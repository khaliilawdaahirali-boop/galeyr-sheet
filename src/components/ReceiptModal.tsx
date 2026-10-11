import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Share2, 
  FileText, 
  ShieldCheck,
  Plane
} from 'lucide-react';
import { ReceiptData } from '../types';
import { COMPANY_NAME } from '../data/initialData';

interface ReceiptModalProps {
  receipt: ReceiptData | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  receipt,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [printFormat, setPrintFormat] = useState<'thermal' | 'a4'>('thermal');

  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const smsText = `RASIID: ${COMPANY_NAME}. Macmiil: ${receipt.receiverName}. Tel: ${receipt.receiverPhone}. Alaab: ${receipt.itemDescription}. Miisaan: ${receipt.weight}. Haraaga/Qiimaha: ${receipt.amountOrBalance}. U socota: ${receipt.destination}. Tixraac: #${receipt.receiptNo}. Mahadsanid!`;

  const handleCopySms = () => {
    navigator.clipboard.writeText(smsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(smsText);
    const phone = receipt.receiverPhone ? `252${receipt.receiverPhone.replace(/^0+/, '')}` : '';
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 select-none overflow-y-auto">
      <div className="bg-neutral-100 rounded-xl shadow-2xl border border-neutral-300 w-full max-w-lg max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 text-white border-b border-neutral-800 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-emerald-600 text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide">
                {COMPANY_NAME}
              </h3>
              <p className="text-[10px] text-neutral-400 font-mono">
                {receipt.type === 'INBOUND' ? 'Rasiidka Alaabta Timi' : 'Rasiidka Alaabta Dirista'} · #{receipt.receiptNo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Format toggle */}
            <div className="flex items-center bg-neutral-800 p-0.5 rounded text-[11px]">
              <button
                onClick={() => setPrintFormat('thermal')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  printFormat === 'thermal' ? 'bg-neutral-700 text-white font-bold' : 'text-neutral-400'
                }`}
              >
                Thermal POS
              </button>
              <button
                onClick={() => setPrintFormat('a4')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  printFormat === 'a4' ? 'bg-neutral-700 text-white font-bold' : 'text-neutral-400'
                }`}
              >
                Standard
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="flex-1 overflow-y-auto p-4 flex justify-center bg-neutral-300/60 print:p-0 print:bg-white print:overflow-visible">
          <div 
            id="cargo-printable-receipt"
            className={`bg-white shadow-lg border border-neutral-300 text-neutral-900 transition-all print:shadow-none print:border-none print:w-full ${
              printFormat === 'thermal' 
                ? 'w-full max-w-[340px] p-5 font-mono text-[11px]' 
                : 'w-full max-w-[440px] p-6 font-sans text-xs'
            }`}
          >
            {/* Header / Brand: GALEYR TOURS AND TRAVEL CARGO AGENCY */}
            <div className="text-center border-b-2 border-neutral-900 pb-3 mb-3">
              <div className="inline-block px-3 py-1 bg-neutral-900 text-white text-[11px] font-black uppercase tracking-wider rounded mb-1">
                {COMPANY_NAME}
              </div>
              <h2 className="text-xs font-extrabold uppercase tracking-tight text-neutral-900 mt-1">
                XARUNTA GUUD EE XAMUULKA, DALXIISKA & DUULIMAADYADA
              </h2>
              <p className="text-[10px] text-neutral-600 font-sans mt-0.5">
                Degmada 26 June, Suuqa Hoose, Hargeisa, Somaliland
              </p>
              <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                Tel: +252 63 4835728 / 63 4444999 · info@galeyrcargo.com
              </p>

              <div className="mt-2 pt-2 border-t border-dashed border-neutral-400 flex items-center justify-between text-[10px] text-neutral-600">
                <span>Rasiid #: <strong className="text-neutral-900 font-mono">{receipt.receiptNo}</strong></span>
                <span>Taariikh: <strong className="text-neutral-900 font-mono">{receipt.date}</strong></span>
              </div>
            </div>

            {/* Barcode Visual Representation */}
            <div className="flex flex-col items-center justify-center my-2 pb-2 border-b border-dashed border-neutral-300">
              <div className="flex items-center gap-[2px] h-8 py-1">
                {[4, 2, 5, 2, 3, 6, 2, 4, 3, 5, 2, 6, 3, 2, 5, 4, 2, 5, 3, 2, 6, 2, 4, 3].map((w, i) => (
                  <span
                    key={i}
                    className="bg-neutral-900 h-full inline-block"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <span className="font-mono text-[9px] tracking-[0.2em] font-bold text-neutral-700">
                *{receipt.type}-{receipt.receiptNo}*
              </span>
            </div>

            {/* Customer & Package Details */}
            <div className="space-y-1.5 py-2 border-b border-dashed border-neutral-400">
              <div className="flex justify-between items-start">
                <span className="text-neutral-500 font-sans">Macmiilka (Receiver):</span>
                <span className="font-extrabold text-neutral-900 uppercase text-right font-sans text-xs">
                  {receipt.receiverName || 'MACAAMIIL'}
                </span>
              </div>

              {receipt.receiverPhone && (
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-sans">Telefoonka Macmiilka:</span>
                  <span className="font-bold text-neutral-900 font-mono">{receipt.receiverPhone}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-neutral-500 font-sans">Qofka Diraya (Sender):</span>
                <span className="font-bold text-neutral-800">{receipt.senderName}</span>
              </div>

              {receipt.senderPhone && (
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-sans">Tel Diraha:</span>
                  <span className="font-bold text-neutral-800 font-mono">{receipt.senderPhone}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-neutral-500 font-sans">Magaalada Asalka:</span>
                <span className="font-bold text-neutral-800">{receipt.originCity}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500 font-sans">U Socota (Destination):</span>
                <span className="font-bold text-neutral-900 uppercase">
                  {receipt.destination || 'HARGEISA (Xarunta)'}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-neutral-500 font-sans">Faahfaahinta Alaabta:</span>
                <span className="font-bold text-neutral-900 uppercase text-right">
                  {receipt.itemDescription}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500 font-sans">Miisaanka:</span>
                <span className="font-bold text-neutral-900 font-mono">{receipt.weight}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500 font-sans">Xaaladda Rasiidka:</span>
                <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                  receipt.status === 'OUT' || receipt.status.includes('Paid') || receipt.status === 'PAID'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {receipt.status}
                </span>
              </div>

              {receipt.dateTime && (
                <div className="flex justify-between text-[10px]">
                  <span className="text-neutral-500 font-sans">Xilliga Bixitaanka:</span>
                  <span className="font-mono text-neutral-700">{receipt.dateTime}</span>
                </div>
              )}
            </div>

            {/* Financial / Balance Due Section */}
            <div className="my-3 p-2.5 rounded bg-neutral-100 border border-neutral-300 text-center">
              <span className="text-[10px] text-neutral-600 uppercase font-sans font-bold block">
                {receipt.type === 'INBOUND' ? 'Haraaga Laga Rabo (Balance Due)' : 'Qiimaha Xamuulka (Payment / Balance)'}
              </span>
              <span className={`text-base font-black font-mono block mt-0.5 ${
                receipt.amountOrBalance !== 'FREE' && receipt.amountOrBalance !== '0$' && !receipt.amountOrBalance.includes('PAID')
                  ? 'text-red-600' 
                  : 'text-emerald-700'
              }`}>
                {receipt.amountOrBalance || 'BILAASH (FREE)'}
              </span>
            </div>

            {/* Official Stamp & Signatures */}
            <div className="pt-2">
              <div className="grid grid-cols-2 gap-4 text-center text-[9px] text-neutral-500 font-sans pt-2">
                <div>
                  <div className="h-7 border-b border-neutral-400"></div>
                  <span className="mt-1 block">Saxeexa Qasnajiga (Cashier)</span>
                </div>
                <div>
                  <div className="h-7 border-b border-neutral-400"></div>
                  <span className="mt-1 block">Saxeexa Macmiilka</span>
                </div>
              </div>

              {/* Security watermark badge */}
              <div className="mt-3 text-center border-t border-dashed border-neutral-300 pt-2 text-[9px] text-neutral-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Rasiid Rasmi ah · {COMPANY_NAME}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden on print) */}
        <div className="px-4 py-3 bg-white border-t border-neutral-300 flex flex-wrap items-center justify-between gap-2 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySms}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-xs font-semibold border border-neutral-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Waa la koobiyeey' : 'Koobiyeey SMS'}</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-xs font-semibold border border-emerald-300 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded text-xs font-medium transition-colors"
            >
              Ka Bax
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Daabac Rasiidka ({COMPANY_NAME})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
