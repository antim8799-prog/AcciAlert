import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction, Hospital, Users, Navigation, PhoneCall, HeartPulse } from 'lucide-react';

interface HelpPlaceholderProps {
  onOpenEmergencyModal: () => void;
}

export const HelpPlaceholder: React.FC<HelpPlaceholderProps> = ({ onOpenEmergencyModal }) => {
  return (
    <main className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-[70vh] flex flex-col justify-center">
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-sm">
        
        {/* Back link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Status header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-4">
          <Construction className="w-3.5 h-3.5 text-blue-700" />
          <span>Development Chunk 3 Preview</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-['Space_Grotesk',sans-serif]">
          Nearby Emergency Assistance & Help Directory
        </h1>

        <p className="mt-3 text-neutral-600 text-base leading-relaxed">
          The responder coordination directory and nearby medical facility finder will be implemented in the upcoming development chunks.
        </p>

        {/* Planned Features */}
        <div className="mt-8 pt-6 border-t border-neutral-100 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
            Upcoming Modules in Chunk 3:
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <Hospital className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="font-bold text-sm text-neutral-900">Hospital Locator</h3>
              <p className="text-xs text-neutral-600 mt-1">
                Verified trauma care facilities and emergency rooms closest to your location.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <Users className="w-5 h-5 text-emerald-600 mb-2" />
              <h3 className="font-bold text-sm text-neutral-900">Volunteer Network</h3>
              <p className="text-xs text-neutral-600 mt-1">
                Connect with registered Good Samaritan first-aiders active in the neighborhood.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <HeartPulse className="w-5 h-5 text-red-600 mb-2" />
              <h3 className="font-bold text-sm text-neutral-900">First Aid Protocol</h3>
              <p className="text-xs text-neutral-600 mt-1">
                Offline-capable CPR guides, bleeding control steps, and spinal protection rules.
              </p>
            </div>
          </div>
        </div>

        {/* Need Help Now Callout */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-white">Need Medical Assistance Right Now?</h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Dial India's national ambulance dispatch or unified 112 services.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenEmergencyModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-sm hover:bg-red-700"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Open Helpline Directory</span>
          </button>
        </div>

        <div className="mt-8 flex items-center justify-end">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-neutral-100 text-neutral-800 font-bold text-sm hover:bg-neutral-200 transition-colors"
          >
            Return to Landing Page
          </Link>
        </div>

      </div>
    </main>
  );
};
