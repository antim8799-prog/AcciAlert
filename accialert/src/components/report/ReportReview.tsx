import React from 'react';
import { AccidentReport } from '../../types';
import { ShieldAlert, MapPin, Users, FileText, Camera, User, ArrowLeft, Send, AlertTriangle } from 'lucide-react';

interface ReportReviewProps {
  report: AccidentReport;
  onEdit: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submissionError?: string | null;
}

export const ReportReview: React.FC<ReportReviewProps> = ({
  report,
  onEdit,
  onSubmit,
  isSubmitting,
  submissionError,
}) => {
  const getSeverityBadge = () => {
    switch (report.severity) {
      case 'CRITICAL':
        return 'bg-red-600 text-white';
      case 'MODERATE':
        return 'bg-orange-500 text-white';
      case 'LOW':
        return 'bg-amber-400 text-neutral-950';
      default:
        return 'bg-neutral-200 text-neutral-800';
    }
  };

  return (
    <div id="report-review-card" className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-neutral-900 text-white p-5 rounded-2xl flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-['Space_Grotesk',sans-serif]">
              Review Accident Report
            </h2>
            <p className="text-xs text-neutral-300 mt-0.5">
              Verify the collected details before preparing the incident alert
            </p>
          </div>
        </div>
      </div>

      {/* Review Details Table / Bento */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-6">
        
        {/* Row 1: Core Classification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-neutral-100">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 block mb-1">
              Accident Type
            </span>
            <span className="font-bold text-base text-neutral-950">
              {report.accidentType || 'Not specified'}
            </span>
          </div>

          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 block mb-1">
              Observed Severity
            </span>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider ${getSeverityBadge()}`}>
              {report.severity}
            </span>
          </div>
        </div>

        {/* Row 2: Location & Injuries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-neutral-100">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 block mb-1">
              Estimated Injured
            </span>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-neutral-600" />
              <span className="font-bold text-base text-neutral-900">
                {report.injuredPeople === 0
                  ? '0 (No visible / unknown injuries)'
                  : `${report.injuredPeople} person(s)`}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 block mb-1">
              GPS Location Coordinates
            </span>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs font-mono font-bold text-neutral-900">
                {report.location.latitude !== null && report.location.longitude !== null ? (
                  <>
                    <div>Lat: {report.location.latitude.toFixed(6)}° N</div>
                    <div>Lng: {report.location.longitude.toFixed(6)}° E</div>
                    {report.location.accuracy && (
                      <div className="text-neutral-500 font-sans font-normal text-[11px] mt-0.5">
                        Precision: ±{Math.round(report.location.accuracy)} meters
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-red-600">Location not captured</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Description */}
        <div className="pb-4 border-b border-neutral-100">
          <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 block mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Incident Description</span>
          </span>
          <p className="text-sm text-neutral-800 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/80 leading-relaxed whitespace-pre-wrap">
            {report.description}
          </p>
        </div>

        {/* Row 4: Photo preview (if provided) */}
        {report.photo && (
          <div className="pb-4 border-b border-neutral-100">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 block mb-2 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span>Attached Photo (Local Preview)</span>
            </span>
            <div className="rounded-xl overflow-hidden border border-neutral-200 max-h-64 bg-neutral-900 flex items-center justify-center">
              <img
                src={report.photo}
                alt="Scene review"
                className="max-h-64 w-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* Row 5: Reporter Info */}
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 block mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>Reporter Identity</span>
          </span>
          <p className="text-sm text-neutral-700">
            {report.reporter.name ? (
              <span className="font-semibold text-neutral-900">{report.reporter.name}</span>
            ) : (
              <span className="italic text-neutral-500">Anonymous Reporter</span>
            )}
            {report.reporter.phone && (
              <span className="text-neutral-500 text-xs ml-2 font-mono">
                ({report.reporter.phone})
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Submission Error Banner */}
      {submissionError && (
        <div className="p-4 rounded-xl bg-red-100 border border-red-300 text-xs text-red-950 flex items-start gap-2.5 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="block font-bold text-red-900 mb-0.5">Submission Error</strong>
            <span>{submissionError}</span>
          </div>
        </div>
      )}

      {/* Safety Advisory Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          <strong>Prototype Notice:</strong> Submitting this report sends incident details to the AcciAlert API backend. It will <strong>not</strong> trigger real emergency sirens or dispatch official ambulances/police.
        </span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onEdit}
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Report</span>
        </button>

        <button
          type="button"
          id="submit-accident-report-btn"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-bold text-base shadow-md shadow-red-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
        >
          <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
          <span>{isSubmitting ? 'Submitting Report...' : 'Submit Accident Report'}</span>
        </button>
      </div>

    </div>
  );
};
