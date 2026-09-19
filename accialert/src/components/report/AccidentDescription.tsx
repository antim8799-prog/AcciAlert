import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';

interface AccidentDescriptionProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export const AccidentDescription: React.FC<AccidentDescriptionProps> = ({ value, onChange, error }) => {
  return (
    <div id="section-description" className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="accident-description-input" className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-neutral-700" />
          <span>Section 4: Describe what happened</span>
          <span className="text-red-600 font-bold">*</span>
        </label>
        <span className="text-xs text-neutral-500">Required</span>
      </div>

      <div className="relative">
        <textarea
          id="accident-description-input"
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Example: A car collided with a motorcycle near the intersection. Two people appear to be injured."
          className={`w-full p-3.5 rounded-xl border text-sm text-neutral-900 placeholder:text-neutral-400 bg-white transition-all focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-500 focus:ring-red-400'
              : 'border-neutral-300 hover:border-neutral-400 focus:ring-neutral-900 focus:border-neutral-900'
          }`}
        />
        <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1.5 px-1">
          <span>Only provide factual details that you can directly see or observe on site.</span>
          <span className="font-mono">{value.length} chars</span>
        </div>
      </div>

      {error && (
        <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};
