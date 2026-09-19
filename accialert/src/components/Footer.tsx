import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Heart } from 'lucide-react';

interface FooterProps {
  onOpenEmergencyModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenEmergencyModal }) => {
  const location = useLocation();

  const handleLinkClick = (href: string) => {
    if (href.startsWith('/#') && location.pathname === '/') {
      const elementId = href.replace('/#', '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-neutral-900 text-neutral-400 text-sm border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-6 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-['Space_Grotesk',sans-serif]">
                Acci<span className="text-red-500">Alert</span>
              </span>
            </Link>

            <p className="text-neutral-300 font-medium text-base">
              Technology designed to help people respond faster.
            </p>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-md">
              A public emergency-response web platform focused on accelerating roadside assistance, crowd-sourced safety alerts, and community-first lifesaving intervention.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-200">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-neutral-300 font-medium">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/#how-it-works"
                  onClick={() => handleLinkClick('/#how-it-works')}
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/#emergency"
                  onClick={() => handleLinkClick('/#emergency')}
                  className="hover:text-white transition-colors"
                >
                  Emergency
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Hackathon Details & Helpline CTA */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-200">
              Emergency Hotlines
            </h4>
            <div className="bg-neutral-800/80 p-3.5 rounded-xl border border-neutral-700/80 text-xs space-y-2">
              <div className="flex justify-between items-center text-neutral-200">
                <span>Pan-India Emergency:</span>
                <span className="font-mono font-bold text-red-400 text-sm">112</span>
              </div>
              <div className="flex justify-between items-center text-neutral-200">
                <span>Medical / Ambulance:</span>
                <span className="font-mono font-bold text-neutral-300">108</span>
              </div>
              <div className="flex justify-between items-center text-neutral-200">
                <span>Highway Helpline:</span>
                <span className="font-mono font-bold text-neutral-300">1033</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenEmergencyModal}
                className="text-xs text-red-400 hover:text-red-300 font-semibold underline"
              >
                View full emergency protocols →
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <div>
            © {new Date().getFullYear()} AcciAlert. Public Emergency Web Utility.
          </div>
        </div>

      </div>
    </footer>
  );
};
