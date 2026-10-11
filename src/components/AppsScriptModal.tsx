import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Code2, 
  Play, 
  Sparkles, 
  HelpCircle,
  FileCode2,
  Terminal
} from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE, APPS_SCRIPT_INSTRUCTIONS, formatCurrentTimestamp } from '../utils/appsScriptCode';

interface AppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppsScriptModal: React.FC<AppsScriptModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<'somali' | 'english'>('somali');

  // Interactive Live Simulator inside the modal
  const [simChecked, setSimChecked] = useState(false);
  const [simStatus, setSimStatus] = useState<'Package in' | 'OUT'>('Package in');
  const [simTime, setSimTime] = useState('');
  const [simLogs, setSimLogs] = useState<string[]>([
    'onEdit trigger listener ready on Column 11 (K)...'
  ]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([GOOGLE_APPS_SCRIPT_CODE], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Cargo_onEdit_Automation.gs';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSimToggle = () => {
    const next = !simChecked;
    setSimChecked(next);

    if (next) {
      const nowStr = formatCurrentTimestamp();
      setSimStatus('OUT');
      setSimTime(nowStr);
      setSimLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] onEdit(e) executed: Col 11 (K) = TRUE -> Col 12 (L) = "OUT" (green), Col 14 (N) = "${nowStr}"`,
        ...prev.slice(0, 5)
      ]);
    } else {
      setSimStatus('Package in');
      setSimTime('');
      setSimLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] onEdit(e) executed: Col 11 (K) = FALSE -> Col 12 (L) = "Package in" (orange), Col 14 (N) = "" (cleared)`,
        ...prev.slice(0, 5)
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-900 text-white border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-amber-500 text-neutral-950 font-bold">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Google Apps Script - onEdit(e) Automation
              </h3>
              <p className="text-[11px] text-neutral-400">
                Code-ka tooska ah ee aad weydiisatay ee maamulaya Column K (Tick), Column L (Status), iyo Column N (Time)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto p-5 space-y-5 bg-neutral-50 text-neutral-800 text-xs">
          {/* Top Explainer */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3 text-emerald-900 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="font-bold">Hambalyo! Nidaamkani wuxuu si toos ah u isticmaalayaa code-kan.</strong>
              <p className="mt-0.5 text-neutral-700">
                Gudaha web application-kan, mar kasta oo aad gujiso sanduuqa (tick box) saf kasta, code-kan ayaa isla markiiba shaqaynaya oo bixinaya saacadda iyo midabka. Haddii aad doonayso inaad ku shubto Google Sheet-kaaga dhabta ah, waxaad koobiyeyn kartaa code-kan hoose.
              </p>
            </div>
          </div>

          {/* Code Viewer Box */}
          <div className="rounded-lg overflow-hidden border border-neutral-800 shadow-sm bg-neutral-950 text-neutral-200">
            <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-xs">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-neutral-300 font-semibold">Code.gs (Apps Script)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded text-xs transition-colors shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Waa la koobiyeey!' : 'Koobiyeey Code-ka'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Soo Deji .gs</span>
                </button>
              </div>
            </div>

            <pre className="p-4 font-mono text-[12px] leading-relaxed overflow-x-auto text-emerald-400 bg-neutral-950">
              <code>{GOOGLE_APPS_SCRIPT_CODE}</code>
            </pre>
          </div>

          {/* Interactive Live Simulator */}
          <div className="bg-white border border-neutral-300 rounded-lg p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-neutral-900 text-xs uppercase">
                  Tijaabi Code-ka (Interactive onEdit Simulator)
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 font-mono">
                Col 11 (K) ➔ Col 12 (L) & Col 14 (N)
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 bg-neutral-100 p-3 rounded-lg border border-neutral-200">
              {/* Checkbox Trigger */}
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-neutral-300 shadow-2xs">
                <span className="text-xs font-semibold text-neutral-700">Col K (GOODS):</span>
                <input
                  type="checkbox"
                  checked={simChecked}
                  onChange={handleSimToggle}
                  className="w-5 h-5 rounded cursor-pointer accent-neutral-900"
                />
                <span className="font-mono text-xs font-bold text-neutral-900">
                  {simChecked ? 'TRUE' : 'FALSE'}
                </span>
              </div>

              {/* Status Output */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-700">Col L (STATUS):</span>
                <div className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  simStatus === 'OUT' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'bg-amber-500 text-white shadow-xs'
                }`}>
                  {simStatus}
                </div>
              </div>

              {/* Timestamp Output */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-700">Col N (TIME):</span>
                <div className="px-3 py-1 rounded bg-white border border-neutral-300 font-mono text-xs text-neutral-800 min-w-[150px]">
                  {simTime || '(Madhan / Empty)'}
                </div>
              </div>
            </div>

            {/* Simulated Execution Log */}
            <div className="mt-3 bg-neutral-900 text-neutral-300 p-2.5 rounded font-mono text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] pb-1 border-b border-neutral-800">
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span>Execution Logs:</span>
              </div>
              {simLogs.map((log, idx) => (
                <div key={idx} className="truncate text-emerald-400/90">{log}</div>
              ))}
            </div>
          </div>

          {/* Installation Instructions */}
          <div className="bg-white border border-neutral-300 rounded-lg p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-neutral-900 text-xs">
                  Sida Loogu Shubo Google Sheets (Installation Guide)
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setLanguage('somali')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    language === 'somali' ? 'bg-neutral-800 text-white' : 'text-neutral-600'
                  }`}
                >
                  Af-Soomaali
                </button>
                <button
                  onClick={() => setLanguage('english')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    language === 'english' ? 'bg-neutral-800 text-white' : 'text-neutral-600'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {APPS_SCRIPT_INSTRUCTIONS[language].map((step) => (
                <div key={step.step} className="p-3 bg-neutral-50 rounded border border-neutral-200">
                  <div className="w-5 h-5 rounded-full bg-neutral-800 text-white text-[11px] font-bold flex items-center justify-center mb-1.5">
                    {step.step}
                  </div>
                  <h4 className="font-bold text-neutral-900 text-xs">{step.title}</h4>
                  <p className="text-[11px] text-neutral-600 mt-1 leading-snug">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-neutral-100 border-t border-neutral-300 flex justify-end gap-3 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white font-bold rounded shadow-2xs"
          >
            Waan Fahmay (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
