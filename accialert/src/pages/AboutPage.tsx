import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, ArrowRight, Eye, PhoneCall } from 'lucide-react';

interface AboutPageProps {
  onOpenEmergencyModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenEmergencyModal }) => {
  return (
    <main className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm space-y-10">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Our Mission</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-['Space_Grotesk',sans-serif] tracking-tight">
            About AcciAlert
          </h1>
          <p className="mt-3 text-lg text-neutral-600 leading-relaxed">
            A public emergency-response web application designed to bridge the critical gap between accident occurrence and initial on-site assistance.
          </p>
        </div>

        {/* The Golden Hour Problem */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 font-['Space_Grotesk',sans-serif]">
            The Golden Hour Challenge
          </h2>
          <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
            In severe road collisions, the first 60 minutes—known in trauma medicine as the <em>Golden Hour</em>—determine survival and long-term recovery outcomes. 
            All too often, bystanders witness an accident but hesitate due to lack of coordination, uncertainty regarding location addresses, or delay in informing nearby responders.
          </p>
          <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
            AcciAlert enables anyone with a smartphone browser to immediately generate a location-precise alert without downloading heavy native apps or navigating complex login forms.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
            <Clock className="w-6 h-6 text-red-600 mb-3" />
            <h3 className="font-bold text-base text-neutral-900">Immediate Speed</h3>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Mobile-first design optimized to submit critical crash alerts in less than 30 seconds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
            <Shield className="w-6 h-6 text-red-600 mb-3" />
            <h3 className="font-bold text-base text-neutral-900">Responsible Triage</h3>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Zero fake emergency claims. Clear coordination between community Good Samaritans and official hotlines (112).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
            <Eye className="w-6 h-6 text-red-600 mb-3" />
            <h3 className="font-bold text-base text-neutral-900">Privacy & Focus</h3>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Captures only vital incident telemetry needed for roadside assistance without persistent user profiling.
            </p>
          </div>
        </div>

        {/* Emergency Reminder Footer */}
        <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700"
          >
            <span>Back to Landing Page</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={onOpenEmergencyModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-red-600" />
            <span>Emergency Hotlines (112)</span>
          </button>
        </div>

      </div>
    </main>
  );
};
