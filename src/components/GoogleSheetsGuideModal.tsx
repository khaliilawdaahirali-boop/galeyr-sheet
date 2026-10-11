import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Download, 
  ExternalLink, 
  Check, 
  Copy, 
  Code2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../utils/appsScriptCode';

interface GoogleSheetsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadCsv: () => void;
  userEmail?: string;
}

export const GoogleSheetsGuideModal: React.FC<GoogleSheetsGuideModalProps> = ({
  isOpen,
  onClose,
  onDownloadCsv,
  userEmail = 'khaliilawdaahirali@gmail.com',
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-neutral-800 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0f9d58] text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-white text-[#0f9d58] shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Sida Sheet-kan Loogu Geeyo Google Sheets (Gmail-kaaga)
              </h3>
              <p className="text-[11px] text-emerald-100">
                U wareeji xogta Gmail-kaaga ({userEmail}) 4 tallaabo oo sahlan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-emerald-100 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Quick Action Banner */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="font-bold text-emerald-900 block text-xs">
                TALLAABADA 1: Soo Deji Faylka Xogta (CSV)
              </span>
              <span className="text-[11px] text-emerald-700">
                Guji badhankan si aad kombiyuutarkaaga ugu soo dejiso faylka xogta ee diyaarka ah.
              </span>
            </div>
            <button
              onClick={onDownloadCsv}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0f9d58] hover:bg-[#0b8043] text-white font-bold rounded-lg text-xs shadow-xs transition-colors shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Soo Deji Faylka CSV</span>
            </button>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {/* Step 2 */}
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-neutral-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-neutral-900">Fur Google Sheets-kaaga</h4>
                  <a
                    href="https://sheets.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-semibold"
                  >
                    <span>Fur sheets.google.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                  Tag browser-kaaga oo fur <strong>sheets.google.com</strong> adigoo ku jira Gmail-kaaga (<code>{userEmail}</code>). Kadib riix <strong>Blank spreadsheet (+)</strong> si aad xaashi cusub u furto.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-neutral-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-neutral-900">Soo Geli Faylka (Import)</h4>
                <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                  Gudaha Google Sheet-ka cusub ee aad furtay:
                </p>
                <ol className="list-decimal list-inside text-[11px] text-neutral-700 mt-1 space-y-0.5 font-medium pl-1">
                  <li>Guji menu-ga sare: <strong>File</strong> ➔ <strong>Import</strong></li>
                  <li>Dooro tab-ka: <strong>Upload</strong> ➔ <strong>Browse</strong></li>
                  <li>Dooro faylka CSV-ga ah ee aad hadda soo degsatay.</li>
                  <li>Xulo <strong>"Replace spreadsheet"</strong> dabadeed riix <strong>"Import data"</strong>.</li>
                </ol>
                <div className="mt-1.5 p-1.5 bg-neutral-100 rounded text-[10px] text-neutral-600">
                  Dhammaan safafkii, magacyadii, telefoonadii iyo miisaankii waxay toos uga muuqanayaan Google Sheet-kaaga!
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-300 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                4
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-900">Ku Shubo Automation-ka onEdit (Koodhka)</h4>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-[11px] transition-colors"
                  >
                    {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Waa la koobiyeey!' : 'Koobiyeey Koodhka'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                  Si uu sanduuqa (tick box) Google Sheet-kaaga ugu beddelo <strong>OUT</strong> cagaar ah iyo taariikhda:
                </p>
                <ol className="list-decimal list-inside text-[11px] text-amber-900 mt-1 space-y-0.5 font-medium pl-1">
                  <li>Guji: <strong>Extensions</strong> ➔ <strong>Apps Script</strong>.</li>
                  <li>Koodhka ku jira tirtir, dabadeed ku dheji (paste) koodhkan aad hadda koobiyaysay.</li>
                  <li>Riix <strong>Save (Diskette icon)</strong> ama <kbd className="px-1 bg-white border border-amber-300 rounded font-mono text-[10px]">Ctrl + S</kbd>.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-100 border-t border-neutral-300 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">
            Faylka CSV wuxuu si toos ah ugu habboon yahay Google Sheets iyo Microsoft Excel.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white font-bold rounded text-xs"
          >
            Waan Fahmay
          </button>
        </div>
      </div>
    </div>
  );
};
