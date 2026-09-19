import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertCircle, Menu, X, PhoneCall, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  onOpenEmergencyModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEmergencyModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Live Map', href: '/map' },
    { label: 'Incidents', href: '/dashboard/incidents' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Emergency', href: '/#emergency' },
    { label: 'About', href: '/about' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('/#') && location.pathname === '/') {
      const elementId = href.replace('/#', '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md transition-all">
      {/* Emergency Hotline Bar for quick notice */}
      <div className="bg-neutral-900 text-neutral-100 text-xs px-4 py-1.5 font-medium flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-neutral-300">Public Response Network</span>
            <span className="hidden sm:inline text-neutral-400">• For critical life threats, dial</span>
            <span className="font-bold text-red-400 ml-1">112</span>
          </span>
          <button
            onClick={onOpenEmergencyModal}
            className="text-red-300 hover:text-red-200 underline font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-400 rounded px-1"
          >
            Emergency Helplines (India)
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-red-600 rounded-lg p-1"
            aria-label="AcciAlert Home"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm shadow-red-500/20 group-hover:bg-red-700 transition-colors">
              <ShieldAlert className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 font-['Space_Grotesk',sans-serif]">
                Acci<span className="text-red-600">Alert</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 -mt-1">
                Emergency Response
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isHash = link.href.startsWith('/#');
              if (isHash && location.pathname === '/') {
                return (
                  <a
                    key={link.label}
                    href={link.href.replace('/', '')}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="px-3 py-2 text-sm font-semibold text-neutral-700 hover:text-red-600 rounded-md hover:bg-red-50/60 transition-colors"
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                    location.pathname === link.href
                      ? 'text-red-600 bg-red-50'
                      : 'text-neutral-700 hover:text-red-600 hover:bg-red-50/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/report"
              id="nav-report-btn"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white font-bold text-sm shadow-sm hover:bg-red-700 active:bg-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Report Accident</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/report"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-red-600 text-white font-bold text-xs shadow-sm"
              aria-label="Report Accident"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Report</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-lg text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isHash = link.href.startsWith('/#');
              if (isHash && location.pathname === '/') {
                return (
                  <a
                    key={link.label}
                    href={link.href.replace('/', '')}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="block px-4 py-3 rounded-lg text-base font-semibold text-neutral-800 hover:bg-red-50 hover:text-red-700"
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-semibold ${
                    location.pathname === link.href
                      ? 'bg-red-50 text-red-600'
                      : 'text-neutral-800 hover:bg-red-50 hover:text-red-700'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
            <Link
              to="/report"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg bg-red-600 text-white font-bold text-base shadow-sm active:bg-red-700"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Report Accident</span>
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenEmergencyModal) onOpenEmergencyModal();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-neutral-100 text-neutral-900 font-semibold text-sm hover:bg-neutral-200"
            >
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span>Emergency Helpline: 112</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
