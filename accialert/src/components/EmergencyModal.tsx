import React, { useState } from 'react';
import { X, Phone, PhoneCall, Copy, Check, ShieldAlert, AlertTriangle } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const helplines = [
    { name: 'National Emergency Helpline (All-in-One)', number: '112', desc: 'Police, Fire, Ambulance 24/7 across India', primary: true },
    { name: 'Ambulance & Medical Emergency', number: '108', desc: 'Free emergency medical transport & paramedical service', primary: false },
    { name: 'National Highway Assistance', number: '1033', desc: 'Toll-free highway breakdown, towing & road clearance', primary: false },
    { name: 'Disaster Management Services', number: '1070', desc: 'Severe multi-vehicle or hazardous incidents', primary: false },
  ];

  const handleCopy = (num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border-2 border-red-600 overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-red-600 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 id="emergency-modal-title" className="text-xl font-bold font-['Space_Grotesk',sans-serif]">
                Official Emergency Helplines
              </h3>
              <p className="text-red-100 text-xs mt-0.5">
                India National Emergency Response Services
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-950">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p>
              If there are severe injuries, trapped passengers, or ongoing highway hazards, contact official emergency dispatchers immediately before submitting app alerts.
            </p>
          </div>

          <div className="space-y-2.5">
            {helplines.map((item) => (
              <div
                key={item.number}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                  item.primary
                    ? 'bg-neutral-900 border-neutral-950 text-white'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm truncate">{item.name}</span>
                    {item.primary && (
                      <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        MAIN
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 ${item.primary ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`font-mono font-black text-lg ${item.primary ? 'text-red-400' : 'text-neutral-900'}`}>
                    {item.number}
                  </span>
                  
                  <a
                    href={`tel:${item.number}`}
                    className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 focus:outline-none focus:ring-2 ${
                      item.primary
                        ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-400'
                        : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800 focus:ring-neutral-400'
                    }`}
                    title={`Call ${item.number}`}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Call</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy(item.number)}
                    className={`p-2 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 ${
                      item.primary
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 focus:ring-neutral-500'
                        : 'bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 focus:ring-neutral-400'
                    }`}
                    title="Copy number"
                  >
                    {copiedNumber === item.number ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-neutral-500 text-center">
            Standard call charges do not apply for emergency toll-free numbers in India.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-100 px-5 py-3 border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            Close Helplines
          </button>
        </div>
      </div>
    </div>
  );
};
