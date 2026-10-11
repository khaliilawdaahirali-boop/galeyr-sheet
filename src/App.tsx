/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SheetTab, CargoItem, OutboundCargoItem, ExpenseItem, ReceiptData } from './types';
import { 
  INITIAL_CARGO_DATA, 
  INITIAL_OUTBOUND_DATA, 
  INITIAL_EXPENSES 
} from './data/initialData';
import { Header } from './components/Header';
import { BottomTabBar } from './components/BottomTabBar';
import { InboundSheet } from './components/InboundSheet';
import { OutboundSheet } from './components/OutboundSheet';
import { ExpensesSheet } from './components/ExpensesSheet';
import { RegionsSheet } from './components/RegionsSheet';
import { TicketsSheet } from './components/TicketsSheet';
import { QuickEntrySheet } from './components/QuickEntrySheet';
import { AppsScriptModal } from './components/AppsScriptModal';
import { ReceiptModal } from './components/ReceiptModal';
import { NewDayModal } from './components/NewDayModal';
import { DirectGoogleSheetsModal } from './components/DirectGoogleSheetsModal';

const LOCAL_STORAGE_CARGO_KEY = 'cargo_sheet_items_v2';
const LOCAL_STORAGE_OUTBOUND_KEY = 'cargo_sheet_outbound_galeyr_v3';
const LOCAL_STORAGE_EXPENSES_KEY = 'cargo_sheet_expenses_v2';
const LOCAL_STORAGE_DATE_BANNER_KEY = 'cargo_sheet_date_banner_v2';
const LOCAL_STORAGE_DAYS_HISTORY_KEY = 'cargo_sheet_days_history_v2';

