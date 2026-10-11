import { CargoItem, OutboundCargoItem } from '../types';
import { COMPANY_NAME } from '../data/initialData';

export interface CreateSpreadsheetResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

export async function createGoogleSpreadsheetWithExactTemplate(
  accessToken: string,
  cargoItems: CargoItem[],
  outboundItems: OutboundCargoItem[],
  dateBanner: string = '10/10/2026'
): Promise<CreateSpreadsheetResult> {
  // 1. Create spreadsheet with custom tabs
  const createPayload = {
    properties: {
      title: `${COMPANY_NAME} - SYSTEM CARGO SHEET (2026)`,
    },
    sheets: [
      {
        properties: {
          title: 'ALAABTA TIMI',
          sheetId: 0,
          gridProperties: { rowCount: 100, columnCount: 16 },
        },
      },
      {
        properties: {
          title: 'ALAAB DIRIS',
          sheetId: 1,
          gridProperties: { rowCount: 100, columnCount: 14 },
        },
      },
      {
        properties: {
          title: 'EXPENCES',
          sheetId: 2,
          gridProperties: { rowCount: 50, columnCount: 10 },
        },
      },
      {
        properties: {
          title: 'GOBOLADA',
          sheetId: 3,
          gridProperties: { rowCount: 50, columnCount: 10 },
        },
      },
    ],
  };

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPayload),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Google Sheets creation failed: ${errText}`);
  }

  const createData = await createRes.json();
  const spreadsheetId = createData.spreadsheetId;
  const spreadsheetUrl = createData.spreadsheetUrl;

  // 2. Prepare Inbound values
  const inboundValues: (string | number | boolean)[][] = [
    ['', '', '', dateBanner, dateBanner, dateBanner, dateBanner, '', '', '', '', '', '', ''],
    [
      '#',
      'DATE',
      'SENDER NAME',
      'ORIGIN CITY',
      'RECEIVER NAME',
      'RECEIVER PHONE',
      'ITEM DESCRIPTION',
      'WEIGHT (KGS)',
      'BALANCE DUE',
      'GOODS',
      'STATUS',
      'DESTINATION',
      'TIME',
    ],
  ];

  cargoItems.forEach((item) => {
    inboundValues.push([
      item.rowNumber,
      item.date,
      item.senderName,
      item.originCity,
      item.receiverName,
      item.receiverPhone,
      item.itemDescription,
      item.weightKgs,
      item.balanceDue,
      item.goodsChecked,
      item.status,
      item.destination,
      item.dateTime,
    ]);
  });

  // 3. Prepare Outbound values
  const outboundValues: (string | number)[][] = [
    [
      '#',
      'DATE',
      'SENDER NAME',
      'SENDER PHONE',
      'ITEM DESCRIPTION',
      'WEIGHT (KGS)',
      'DESTINATION',
      'RECEIVER NAME',
      'RECEIVER PHONE',
      'FEE / $',
      'PAYMENT / BALANCE',
    ],
  ];

  let currentSection = '';
  outboundItems.forEach((item) => {
    if (item.sectionDate && item.sectionDate !== currentSection) {
      currentSection = item.sectionDate;
      outboundValues.push([item.sectionDate, '', '', '', '', '', '', '', '', '', '']);
    }
    outboundValues.push([
      item.rowNumber,
      item.date,
      item.senderName,
      item.senderPhone,
      item.itemDescription,
      item.weightKgs,
      item.destination,
      item.receiverName,
      item.receiverPhone,
      item.feeAmount,
      item.balanceStatus,
    ]);
  });

  // Batch write values
  const valuesBatchPayload = {
    valueInputOption: 'USER_ENTERED',
    data: [
      {
        range: 'ALAABTA TIMI!A1:N' + inboundValues.length,
        values: inboundValues,
      },
      {
        range: 'ALAAB DIRIS!A1:K' + outboundValues.length,
        values: outboundValues,
      },
    ],
  };

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(valuesBatchPayload),
  });

  // 4. Format formatting with batchUpdate (Colors, Checkboxes, Cell background matching screenshot)
  const formatRequests = [
    // Inbound: Merge D1:G1 for date banner
    {
      mergeCells: {
        range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 3, endColumnIndex: 7 },
        mergeType: 'MERGE_ALL',
      },
    },
    // Inbound: Date banner styling (Red background, bold white text)
    {
      repeatCell: {
        range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 3, endColumnIndex: 7 },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.86, green: 0.15, blue: 0.15 },
            textFormat: { bold: true, fontSize: 13, foregroundColor: { red: 1, green: 1, blue: 1 } },
            horizontalAlignment: 'CENTER',
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
      },
    },
    // Inbound: Header row styling (Red background, bold white text)
    {
      repeatCell: {
        range: { sheetId: 0, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 13 },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.86, green: 0.15, blue: 0.15 },
            textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 1, green: 1, blue: 1 } },
            horizontalAlignment: 'CENTER',
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
      },
    },
    // Inbound: Add checkbox data validation to Column K (index 9)
    {
      setDataValidation: {
        range: { sheetId: 0, startRowIndex: 2, endRowIndex: inboundValues.length, startColumnIndex: 9, endColumnIndex: 10 },
        rule: {
          condition: { type: 'BOOLEAN' },
          strict: true,
          showCustomUi: true,
        },
      },
    },
    // Outbound: Header row styling (Dark slate background, bold white text)
    {
      repeatCell: {
        range: { sheetId: 1, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 11 },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.15, green: 0.18, blue: 0.22 },
            textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 1, green: 1, blue: 1 } },
            horizontalAlignment: 'CENTER',
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
      },
    },
    // Outbound: Sender Columns (Columns C & D) Yellow background (#fef9c3)
    {
      repeatCell: {
        range: { sheetId: 1, startRowIndex: 1, endRowIndex: outboundValues.length, startColumnIndex: 2, endColumnIndex: 4 },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.99, green: 0.98, blue: 0.77 },
          },
        },
        fields: 'userEnteredFormat(backgroundColor)',
      },
    },
    // Outbound: Receiver Columns (Columns H & I) Aqua blue background (#cffafe)
    {
      repeatCell: {
        range: { sheetId: 1, startRowIndex: 1, endRowIndex: outboundValues.length, startColumnIndex: 7, endColumnIndex: 9 },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.81, green: 0.98, blue: 0.99 },
          },
        },
        fields: 'userEnteredFormat(backgroundColor)',
      },
    },
  ];

  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests: formatRequests }),
    });
  } catch (styleErr) {
    console.warn('Formatting batch update minor notice:', styleErr);
  }

  return {
    spreadsheetId,
    spreadsheetUrl,
    title: `${COMPANY_NAME} - SYSTEM CARGO SHEET (2026)`,
  };
}
