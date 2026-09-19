import React from 'react';
import { AccidentType } from '../../types';
import { Car, Bike, UserX, AlertTriangle, HelpCircle, Check } from 'lucide-react';

interface AccidentTypeSelectorProps {
  value: AccidentType | '';
  onChange: (val: AccidentType) => void;
  error?: string;
}

const ACCIDENT_TYPES: { type: AccidentType; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    type: 'Road Accident',
    label: 'Road Accident',
    desc: 'General road incident or obstruction',
    icon: AlertTriangle,
  },
  {
    type: 'Vehicle Collision',
    label: 'Vehicle Collision',
    desc: 'Multi-car, bus, or truck impact',
    icon: Car,
  },
  {
    type: 'Pedestrian Accident',
    label: 'Pedestrian Accident',
    desc: 'Pedestrian or cyclist hit by vehicle',
    icon: UserX,
  },
  {
    type: 'Motorcycle Accident',
    label: 'Motorcycle Accident',
    desc: 'Two-wheeler crash or skid',
    icon: Bike,
  },
  {
    type: 'Other',
    label: 'Other',
    desc: 'Fallen vehicle, rollover, or roadside hazard',
    icon: HelpCircle,
  },
];

export const AccidentTypeSelector: React.FC<AccidentTypeSelectorProps> = ({ value, onChange, error }) => {
  return (
    <div id="section-accident-type" className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
          <span>Section 1: Accident Type</span>
          <span className="text-red-600 font-bold">*</span>
        </label>
        <span className="text-xs text-neutral-500">Required</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACCIDENT_TYPES.map(({ type, label, desc, icon: Icon }) => {
          const isSelected = value === type;
          return (
            <button
              key={type}
              type="button"
              id={`accident-type-${type.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onChange(type)}
              className={`p-4 rounded-xl border-2 text-left transition-all relative flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-red-500 ${
                isSelected
                  ? 'border-red-600 bg-red-50/60 shadow-sm'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-red-600 text-white' : 'bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="font-bold text-sm text-neutral-900">{label}</div>
                <div className="text-xs text-neutral-500 mt-1 leading-snug">{desc}</div>
              </div>
            </button>
          );
        })}
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
