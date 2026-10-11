import React, { useState } from 'react';
import { 
  Check, 
  Trash2, 
  Copy, 
  Phone, 
  ChevronDown, 
  Plus,
  FileText,
  Calendar,
  Layers,
  Edit2
} from 'lucide-react';
import { CargoItem, ReceiptData } from '../types';
import { SENDER_OPTIONS, ORIGIN_OPTIONS, DESTINATION_OPTIONS } from '../data/initialData';
import { formatCurrentTimestamp } from '../utils/appsScriptCode';
import { playSound } from '../utils/sound';

interface InboundSheetProps {
  items: CargoItem[];
  onUpdateItem: (id: string, updates: Partial<CargoItem>) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (item?: Partial<CargoItem>) => void;
  onDuplicateItem: (id: string) => void;
  onOpenReceipt: (receipt: ReceiptData) => void;
  onOpenNewDayModal: () => void;
  currentDateBanner: string;
  onChangeDateBanner: (newDate: string) => void;
  searchQuery: string;
}

export const InboundSheet: React.FC<InboundSheetProps> = ({
  items,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onDuplicateItem,
  onOpenReceipt,
  onOpenNewDayModal,
  currentDateBanner,
  onChangeDateBanner,
  searchQuery,
}) => {
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof CargoItem } | null>(null);
  const [editingDateBanner, setEditingDateBanner] = useState(false);
  const [tempDateBanner, setTempDateBanner] = useState(currentDateBanner);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OUT' | 'Package in'>('ALL');
  const [filterDestination, setFilterDestination] = useState<string>('ALL');

  // Filter items
  const filteredItems = items.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.receiverName.toLowerCase().includes(q);
      const matchPhone = item.receiverPhone.toLowerCase().includes(q);
      const matchDesc = item.itemDescription.toLowerCase().includes(q);
      const matchSender = item.senderName.toLowerCase().includes(q);
      const matchOrigin = item.originCity.toLowerCase().includes(q);
      const matchDest = item.destination.toLowerCase().includes(q);
      const matchRow = String(item.rowNumber).includes(q);
      if (!matchName && !matchPhone && !matchDesc && !matchSender && !matchOrigin && !matchDest && !matchRow) {
        return false;
      }
    }

    if (filterStatus !== 'ALL' && item.status !== filterStatus) {
      return false;
    }

    if (filterDestination !== 'ALL') {
      if (filterDestination === 'LOCAL_ONLY' && item.destination !== '') return false;
      if (filterDestination !== 'LOCAL_ONLY' && item.destination !== filterDestination) return false;
    }

    return true;
  });

  const handleToggleGoods = (item: CargoItem) => {
    const nextChecked = !item.goodsChecked;

    if (nextChecked) {
      const nowFormatted = formatCurrentTimestamp();
      playSound('check');
      onUpdateItem(item.id, {
        goodsChecked: true,
        status: 'OUT',
        dateTime: nowFormatted,
      });
    } else {
      playSound('uncheck');
      onUpdateItem(item.id, {
        goodsChecked: false,
        status: 'Package in',
        dateTime: '',
      });
    }
  };

  const isNumericBalance = (val: string) => {
    if (!val || val === 'FREE') return false;
    return val.includes('$') || /\d/.test(val);
  };

  const triggerRowReceipt = (item: CargoItem) => {
    onOpenReceipt({
      type: 'INBOUND',
      receiptNo: `CRG-IN-${item.rowNumber}`,
      date: item.date || currentDateBanner,
      senderName: item.senderName,
      originCity: item.originCity,
      receiverName: item.receiverName || 'MACAAMIIL',
      receiverPhone: item.receiverPhone,
      itemDescription: item.itemDescription,
      weight: item.weightKgs,
      amountOrBalance: item.balanceDue,
      status: item.status,
      destination: item.destination || 'HARGEISA (Xarunta)',
      dateTime: item.dateTime,
    });
  };

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Sub-toolbar with filters & status quick filters */}
      <div className="flex flex-wrap items-center justify-between px-3 py-1.5 bg-neutral-100 border-b border-neutral-300 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-700">Shaandhee (Filter):</span>
          
          {/* Status buttons */}
          <div className="flex items-center bg-white border border-neutral-300 rounded overflow-hidden">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                filterStatus === 'ALL' ? 'bg-neutral-800 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Dhammaan ({items.length})
            </button>
            <button
              onClick={() => setFilterStatus('Package in')}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                filterStatus === 'Package in' ? 'bg-amber-500 text-white' : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              Package in ({items.filter(i => i.status === 'Package in').length})
            </button>
            <button
              onClick={() => setFilterStatus('OUT')}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                filterStatus === 'OUT' ? 'bg-emerald-600 text-white' : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              OUT ({items.filter(i => i.status === 'OUT').length})
            </button>
          </div>

          {/* Destination filter */}
          <select
            value={filterDestination}
            onChange={(e) => setFilterDestination(e.target.value)}
            className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs text-neutral-700 focus:outline-none"
          >
            <option value="ALL">Dhammaan Gobolada & Magaalooyinka</option>
            <option value="LOCAL_ONLY">Xarunta Hargeisa (Local)</option>
            {DESTINATION_OPTIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Quick Batch Actions & New Day Trigger */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onOpenNewDayModal}
            className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold shadow-2xs transition-colors"
            title="Nuqul ka samee sheet-ka si aad maalin cusub ugu bilowdo"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Nuqul / Maalin Cusub (New Date)</span>
          </button>

          <button
            onClick={() => onAddItem()}
            className="flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-300 hover:bg-neutral-50 rounded font-medium text-neutral-800 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kudar Saf Cusub</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Table Container */}
      <div className="flex-1 overflow-auto bg-neutral-200">
        <table className="w-full border-collapse bg-white text-xs text-neutral-900 border border-neutral-300">
          <thead>
            {/* Top Date Banner Row spanning across center */}
            <tr className="bg-neutral-100 border-b border-neutral-300 text-center font-bold">
              <th className="w-12 bg-neutral-200 border-r border-neutral-300 py-1 text-[11px] text-neutral-600">
                #
              </th>
              <th className="border-r border-neutral-300 px-2 py-1 bg-neutral-100"></th>
              <th className="border-r border-neutral-300 px-2 py-1 bg-neutral-100"></th>
              <th className="border-r border-neutral-300 px-2 py-1 bg-neutral-100"></th>
              
              {/* Centered Large Red Banner with Interactive Edit & New Day shortcut */}
              <th 
                colSpan={4} 
                className="bg-red-600 text-white text-base font-extrabold tracking-wide py-1.5 uppercase shadow-inner border-r border-neutral-300 relative group"
              >
                {editingDateBanner ? (
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="text"
                      value={tempDateBanner}
                      onChange={(e) => setTempDateBanner(e.target.value)}
                      onBlur={() => {
                        onChangeDateBanner(tempDateBanner);
                        setEditingDateBanner(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onChangeDateBanner(tempDateBanner);
                          setEditingDateBanner(false);
                        } else if (e.key === 'Escape') setEditingDateBanner(false);
                      }}
                      autoFocus
                      className="text-neutral-900 bg-white px-2 py-0.5 rounded text-sm font-bold text-center font-mono outline-none"
                    />
                    <button
                      onClick={() => {
                        onChangeDateBanner(tempDateBanner);
                        setEditingDateBanner(false);
                      }}
                      className="px-2 py-0.5 bg-neutral-900 text-white text-xs rounded font-bold"
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span 
                      onClick={() => setEditingDateBanner(true)} 
                      className="cursor-pointer hover:underline"
                      title="Guji si aad u bedesho taariikhda"
                    >
                      {currentDateBanner}
                    </span>
                    <button
                      onClick={() => setEditingDateBanner(true)}
                      className="opacity-0 group-hover:opacity-100 text-[11px] bg-red-700 hover:bg-red-800 px-1.5 py-0.5 rounded transition-opacity"
                      title="Wax ka beddel taariikhda"
                    >
                      <Edit2 className="w-3 h-3 inline" />
                    </button>
                    <button
                      onClick={onOpenNewDayModal}
                      className="opacity-0 group-hover:opacity-100 text-[10px] bg-neutral-900 hover:bg-neutral-800 text-white px-2 py-0.5 rounded font-normal transition-opacity"
                    >
                      + Nuqul Maalin Cusub
                    </button>
                  </div>
                )}
              </th>
              
              <th className="border-r border-neutral-300 px-2 py-1 bg-neutral-100"></th>
              <th className="border-r border-neutral-300 px-2 py-1 bg-neutral-100"></th>
              <th className="border-r border-neutral-300 px-2 py-1 bg-neutral-100"></th>
              <th className="border-r border-neutral-300 px-2 py-1 bg-neutral-100"></th>
              <th className="border-r border-neutral-300 px-2 py-1 bg-neutral-100"></th>
              <th className="px-2 py-1 bg-neutral-100"></th>
            </tr>

            {/* Main Column Header Row (Row 6398 in screenshot) */}
            <tr className="bg-red-600 text-white font-bold tracking-tight text-center border-b border-neutral-800">
              <th className="w-12 py-1.5 px-2 bg-neutral-200 text-neutral-700 text-[11px] font-semibold border-r border-neutral-300">
                6398
              </th>
              <th className="border-r border-neutral-400/40 px-2 py-1.5 text-left w-24">
                DATE
              </th>
              <th className="border-r border-neutral-400/40 px-2 py-1.5 text-left w-32">
                SENDER NAME
              </th>
              <th className="border-r border-neutral-400/40 px-2 py-1.5 text-left w-28">
                ORIGIN CITY
              </th>
              <th className="border-r border-neutral-400/40 px-3 py-1.5 text-left min-w-[140px]">
                RECEIVER NAME
              </th>
              <th className="border-r border-neutral-400/40 px-2 py-1.5 text-left w-32">
                RECEIVER PHONE
              </th>
              <th className="border-r border-neutral-400/40 px-2 py-1.5 text-left min-w-[130px]">
                ITEM DESCRIPTION
              </th>
              <th className="border-r border-neutral-400/40 px-2 py-1.5 text-center w-24">
                WEIGHT (KGS)
              </th>
              <th className="border-r border-neutral-400/40 px-2 py-1.5 text-center w-28">
                BALANCE DUE
              </th>
              <th className="border-r border-neutral-400/40 px-2 py-1.5 text-center w-20">
                GOODS
              </th>
              <th className="border-r border-neutral-400/40 px-3 py-1.5 text-center w-28">
                STATUS
              </th>
              <th className="border-r border-neutral-400/40 px-2 py-1.5 text-left w-28">
                DESTINATION
              </th>
              <th className="border-r border-neutral-400/40 px-2 py-1.5 text-left w-36">
                TIME
              </th>
              {/* Action column with Rasiid & options */}
              <th className="px-2 py-1.5 text-center w-36 bg-red-700">
                RASIID & TALLAABO
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200">
            {filteredItems.map((item) => {
              const hasBalanceAlert = isNumericBalance(item.balanceDue);
              const isOut = item.status === 'OUT';

              return (
                <tr 
                  key={item.id} 
                  className={`hover:bg-neutral-50/80 transition-colors ${
                    item.isImportant ? 'bg-red-50/50' : ''
                  }`}
                >
                  {/* Row Number */}
                  <td className="bg-neutral-100 text-neutral-500 font-mono text-[11px] text-center border-r border-neutral-300 py-1 px-1 font-medium select-none">
                    {item.rowNumber}
                  </td>

                  {/* Col B: DATE */}
                  <td 
                    className="border-r border-neutral-200 px-2 py-1 text-neutral-800 whitespace-nowrap font-mono text-[11px]"
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
                      <span>{item.date}</span>
                    )}
                  </td>

                  {/* Col C: SENDER NAME */}
                  <td className="border-r border-neutral-200 px-2 py-1 whitespace-nowrap">
                    <div className="relative inline-block w-full">
                      <select
                        value={item.senderName}
                        onChange={(e) => onUpdateItem(item.id, { senderName: e.target.value })}
                        className={`w-full appearance-none pr-5 pl-2 py-0.5 text-xs font-semibold rounded cursor-pointer border ${
                          item.senderName === 'GAAAS'
                            ? 'bg-white border-red-500 text-red-700 hover:bg-red-50'
                            : item.senderName === 'KOBOC CARGO'
                            ? 'bg-[#154c5c] text-white border-[#154c5c]'
                            : item.senderName === 'HIMLO'
                            ? 'bg-neutral-700 text-white border-neutral-700'
                            : item.senderName === 'TAWAKAL'
                            ? 'bg-blue-700 text-white border-blue-700'
                            : 'bg-white border-neutral-300 text-neutral-800'
                        }`}
                      >
                        {SENDER_OPTIONS.map((sender) => (
                          <option key={sender} value={sender} className="bg-white text-neutral-900">
                            {sender}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                    </div>
                  </td>

                  {/* Col D: ORIGIN CITY */}
                  <td className="border-r border-neutral-200 px-2 py-1 whitespace-nowrap">
                    <div className="relative inline-block w-full">
                      <select
                        value={item.originCity}
                        onChange={(e) => onUpdateItem(item.id, { originCity: e.target.value })}
                        className={`w-full appearance-none pr-5 pl-2 py-0.5 text-xs font-semibold rounded cursor-pointer border ${
                          item.originCity === 'MGQ-HGA'
                            ? 'bg-[#15803d] text-white border-[#15803d]'
                            : item.originCity === 'NBO-HGA'
                            ? 'bg-[#7f1d1d] text-white border-[#7f1d1d]'
                            : item.originCity === 'DXB-HGA'
                            ? 'bg-[#0369a1] text-white border-[#0369a1]'
                            : 'bg-white border-neutral-300 text-neutral-800'
                        }`}
                      >
                        {ORIGIN_OPTIONS.map((orig) => (
                          <option key={orig} value={orig} className="bg-white text-neutral-900">
                            {orig}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/80" />
                    </div>
                  </td>

                  {/* Col E: RECEIVER NAME */}
                  <td 
                    className={`border-r border-neutral-200 px-3 py-1 font-bold whitespace-nowrap transition-colors ${
                      item.isImportant 
                        ? 'bg-red-600 text-white' 
                        : 'text-neutral-900'
                    }`}
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
                        className="w-full bg-white text-neutral-900 border border-blue-500 px-1 py-0.5 text-xs outline-none uppercase font-bold"
                      />
                    ) : (
                      <div className="flex items-center justify-between group">
                        <span className="uppercase">{item.receiverName || '—'}</span>
                        <button
                          onClick={() => onUpdateItem(item.id, { isImportant: !item.isImportant })}
                          title={item.isImportant ? 'Ka saar digniinta cas' : 'U dhig digniin cas (Alert)'}
                          className={`ml-1 text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                            item.isImportant ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          !
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Col F: RECEIVER PHONE */}
                  <td 
                    className="border-r border-neutral-200 px-2 py-1 font-mono text-neutral-800 whitespace-nowrap"
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
                      <div className="flex items-center gap-1 group">
                        <span>{item.receiverPhone || ''}</span>
                        {item.receiverPhone && (
                          <a
                            href={`tel:${item.receiverPhone}`}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-400 hover:text-emerald-600 transition-opacity"
                            title={`Wac: ${item.receiverPhone}`}
                          >
                            <Phone className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Col G: ITEM DESCRIPTION */}
                  <td 
                    className="border-r border-neutral-200 px-2 py-1 uppercase font-medium text-neutral-800 whitespace-nowrap"
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
                      <span>{item.itemDescription || '—'}</span>
                    )}
                  </td>

                  {/* Col H: WEIGHT (KGS) */}
                  <td 
                    className="border-r border-neutral-200 px-2 py-1 text-center font-mono font-medium text-neutral-800 whitespace-nowrap tabular-nums"
                    onDoubleClick={() => setEditingCell({ id: item.id, field: 'weightKgs' })}
                  >
                    {editingCell?.id === item.id && editingCell?.field === 'weightKgs' ? (
                      <input
                        type="text"
                        defaultValue={item.weightKgs}
                        autoFocus
                        onBlur={(e) => {
                          onUpdateItem(item.id, { weightKgs: e.target.value.toUpperCase() });
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onUpdateItem(item.id, { weightKgs: (e.target as HTMLInputElement).value.toUpperCase() });
                            setEditingCell(null);
                          } else if (e.key === 'Escape') setEditingCell(null);
                        }}
                        className="w-full bg-white border border-blue-500 px-1 py-0.5 text-xs outline-none text-center font-mono"
                      />
                    ) : (
                      <span>{item.weightKgs || ''}</span>
                    )}
                  </td>

                  {/* Col I: BALANCE DUE */}
                  <td 
                    className={`border-r border-neutral-200 px-2 py-1 text-center font-bold whitespace-nowrap tabular-nums ${
                      hasBalanceAlert 
                        ? 'bg-red-600 text-white' 
                        : 'text-neutral-700'
                    }`}
                    onDoubleClick={() => setEditingCell({ id: item.id, field: 'balanceDue' })}
                  >
                    {editingCell?.id === item.id && editingCell?.field === 'balanceDue' ? (
                      <input
                        type="text"
                        defaultValue={item.balanceDue}
                        autoFocus
                        onBlur={(e) => {
                          onUpdateItem(item.id, { balanceDue: e.target.value });
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onUpdateItem(item.id, { balanceDue: (e.target as HTMLInputElement).value });
                            setEditingCell(null);
                          } else if (e.key === 'Escape') setEditingCell(null);
                        }}
                        className="w-full bg-white text-neutral-900 border border-blue-500 px-1 py-0.5 text-xs outline-none text-center font-bold"
                      />
                    ) : (
                      <span>{item.balanceDue || ''}</span>
                    )}
                  </td>

                  {/* Col J/K: GOODS (Tick Box) */}
                  <td className="border-r border-neutral-200 px-2 py-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleGoods(item)}
                      aria-label={`Toggle status for ${item.receiverName || item.rowNumber}`}
                      className={`inline-flex items-center justify-center w-5 h-5 rounded border transition-all cursor-pointer shadow-2xs ${
                        item.goodsChecked
                          ? 'bg-neutral-800 border-neutral-900 text-white'
                          : 'bg-white border-neutral-400 hover:border-neutral-600 text-transparent'
                      }`}
                      title={item.goodsChecked ? 'OUT (Guji si aad ugu celiso Package in)' : 'Package in (Guji si aad ugu bixiso OUT)'}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </td>

                  {/* Col L: STATUS */}
                  <td 
                    className={`border-r border-neutral-200 px-3 py-1 text-center font-bold whitespace-nowrap transition-colors ${
                      isOut 
                        ? 'bg-[#15803d] text-white shadow-xs' 
                        : 'bg-[#ea580c] text-white shadow-xs'
                    }`}
                  >
                    <span>{item.status}</span>
                  </td>

                  {/* Col M: DESTINATION */}
                  <td className="border-r border-neutral-200 px-2 py-1 whitespace-nowrap">
                    <div className="relative inline-block w-full">
                      <select
                        value={item.destination}
                        onChange={(e) => onUpdateItem(item.id, { destination: e.target.value })}
                        className={`w-full appearance-none pr-5 pl-2 py-0.5 text-xs font-semibold rounded cursor-pointer border ${
                          item.destination === 'MOOTO'
                            ? 'bg-[#6b21a8] text-white border-[#6b21a8]'
                            : item.destination === 'BURCO'
                            ? 'bg-[#166534] text-white border-[#166534]'
                            : item.destination === 'BORAMA'
                            ? 'bg-[#15803d] text-white border-[#15803d]'
                            : item.destination === 'GABILEY'
                            ? 'bg-[#0284c7] text-white border-[#0284c7]'
                            : item.destination === 'BERBERA'
                            ? 'bg-[#0f766e] text-white border-[#0f766e]'
                            : 'bg-white border-neutral-300 text-neutral-800'
                        }`}
                      >
                        <option value="">— (Xarunta)</option>
                        {DESTINATION_OPTIONS.map((dest) => (
                          <option key={dest} value={dest} className="bg-white text-neutral-900">
                            {dest}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                    </div>
                  </td>

                  {/* Col N: TIME */}
                  <td className="border-r border-neutral-200 px-2 py-1 font-mono text-[11px] text-neutral-700 whitespace-nowrap">
                    {item.dateTime || ''}
                  </td>

                  {/* Action Column: RECEIPT + DUPLICATE + DELETE */}
                  <td className="px-2 py-1 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      {/* Prominent Receipt Button */}
                      <button
                        onClick={() => triggerRowReceipt(item)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] border border-emerald-300 transition-colors shadow-2xs"
                        title="Daabac Rasiidka Macmiilkan (Print Receipt)"
                      >
                        <FileText className="w-3 h-3 text-emerald-700" />
                        <span>Rasiid</span>
                      </button>

                      {/* Duplicate single row button */}
                      <button
                        onClick={() => onDuplicateItem(item.id)}
                        className="p-1 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded transition-colors"
                        title="Nuqul ka samee safkan (Duplicate row)"
                      >
                        <Copy className="w-3 h-3" />
                      </button>

                      {/* Delete button */}
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
            })}

            {/* Empty template rows */}
            {[6428, 6429, 6430].map((emptyRow) => (
              <tr key={`empty-${emptyRow}`} className="hover:bg-neutral-50/50 text-neutral-400">
                <td className="bg-neutral-100 text-neutral-400 font-mono text-[11px] text-center border-r border-neutral-300 py-1 px-1">
                  {emptyRow}
                </td>
                <td className="border-r border-neutral-200 px-2 py-1 font-mono text-[11px]"></td>
                <td className="border-r border-neutral-200 px-2 py-1">
                  <div className="h-4 border border-dashed border-neutral-300 rounded"></div>
                </td>
                <td className="border-r border-neutral-200 px-2 py-1">
                  <div className="h-4 border border-dashed border-neutral-300 rounded"></div>
                </td>
                <td className="border-r border-neutral-200 px-3 py-1">
                  <button 
                    onClick={() => onAddItem()}
                    className="text-[11px] text-neutral-400 hover:text-neutral-800"
                  >
                    + Guji si aad u geliso xog
                  </button>
                </td>
                <td className="border-r border-neutral-200 px-2 py-1"></td>
                <td className="border-r border-neutral-200 px-2 py-1"></td>
                <td className="border-r border-neutral-200 px-2 py-1 text-center"></td>
                <td className="border-r border-neutral-200 px-2 py-1 text-center"></td>
                <td className="border-r border-neutral-200 px-2 py-1 text-center">
                  <span className="inline-block w-4 h-4 border border-neutral-300 rounded"></span>
                </td>
                <td className="border-r border-neutral-200 px-3 py-1 text-center bg-amber-50/50 text-amber-700/60 font-medium text-[11px]">
                  Package in
                </td>
                <td className="border-r border-neutral-200 px-2 py-1"></td>
                <td className="border-r border-neutral-200 px-2 py-1"></td>
                <td className="px-2 py-1 text-center"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
