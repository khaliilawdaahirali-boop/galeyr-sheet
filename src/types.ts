export type CargoStatus = 'OUT' | 'Package in';

export interface CargoItem {
  id: string;
  rowNumber: number;
  date: string; // e.g. "10-Oct-2026"
  senderName: string; // "GAAAS", "KOBOC CARGO", "GALEYR", "HIMLO", etc.
  originCity: string; // "MGQ-HGA", "NBO-HGA", "DXB-HGA", etc.
  receiverName: string; // "NASHAAD", "NIMCO VABI", etc.
  receiverPhone: string; // "634835728"
  itemDescription: string; // "CADAN", "BLUE", "BOX", etc.
  weightKgs: string; // "5.2 KGS"
  balanceDue: string; // "FREE", "40$", "8$", etc.
  goodsChecked: boolean; // Column K checkbox
  status: CargoStatus; // Column L: "OUT" | "Package in"
  destination: string; // "MOOTO", "BURCO", "BORAMA", "GABILEY", "BERBERA", etc.
  dateTime: string; // Column N: "2026-10-10 19:07:02" or ""
  isImportant?: boolean; // cell highlight (like NIMCO VABI in red)
  notes?: string;
}

export interface OutboundCargoItem {
  id: string;
  rowNumber: number;
  trackingNo: string;
  sectionDate?: string; // "7-Oct-2026", "8-Oct-2026", "10-Oct-2026"
  date: string; // e.g. "1-Oct-2026", "6-Oct-2026"
  senderName: string; // "MUSTAFE", "CABDIFATAAX", etc.
  senderPhone: string; // "634047656", etc.
  itemDescription: string; // "BAC", "3 JAWAAN KABO", "QASQAS", etc.
  weightKgs: string; // "9.7 KGS", "115 KGS", etc.
  destination: string; // "MGQ", "NAIROBI", "BURCO", "DUBAI"
  receiverName: string; // "SAKARIYE", "HEERSARE", etc.
  receiverPhone: string; // "615268002", etc.
  feeAmount: string; // "2$", "FREE", "5$", "17$", "$240", etc.
  balanceStatus: string; // "PAID", "UN-PAID", "BALANCE 19 $", "BALANCE 230 $", etc.
  isPaid?: boolean;
}

export interface ExpenseItem {
  id: string;
  date: string;
  category: 'Shidaal' | 'Mootooyin' | 'Canshuur' | 'Kirada Bakhaarka' | 'Mushahar' | 'Qalab & Baakad' | 'Kale';
  description: string;
  amount: number;
  currency: 'USD' | 'SLSH';
  paidTo: string;
  voucherNo: string;
  approvedBy: string;
}

export type SheetTab = 
  | 'ALAABTA_TIMI' 
  | 'ALAAB_DIRIS' 
  | 'EXPENCES' 
  | 'GOBOLADA' 
  | 'TICKETS' 
  | 'DIB_U_DIWAN_GELIN';

export interface ReceiptData {
  type: 'INBOUND' | 'OUTBOUND';
  receiptNo: string;
  date: string;
  senderName: string;
  senderPhone?: string;
  originCity: string;
  receiverName: string;
  receiverPhone: string;
  itemDescription: string;
  weight: string;
  amountOrBalance: string;
  status: string;
  destination: string;
  dateTime?: string;
  paymentStatus?: string;
}
