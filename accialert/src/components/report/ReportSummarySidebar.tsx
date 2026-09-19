import React from 'react';
import { AccidentReport } from '../../types';
import { ShieldAlert, CheckCircle2, AlertCircle, MapPin, Users, FileText, Phone, Camera } from 'lucide-react';

interface ReportSummarySidebarProps {
  report: AccidentReport;
  isValid: boolean;
  onOpenEmergencyModal: () => void;
  onReview: () => void;
}

export const ReportSummarySidebar: React.FC<ReportSummarySidebarProps> = ({
  report,
  isValid,
  onOpenEmergencyModal,
  onReview,
}) => {
  const hasType = !!report.accidentType;
  const hasSeverity = !!report.severity;
  const hasDescription = report.description.trim().length > 0;
  const hasLocation = report.location.latitude !== null && report.location.longitude !== null;

  const completedCount = [hasType, hasSeverity, hasDescription, hasLocation].filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 4) * 100);

  return (
    <div className="space-y-5 sticky top-24">
      {/* Live Status Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h3 className="font-bold text-sm text-neutral-900 font-['Space_Grotesk',sans-serif]">
              Report Progress
            </h3>
            <p className="text-[11px] text-neutral-500">
              {completedCount} of 4 mandatory details ready
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-sm text-neutral-900">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              progressPercent === 100 ? 'bg-emerald-600' : 'bg-red-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Live Checklist */}
        <div className="space-y-2.5 text-xs">
          
          <div className="flex items-center justify-between">
            <span className="text-neutral-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
              <span>Accident Type:</span>
            </span>
            <span className="font-semibold text-neutral-900">
              {hasType ? (
                <span className="text-emerald-700 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {report.accidentType}
                </span>
              ) : (
                <span className="text-neutral-400">Required</span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
              <span>Severity:</span>
            </span>
            <span className="font-semibold text-neutral-900">
              {hasSeverity ? (
                <span className="text-red-600 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {report.severity}
                </span>
              ) : (
                <span className="text-neutral-400">Required</span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
              <span>Injured Estimate:</span>
            </span>
            <span className="font-semibold text-neutral-900">
              {report.injuredPeople} person(s)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
              <span>GPS Location:</span>
            </span>
            <span className="font-semibold text-neutral-900">
              {hasLocation ? (
                <span className="text-emerald-700 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Captured
                </span>
              ) : (
                <span className="text-red-500 font-medium">Pending GPS</span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
              <span>Description:</span>
            </span>
            <span className="font-semibold text-neutral-900">
              {hasDescription ? (
                <span className="text-emerald-700 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Written
                </span>
              ) : (
                <span className="text-neutral-400">Required</span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
              <span>Photo Attached:</span>
            </span>
            <span className="text-neutral-500">
              {report.photo ? 'Yes (Local)' : 'None'}
            </span>
          </div>

        </div>

        {/* Review Action Trigger */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onReview}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              isValid
                ? 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600'
            }`}
          >
            {isValid ? 'Proceed to Review →' : 'Complete All 4 Required Fields'}
          </button>
        </div>
      </div>

      {/* Emergency Hotline Box */}
      <div className="bg-neutral-900 text-white rounded-2xl p-5 border border-neutral-800 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-bold uppercase">Immediate Danger?</div>
            <div className="text-sm font-bold text-white">Call 112 First</div>
          </div>
        </div>
        <p className="text-[11px] text-neutral-300 leading-relaxed">
          Do not delay calling local emergency services to complete digital forms if casualties are trapped or bleeding heavily.
        </p>
        <button
          type="button"
          onClick={onOpenEmergencyModal}
          className="text-xs text-red-400 hover:text-red-300 font-semibold underline block"
        >
          View Indian Emergency Contacts →
        </button>
      </div>

    </div>
  );
};
