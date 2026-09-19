import React from 'react';
import { Users, Minus, Plus } from 'lucide-react';

interface InjuredPeopleInputProps {
  value: number;
  onChange: (val: number) => void;
}

export const InjuredPeopleInput: React.FC<InjuredPeopleInputProps> = ({ value, onChange }) => {
  const handleDecrement = () => {
    if (value > 0) onChange(value - 1);
  };

  const handleIncrement = () => {
    onChange(value + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 0) {
      onChange(0);
    } else {
      onChange(val);
    }
  };

  return (
    <div id="section-injured-people" className="space-y-2">
      <label htmlFor="injured-people-input" className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
        <Users className="w-4 h-4 text-neutral-700" />
        <span>Section 3: Estimated number of injured people</span>
      </label>

      <div className="flex items-center gap-3">
        {/* Quick Stepper */}
        <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-red-500">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={value <= 0}
            className="p-3 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-neutral-700 focus:outline-none"
            aria-label="Decrease injured count"
          >
            <Minus className="w-4 h-4" />
          </button>

          <input
            id="injured-people-input"
            type="number"
            min="0"
            value={value}
            onChange={handleInputChange}
            className="w-20 sm:w-24 text-center font-mono font-bold text-lg text-neutral-950 py-2.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          <button
            type="button"
            onClick={handleIncrement}
            className="p-3 bg-neutral-100 hover:bg-neutral-200 transition-colors text-neutral-700 focus:outline-none"
            aria-label="Increase injured count"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Preset Buttons */}
        <div className="flex items-center gap-1.5 text-xs">
          {[0, 1, 2, 3, 5].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={`px-3 py-2 rounded-lg font-bold transition-colors ${
                value === preset
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-neutral-500 leading-relaxed">
        Enter 0 if you cannot determine the number or if there are no visible injuries.
      </p>
    </div>
  );
};
