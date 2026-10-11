import React from 'react';
import { Plus, Menu, ChevronDown } from 'lucide-react';
import { SheetTab } from '../types';

interface BottomTabBarProps {
  activeTab: SheetTab;
  onTabChange: (tab: SheetTab) => void;
  onAddNewRow: () => void;
  totalCount: number;
  totalWeightKgs: number;
  totalUnpaidBalanceUSD: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  onAddNewRow,
  totalCount,
  totalWeightKgs,
  totalUnpaidBalanceUSD,
}) => {
  const tabs: { key: SheetTab; label: string; countLabel?: string }[] = [
    { key: 'ALAABTA_TIMI', label: 'ALAABTA TIMI' },
    { key: 'ALAAB_DIRIS', label: 'ALAAB DIRIS' },
    { key: 'EXPENCES', label: 'EXPENCES' },
    { key: 'GOBOLADA', label: 'GOBOLADA' },
    { key: 'TICKETS', label: 'TICKETS' },
    { key: 'DIB_U_DIWAN_GELIN', label: 'DIB U DIWAN GELIN' },
  ];

  return (
    <div className="flex items-center justify-between h-9 bg-neutral-200 border-t border-neutral-300 text-xs px-2 select-none shrink-0 shadow-inner">
      {/* Left controls & Sheet tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1">
        {/* + Button */}
        <button
          onClick={onAddNewRow}
          title="Kudar Saf Cusub (Add row)"
          className="flex items-center justify-center w-6 h-6 rounded hover:bg-neutral-300 text-neutral-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Sheets hamburger menu */}
        <button
          title="Liiska Dhammaan Sheets-ka"
          className="flex items-center justify-center w-6 h-6 rounded hover:bg-neutral-300 text-neutral-700 transition-colors"
        >
          <Menu className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-neutral-400 mx-1" />

        {/* The Tabs */}
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-t text-xs font-semibold uppercase tracking-tight transition-all ${
                isActive
                  ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-300/70 hover:text-neutral-900'
              }`}
            >
              <span>{tab.label}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
          );
        })}
      </div>

      {/* Right Stats & Exact "Count: 88" badge from the screenshot */}
      <div className="flex items-center gap-3 shrink-0 pl-2">
        <div className="hidden md:flex items-center gap-3 text-[11px] text-neutral-600 font-mono">
          <span>Miisaanka: <strong>{totalWeightKgs.toFixed(1)} kg</strong></span>
          <span>Haraaga: <strong className="text-red-700 font-bold">${totalUnpaidBalanceUSD}</strong></span>
        </div>

        {/* The exact Count: 88 badge in green matching bottom right of image.png */}
        <div className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#dcfce7] border border-[#86efac] text-[#15803d] font-mono font-bold text-xs shadow-2xs">
          <span>Count:</span>
          <span>{totalCount}</span>
        </div>
      </div>
    </div>
  );
};
