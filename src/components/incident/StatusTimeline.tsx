import React from 'react';
import {
  CheckCircle2,
  Clock,
  Search,
  ShieldCheck,
  UserCheck,
  Ambulance,
  AlertOctagon,
  AlertTriangle,
} from 'lucide-react';
import { IncidentStatus } from '../../types';

interface StatusTimelineProps {
  currentStatus: IncidentStatus;
}

interface TimelineStep {
  key: IncidentStatus;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    key: 'reported',
    label: 'Reported',
    description: 'Initial alert logged into system',
    icon: Clock,
  },
  {
    key: 'under_review',
    label: 'Under Review',
    description: 'Triaged by emergency dispatch operator',
    icon: Search,
  },
  {
    key: 'verified',
    label: 'Verified',
    description: 'Confirmed genuine incident',
    icon: ShieldCheck,
  },
  {
    key: 'responder_assigned',
    label: 'Responder Assigned',
    description: 'Units or local emergency teams alerted',
    icon: UserCheck,
  },
  {
    key: 'responding',
    label: 'Responding',
    description: 'Emergency units en route to coordinates',
    icon: Ambulance,
  },
  {
    key: 'resolved',
    label: 'Resolved',
    description: 'Incident addressed and scene cleared',
    icon: CheckCircle2,
  },
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus }) => {
  const isDisputed = currentStatus === 'disputed';

  // Find step index in standard progression
  const currentStepIndex = TIMELINE_STEPS.findIndex((step) => step.key === currentStatus);

  return (
    <div className="w-full bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-neutral-100">
        <div>
          <h3 className="text-base font-bold text-neutral-900 font-['Space_Grotesk',sans-serif]">
            Incident Lifecycle Status
          </h3>
          <p className="text-xs text-neutral-500">
            Real-time status progression from initial alert to resolution
          </p>
        </div>

        {/* Current status chip */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto uppercase tracking-wide border">
          {isDisputed ? (
            <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 border-rose-200">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              Status: Disputed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Status: {currentStatus.replace('_', ' ')}
            </span>
          )}
        </div>
      </div>

      {isDisputed && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm text-rose-900 mb-1">
              Incident Marked as Disputed
            </span>
            <span>
              This incident was marked as disputed during review. Ground signals or community reports indicate
              the incident may not have occurred at these coordinates or was reported in error.
            </span>
          </div>
        </div>
      )}

      {/* Desktop / Tablet Horizontal Timeline */}
      <div className="hidden lg:grid grid-cols-6 gap-2 relative">
        {TIMELINE_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = !isDisputed && currentStepIndex > index;
          const isCurrent = !isDisputed && currentStepIndex === index;
          const isFuture = isDisputed || currentStepIndex < index;

          return (
            <div key={step.key} className="flex flex-col items-center text-center relative group">
              {/* Connector line between steps */}
              {index < TIMELINE_STEPS.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-0.5 z-0 transition-colors ${
                    isCompleted ? 'bg-emerald-500' : 'bg-neutral-200'
                  }`}
                  style={{ transform: 'translateY(-50%)' }}
                />
              )}

              {/* Node Circle */}
              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/30 ring-4 ring-red-100 font-bold'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-white stroke-[2.5]" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              {/* Step Info */}
              <div className="mt-3">
                <div
                  className={`text-xs font-bold leading-tight ${
                    isCurrent
                      ? 'text-red-600'
                      : isCompleted
                      ? 'text-neutral-900'
                      : 'text-neutral-400'
                  }`}
                >
                  {step.label}
                </div>
                <div className="text-[11px] text-neutral-500 mt-1 leading-snug px-1">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile & Small Tablet Vertical Timeline */}
      <div className="lg:hidden space-y-4">
        {TIMELINE_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = !isDisputed && currentStepIndex > index;
          const isCurrent = !isDisputed && currentStepIndex === index;
          const isFuture = isDisputed || currentStepIndex < index;

          return (
            <div key={step.key} className="flex items-start gap-3.5 relative">
              {/* Vertical Connector Line */}
              {index < TIMELINE_STEPS.length - 1 && (
                <div
                  className={`absolute left-5 top-10 bottom-0 w-0.5 -ml-[1px] ${
                    isCompleted ? 'bg-emerald-500' : 'bg-neutral-200'
                  }`}
                />
              )}

              {/* Circle */}
              <div
                className={`relative z-10 w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${
                  isCurrent
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/30 ring-4 ring-red-100'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              {/* Details */}
              <div className="pt-1.5 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-bold ${
                      isCurrent
                        ? 'text-red-600'
                        : isCompleted
                        ? 'text-neutral-900'
                        : 'text-neutral-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">
                      Active Stage
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
