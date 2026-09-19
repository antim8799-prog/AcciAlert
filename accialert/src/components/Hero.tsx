import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Users, CheckCircle2, Siren, ArrowRight, Shield } from 'lucide-react';

interface HeroProps {
  onNeedHelpClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNeedHelpClick }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-28 border-b border-neutral-200/70 bg-gradient-to-b from-white via-neutral-50/50 to-neutral-50">
      {/* Subtle grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Core Message & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Context Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 border border-red-200 text-red-800 text-xs sm:text-sm font-bold tracking-wide mb-6">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>Public Emergency Coordination Initiative</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-neutral-950 tracking-tight leading-[1.15] font-['Space_Grotesk',sans-serif]">
              Help Can Start With One Alert.
            </h1>

            {/* Supporting Text */}
            <p className="mt-5 text-base sm:text-lg text-neutral-700 leading-relaxed max-w-2xl font-normal">
              When an accident happens, every second matters. AcciAlert helps people quickly report emergencies, share their location, and connect incidents with nearby help.
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <Link
                to="/report"
                id="hero-primary-cta"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-red-600 text-white font-bold text-base sm:text-lg shadow-md shadow-red-600/20 hover:bg-red-700 active:bg-red-800 transition-all focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 text-center"
              >
                <span className="text-xl">🚨</span>
                <span>Report an Accident</span>
              </Link>

              <button
                onClick={onNeedHelpClick}
                id="hero-secondary-cta"
                type="button"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white text-neutral-900 border-2 border-neutral-300 font-bold text-base sm:text-lg hover:border-neutral-400 hover:bg-neutral-50 active:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400 text-center"
              >
                <span>I Need Help</span>
                <ArrowRight className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-neutral-200/80 w-full flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-neutral-600">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                No login required for urgent reports
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                GPS precision dispatch
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Immediate bystander alerting
              </span>
            </div>
          </div>

          {/* Right Column: Visual CSS/UI-based Emergency Dispatch Illustration */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
              {/* Card Header: Simulated Live Dispatch Feed */}
              <div className="bg-neutral-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">
                    Live Incident Monitor
                  </span>
                </div>
                <span className="text-[11px] font-mono bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">
                  Radius: 3.0 KM
                </span>
              </div>

              {/* Visual Map / Incident Radar Simulation */}
              <div className="relative bg-neutral-100 h-52 sm:h-60 border-b border-neutral-200 overflow-hidden flex items-center justify-center p-4">
                {/* Stylized road grid lines */}
                <div className="absolute inset-0 opacity-40">
                  {/* Road 1 */}
                  <div className="absolute top-1/2 left-0 right-0 h-8 -translate-y-1/2 bg-neutral-300/80 flex items-center justify-around">
                    <div className="w-6 h-0.5 border-t border-dashed border-neutral-400" />
                    <div className="w-6 h-0.5 border-t border-dashed border-neutral-400" />
                    <div className="w-6 h-0.5 border-t border-dashed border-neutral-400" />
                    <div className="w-6 h-0.5 border-t border-dashed border-neutral-400" />
                  </div>
                  {/* Road 2 Cross */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-neutral-300/80" />
                </div>

                {/* Radar Pulse Concentric Circles */}
                <div className="absolute w-44 h-44 rounded-full border border-red-400/40 animate-ping pointer-events-none" />
                <div className="absolute w-32 h-32 rounded-full border border-red-500/30 pointer-events-none" />
                <div className="absolute w-20 h-20 rounded-full bg-red-500/10 border border-red-500/40 pointer-events-none" />

                {/* Center Incident Pin */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 border-2 border-white ring-4 ring-red-500/30 animate-bounce">
                    <Siren className="w-6 h-6 text-white" />
                  </div>
                  <span className="mt-2 bg-neutral-900 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                    Accident Reported
                  </span>
                </div>

                {/* Nearby Community Helper Pin 1 */}
                <div className="absolute top-8 right-10 bg-white border border-neutral-300 text-neutral-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                  <Users className="w-3 h-3 text-emerald-600" />
                  <span>Responder (450m)</span>
                </div>

                {/* Nearby Facility Pin 2 */}
                <div className="absolute bottom-6 left-8 bg-white border border-neutral-300 text-neutral-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-blue-600" />
                  <span>Trauma Center (1.2km)</span>
                </div>
              </div>

              {/* Card Body: Emergency Incident Data Preview */}
              <div className="p-4 sm:p-5 space-y-3 bg-white">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-red-600">
                      High Priority Alert
                    </span>
                    <h4 className="text-sm font-bold text-neutral-900">
                      Two-Vehicle Collision • Outer Ring Road
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    Awaiting Triage
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                    <span className="text-neutral-500 block text-[11px]">Location Status</span>
                    <span className="font-semibold text-neutral-900 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      GPS Locked (±4m)
                    </span>
                  </div>
                  <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                    <span className="text-neutral-500 block text-[11px]">Bystander Alert</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      3 Alerted Nearby
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-neutral-500 flex items-center justify-between border-t border-neutral-100">
                  <span>Standard public alert preview</span>
                  <span className="text-neutral-700 font-medium">Target response: &lt; 4 mins</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
