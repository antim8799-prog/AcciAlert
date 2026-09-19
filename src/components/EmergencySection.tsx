import React from 'react';
import { Phone, AlertCircle, ShieldAlert, ExternalLink, HelpCircle } from 'lucide-react';

interface EmergencySectionProps {
  onOpenEmergencyModal: () => void;
}

export const EmergencySection: React.FC<EmergencySectionProps> = ({ onOpenEmergencyModal }) => {
  return (
    <section id="emergency" className="py-14 sm:py-20 bg-neutral-900 text-white relative overflow-hidden">
      {/* Background Accent Grid / Tint */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ef4444 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto bg-neutral-950 border-2 border-red-600/60 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            
            {/* Left side: Heading & Text */}
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Urgent Life Safety</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-['Space_Grotesk',sans-serif]">
                Need Emergency Assistance?
              </h2>

              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-xl">
                If you or someone around you is in immediate danger, contact your local emergency services.
              </p>

              {/* India Emergency Number Highlight */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white">
                  <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold">India Emergency Number:</span>
                  <span className="text-xl sm:text-2xl font-black text-red-500 font-mono tracking-wider">112</span>
                </div>
                <span className="text-xs text-neutral-400">
                  Toll-Free • 24/7 National Emergency Hotline
                </span>
              </div>
            </div>

            {/* Right side: Direct Emergency Help Trigger */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3.5 shrink-0">
              <button
                type="button"
                id="emergency-help-btn"
                onClick={onOpenEmergencyModal}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-lg shadow-lg shadow-red-600/30 transition-all focus:outline-none focus:ring-4 focus:ring-red-500/50 cursor-pointer"
              >
                <Phone className="w-6 h-6 animate-pulse" />
                <span>Emergency Help</span>
              </button>

              <a
                href="tel:112"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-bold text-sm transition-colors text-center"
              >
                <span>Direct Call: 112</span>
                <ExternalLink className="w-4 h-4 text-neutral-400" />
              </a>
            </div>

          </div>

          {/* Quick Helplines Breakdown Footer */}
          <div className="mt-8 pt-6 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">National Emergency</div>
              <div className="text-lg font-bold text-red-400 font-mono">112</div>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">Ambulance Service</div>
              <div className="text-lg font-bold text-neutral-200 font-mono">108 / 102</div>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">Highway Emergency</div>
              <div className="text-lg font-bold text-neutral-200 font-mono">1033</div>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">Traffic Police</div>
              <div className="text-lg font-bold text-neutral-200 font-mono">1095 / 100</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
