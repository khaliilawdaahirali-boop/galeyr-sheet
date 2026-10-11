import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Plus, 
  Zap, 
  CheckCircle, 
  Layers, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { CargoItem } from '../types';
import { SENDER_OPTIONS, ORIGIN_OPTIONS, DESTINATION_OPTIONS } from '../data/initialData';
import { playSound } from '../utils/sound';

interface QuickEntrySheetProps {
  onAddItem: (item: Partial<CargoItem>) => void;
  nextRowNumber: number;
}

export const QuickEntrySheet: React.FC<QuickEntrySheetProps> = ({
  onAddItem,
  nextRowNumber,
}) => {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Single Form State
  const [formData, setFormData] = useState({
    senderName: 'GAAAS',
    originCity: 'MGQ-HGA',
    receiverName: '',
    receiverPhone: '',
    itemDescription: '',
    weightKgs: '5 KGS',
    balanceDue: 'FREE',
    destination: '',
    isImportant: false,
  });

  // Batch Form State
  const [batchText, setBatchText] = useState('');

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.receiverName.trim()) return;

    onAddItem({
      senderName: formData.senderName,
      originCity: formData.originCity,
      receiverName: formData.receiverName.trim().toUpperCase(),
      receiverPhone: formData.receiverPhone.trim(),
      itemDescription: formData.itemDescription.trim().toUpperCase() || 'XIRMO',
      weightKgs: formData.weightKgs.trim(),
      balanceDue: formData.balanceDue.trim() || 'FREE',
      destination: formData.destination,
      isImportant: formData.isImportant,
      goodsChecked: false,
      status: 'Package in',
      dateTime: '',
    });

    playSound('add');
    setSuccessNotice(`Xirmada "${formData.receiverName.toUpperCase()}" si guul leh ayaa loogu daray Safka #${nextRowNumber}!`);
    setTimeout(() => setSuccessNotice(null), 3000);

    // Reset fields for the next entry but keep sender/origin for speed
    setFormData((prev) => ({
      ...prev,
      receiverName: '',
      receiverPhone: '',
      itemDescription: '',
      weightKgs: '5 KGS',
      balanceDue: 'FREE',
      isImportant: false,
    }));
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchText.trim()) return;

    const lines = batchText.trim().split('\n');
    let addedCount = 0;

    lines.forEach((line) => {
      const parts = line.split(/[,\t|]/).map((p) => p.trim());
      if (parts.length > 0 && parts[0]) {
        // format: Name, Phone, Item, Weight, Balance, Destination
        const receiverName = parts[0] || 'MACAAMIIL';
        const receiverPhone = parts[1] || '';
        const itemDescription = parts[2] || 'BOX';
        const weightKgs = parts[3] ? `${parts[3]} KGS` : '0 KGS';
        const balanceDue = parts[4] || 'FREE';
        const destination = parts[5] || '';

        onAddItem({
          senderName: formData.senderName,
          originCity: formData.originCity,
          receiverName: receiverName.toUpperCase(),
          receiverPhone: receiverPhone,
          itemDescription: itemDescription.toUpperCase(),
          weightKgs: weightKgs,
          balanceDue: balanceDue,
          destination: destination,
          goodsChecked: false,
          status: 'Package in',
          dateTime: '',
        });
        addedCount++;
      }
    });

    playSound('add');
    setSuccessNotice(`${addedCount} xirmo oo cusub ayaa toos loogu daray jadwalka "ALAABTA TIMI"!`);
    setTimeout(() => setSuccessNotice(null), 4000);
    setBatchText('');
  };

  return (
    <div className="flex flex-col h-full bg-neutral-100 select-none overflow-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto w-full space-y-4">
        {/* Banner */}
        <div className="bg-white p-4 rounded-lg border border-neutral-300 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 uppercase">
                DIB U DIWAN GELIN (Quick Package Entry & Intake Form)
              </h2>
              <p className="text-xs text-neutral-500">
                Geli xogta xirmooyinka cusub ee hadda soo degay si ay toos ugu biiraan jadwalka weyn
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-neutral-100 p-1 rounded border border-neutral-300 text-xs">
            <button
              onClick={() => setMode('single')}
              className={`px-3 py-1 font-semibold rounded transition-colors ${
                mode === 'single' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
              }`}
            >
              Mid-mid (Single Entry)
            </button>
            <button
              onClick={() => setMode('batch')}
              className={`px-3 py-1 font-semibold rounded transition-colors ${
                mode === 'batch' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
              }`}
            >
              Dhowr mar (Batch Intake)
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Form Container */}
        {mode === 'single' ? (
          <form onSubmit={handleSingleSubmit} className="bg-white p-6 rounded-lg border border-neutral-300 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
              <span className="text-xs font-bold text-neutral-800 uppercase flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Diwaangelin Degdeg ah (Safka Xiga: #{nextRowNumber})
              </span>
              <span className="text-xs text-neutral-500">
                Riix <kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded font-mono text-[10px]">Enter</kbd> si aad u keydiso
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Sender Name */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Shirkadda Soo Dirtay (Sender)</label>
                <select
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded font-bold bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                >
                  {SENDER_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Origin City */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Magaalada Ka Timid (Origin)</label>
                <select
                  value={formData.originCity}
                  onChange={(e) => setFormData({ ...formData, originCity: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded font-bold bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                >
                  {ORIGIN_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              {/* Destination */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Magaalada Loo Dirayo (Destination)</label>
                <select
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded font-bold bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                >
                  <option value="">— (Xarunta Hargeisa)</option>
                  {DESTINATION_OPTIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Receiver Name */}
              <div className="md:col-span-2">
                <label className="block font-semibold text-neutral-700 mb-1">Magaca Qaataha (Receiver Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="Tusaale: MAXAMED AXMED CALI"
                  value={formData.receiverName}
                  onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded font-bold uppercase bg-white focus:ring-1 focus:ring-emerald-500 outline-none text-neutral-900"
                  autoFocus
                />
              </div>

              {/* Receiver Phone */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Telefoonka Macmiilka (Phone)</label>
                <input
                  type="text"
                  placeholder="63xxxxxxx ama 65xxxxxxx"
                  value={formData.receiverPhone}
                  onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded font-mono bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Item Description */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Sharaxaadda Alaabta (Description)</label>
                <input
                  type="text"
                  placeholder="CADAN, BLUE, BOX, DHAR, HURUD..."
                  value={formData.itemDescription}
                  onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded uppercase font-semibold bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Miisaanka (Weight)</label>
                <input
                  type="text"
                  placeholder="Tusaale: 5.2 KGS ama 10 KGS"
                  value={formData.weightKgs}
                  onChange={(e) => setFormData({ ...formData, weightKgs: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded font-mono font-semibold bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Balance Due */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Haraaga Laga Rabo (Balance Due)</label>
                <input
                  type="text"
                  placeholder="FREE ama 10$, 40$, 8$..."
                  value={formData.balanceDue}
                  onChange={(e) => setFormData({ ...formData, balanceDue: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded font-mono font-bold bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Checkbox for Special Red Alert */}
            <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                <input
                  type="checkbox"
                  checked={formData.isImportant}
                  onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                  className="rounded border-neutral-300 text-red-600 focus:ring-red-500"
                />
                <span>U dhig digniin cas (sida magaca NIMCO VABI ee casanka ahaa)</span>
              </label>

              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-xs text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Kudar Sheet-ka Weyn</span>
              </button>
            </div>
          </form>
        ) : (
          /* Batch Form */
          <form onSubmit={handleBatchSubmit} className="bg-white p-6 rounded-lg border border-neutral-300 shadow-xs">
            <div className="pb-3 mb-4 border-b border-neutral-200">
              <span className="text-xs font-bold text-neutral-800 uppercase flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                Diiwaangelin Wadareed (Batch Paste)
              </span>
              <p className="text-xs text-neutral-500 mt-1">
                Kusoo koobiyeey qoraal ama safaf Excel ah. Qaabka: <code className="bg-neutral-100 px-1 py-0.5 rounded text-[11px] font-mono">Magaca, Tel, Alaabta, Miisaanka, Haraaga, Magaalada</code>
              </p>
            </div>

            <textarea
              rows={8}
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              placeholder={`NASHAAD, 634835728, CADAN, 5, FREE, \nFADUMO XASAN, 633319576, MADOW, 8, 10$, BURCO\nAXMED CALI, 634123456, BOX, 12, FREE, BORAMA`}
              className="w-full p-3 border border-neutral-300 rounded font-mono text-xs focus:ring-1 focus:ring-emerald-500 outline-none leading-relaxed"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-xs text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Geli Dhammaan Xirmooyinka</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
