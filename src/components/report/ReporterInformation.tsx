import React from 'react';
import { ReporterInfo } from '../../types';
import { User, Phone, ShieldCheck } from 'lucide-react';

interface ReporterInformationProps {
  reporter: ReporterInfo;
  onChange: (reporter: ReporterInfo) => void;
}

export const ReporterInformation: React.FC<ReporterInformationProps> = ({ reporter, onChange }) => {
  return (
    <div id="section-reporter-info" className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
          <User className="w-4 h-4 text-neutral-700" />
          <span>Section 7: Reporter Information</span>
        </label>
        <span className="text-xs text-neutral-500">Optional</span>
      </div>

      <div className="p-4 rounded-2xl border border-neutral-200 bg-white space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="reporter-name" className="block text-xs font-semibold text-neutral-700 mb-1">
              Your Name (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                id="reporter-name"
                value={reporter.name}
                onChange={(e) => onChange({ ...reporter, name: e.target.value })}
                placeholder="e.g. John Doe (or leave blank)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 placeholder:text-neutral-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reporter-phone" className="block text-xs font-semibold text-neutral-700 mb-1">
              Contact Number (Optional)
            </label>
            <div className="relative">
              <input
                type="tel"
                id="reporter-phone"
                value={reporter.phone}
                onChange={(e) => onChange({ ...reporter, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 placeholder:text-neutral-400"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1 border-t border-neutral-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Anonymous reporting is fully supported. Personal info is never publicized to other bystanders.
          </span>
        </div>
      </div>
    </div>
  );
};
