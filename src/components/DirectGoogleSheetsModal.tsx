import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles, 
  Loader2,
  CheckCircle2,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, getAccessToken, logout, initAuth } from '../utils/googleAuth';
import { createGoogleSpreadsheetWithExactTemplate, CreateSpreadsheetResult } from '../utils/googleSheetsService';
import { CargoItem, OutboundCargoItem } from '../types';
import { COMPANY_NAME } from '../data/initialData';
import { GOOGLE_APPS_SCRIPT_CODE } from '../utils/appsScriptCode';

interface DirectGoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cargoItems: CargoItem[];
  outboundItems: OutboundCargoItem[];
  currentDateBanner: string;
}

export const DirectGoogleSheetsModal: React.FC<DirectGoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  cargoItems,
  outboundItems,
  currentDateBanner,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [createdResult, setCreatedResult] = useState<CreateSpreadsheetResult | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => setCurrentUser(user),
      () => setCurrentUser(null)
    );
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setErrorMsg(null);
    setIsSigningIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Galitaanka Google wuu guuldarraystay. Fadlan hubi inaad oggolaatay daaqada popup-ka.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleCreateInGoogleSheets = async () => {
    setErrorMsg(null);
    setIsCreatingSheet(true);
    setStatusMessage('Waxaa la abuurayaa xaashida Google Spreadsheet...');

    try {
      let token = await getAccessToken();
      if (!token) {
        const res = await googleSignIn();
        token = res?.accessToken || null;
      }

      if (!token) {
        throw new Error('Oggolaanshaha Google lama helin. Fadlan mar labaad gal Google.');
      }

      setStatusMessage('Waxaa la buuxinayaa tiirarka, safafka iyo midabada cas, huruud iyo cyan...');
      const result = await createGoogleSpreadsheetWithExactTemplate(
        token,
        cargoItems,
        outboundItems,
        currentDateBanner
      );

      setCreatedResult(result);
      setStatusMessage('Si buuxda ayaa loogu abuuray Google Sheets-kaaga!');
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Khalad ayaa dhacay';
      setErrorMsg(`Khalad: ${msg}`);
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-neutral-800 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0f9d58] text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-white text-[#0f9d58] shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Toos ugu Abuur Google Sheets (Google Drive)
              </h3>
              <p className="text-[11px] text-emerald-100">
                {COMPANY_NAME} · Xaashi leh isla naqshadda, midabada iyo tiirarka
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Banner */}
          {createdResult ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-base font-extrabold text-emerald-950">
                  Hambalyo! Sheet-kaaga Waa La Abuuray
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Waxaa toos loogu daray Google Drive-kaaga koontada: <strong>{currentUser?.email}</strong>
                </p>

                {/* Open in Google Sheets Button */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <a
                    href={createdResult.spreadsheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#0f9d58] hover:bg-[#0b8043] text-white font-extrabold rounded-lg text-xs shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                  >
                    <span>Fur Google Sheet-kaaga (Open Sheet)</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdResult.spreadsheetUrl);
                      alert('Link-ga Google Sheet-kaaga waa la koobiyeey!');
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold rounded-lg text-xs"
                  >
                    Koobiyeey Link-ga
                  </button>
                </div>
              </div>

              {/* Automation step info */}
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-900">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">Kudar Automation-ka onEdit:</span>
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-1 px-2 py-0.5 bg-amber-600 text-white rounded text-[11px] font-bold"
                  >
                    {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedScript ? 'Waa la koobiyeey!' : 'Koobiyeey Koodhka'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Gudaha Google Sheet-ka aad hadda furtay, guji: <strong>Extensions ➔ Apps Script</strong>, ku dheji koodhka, dabadeed riix Save. Tani waxay keenaysaa in sanduuqa tick box-ka uu toos u qoro <strong>OUT</strong> cagaar ah iyo saacadda!
                </p>
              </div>
            </div>
          ) : (
            /* Creation Preparation Screen */
            <div className="space-y-4">
              {/* Account Status Card */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-300 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-neutral-500 font-medium block">Koontada Google:</span>
                  {currentUser ? (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      <strong className="font-bold text-neutral-900 text-xs">{currentUser.email}</strong>
                    </div>
                  ) : (
                    <span className="text-neutral-600 text-xs">Wali laguma gelin koontada Google</span>
                  )}
                </div>

                {currentUser ? (
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-red-600 p-1"
                    title="Ka bax"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Ka bax</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                    className="px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold rounded text-xs shadow-2xs flex items-center gap-1.5"
                  >
                    {isSigningIn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Gal Google (Sign in)</span>
                  </button>
                )}
              </div>

              {/* What will be created */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2">
                <span className="font-bold text-neutral-900 block text-xs uppercase">
                  Maxaa Lagu Abuurayaa Google Sheet-kaaga?
                </span>
                <ul className="space-y-1.5 text-[11px] text-neutral-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Tab-ka <strong>"ALAABTA TIMI"</strong> oo wata taariikhda cas ee {currentDateBanner}, {cargoItems.length} saf, iyo sanduuqa checkbox-ka.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Tab-ka <strong>"ALAAB DIRIS"</strong> oo wata midabada huruudda (Sender) iyo cyan-ka (Receiver), iyo qaybaha taariikhda.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Tab-yada <strong>"EXPENCES"</strong> iyo <strong>"GOBOLADA"</strong> oo diyaarsan.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Naqshadda asalka ah (Exact Template & Styling) iyadoo waxba aan laga beddelin!</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={currentUser ? handleCreateInGoogleSheets : handleSignIn}
                  disabled={isCreatingSheet || isSigningIn}
                  className="w-full py-3 bg-[#0f9d58] hover:bg-[#0b8043] text-white font-extrabold rounded-lg text-sm shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isCreatingSheet ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{statusMessage || 'Waxaa la abuurayaa...'}</span>
                    </>
                  ) : isSigningIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Fadlan gal Google koontadaada...</span>
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>
                        {currentUser 
                          ? 'Toos ugu Abuur Google Sheet-kayga (Create in Google Sheets)' 
                          : 'Gal Google oo Toos u Abuur Sheet-ka'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-100 border-t border-neutral-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold rounded text-xs"
          >
            Xidh (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
