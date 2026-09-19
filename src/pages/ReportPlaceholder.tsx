import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction, MapPin, Camera, AlertOctagon, PhoneCall, ShieldAlert } from 'lucide-react';

interface ReportPlaceholderProps {
  onOpenEmergencyModal: () => void;
}

export const ReportPlaceholder: React.FC<ReportPlaceholderProps> = ({ onOpenEmergencyModal }) => {
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4">
          <Construction className="w-3.5 h-3.5 text-amber-700" />
          {/* i make a change in span section  */}
          <span>Development  Preview</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-['Space_Grotesk',sans-serif]">
          Accident Reporting Module
        </h1>

        {/* <p className="mt-3 text-neutral-600 text-base leading-relaxed">
          This reporting workflow is scheduled for implementation in the next development chunk of the 24-hour hackathon build.
        </p> */}

        {/* Planned Features in this module */}
        <div className="mt-8 pt-6 border-t border-neutral-100 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
            What will be available :
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <MapPin className="w-5 h-5 text-red-600 mb-2" />
              <h3 className="font-bold text-sm text-neutral-900">GPS Auto-Location</h3>
              <p className="text-xs text-neutral-600 mt-1">
                Instant browser GPS pin detection with accuracy radius tracking.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <AlertOctagon className="w-5 h-5 text-red-600 mb-2" />
              <h3 className="font-bold text-sm text-neutral-900">Severity Assessment</h3>
              <p className="text-xs text-neutral-600 mt-1">
                Classify critical hazards, vehicle count, and injured persons count.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <Camera className="w-5 h-5 text-red-600 mb-2" />
              <h3 className="font-bold text-sm text-neutral-900">Visual Evidence</h3>
              <p className="text-xs text-neutral-600 mt-1">
                Secure photo upload to alert responders about roadblocks and wreckage.
              </p>
            </div>
          </div>
        </div>

        {/* Immediate Emergency Action */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-red-950">Is this an actual active emergency?</h4>
              <p className="text-xs text-red-800 mt-0.5">
                Do not wait for form input. Call official emergency services right now.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenEmergencyModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-sm hover:bg-red-700"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency Helplines (112)</span>
          </button>
        </div>

        <div className="mt-8 flex items-center justify-end">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-sm hover:bg-neutral-800 transition-colors"
          >
            Return to Landing Page
          </Link>
        </div>

      </div>
    </main>
  );
};
