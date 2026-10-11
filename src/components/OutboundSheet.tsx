import React, { useState } from 'react';
import { 
  Send, 
  Plus, 
  Trash2, 
  Copy,
  Printer,
  FileText,
  ChevronDown,
  Phone,
  Search
} from 'lucide-react';
import { OutboundCargoItem, ReceiptData } from '../types';
import { COMPANY_NAME } from '../data/initialData';

interface OutboundSheetProps {
  items: OutboundCargoItem[];
  onAddItem: (item: OutboundCargoItem) => void;
  onDeleteItem: (id: string) => void;
  onDuplicateItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<OutboundCargoItem>) => void;
  onOpenReceipt: (receipt: ReceiptData) => void;
}

export const OutboundSheet: React.FC<OutboundSheetProps> = ({
  items,
  onAddItem,
  onDeleteItem,
  onDuplicateItem,
  onUpdateItem,
  onOpenReceipt,
}) => {
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof OutboundCargoItem } | null>(null);
  const [filterSearch, setFilterSearch] = useState('');

  const triggerRowReceipt = (item: OutboundCargoItem) => {
    onOpenReceipt({
      type: 'OUTBOUND',
      receiptNo: item.trackingNo || `GLR-DIR-${item.rowNumber}`,
      date: item.date || item.sectionDate || '10-Oct-2026',
      senderName: item.senderName || 'GALEYR SENDER',
      senderPhone: item.senderPhone,
      originCity: 'HARGEISA',
      receiverName: item.receiverName || 'MACAAMIIL',
      receiverPhone: item.receiverPhone,
      itemDescription: item.itemDescription || 'XIRMO',
      weight: item.weightKgs || '0 KGS',
      amountOrBalance: item.balanceStatus || item.feeAmount || 'FREE',
      status: item.balanceStatus.includes('PAID') ? 'Diyaar ah (Paid)' : 'Diyaar ah',
      destination: item.destination || 'MGQ',
      paymentStatus: item.balanceStatus.includes('PAID') ? 'Paid' : 'Unpaid',
    });
  };

  const filteredItems = items.filter((item) => {
    if (!filterSearch.trim()) return true;
    const q = filterSearch.toLowerCase().trim();
    return (
      item.senderName.toLowerCase().includes(q) ||
      item.senderPhone.toLowerCase().includes(q) ||
      item.receiverName.toLowerCase().includes(q) ||
      item.receiverPhone.toLowerCase().includes(q) ||
      item.destination.toLowerCase().includes(q) ||
      item.itemDescription.toLowerCase().includes(q) ||
      String(item.rowNumber).includes(q)
    );
  });

  // Group items by sectionDate or display with section banners
  const renderRowsWithBanners = () => {
    const rows: React.ReactNode[] = [];
    let lastSection = '';

    filteredItems.forEach((item, index) => {
      // If there's a section date change and it's defined, render the centered red banner
      if (item.sectionDate && item.sectionDate !== lastSection && (index === 0 || item.sectionDate !== '')) {
        lastSection = item.sectionDate;
        rows.push(
          <tr key={`banner-${item.sectionDate}-${item.id}`} className="bg-red-600 text-white font-extrabold text-center select-none">
            <td colSpan={13} className="py-2 text-base tracking-wider uppercase font-bold shadow-inner">
              {item.sectionDate}
            </td>
          </tr>
        );
      }

      const isPaid = item.balanceStatus === 'PAID';
      const isUnPaid = item.balanceStatus === 'UN-PAID';
      const isBalance = item.balanceStatus.startsWith('BALANCE');

      rows.push(
        <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors border-b border-neutral-300">
          {/* Row Number */}
          <td className="bg-neutral-100 text-neutral-500 font-mono text-[11px] text-center border-r border-neutral-300 py-1.5 px-1 font-semibold select-none">
            {item.rowNumber}
          </td>

          {/* Date Column */}
          <td 
            className="border-r border-neutral-300 px-2 py-1 text-neutral-800 whitespace-nowrap font-mono text-[11px]"
            onDoubleClick={() => setEditingCell({ id: item.id, field: 'date' })}
          >
            {editingCell?.id === item.id && editingCell?.field === 'date' ? (
              <input
                type="text"
                defaultValue={item.date}
                autoFocus
                onBlur={(e) => {
                  onUpdateItem(item.id, { date: e.target.value });
                  setEditingCell(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onUpdateItem(item.id, { date: (e.target as HTMLInputElement).value });
                    setEditingCell(null);
                  } else if (e.key === 'Escape') setEditingCell(null);
                }}
                className="w-full bg-white border border-blue-500 px-1 py-0.5 text-xs outline-none"
              />
            ) : (
              <span className="font-bold">{item.date}</span>
            )}
          </td>

          {/* SENDER NAME (Soft Yellow background #fef9c3) */}
          <td 
            className="border-r border-neutral-300 px-2 py-1 bg-[#fef9c3] text-neutral-900 font-bold uppercase whitespace-nowrap"
            onDoubleClick={() => setEditingCell({ id: item.id, field: 'senderName' })}
          >
            {editingCell?.id === item.id && editingCell?.field === 'senderName' ? (
              <input
                type="text"
                defaultValue={item.senderName}
                autoFocus
                onBlur={(e) => {
                  onUpdateItem(item.id, { senderName: e.target.value.toUpperCase() });
                  setEditingCell(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onUpdateItem(item.id, { senderName: (e.target as HTMLInputElement).value.toUpperCase() });
                    setEditingCell(null);
                  } else if (e.key === 'Escape') setEditingCell(null);
                }}
                className="w-full bg-white border border-blue-500 px-1 py-0.5 text-xs outline-none uppercase font-bold"
              />
            ) : (
              <span>{item.senderName || ''}</span>
            )}
          </td>

          {/* SENDER PHONE (Soft Yellow background #fef9c3) */}
          <td 
            className="border-r border-neutral-300 px-2 py-1 bg-[#fef9c3] text-neutral-800 font-mono whitespace-nowrap"
            onDoubleClick={() => setEditingCell({ id: item.id, field: 'senderPhone' })}
          >
            {editingCell?.id === item.id && editingCell?.field === 'senderPhone' ? (
              <input
                type="text"
                defaultValue={item.senderPhone}
                autoFocus
                onBlur={(e) => {
                  onUpdateItem(item.id, { senderPhone: e.target.value });
                  setEditingCell(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onUpdateItem(item.id, { senderPhone: (e.target as HTMLInputElement).value });
                    setEditingCell(null);
                  } else if (e.key === 'Escape') setEditingCell(null);
                }}
                className="w-full bg-white border border-blue-500 px-1 py-0.5 text-xs outline-none font-mono"
              />
            ) : (
              <span>{item.senderPhone || ''}</span>
            )}
          </td>

          {/* ITEM DESCRIPTION (BAC maroon pill or plain text) */}
          <td className="border-r border-neutral-300 px-2 py-1 whitespace-nowrap">
            {item.itemDescription === 'BAC' ? (
              <div className="relative inline-block w-full">
                <select
                  value={item.itemDescription}
                  onChange={(e) => onUpdateItem(item.id, { itemDescription: e.target.value })}
                  className="w-full appearance-none pr-5 pl-2 py-0.5 text-xs font-bold rounded-md bg-[#7f1d1d] text-white border border-[#7f1d1d] cursor-pointer"
                >
                  <option value="BAC">BAC</option>
                  <option value="BOX">BOX</option>
                  <option value="3 JAWAAN KABO">3 JAWAAN KABO</option>
                  <option value="QASQAS">QASQAS</option>
                  <option value="2 PCS">2 PCS</option>
                  <option value="DHAR CADARO">DHAR CADARO</option>
                </select>
                <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/80" />
              </div>
            ) : (
              <span 
                className="font-bold text-neutral-800 uppercase cursor-pointer"
                onDoubleClick={() => setEditingCell({ id: item.id, field: 'itemDescription' })}
              >
                {editingCell?.id === item.id && editingCell?.field === 'itemDescription' ? (
                  <input
                    type="text"
                    defaultValue={item.itemDescription}
                    autoFocus
                    onBlur={(e) => {
                      onUpdateItem(item.id, { itemDescription: e.target.value.toUpperCase() });
                      setEditingCell(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onUpdateItem(item.id, { itemDescription: (e.target as HTMLInputElement).value.toUpperCase() });
                        setEditingCell(null);
                      } else if (e.key === 'Escape') setEditingCell(null);
                    }}
                    className="w-full bg-white border border-blue-500 px-1 py-0.5 text-xs outline-none uppercase"
                  />
                ) : (
                  item.itemDescription || ''
                )}
              </span>
            )}
          </td>

          {/* WEIGHT (KGS) */}
          <td 
            className="border-r border-neutral-300 px-2 py-1 text-center font-mono font-medium text-neutral-800 whitespace-nowrap tabular-nums"
            onDoubleClick={() => setEditingCell({ id: item.id, field: 'weightKgs' })}
          >
            {editingCell?.id === item.id && editingCell?.field === 'weightKgs' ? (
              <input
                type="text"
                defaultValue={item.weightKgs}
                autoFocus
                onBlur={(e) => {
                  onUpdateItem(item.id, { weightKgs: e.target.value });
                  setEditingCell(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onUpdateItem(item.id, { weightKgs: (e.target as HTMLInputElement).value });
                    setEditingCell(null);
                  } else if (e.key === 'Escape') setEditingCell(null);
                }}
                className="w-full bg-white border border-blue-500 px-1 py-0.5 text-xs outline-none text-center font-mono"
              />
            ) : (
              <span>{item.weightKgs || ''}</span>
            )}
          </td>

          {/* DESTINATION (MGQ in red pill, NAIROBI in soft pill) */}
          <td className="border-r border-neutral-300 px-2 py-1 whitespace-nowrap">
            <div className="relative inline-block w-full">
              <select
                value={item.destination}
                onChange={(e) => onUpdateItem(item.id, { destination: e.target.value })}
                className={`w-full appearance-none pr-5 pl-2 py-0.5 text-xs font-bold rounded-md cursor-pointer border ${
                  item.destination === 'MGQ'
                    ? 'bg-[#991b1b] text-white border-[#991b1b]'
                    : item.destination === 'NAIROBI'
                    ? 'bg-[#f1f5f9] text-neutral-800 border-neutral-300'
                    : 'bg-white text-neutral-900 border-neutral-300'
                }`}
              >
                <option value="MGQ">MGQ</option>
                <option value="NAIROBI">NAIROBI</option>
                <option value="BURCO">BURCO</option>
                <option value="BORAMA">BORAMA</option>
                <option value="DUBAI">DUBAI</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
            </div>
          </td>

          {/* RECEIVER NAME (Soft Cyan/Aqua blue background #cffafe) */}
          <td 
            className="border-r border-neutral-300 px-2 py-1 bg-[#cffafe] text-neutral-900 font-bold uppercase whitespace-nowrap"
            onDoubleClick={() => setEditingCell({ id: item.id, field: 'receiverName' })}
          >
            {editingCell?.id === item.id && editingCell?.field === 'receiverName' ? (
              <input
                type="text"
                defaultValue={item.receiverName}
                autoFocus
                onBlur={(e) => {
                  onUpdateItem(item.id, { receiverName: e.target.value.toUpperCase() });
                  setEditingCell(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onUpdateItem(item.id, { receiverName: (e.target as HTMLInputElement).value.toUpperCase() });
                    setEditingCell(null);
                  } else if (e.key === 'Escape') setEditingCell(null);
                }}
                className="w-full bg-white border border-blue-500 px-1 py-0.5 text-xs outline-none uppercase font-bold"
              />
            ) : (
              <span>{item.receiverName || ''}</span>
            )}
          </td>

          {/* RECEIVER PHONE (Soft Cyan/Aqua blue background #cffafe) */}
          <td 
            className="border-r border-neutral-300 px-2 py-1 bg-[#cffafe] text-neutral-800 font-mono whitespace-nowrap"
            onDoubleClick={() => setEditingCell({ id: item.id, field: 'receiverPhone' })}
          >
            {editingCell?.id === item.id && editingCell?.field === 'receiverPhone' ? (
              <input
                type="text"
                defaultValue={item.receiverPhone}
                autoFocus
                onBlur={(e) => {
                  onUpdateItem(item.id, { receiverPhone: e.target.value });
                  setEditingCell(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onUpdateItem(item.id, { receiverPhone: (e.target as HTMLInputElement).value });
                    setEditingCell(null);
                  } else if (e.key === 'Escape') setEditingCell(null);
                }}
                className="w-full bg-white border border-blue-500 px-1 py-0.5 text-xs outline-none font-mono"
              />
            ) : (
              <span>{item.receiverPhone || ''}</span>
            )}
          </td>

          {/* FEE / AMOUNT */}
          <td 
            className="border-r border-neutral-300 px-2 py-1 text-center font-bold text-neutral-800 font-mono whitespace-nowrap"
            onDoubleClick={() => setEditingCell({ id: item.id, field: 'feeAmount' })}
          >
            {editingCell?.id === item.id && editingCell?.field === 'feeAmount' ? (
              <input
                type="text"
                defaultValue={item.feeAmount}
                autoFocus
                onBlur={(e) => {
                  onUpdateItem(item.id, { feeAmount: e.target.value });
                  setEditingCell(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onUpdateItem(item.id, { feeAmount: (e.target as HTMLInputElement).value });
                    setEditingCell(null);
                  } else if (e.key === 'Escape') setEditingCell(null);
                }}
                className="w-full bg-white border border-blue-500 px-1 py-0.5 text-xs outline-none text-center font-mono font-bold"
              />
            ) : (
              <span>{item.feeAmount || ''}</span>
            )}
          </td>

          {/* BALANCE / PAYMENT STATUS */}
          <td className="border-r border-neutral-300 px-2 py-1 text-center whitespace-nowrap">
            {isPaid ? (
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#ea580c] text-white font-extrabold text-[11px] shadow-2xs">
                PAID
              </span>
            ) : isUnPaid ? (
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#0891b2] text-white font-extrabold text-[11px] shadow-2xs">
                UN-PAID
              </span>
            ) : isBalance ? (
              <span className="inline-block px-2.5 py-0.5 rounded bg-[#fed7aa] text-[#9a3412] font-black text-[11px] border border-[#fdba74]">
                {item.balanceStatus}
              </span>
            ) : (
              <span className="text-neutral-400 font-mono text-[10px]">—</span>
            )}
          </td>

          {/* RASIID (Receipt Button) */}
          <td className="px-2 py-1 text-center whitespace-nowrap">
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => triggerRowReceipt(item)}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-colors"
                title={`Daabac Rasiidka ${COMPANY_NAME}`}
              >
                <FileText className="w-3 h-3" />
                <span>Rasiid</span>
              </button>

              <button
                onClick={() => onDuplicateItem(item.id)}
                className="p-1 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded transition-colors"
                title="Nuqul ka samee safkan"
              >
                <Copy className="w-3 h-3" />
              </button>

              <button
                onClick={() => onDeleteItem(item.id)}
                className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors"
                title="Tirtir safkan"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </td>
        </tr>
      );
    });

    return rows;
  };

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Top Banner & Actions */}
      <div className="flex flex-wrap items-center justify-between px-3 py-1.5 bg-neutral-100 border-b border-neutral-300 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-sm">
            <Send className="w-4 h-4 text-emerald-600" />
            <span>ALAAB DIRIS — {COMPANY_NAME}</span>
          </div>
          <span className="text-neutral-400">|</span>
          <span className="text-neutral-600 hidden md:inline">
            Jadwalka Xamuulka Baxaya (Mogadishu MGQ, Nairobi, Dubai)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Search inside Outbound */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Raadi Diraha, Qaataha, Tel..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="pl-7 pr-3 py-1 bg-white border border-neutral-300 rounded text-xs w-48 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-300 rounded font-medium text-neutral-700 hover:bg-neutral-50 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Daabac</span>
          </button>

          <button
            onClick={() => {
              const maxRow = items.reduce((max, i) => Math.max(max, i.rowNumber), 720);
              const newItem: OutboundCargoItem = {
                id: `out-${Date.now()}`,
                rowNumber: maxRow + 1,
                trackingNo: `GLR-${maxRow + 1}-MGQ`,
                sectionDate: '10-Oct-2026',
                date: '10-Oct-2026',
                senderName: '',
                senderPhone: '',
                itemDescription: 'BAC',
                weightKgs: '5 KGS',
                destination: 'MGQ',
                receiverName: '',
                receiverPhone: '',
                feeAmount: '',
                balanceStatus: 'PAID',
                isPaid: true,
              };
              onAddItem(newItem);
            }}
            className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Kudar Saf Cusub</span>
          </button>
        </div>
      </div>

      {/* Main Table Matching the Exact Screenshot Layout */}
      <div className="flex-1 overflow-auto bg-neutral-200">
        <table className="w-full border-collapse bg-white text-xs text-neutral-900 border border-neutral-300">
          <thead>
            {/* Main Header matching image.png */}
            <tr className="bg-neutral-800 text-white font-bold tracking-tight text-center border-b border-neutral-900 select-none">
              <th className="w-12 py-1.5 px-2 bg-neutral-900 text-neutral-300 text-[11px] font-semibold border-r border-neutral-700">
                #
              </th>
              <th className="border-r border-neutral-700 px-2 py-1.5 text-left w-24">
                DATE
              </th>
              <th className="border-r border-neutral-700 px-2 py-1.5 text-left w-36 bg-amber-700 text-white">
                SENDER NAME
              </th>
              <th className="border-r border-neutral-700 px-2 py-1.5 text-left w-32 bg-amber-700 text-white">
                SENDER PHONE
              </th>
              <th className="border-r border-neutral-700 px-2 py-1.5 text-left w-32">
                ITEM DESCRIPTION
              </th>
              <th className="border-r border-neutral-700 px-2 py-1.5 text-center w-24">
                WEIGHT (KGS)
              </th>
              <th className="border-r border-neutral-700 px-2 py-1.5 text-center w-24">
                DESTINATION
              </th>
              <th className="border-r border-neutral-700 px-2 py-1.5 text-left w-36 bg-cyan-700 text-white">
                RECEIVER NAME
              </th>
              <th className="border-r border-neutral-700 px-2 py-1.5 text-left w-32 bg-cyan-700 text-white">
                RECEIVER PHONE
              </th>
              <th className="border-r border-neutral-700 px-2 py-1.5 text-center w-20">
                FEE / $
              </th>
              <th className="border-r border-neutral-700 px-2 py-1.5 text-center w-32">
                PAYMENT / BALANCE
              </th>
              <th className="px-2 py-1.5 text-center w-28 bg-emerald-800 text-white">
                RASIID & TALLAABO
              </th>
            </tr>
          </thead>
          <tbody>
            {renderRowsWithBanners()}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-neutral-200 border-t border-neutral-300 text-xs font-semibold text-neutral-700">
        <div>Wadarta Safafka Dirista: {items.length}</div>
        <div className="flex items-center gap-6">
          <span>Shirkadda: <strong className="text-neutral-900">{COMPANY_NAME}</strong></span>
          <span>Baxay (PAID): <strong className="text-emerald-700">{items.filter(i => i.balanceStatus === 'PAID').length}</strong></span>
          <span>Haraac ku jira: <strong className="text-red-700">{items.filter(i => i.balanceStatus.startsWith('BALANCE')).length}</strong></span>
        </div>
      </div>
    </div>
  );
};
