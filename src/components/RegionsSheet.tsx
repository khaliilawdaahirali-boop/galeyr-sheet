import React, { useState } from 'react';
import { 
  MapPin, 
  Printer, 
  Truck, 
  Bike, 
  Package, 
  DollarSign, 
  Phone,
  CheckCircle2
} from 'lucide-react';
import { CargoItem } from '../types';

interface RegionsSheetProps {
  items: CargoItem[];
  onToggleGoods: (item: CargoItem) => void;
}

export const RegionsSheet: React.FC<RegionsSheetProps> = ({
  items,
  onToggleGoods,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  // Group items by destination
  const destinations = ['BURCO', 'BORAMA', 'GABILEY', 'BERBERA', 'MOOTO', 'XARUNTA (HARGEISA)'];

  const getDestinationItems = (dest: string) => {
    if (dest === 'XARUNTA (HARGEISA)') {
      return items.filter(i => !i.destination || i.destination === '');
    }
    return items.filter(i => i.destination === dest);
  };

  const currentList = selectedRegion === 'ALL'
    ? items.filter(i => i.destination && i.destination !== '')
    : getDestinationItems(selectedRegion);

  const calculateStats = (destItems: CargoItem[]) => {
    const totalCount = destItems.length;
    const deliveredOut = destItems.filter(i => i.status === 'OUT').length;
    const pendingIn = totalCount - deliveredOut;
    const totalDue = destItems.reduce((acc, i) => {
      const match = i.balanceDue.match(/(\d+)/);
      return acc + (match ? parseFloat(match[1]) : 0);
    }, 0);
    return { totalCount, deliveredOut, pendingIn, totalDue };
  };

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-neutral-100 border-b border-neutral-300 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-neutral-800 text-sm">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>GOBOLADA & MANIFEST-YADA QEYBINTA (Regional Branches & Routes)</span>
          </div>
          <span className="text-neutral-500">|</span>
          <span className="text-neutral-600">
            Kala saarista xamuulka loo rarayo Burco, Borama, Gabiley, Berbera, iyo Mootooyinka
          </span>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white rounded font-medium shadow-2xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Daabac Manifest-ka Gobolka</span>
        </button>
      </div>

      {/* Region KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-3 bg-neutral-50 border-b border-neutral-200">
        {destinations.map((dest) => {
          const destItems = getDestinationItems(dest);
          const stats = calculateStats(destItems);
          const isSelected = selectedRegion === dest;

          return (
            <button
              key={dest}
              onClick={() => setSelectedRegion(dest)}
              className={`p-2.5 rounded border text-left transition-all ${
                isSelected
                  ? 'bg-white border-neutral-900 shadow-xs ring-1 ring-neutral-900'
                  : 'bg-white/80 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold uppercase truncate ${
                  dest === 'MOOTO' ? 'text-purple-700' : 'text-neutral-800'
                }`}>
                  {dest}
                </span>
                {dest === 'MOOTO' ? (
                  <Bike className="w-3.5 h-3.5 text-purple-600" />
                ) : (
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </div>
              <div className="text-lg font-extrabold text-neutral-900 tabular-nums">
                {stats.totalCount} <span className="text-[10px] font-normal text-neutral-500">xirmo</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-600 mt-1">
                <span className="text-emerald-700 font-semibold">{stats.deliveredOut} OUT</span>
                <span className="text-amber-700 font-semibold">{stats.pendingIn} In</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Region Filter Selector */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-100 border-b border-neutral-200 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-700">Dooro Magaalada:</span>
          <button
            onClick={() => setSelectedRegion('ALL')}
            className={`px-2.5 py-1 rounded text-xs font-semibold ${
              selectedRegion === 'ALL' ? 'bg-neutral-800 text-white' : 'bg-white border border-neutral-300 text-neutral-700'
            }`}
          >
            Dhammaan Gobolada ({items.filter(i => i.destination).length})
          </button>
          {destinations.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedRegion(d)}
              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                selectedRegion === d ? 'bg-emerald-700 text-white' : 'bg-white border border-neutral-300 text-neutral-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="text-xs text-neutral-600">
          Xirmooyinka shaashadda ku jira: <strong className="text-neutral-900">{currentList.length}</strong>
        </div>
      </div>

      {/* Manifest Table */}
      <div className="flex-1 overflow-auto bg-neutral-100">
        <table className="w-full border-collapse bg-white text-xs text-neutral-900 border border-neutral-300">
          <thead>
            <tr className="bg-neutral-800 text-white font-semibold text-left">
              <th className="py-2 px-3 border-r border-neutral-700 w-16 text-center">SAF</th>
              <th className="py-2 px-3 border-r border-neutral-700 w-28">GOBOLKA</th>
              <th className="py-2 px-3 border-r border-neutral-700">QAATAHA (RECEIVER)</th>
              <th className="py-2 px-3 border-r border-neutral-700 w-36">TELEFOONKA</th>
              <th className="py-2 px-3 border-r border-neutral-700">FAAHFAAINTA</th>
              <th className="py-2 px-2 border-r border-neutral-700 text-center w-24">MIISAANKA</th>
              <th className="py-2 px-2 border-r border-neutral-700 text-center w-28">HARAAGA ($)</th>
              <th className="py-2 px-2 border-r border-neutral-700 text-center w-24">XAALADDA</th>
              <th className="py-2 px-3 text-left w-36">SAACADDA BIXITAANKA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 font-mono text-[11px]">
            {currentList.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50 transition-colors font-sans">
                <td className="p-2 border-r border-neutral-200 text-center font-mono font-medium text-neutral-500">
                  {item.rowNumber}
                </td>
                <td className="p-2 border-r border-neutral-200">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    item.destination === 'MOOTO'
                      ? 'bg-purple-100 text-purple-900 border border-purple-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}>
                    {item.destination || 'Xarunta'}
                  </span>
                </td>
                <td className="p-2 border-r border-neutral-200 font-bold text-neutral-900 uppercase">
                  {item.receiverName}
                </td>
                <td className="p-2 border-r border-neutral-200 font-mono text-neutral-800">
                  {item.receiverPhone}
                </td>
                <td className="p-2 border-r border-neutral-200 uppercase text-neutral-700">
                  {item.itemDescription}
                </td>
                <td className="p-2 border-r border-neutral-200 text-center font-mono">
                  {item.weightKgs}
                </td>
                <td className={`p-2 border-r border-neutral-200 text-center font-bold ${
                  item.balanceDue !== 'FREE' ? 'bg-red-600 text-white font-mono' : 'text-neutral-700'
                }`}>
                  {item.balanceDue}
                </td>
                <td className={`p-2 border-r border-neutral-200 text-center font-bold ${
                  item.status === 'OUT' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {item.status}
                </td>
                <td className="p-2 font-mono text-[10px] text-neutral-600">
                  {item.dateTime || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
