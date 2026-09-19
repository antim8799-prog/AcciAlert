import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin, Bell, ArrowRight, Check } from 'lucide-react';

interface EmergencyActionsProps {
  onFindHelpClick?: () => void;
}

export const EmergencyActions: React.FC<EmergencyActionsProps> = ({ onFindHelpClick }) => {
  const [subscribedAlerts, setSubscribedAlerts] = useState(false);
  const [alertFeedback, setAlertFeedback] = useState<string | null>(null);

  const handleGetAlerts = () => {
    if (subscribedAlerts) {
      setAlertFeedback('Location alerts are already enabled in your browser demo session.');
      return;
    }
    setSubscribedAlerts(true);
    setAlertFeedback('Demo alert subscription simulated for nearby incidents within 5 km.');
    setTimeout(() => {
      setAlertFeedback(null);
    }, 4500);
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-red-600 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            <span>Emergency Quick Actions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight font-['Space_Grotesk',sans-serif]">
            Rapid Response Options
          </h2>
          <p className="mt-2 text-neutral-600 text-sm sm:text-base">
            Choose an action below for immediate assistance, finding nearby resources, or joining the local bystander alert network.
          </p>
        </div>

        {/* 3 Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: REPORT ACCIDENT */}
          <div 
            id="action-card-report"
            className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-red-50/40 border-2 border-red-200/90 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/10 transition-all"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-red-600 text-white flex items-center justify-center text-2xl mb-5 shadow-sm shadow-red-600/30 group-hover:scale-105 transition-transform">
                <span role="img" aria-label="Siren">🚨</span>
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-red-100 text-red-800 mb-2">
                Priority 1
              </div>
              <h3 className="text-xl font-bold text-neutral-950 tracking-tight font-['Space_Grotesk',sans-serif]">
                REPORT ACCIDENT
              </h3>
              <p className="mt-3 text-sm sm:text-base text-neutral-700 leading-relaxed">
                Quickly report an accident and share its location.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-red-200/60">
              <Link
                to="/report"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                <span>Start Accident Report</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: FIND HELP */}
          <div 
            id="action-card-help"
            className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-neutral-50/70 border-2 border-neutral-200 hover:border-neutral-400 hover:shadow-md transition-all"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-2xl mb-5 shadow-sm group-hover:scale-105 transition-transform">
                <span role="img" aria-label="Map pin">📍</span>
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-neutral-200 text-neutral-800 mb-2">
                Assistance
              </div>
              <h3 className="text-xl font-bold text-neutral-950 tracking-tight font-['Space_Grotesk',sans-serif]">
                FIND HELP
              </h3>
              <p className="mt-3 text-sm sm:text-base text-neutral-700 leading-relaxed">
                Discover nearby emergency assistance and hospitals.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-neutral-200">
              <Link
                to="/help"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:bg-black text-white font-bold text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2"
              >
                <span>Explore Nearby Help</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: GET ALERTS */}
          <div 
            id="action-card-alerts"
            className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-neutral-50/70 border-2 border-neutral-200 hover:border-neutral-400 hover:shadow-md transition-all"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center text-2xl mb-5 shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <span role="img" aria-label="Bell">🔔</span>
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 mb-2">
                Community
              </div>
              <h3 className="text-xl font-bold text-neutral-950 tracking-tight font-['Space_Grotesk',sans-serif]">
                GET ALERTS
              </h3>
              <p className="mt-3 text-sm sm:text-base text-neutral-700 leading-relaxed">
                Receive important emergency alerts around you.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-neutral-200">
              <button
                type="button"
                onClick={handleGetAlerts}
                className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  subscribedAlerts
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-600'
                    : 'bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-900 focus:ring-neutral-400'
                }`}
              >
                {subscribedAlerts ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Alerts Active (Demo)</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 text-neutral-700" />
                    <span>Turn On Nearby Alerts</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Interactive feedback for Get Alerts */}
        {alertFeedback && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-2 animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{alertFeedback}</span>
          </div>
        )}

      </div>
    </section>
  );
};
