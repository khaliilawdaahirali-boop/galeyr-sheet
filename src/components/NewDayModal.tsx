import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Copy, 
  Sparkles, 
  Layers, 
  ArrowRight,
  RotateCcw,
  Plus
} from 'lucide-react';
import { CargoItem } from '../types';

interface NewDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: string;
  items: CargoItem[];
  onStartNewDay: (newDate: string, rolloverMode: 'pending_only' | 'duplicate_all' | 'empty') => void;
  availableDates: string[];
  onSelectDate: (date: string) => void;
}

export const NewDayModal: React.FC<NewDayModalProps> = ({
  isOpen,
  onClose,
  currentDate,
  items,
  onStartNewDay,
  availableDates,
  onSelectDate,
}) => {
  // Generate next day by default (e.g., if 10/10/2026, suggest 11/10/2026)
  const getNextDateSuggestion = (dateStr: string) => {
    try {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const y = parseInt(parts[2], 10);
        const nextDay = String(d + 1).padStart(2, '0');
        const monthStr = String(m).padStart(2, '0');
        return `${nextDay}/${monthStr}/${y}`;
      }
    } catch {
      // fallback
    }
    const today = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(today.getDate())}/${pad(today.getMonth() + 1)}/${today.getFullYear()}`;
  };

  const [newDateInput, setNewDateInput] = useState(() => getNextDateSuggestion(currentDate));
  const [rolloverMode, setRolloverMode] = useState<'pending_only' | 'duplicate_all' | 'empty'>('pending_only');

  if (!isOpen) return null;

  const pendingCount = items.filter((i) => i.status === 'Package in').length;
  const outCount = items.filter((i) => i.status === 'OUT').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDateInput.trim()) return;
    onStartNewDay(newDateInput.trim(), rolloverMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-900 text-white border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-red-600 text-white font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Nuqul Ka Samee / Bilow Maalin Cusub
              </h3>
              <p className="text-[11px] text-neutral-400">
                U guuri xogta maalin cusub (New Day Manifest) adigoo beddelaya taariikhda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Current Date & Past Days Switcher */}
          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-neutral-700">Taariikhda Hadda Furan:</span>
              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono font-bold">
                {currentDate}
              </span>
            </div>
            <div className="text-[11px] text-neutral-500 flex justify-between">
              <span>Wadarta Xirmooyinka: <strong>{items.length}</strong></span>
              <span>Baxay (OUT): <strong className="text-emerald-700">{outCount}</strong></span>
              <span>Ku jira (Package in): <strong className="text-amber-700">{pendingCount}</strong></span>
            </div>

            {/* Quick switcher if multiple dates exist */}
            {availableDates.length > 1 && (
              <div className="mt-3 pt-2 border-t border-neutral-200">
                <span className="text-[11px] font-semibold text-neutral-600 block mb-1">
                  U kala beddel maalmaha hore loo keydiyey:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {availableDates.map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => {
                        onSelectDate(d);
                        onClose();
                      }}
                      className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-colors ${
                        d === currentDate 
                          ? 'bg-neutral-800 text-white' 
                          : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* New Date Input */}
          <div>
            <label className="block font-bold text-neutral-800 mb-1">
              Geli Taariikhda Maalinta Cusub (DD/MM/YYYY) *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Tusaale: 11/10/2026"
                value={newDateInput}
                onChange={(e) => setNewDateInput(e.target.value)}
                className="w-full pl-3 pr-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono font-bold text-neutral-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Cinwaanka weyn ee casanka ah ee dhexda wuxuu noqon doonaa taariikhdan cusub.
            </span>
          </div>

          {/* Rollover Mode Selector */}
          <div>
            <label className="block font-bold text-neutral-800 mb-1.5">
              Sidee loo maamulayaa xirmooyinka maalinta cusub?
            </label>
            <div className="space-y-2">
              {/* Option 1: Pending only (recommended) */}
              <label 
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  rolloverMode === 'pending_only'
                    ? 'border-red-600 bg-red-50/50 shadow-2xs'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name="rollover"
                  checked={rolloverMode === 'pending_only'}
                  onChange={() => setRolloverMode('pending_only')}
                  className="mt-0.5 text-red-600 focus:ring-red-500"
                />
                <div>
                  <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <span>Soo rar xirmooyinka dhiman kaliya ({pendingCount} Package in)</span>
                    <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-semibold">Tugsanaya</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    Xirmooyinkii hore ee baxay (OUT) waxay ku hadhayaan taariikhdii shalay, kuwa wali xafiiska yaallana waxay u gudbayaan maalinta cusub.
                  </p>
                </div>
              </label>

              {/* Option 2: Full Copy */}
              <label 
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  rolloverMode === 'duplicate_all'
                    ? 'border-red-600 bg-red-50/50 shadow-2xs'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name="rollover"
                  checked={rolloverMode === 'duplicate_all'}
                  onChange={() => setRolloverMode('duplicate_all')}
                  className="mt-0.5 text-red-600 focus:ring-red-500"
                />
                <div>
                  <div className="font-bold text-neutral-900">
                    Nuqul buuxa oo dhammaan safafka ah ({items.length} xirmo)
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    Dhammaan safafka hadda jira waxaa loo koobiyeeyn doonaa maalinta cusub iyagoo la cusboonaysiiyay taariikhdooda.
                  </p>
                </div>
              </label>

              {/* Option 3: Fresh Empty */}
              <label 
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  rolloverMode === 'empty'
                    ? 'border-red-600 bg-red-50/50 shadow-2xs'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name="rollover"
                  checked={rolloverMode === 'empty'}
                  onChange={() => setRolloverMode('empty')}
                  className="mt-0.5 text-red-600 focus:ring-red-500"
                />
                <div>
                  <div className="font-bold text-neutral-900">
                    Bilow maalin cusub oo madhan (Fresh Day)
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    Waxay bilaabaysaa xaashi cusub oo madhan taariikhdaas cusub leh, adigoo safafka cusub bilaabi kara.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-neutral-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded font-medium transition-colors"
            >
              Ka Noqo
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Abuur Maalinta Cusub ({newDateInput})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