export default function App() {
  const [currentDateBanner, setCurrentDateBanner] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_DATE_BANNER_KEY);
      if (saved) return saved;
    } catch {}
    return '10/10/2026';
  });

  const [availableDates, setAvailableDates] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_DAYS_HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['10/10/2026'];
  });

  const [cargoItems, setCargoItems] = useState<CargoItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CARGO_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CARGO_DATA;
  });

  const [outboundItems, setOutboundItems] = useState<OutboundCargoItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_OUTBOUND_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_OUTBOUND_DATA;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_EXPENSES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_EXPENSES;
  });

  const [activeTab, setActiveTab] = useState<SheetTab>('ALAABTA_TIMI');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isAppsScriptModalOpen, setIsAppsScriptModalOpen] = useState(false);
  const [isNewDayModalOpen, setIsNewDayModalOpen] = useState(false);
  const [isGoogleSheetsGuideOpen, setIsGoogleSheetsGuideOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<ReceiptData | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CARGO_KEY, JSON.stringify(cargoItems));
    } catch (e) {
      console.error('Failed to save cargo data', e);
    }
  }, [cargoItems]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_OUTBOUND_KEY, JSON.stringify(outboundItems));
    } catch (e) {
      console.error('Failed to save outbound data', e);
    }
  }, [outboundItems]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_EXPENSES_KEY, JSON.stringify(expenses));
    } catch (e) {
      console.error('Failed to save expenses', e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_DATE_BANNER_KEY, currentDateBanner);
    } catch (e) {
      console.error('Failed to save date banner', e);
    }
  }, [currentDateBanner]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_DAYS_HISTORY_KEY, JSON.stringify(availableDates));
    } catch (e) {
      console.error('Failed to save dates list', e);
    }
  }, [availableDates]);

  // Update Inbound Item
  const handleUpdateCargoItem = (id: string, updates: Partial<CargoItem>) => {
    setCargoItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Delete Inbound Item
  const handleDeleteCargoItem = (id: string) => {
    if (confirm('Ma hubtaa inaad tirtirto safkan?')) {
      setCargoItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Duplicate Inbound Item
  const handleDuplicateInboundItem = (id: string) => {
    const existing = cargoItems.find((i) => i.id === id);
    if (!existing) return;

    const maxRow = cargoItems.reduce((max, i) => Math.max(max, i.rowNumber), 6398);
    const duplicated: CargoItem = {
      ...existing,
      id: `cargo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      rowNumber: maxRow + 1,
      goodsChecked: false,
      status: 'Package in',
      dateTime: '',
    };
    setCargoItems((prev) => [...prev, duplicated]);
  };

  // Duplicate Outbound Item
  const handleDuplicateOutboundItem = (id: string) => {
    const existing = outboundItems.find((i) => i.id === id);
    if (!existing) return;

    const maxRow = outboundItems.reduce((max, i) => Math.max(max, i.rowNumber || 700), 750);
    const duplicated: OutboundCargoItem = {
      ...existing,
      id: `out-${Date.now()}`,
      rowNumber: maxRow + 1,
      trackingNo: `GLR-${maxRow + 1}-${existing.destination || 'MGQ'}`,
    };
    setOutboundItems((prev) => [...prev, duplicated]);
  };

  // Add Inbound Item
  const handleAddCargoItem = (customProps?: Partial<CargoItem>) => {
    const maxRow = cargoItems.reduce((max, i) => Math.max(max, i.rowNumber), 6398);
    const nextRow = maxRow + 1;
    const newItem: CargoItem = {
      id: `cargo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      rowNumber: nextRow,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      senderName: customProps?.senderName || 'GAAAS',
      originCity: customProps?.originCity || 'MGQ-HGA',
      receiverName: customProps?.receiverName || '',
      receiverPhone: customProps?.receiverPhone || '',
      itemDescription: customProps?.itemDescription || 'BOX',
      weightKgs: customProps?.weightKgs || '5 KGS',
      balanceDue: customProps?.balanceDue || 'FREE',
      goodsChecked: customProps?.goodsChecked ?? false,
      status: customProps?.status || 'Package in',
      destination: customProps?.destination || '',
      dateTime: customProps?.dateTime || '',
      isImportant: customProps?.isImportant ?? false,
    };
    setCargoItems((prev) => [...prev, newItem]);
  };

  // Start New Day / Duplicate Day Manifest
  const handleStartNewDay = (newDate: string, rolloverMode: 'pending_only' | 'duplicate_all' | 'empty') => {
    setCurrentDateBanner(newDate);
    if (!availableDates.includes(newDate)) {
      setAvailableDates((prev) => [...prev, newDate]);
    }

    if (rolloverMode === 'pending_only') {
      // In cargo operations: carry over only the packages that haven't been picked up yet (Package in)
      const pendingItems = cargoItems
        .filter((i) => i.status === 'Package in')
        .map((i, idx) => ({
          ...i,
          id: `cargo-day-${Date.now()}-${idx}`,
          date: newDate,
          rowNumber: 6400 + idx,
          dateTime: '',
        }));

      setCargoItems(pendingItems.length > 0 ? pendingItems : INITIAL_CARGO_DATA.slice(0, 5));
    } else if (rolloverMode === 'duplicate_all') {
      // Full copy of all items with updated date
      const copied = cargoItems.map((i, idx) => ({
        ...i,
        id: `cargo-day-${Date.now()}-${idx}`,
        date: newDate,
        goodsChecked: false,
        status: 'Package in' as const,
        dateTime: '',
      }));
      setCargoItems(copied);
    } else {
      // Fresh clean day: provide 5 blank starter rows
      const emptyStarters: CargoItem[] = Array.from({ length: 5 }).map((_, idx) => ({
        id: `cargo-new-${Date.now()}-${idx}`,
        rowNumber: 6400 + idx,
        date: newDate,
        senderName: 'GAAAS',
        originCity: 'MGQ-HGA',
        receiverName: '',
        receiverPhone: '',
        itemDescription: '',
        weightKgs: '0 KGS',
        balanceDue: 'FREE',
        goodsChecked: false,
        status: 'Package in',
        destination: '',
        dateTime: '',
      }));
      setCargoItems(emptyStarters);
    }
  };

  // Reset to initial demo screenshot data
  const handleResetData = () => {
    if (confirm('Ma hubtaa inaad dib u soo celiso xogtii asalka ahayd ee sawirka?')) {
      setCargoItems(INITIAL_CARGO_DATA);
      setOutboundItems(INITIAL_OUTBOUND_DATA);
      setExpenses(INITIAL_EXPENSES);
      setCurrentDateBanner('10/10/2026');
      setAvailableDates(['10/10/2026']);
      localStorage.clear();
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    const headers = [
      'ROW',
      'DATE',
      'SENDER NAME',
      'ORIGIN CITY',
      'RECEIVER NAME',
      'RECEIVER PHONE',
      'ITEM DESCRIPTION',
      'WEIGHT (KGS)',
      'BALANCE DUE',
      'GOODS CHECKED',
      'STATUS',
      'DESTINATION',
      'TIME'
    ];

    const rows = cargoItems.map((item) => [
      item.rowNumber,
      `"${item.date}"`,
      `"${item.senderName}"`,
      `"${item.originCity}"`,
      `"${item.receiverName}"`,
      `"${item.receiverPhone}"`,
      `"${item.itemDescription}"`,
      `"${item.weightKgs}"`,
      `"${item.balanceDue}"`,
      item.goodsChecked ? 'TRUE' : 'FALSE',
      `"${item.status}"`,
      `"${item.destination}"`,
      `"${item.dateTime}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CARGO_${currentDateBanner.replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations
  const totalWeightKgs = cargoItems.reduce((acc, item) => {
    const match = item.weightKgs.match(/([0-9.]+)/);
    return acc + (match ? parseFloat(match[1]) : 0);
  }, 0);

  const totalUnpaidBalanceUSD = cargoItems.reduce((acc, item) => {
    const match = item.balanceDue.match(/(\d+)/);
    return acc + (match ? parseFloat(match[1]) : 0);
  }, 0);

  const nextRowNumber = cargoItems.reduce((max, i) => Math.max(max, i.rowNumber), 6398) + 1;

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-100 font-sans text-neutral-900 overflow-hidden">
      {/* Top Header & Toolbar */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAppsScript={() => setIsAppsScriptModalOpen(true)}
        onOpenGoogleSheetsGuide={() => setIsGoogleSheetsGuideOpen(true)}
        onExportCsv={handleExportCsv}
        onImportCsv={() => setActiveTab('DIB_U_DIWAN_GELIN')}
        onPrint={() => window.print()}
        onAddNewRow={() => handleAddCargoItem()}
        onResetData={handleResetData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalCount={cargoItems.length}
      />

      {/* Main Sheet Viewport Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'ALAABTA_TIMI' && (
          <InboundSheet
            items={cargoItems}
            onUpdateItem={handleUpdateCargoItem}
            onDeleteItem={handleDeleteCargoItem}
            onAddItem={handleAddCargoItem}
            onDuplicateItem={handleDuplicateInboundItem}
            onOpenReceipt={(receipt) => setActiveReceipt(receipt)}
            onOpenNewDayModal={() => setIsNewDayModalOpen(true)}
            currentDateBanner={currentDateBanner}
            onChangeDateBanner={(newDate) => setCurrentDateBanner(newDate)}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'ALAAB_DIRIS' && (
          <OutboundSheet
            items={outboundItems}
            onAddItem={(newItem) => setOutboundItems((prev) => [newItem, ...prev])}
            onDeleteItem={(id) => setOutboundItems((prev) => prev.filter((i) => i.id !== id))}
            onDuplicateItem={handleDuplicateOutboundItem}
            onUpdateItem={(id, upd) =>
              setOutboundItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...upd } : i)))
            }
            onOpenReceipt={(receipt) => setActiveReceipt(receipt)}
          />
        )}

        {activeTab === 'EXPENCES' && (
          <ExpensesSheet
            expenses={expenses}
            onAddExpense={(newExp) => setExpenses((prev) => [newExp, ...prev])}
            onDeleteExpense={(id) => setExpenses((prev) => prev.filter((e) => e.id !== id))}
          />
        )}

        {activeTab === 'GOBOLADA' && (
          <RegionsSheet
            items={cargoItems}
            onToggleGoods={(item) =>
              handleUpdateCargoItem(item.id, {
                goodsChecked: !item.goodsChecked,
                status: !item.goodsChecked ? 'OUT' : 'Package in',
                dateTime: !item.goodsChecked ? new Date().toISOString().replace('T', ' ').slice(0, 19) : '',
              })
            }
          />
        )}

        {activeTab === 'TICKETS' && (
          <TicketsSheet
            items={cargoItems}
            onToggleGoods={(item) =>
              handleUpdateCargoItem(item.id, {
                goodsChecked: !item.goodsChecked,
                status: !item.goodsChecked ? 'OUT' : 'Package in',
                dateTime: !item.goodsChecked ? new Date().toISOString().replace('T', ' ').slice(0, 19) : '',
              })
            }
          />
        )}

        {activeTab === 'DIB_U_DIWAN_GELIN' && (
          <QuickEntrySheet
            onAddItem={(item) => handleAddCargoItem(item)}
            nextRowNumber={nextRowNumber}
          />
        )}
      </main>

      {/* Bottom Tabs Bar with Count: 88 Badge */}
      <BottomTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddNewRow={() => handleAddCargoItem()}
        totalCount={cargoItems.length}
        totalWeightKgs={totalWeightKgs}
        totalUnpaidBalanceUSD={totalUnpaidBalanceUSD}
      />

      {/* Google Apps Script Code Modal */}
      <AppsScriptModal
        isOpen={isAppsScriptModalOpen}
        onClose={() => setIsAppsScriptModalOpen(false)}
      />

      {/* New Day / Date Duplication Modal */}
      <NewDayModal
        isOpen={isNewDayModalOpen}
        onClose={() => setIsNewDayModalOpen(false)}
        currentDate={currentDateBanner}
        items={cargoItems}
        onStartNewDay={handleStartNewDay}
        availableDates={availableDates}
        onSelectDate={(d) => setCurrentDateBanner(d)}
      />

      {/* Dedicated Row-Level Customer Receipt Modal */}
      <ReceiptModal
        receipt={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />

      {/* Direct Google Sheets (Google Drive) Automatic Creation Modal */}
      <DirectGoogleSheetsModal
        isOpen={isGoogleSheetsGuideOpen}
        onClose={() => setIsGoogleSheetsGuideOpen(false)}
        cargoItems={cargoItems}
        outboundItems={outboundItems}
        currentDateBanner={currentDateBanner}
      />
    </div>
  );
}
