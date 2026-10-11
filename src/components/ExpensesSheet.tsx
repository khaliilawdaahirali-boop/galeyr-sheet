import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  DollarSign, 
  FileText,
  Calendar,
  Filter
} from 'lucide-react';
import { ExpenseItem } from '../types';

interface ExpensesSheetProps {
  expenses: ExpenseItem[];
  onAddExpense: (exp: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpensesSheet: React.FC<ExpensesSheetProps> = ({
  expenses,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newExp, setNewExp] = useState<Partial<ExpenseItem>>({
    date: new Date().toISOString().split('T')[0],
    category: 'Mootooyin',
    description: '',
    amount: 10,
    currency: 'USD',
    paidTo: '',
    voucherNo: `VCH-${Math.floor(700 + Math.random() * 300)}`,
    approvedBy: 'Maamulaha',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.description || !newExp.amount) return;

    const created: ExpenseItem = {
      id: `exp-${Date.now()}`,
      date: newExp.date || new Date().toISOString().split('T')[0],
      category: newExp.category || 'Kale',
      description: newExp.description,
      amount: Number(newExp.amount) || 0,
      currency: 'USD',
      paidTo: newExp.paidTo || '—',
      voucherNo: newExp.voucherNo || `VCH-${Math.floor(100 + Math.random() * 900)}`,
      approvedBy: newExp.approvedBy || 'Maamulka',
    };

    onAddExpense(created);
    setShowForm(false);
    setNewExp({
      date: new Date().toISOString().split('T')[0],
      category: 'Mootooyin',
      description: '',
      amount: 10,
      currency: 'USD',
      paidTo: '',
      voucherNo: `VCH-${Math.floor(700 + Math.random() * 300)}`,
      approvedBy: 'Maamulaha',
    });
  };

  const totalExpenseUSD = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-neutral-100 border-b border-neutral-300 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-neutral-800 text-sm">
            <Receipt className="w-4 h-4 text-red-600" />
            <span>EXPENCES (Kharashaadka Shaqada ee Xarunta & Gaadiidka)</span>
          </div>
          <span className="text-neutral-500">|</span>
          <span className="text-neutral-600">
            Diiwaanka kharashka shidaalka, mootooyinka, canshuuraha, iyo baakadaha
          </span>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Kudar Kharash Cusub</span>
        </button>
      </div>

      {/* Add Drawer */}
      {showForm && (
        <form onSubmit={handleAdd} className="p-4 bg-red-50/50 border-b border-red-200 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Taariikhda</label>
              <input
                type="date"
                required
                value={newExp.date}
                onChange={(e) => setNewExp({ ...newExp, date: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-neutral-300 rounded bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Qaybta (Category)</label>
              <select
                value={newExp.category}
                onChange={(e) => setNewExp({ ...newExp, category: e.target.value as ExpenseItem['category'] })}
                className="w-full px-2.5 py-1.5 border border-neutral-300 rounded bg-white font-semibold"
              >
                <option value="Mootooyin">Mootooyin (Delivery)</option>
                <option value="Shidaal">Shidaal (Fuel)</option>
                <option value="Canshuur">Canshuur (Customs / Tax)</option>
                <option value="Kirada Bakhaarka">Kirada Bakhaarka</option>
                <option value="Mushahar">Mushahar (Wages)</option>
                <option value="Qalab & Baakad">Qalab & Baakad (Packaging)</option>
                <option value="Kale">Kale (Other)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Cadadka Lacagta ($ USD) *</label>
              <input
                type="number"
                step="0.5"
                required
                value={newExp.amount}
                onChange={(e) => setNewExp({ ...newExp, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 border border-neutral-300 rounded bg-white font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Loo Bixiyey (Paid To)</label>
              <input
                type="text"
                placeholder="Shirkad ama Qof..."
                value={newExp.paidTo}
                onChange={(e) => setNewExp({ ...newExp, paidTo: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-neutral-300 rounded bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">Sharaxaadda Kharashka *</label>
              <input
                type="text"
                required
                placeholder="Faahfaahi waxa loo isticmaalay lacagta..."
                value={newExp.description}
                onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-neutral-300 rounded bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Voucher No</label>
              <input
                type="text"
                value={newExp.voucherNo}
                onChange={(e) => setNewExp({ ...newExp, voucherNo: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-neutral-300 rounded bg-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Waxaa Anxiyey</label>
              <input
                type="text"
                value={newExp.approvedBy}
                onChange={(e) => setNewExp({ ...newExp, approvedBy: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-neutral-300 rounded bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded font-medium"
            >
              Ka Noqo
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow-xs"
            >
              Keydi Kharashka
            </button>
          </div>
        </form>
      )}

      {/* Expenses Table */}
      <div className="flex-1 overflow-auto bg-neutral-100">
        <table className="w-full border-collapse bg-white text-xs text-neutral-900 border border-neutral-300">
          <thead>
            <tr className="bg-neutral-800 text-white font-semibold text-left">
              <th className="py-2 px-3 border-r border-neutral-700 w-28">VOUCHER #</th>
              <th className="py-2 px-3 border-r border-neutral-700 w-28">TAARIIKH</th>
              <th className="py-2 px-3 border-r border-neutral-700 w-36">QAYBTA</th>
              <th className="py-2 px-3 border-r border-neutral-700">SHARAXAADDA</th>
              <th className="py-2 px-3 border-r border-neutral-700 w-44">LOO BIXIYEY</th>
              <th className="py-2 px-3 border-r border-neutral-700 text-right w-28">CADADKA ($)</th>
              <th className="py-2 px-3 border-r border-neutral-700 w-32">ANXINTA</th>
              <th className="py-2 px-2 text-center w-16">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 font-mono text-[11px]">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-neutral-50 transition-colors font-sans">
                <td className="p-2 border-r border-neutral-200 font-mono font-bold text-red-800">
                  {exp.voucherNo}
                </td>
                <td className="p-2 border-r border-neutral-200 font-mono text-neutral-600">
                  {exp.date}
                </td>
                <td className="p-2 border-r border-neutral-200 font-medium">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-100 text-neutral-800 border border-neutral-300">
                    {exp.category}
                  </span>
                </td>
                <td className="p-2 border-r border-neutral-200 font-medium text-neutral-800">
                  {exp.description}
                </td>
                <td className="p-2 border-r border-neutral-200 text-neutral-600">
                  {exp.paidTo}
                </td>
                <td className="p-2 border-r border-neutral-200 text-right font-mono font-bold text-red-700">
                  ${exp.amount.toFixed(2)}
                </td>
                <td className="p-2 border-r border-neutral-200 text-neutral-600 text-[11px]">
                  {exp.approvedBy}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => onDeleteExpense(exp.id)}
                    className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-200 border-t border-neutral-300 text-xs font-semibold text-neutral-700">
        <div>Tirada Qoraallada Kharashka: {expenses.length}</div>
        <div className="flex items-center gap-6">
          <span>Wadarta Kharashka Baxay: <strong className="text-red-700 text-sm font-mono">${totalExpenseUSD.toFixed(2)} USD</strong></span>
        </div>
      </div>
    </div>
  );
};
