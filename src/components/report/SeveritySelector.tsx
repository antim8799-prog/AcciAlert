import React from 'react';
import { AccidentSeverity } from '../../types';
import { AlertCircle, AlertOctagon, AlertTriangle, Check, Info } from 'lucide-react';

interface SeveritySelectorProps {
  value: AccidentSeverity | '';
  onChange: (val: AccidentSeverity) => void;
  error?: string;
}

const SEVERITY_LEVELS: {
  level: AccidentSeverity;
  label: string;
  desc: string;
  borderActive: string;
  bgActive: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    level: 'LOW',
    label: 'Low Severity',
    desc: 'Minor incident, no obvious serious injury',
    borderActive: 'border-amber-500',
    bgActive: 'bg-amber-50/70',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    icon: AlertCircle,
  },
  {
    level: 'MODERATE',
    label: 'Moderate Severity',
    desc: 'Possible injuries or significant accident',
    borderActive: 'border-orange-600',
    bgActive: 'bg-orange-50/70',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-900',
    icon: AlertTriangle,
  },
  {
    level: 'CRITICAL',
    label: 'Critical Severity',
    desc: 'Serious injuries or immediate danger',
    borderActive: 'border-red-600',
    bgActive: 'bg-red-50/80',
    badgeBg: 'bg-red-600',
    badgeText: 'text-white',
    icon: AlertOctagon,
  },
];

export const SeveritySelector: React.FC<SeveritySelectorProps> = ({ value, onChange, error }) => {
  return (
    <div id="section-severity" className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
          <span>Section 2: Observed Severity</span>
          <span className="text-red-600 font-bold">*</span>
        </label>
        <span className="text-xs text-neutral-500">Required</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SEVERITY_LEVELS.map((item) => {
          const isSelected = value === item.level;
          const Icon = item.icon;
          return (
            <button
              key={item.level}
              type="button"
              id={`severity-${item.level.toLowerCase()}`}
              onClick={() => onChange(item.level)}
              className={`p-4 rounded-xl border-2 text-left transition-all relative flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-red-500 ${
                isSelected
                  ? `${item.borderActive} ${item.bgActive} shadow-sm`
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isSelected
                        ? `${item.badgeBg} ${item.badgeText}`
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {item.level}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="font-bold text-sm text-neutral-950 flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-neutral-700 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                  "{item.desc}"
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mandatory safety transparency notice */}
      <div className="p-3 rounded-lg bg-neutral-100 border border-neutral-200/80 flex items-start gap-2 text-xs text-neutral-600">
        <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
        <span>
          <strong>Reporter's Visual Assessment:</strong> This selection represents what you observe on-site. It is <strong>not</strong> an AI-generated diagnosis or medical certification.
        </span>
      </div>

      {error && (
        <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};
