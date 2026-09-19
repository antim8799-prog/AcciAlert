import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { EmergencyActions } from '../components/EmergencyActions';
import { HowItWorks } from '../components/HowItWorks';
import { EmergencySection } from '../components/EmergencySection';
import { TrustSection } from '../components/TrustSection';

interface LandingPageProps {
  onOpenEmergencyModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenEmergencyModal }) => {
  const { hash } = useLocation();

  // React Router doesn't auto-scroll to #hash targets after client-side navigation
  // (e.g. clicking "How It Works" from /report), so do it here.
  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timer);
  }, [hash]);

  return (
    <main>
      {/* Hero Section */}
      <Hero onNeedHelpClick={onOpenEmergencyModal} />

      {/* Quick Action Section */}
      <EmergencyActions onFindHelpClick={onOpenEmergencyModal} />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Emergency Section */}
      <EmergencySection onOpenEmergencyModal={onOpenEmergencyModal} />

      {/* Trust & Impact Section */}
      <TrustSection />
    </main>
  );
};
