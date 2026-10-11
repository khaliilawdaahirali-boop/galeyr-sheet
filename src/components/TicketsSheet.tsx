import React, { useState } from 'react';
import { 
  Ticket, 
  Search, 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  Phone, 
  Clock, 
  MapPin, 
  Weight, 
  DollarSign, 
  MessageSquare,
  QrCode
} from 'lucide-react';
import { CargoItem } from '../types';
import { COMPANY_NAME } from '../data/initialData';

interface TicketsSheetProps {
  items: CargoItem[];
  onToggleGoods: (item: CargoItem) => void;
}

export const TicketsSheet: React.FC<TicketsSheetProps> = ({
  items,
  onToggleGoods,
}) => {
  const [ticketSearch, setTicketSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<CargoItem | null>(items[0] || null);
  const [copiedSms, setCopiedSms] = useState(false);

  const matchedItems = items.filter((item) => {
    if (!ticketSearch.trim()) return true;
    const q = ticketSearch.toLowerCase().trim();
    return (
      item.receiverName.toLowerCase().includes(q) ||
      item.receiverPhone.toLowerCase().includes(q) ||
      item.itemDescription.toLowerCase().includes(q) ||
      String(item.rowNumber).includes(q)
    );
  });

  const activeTicket = selectedItem || matchedItems[0] || null;

  const generateSmsText = (item: CargoItem) => {
    return `Salaamu calaykum Mudane/Marwo ${item.receiverName}, waxa xafiiska ${COMPANY_NAME} kuugu timid xirmo (${item.itemDescription}) oo ka timid ${item.originCity}. Miisaanka: ${item.weightKgs}. Haraaga lagaa rabo: ${item.balanceDue || 'BILAASH'}. Xaaladda: ${item.status}. Xarunta Hargeisa. Mahadsanid.`;
  };

  const handleCopySms = () => {
    if (!activeTicket) return;
    const text = generateSmsText(activeTicket);
    navigator.clipboard.writeText(text);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!activeTicket) return;
    const text = encodeURIComponent(generateSmsText(activeTicket));
    const phone = activeTicket.receiverPhone ? `252${activeTicket.receiverPhone.replace(/^0+/, '')}` : '';
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-neutral-100 border-b border-neutral-300 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-neutral-800 text-sm">
            <Ticket className="w-4 h-4 text-emerald-600" />
            <span>TICKETS & BAAFIN (Tikidhada, Baafinta & Rasiidhada Xamuulka)</span>
          </div>
          <span className="text-neutral-500">|</span>
          <span className="text-neutral-600">
            Baafinta macaamiisha, soo saarista tigidhka rasiidka ah iyo fariimaha SMS/WhatsApp
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white rounded font-medium shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Daabac Tigidhka (Print Ticket)</span>
          </button>
        </div>
      </div>

      {/* 2-Column Split: List on Left, Ticket Preview on Right */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-neutral-100">
        {/* Left Column: Search & List */}
        <div className="w-full md:w-5/12 border-r border-neutral-300 bg-white flex flex-col">
          <div className="p-3 border-b border-neutral-200">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Raadi Macmiilka (Tel, Magac, Saf #)..."
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="text-[11px] text-neutral-500 mt-1.5 flex justify-between">
              <span>Macaamiisha la helay: <strong>{matchedItems.length}</strong></span>
              <span>Guji macmiilka si aad u eegto tigidhkiisa</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto divide-y divide-neutral-200">
            {matchedItems.map((item) => {
              const isSelected = activeTicket?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 cursor-pointer transition-colors text-xs flex items-center justify-between ${
                    isSelected ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : 'hover:bg-neutral-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-1 bg-neutral-200 text-neutral-700 rounded">
                        #{item.rowNumber}
                      </span>
                      <span className="font-bold text-neutral-900 uppercase">
                        {item.receiverName || 'MAGAC LA’AAN'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500 text-[11px] mt-0.5 font-mono">
                      <span>{item.receiverPhone || 'Tel la’aan'}</span>
                      <span>·</span>
                      <span className="font-sans">{item.itemDescription}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'OUT' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                    <div className="text-[10px] text-neutral-500 mt-1 font-mono font-bold">
                      {item.balanceDue}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Thermal POS Receipt / Ticket Preview */}
        <div className="w-full md:w-7/12 p-6 flex flex-col items-center justify-start overflow-auto bg-neutral-200/70">
          {activeTicket ? (
            <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-neutral-300 p-6 print:border-none print:shadow-none print:p-0">
              {/* Thermal Receipt Header */}
              <div className="text-center border-b border-dashed border-neutral-400 pb-4 mb-4">
                <h2 className="text-base font-extrabold tracking-tight text-neutral-900 uppercase">
                  {COMPANY_NAME}
                </h2>
                <p className="text-[11px] text-neutral-600 font-medium">
                  Xafiiska Guud ee Xamuulka, Dalxiiska & Duulimaadyada - Hargeisa
                </p>
                <p className="text-[10px] text-neutral-500 font-mono">
                  Tel: +252 63 4835728 / 63 4444999
                </p>
                <div className="inline-block px-3 py-1 bg-neutral-100 text-neutral-800 text-[11px] font-bold rounded mt-2 border border-neutral-300">
                  TIGIDHKA XAMUULKA / CARGO WAYBILL RECEIPT
                </div>
              </div>

              {/* Barcode Mock Visual */}
              <div className="flex flex-col items-center justify-center my-3 pb-3 border-b border-dashed border-neutral-300">
                <div className="font-mono tracking-[0.25em] text-lg font-bold text-neutral-900 select-all">
                  *CRG-{activeTicket.rowNumber}-{activeTicket.originCity}*
                </div>
                <div className="text-[9px] text-neutral-500 font-mono mt-0.5">
                  TIXRAACA: 2026-ROW-{activeTicket.rowNumber}
                </div>
              </div>

              {/* Ticket Details */}
              <div className="space-y-2 text-xs font-mono border-b border-dashed border-neutral-400 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Taariikhda:</span>
                  <span className="font-bold text-neutral-900">{activeTicket.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Magaca Qaataha:</span>
                  <span className="font-bold text-neutral-900 uppercase text-sm font-sans">{activeTicket.receiverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Telefoonka Macmiilka:</span>
                  <span className="font-bold text-neutral-900">{activeTicket.receiverPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Magaalada Asalka:</span>
                  <span className="font-bold text-neutral-900">{activeTicket.originCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">U Socota (Destination):</span>
                  <span className="font-bold text-neutral-900">{activeTicket.destination || 'HARGEISA (Xarunta)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Faahfaahinta Alaabta:</span>
                  <span className="font-bold text-neutral-900 uppercase font-sans">{activeTicket.itemDescription}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Miisaanka (Kgs):</span>
                  <span className="font-bold text-neutral-900">{activeTicket.weightKgs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Xaaladda Alaabta:</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                    activeTicket.status === 'OUT' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {activeTicket.status}
                  </span>
                </div>
                {activeTicket.dateTime && (
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-500">Bixitaanka (Timestamp):</span>
                    <span className="font-bold text-neutral-800">{activeTicket.dateTime}</span>
                  </div>
                )}
              </div>

              {/* Total Balance Due Highlight */}
              <div className="p-3 rounded bg-neutral-100 border border-neutral-300 text-center mb-4">
                <div className="text-[11px] text-neutral-600 font-semibold uppercase">Haraaga Lagaa Rabo (Balance Due)</div>
                <div className={`text-xl font-extrabold mt-0.5 font-mono ${
                  activeTicket.balanceDue !== 'FREE' ? 'text-red-600' : 'text-emerald-700'
                }`}>
                  {activeTicket.balanceDue || 'BILAASH (FREE)'}
                </div>
              </div>

              {/* Signature Line */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed border-neutral-300 text-[10px] text-neutral-500 text-center">
                <div>
                  <div className="h-8 border-b border-neutral-400"></div>
                  <span className="mt-1 block">Saxeexa Bixiyaha</span>
                </div>
                <div>
                  <div className="h-8 border-b border-neutral-400"></div>
                  <span className="mt-1 block">Saxeexa Macmiilka</span>
                </div>
              </div>

              {/* SMS Notification Action Box */}
              <div className="mt-6 pt-4 border-t border-neutral-200 print:hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fariinta SMS / WhatsApp ee Macmiilka</span>
                  </div>
                  <button
                    onClick={handleCopySms}
                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    {copiedSms ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSms ? 'Waa la koobiyeey!' : 'Koobiyeey Qoraalka'}</span>
                  </button>
                </div>
                <div className="p-2.5 bg-neutral-50 border border-neutral-300 rounded text-[11px] text-neutral-700 leading-relaxed font-sans">
                  {generateSmsText(activeTicket)}
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleCopySms}
                    className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white rounded text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Koobiyeey Fariinta</span>
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>U dir WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 text-xs">
              <Ticket className="w-10 h-10 text-neutral-400 mb-2 stroke-1" />
              <span>Fadlan dhanka bidix ka dooro macmiilka aad rabto tigidhkiisa</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
