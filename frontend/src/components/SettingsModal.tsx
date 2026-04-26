import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('ai_api_key') || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('ai_api_key', apiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  const handleClear = () => {
    localStorage.removeItem('ai_api_key');
    setApiKey('');
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-[32px] ambient-shadow border border-surface-container-high space-y-8 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined fill">settings</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">Settings</h2>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                Gemini API Key
                <span className="material-symbols-outlined text-[10px]">key</span>
              </label>
              <button 
                onClick={handleClear}
                className="text-[10px] font-bold text-red-500 hover:underline uppercase tracking-wider"
              >
                Clear Key
              </button>
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your Gemini key here..."
                className="w-full bg-surface-container-low border-none rounded-2xl p-4 pl-12 pr-12 text-on-surface focus:ring-2 focus:ring-primary/20 shadow-sm"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">key</span>
              <button 
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showKey ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
            <p className="text-[10px] text-outline leading-relaxed px-1">
              The AI coach uses this key to analyze your fitness data. You can find your key in <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google AI Studio</a>.
            </p>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-surface-container text-on-surface font-bold py-4 rounded-2xl hover:bg-surface-container-high transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`flex-1 font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                saved ? 'bg-primary text-on-primary' : 'bg-primary-container text-on-primary hover:opacity-90'
              }`}
            >
              {saved ? (
                <>
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Saved
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
