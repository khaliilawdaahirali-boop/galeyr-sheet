export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * Cargo Sheet System - onEdit Automation Trigger
 * This script runs automatically whenever Column K (Goods Tick Box) is toggled.
 * 
 * Column K (11) = Tick Box (TRUE / FALSE)
 * Column L (12) = Status ("OUT" / "Package in")
 * Column N (14) = Date & Time of delivery / release
 */
function onEdit(e) {
  if (!e) return;

  var sheet = e.source.getActiveSheet();
  var range = e.range;

  var tickBoxColumn = 11; // Column K (Tick Box)
  var statusColumn = 12;  // Column L (Status: "OUT" or "Package in")
  var dateTimeColumn = 14; // Column N (Date & Time for "OUT")

  // Only run if the edited cell is in the tick box column (K)
  if (range.getColumn() === tickBoxColumn) {
    var tickValue = range.getValue(); // TRUE or FALSE
    var statusCell = sheet.getRange(range.getRow(), statusColumn);
    var dateTimeCell = sheet.getRange(range.getRow(), dateTimeColumn);

    if (tickValue === true) {
      // If checked: set "OUT", green background, and record date & time
      statusCell.setValue("OUT").setBackground("green");
      var now = new Date();
      dateTimeCell.setValue(now).setNumberFormat("yyyy-MM-dd HH:mm:ss");
    } else {
      // If unchecked: set "Package in", orange background, and clear date
      statusCell.setValue("Package in").setBackground("orange");
      dateTimeCell.setValue("");
    }
  }
}
`;

export const APPS_SCRIPT_INSTRUCTIONS = {
  somali: [
    {
      step: 1,
      title: 'Fur Google Sheet-kaaga',
      desc: 'Tag faylka Google Sheets ee aad ku haysato xogta Cargo-ga (tusaale jadwalka "ALAABTA TIMI").'
    },
    {
      step: 2,
      title: 'Fur Apps Script',
      desc: 'Guji menu-ga sare: Extensions (Kordhinta) -> Apps Script.'
    },
    {
      step: 3,
      title: 'Geli Code-kan (Paste)',
      desc: 'Tirtir wixii ku qornaa Code.gs, dabadeed koobiyeey oo ku dheji (paste) code-kan kor ku xusan.'
    },
    {
      step: 4,
      title: 'Keydi (Save)',
      desc: 'Riix astaanta keydinta (Floppy disk icon) ama Ctrl + S / Cmd + S si aad u keydiso.'
    },
    {
      step: 5,
      title: 'Tijaabi Automation-ka',
      desc: 'Kusoo noqo sheet-ka, markaad calaamadiso (tick) sanduuqa Col K (GOODS), toos ayuu Col L u noqonayaa "OUT" cagaar ah, Col N-na wuxuu qorayaa saacadda iyo taariikhda!'
    }
  ],
  english: [
    {
      step: 1,
      title: 'Open your Google Sheet',
      desc: 'Open the spreadsheet containing your Cargo inventory.'
    },
    {
      step: 2,
      title: 'Open Apps Script',
      desc: 'Click on Extensions -> Apps Script in the top menu.'
    },
    {
      step: 3,
      title: 'Paste Code',
      desc: 'Replace existing code in Code.gs with this onEdit function.'
    },
    {
      step: 4,
      title: 'Save Project',
      desc: 'Click the Save icon (Ctrl + S).'
    },
    {
      step: 5,
      title: 'Test Live',
      desc: 'Check any box in Column K. Column L will automatically become OUT (green) and Column N will record timestamp.'
    }
  ]
};

/**
 * Format current timestamp as "YYYY-MM-DD HH:mm:ss" matching the Apps Script logic.
 */
export function formatCurrentTimestamp(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
