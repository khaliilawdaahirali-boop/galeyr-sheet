import React from 'react';
import { 
  FileSpreadsheet, 
  Code2, 
  Download, 
  Printer, 
  Plus, 
  Search, 
  RefreshCw,
  Plane
} from 'lucide-react';
import { SheetTab } from '../types';
import { COMPANY_NAME } from '../data/initialData';

interface HeaderProps {
  activeTab: SheetTab;
  onTabChange: (tab: SheetTab) => void;
  onOpenAppsScript: () => void;
  onOpenGoogleSheetsGuide: () => void;
  onExportCsv: () => void;
  onImportCsv: () => void;
  onPrint: () => void;
  onAddNewRow: () => void;
  onResetData: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenAppsScript,
  onOpenGoogleSheetsGuide,
  onExportCsv,
  onImportCsv,
  onPrint,
  onAddNewRow,
  onResetData,
  searchQuery,
  setSearchQuery,
  totalCount,
}) => {
  return (
    <header className="bg-white border-b border-neutral-300 select-none shadow-xs">
      {/* Top Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-emerald-700 text-white shadow-xs font-black">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold tracking-tight text-neutral-900 uppercase">
                {COMPANY_NAME}
              </h1>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                onEdit Active
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <span>Nidaamka Guud ee Xamuulka: <strong className="font-semibold text-neutral-700">Mogadishu, Nairobi, Dubai & Gobolada</strong></span>
              <span>·</span>
              <span className="text-neutral-500">Invoice & Manifest System</span>
            </div>
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Direct Google Sheets / Gmail Helper Button */}
          <button
            onClick={onOpenGoogleSheetsGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded bg-[#0f9d58] hover:bg-[#0b8043] text-white transition-colors shadow-xs"
            title="Sida loogu geeyo Google Sheet-ka Gmail-kaaga"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>U Gey Google Sheets (Gmail)</span>
          </button>

          <button
            onClick={onOpenAppsScript}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-xs"
            title="Eeg oo koobiyeey Code-ka Google Apps Script (onEdit)"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Code-ka Apps Script</span>
          </button>

          <button
            onClick={onAddNewRow}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Kudar Saf Cusub</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors"
            title="Daabac Jadwalka (Print)"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Daabac</span>
          </button>

          <button
            onClick={onExportCsv}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors"
            title="Dhoofi xogta (Export CSV / Excel)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            onClick={onResetData}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded border border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
            title="Dib u soo celi xogtii asalka ahayd ee sawirka (Reset)"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Sheets Style Toolbar */}
      <div className="flex items-center justify-between px-3 py-1 bg-neutral-50 text-neutral-700 text-xs overflow-x-auto gap-3">
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Search */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2 text-neutral-400" />
            <input
              type="text"
              placeholder="Raadi magaca, telefoonka, xirmooyinka..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-3 py-1 text-xs border border-neutral-300 rounded bg-white w-64 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-xs text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            )}
          </div>

          <div className="h-4 w-px bg-neutral-300" />

          {/* Quick tab switcher indicator */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-neutral-500 font-medium">Qaybta Furan:</span>
            <span className="font-extrabold text-neutral-900 uppercase tracking-tight">
              {activeTab === 'ALAABTA_TIMI' && 'ALAABTA TIMI (Inbound Manifest)'}
              {activeTab === 'ALAAB_DIRIS' && 'ALAAB DIRIS (Outbound Manifest)'}
              {activeTab === 'EXPENCES' && 'EXPENCES (Kharashaadka)'}
              {activeTab === 'GOBOLADA' && 'GOBOLADA (Regional Routes)'}
              {activeTab === 'TICKETS' && 'TICKETS (Tikidhada & Baafinta)'}
              {activeTab === 'DIB_U_DIWAN_GELIN' && 'DIB U DIWAN GELIN (Quick Intake)'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-600 inline-block"></span>
            <span className="text-neutral-700 font-medium">OUT / PAID</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 inline-block"></span>
            <span className="text-neutral-700 font-medium">Package in / Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-600 inline-block"></span>
            <span className="text-neutral-700 font-medium">Balance Due</span>
          </div>
        </div>
      </div>
    </header>
  );
};
