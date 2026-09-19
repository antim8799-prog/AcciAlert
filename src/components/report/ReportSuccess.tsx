import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AccidentReport } from '../../types';
import { CheckCircle2, ShieldCheck, MapPin, Clock, FileText, ArrowRight, RefreshCw, Eye, AlertCircle, PhoneCall, Copy, Check } from 'lucide-react';

interface ReportSuccessProps {
  report: AccidentReport;
  onReset: () => void;
  onOpenEmergencyModal: () => void;
}

export const ReportSuccess: React.FC<ReportSuccessProps> = ({
  report,
  onReset,
  onOpenEmergencyModal,
}) => {
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard?.writeText(report.reportId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div id="report-success-screen" className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Primary Success Card */}
      <div className="bg-white border-2 border-emerald-500/80 rounded-3xl p-6 sm:p-10 shadow-lg shadow-emerald-500/5 text-center">
        
        {/* Animated Check Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-3xl mx-auto mb-5 shadow-md shadow-emerald-600/30">
          <span role="img" aria-label="Siren">🚨</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Report Submitted</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-['Space_Grotesk',sans-serif]">
          🚨 Accident Report Created
        </h1>

        <p className="mt-2 text-neutral-600 text-sm sm:text-base max-w-lg mx-auto">
          Your accident report has been created and stored securely.
        </p>

        {/* Report ID & Status */}
        <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-neutral-500">Report ID:</span>
            <span className="font-mono font-extrabold text-lg text-neutral-950">
              {report.reportId}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
              title="Copy ID"
            >
              {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="hidden sm:block text-neutral-300">•</div>

          {/* Simple honest status: Reported */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Status: Reported
            </span>
          </div>
        </div>

        {/* Structured Summary Card */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
              Accident Type
            </span>
            <span className="font-bold text-sm text-neutral-900">
              {report.accidentType}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
              Severity
            </span>
            <span className="inline-block font-bold text-sm text-red-600">
              {report.severity}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
              Location
            </span>
            <span className="font-mono font-semibold text-xs text-neutral-900 block truncate">
              {report.location.latitude?.toFixed(4)}°, {report.location.longitude?.toFixed(4)}°
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
              Reported Time
            </span>
            <span className="font-semibold text-xs text-neutral-800 block">
              {report.createdAt || 'Just now'}
            </span>
          </div>

        </div>

        {/* Mandatory Safety Notice */}
        <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 text-left flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Prototype mode:</strong> This report is currently stored only in this browser and has <strong>not</strong> been sent to emergency services. In a true life-threatening crisis, always dial <strong>112</strong> immediately.
          </div>
        </div>

        {/* Expandable Report Detail Inspector */}
        {showFullDetails && (
          <div className="mt-6 p-5 rounded-2xl bg-neutral-900 text-white text-left text-xs font-mono space-y-2 border border-neutral-800 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-neutral-400">
              <span className="font-sans font-bold uppercase text-[11px]">Browser Record Inspector</span>
              {/* i make a change here  in span section */}
              <span> Data Model</span>
            </div>
            <div>
              <span className="text-neutral-400">Description: </span>
              <span className="text-neutral-200 font-sans">{report.description}</span>
            </div>
            <div>
              <span className="text-neutral-400">Injured Count: </span>
              <span className="text-emerald-400">{report.injuredPeople}</span>
            </div>
            <div>
              <span className="text-neutral-400">Coordinates: </span>
              <span className="text-amber-400">
                Lat {report.location.latitude}, Lng {report.location.longitude} (Accuracy ±{Math.round(report.location.accuracy || 0)}m)
              </span>
            </div>
            <div>
              <span className="text-neutral-400">Reporter: </span>
              <span className="text-neutral-200">
                {report.reporter.name || 'Anonymous'} {report.reporter.phone && `(${report.reporter.phone})`}
              </span>
            </div>
            <div>
              <span className="text-neutral-400">Photo Attached: </span>
              <span className="text-neutral-200">{report.photo ? 'Yes (Local blob)' : 'None'}</span>
            </div>
          </div>
        )}

        {/* Main Action Buttons */}
        <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to={`/accidents/${report.reportId}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-sm transition-colors"
          >
            <span>Track Incident Lifecycle</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => setShowFullDetails(!showFullDetails)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-sm transition-colors"
          >
            <Eye className="w-4 h-4 text-neutral-600" />
            <span>{showFullDetails ? 'Hide Details' : 'View Summary'}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Report Another</span>
          </button>
        </div>

      </div>

      {/* Emergency Helpline Reminder */}
      <div className="p-4 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
            <PhoneCall className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-200">Need official ambulance or police on site?</div>
            <div className="text-xs text-neutral-400">Emergency Call 112 (India All-in-One Hotline)</div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenEmergencyModal}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
        >
          View Emergency Hotlines
        </button>
      </div>

    </div>
  );
};
