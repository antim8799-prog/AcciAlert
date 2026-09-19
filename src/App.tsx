import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EmergencyModal } from './components/EmergencyModal';
import { LandingPage } from './pages/LandingPage';
import { AccidentReportPage } from './pages/AccidentReportPage';
import { AccidentDetailPage } from './pages/AccidentDetailPage';
import { IncidentDashboardPage } from './pages/IncidentDashboardPage';
import { AccidentMapPage } from './pages/AccidentMapPage';
import { HelpPlaceholder } from './pages/HelpPlaceholder';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('accialert_theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('accialert_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const openEmergencyModal = () => setIsEmergencyModalOpen(true);
  const closeEmergencyModal = () => setIsEmergencyModalOpen(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 selection:bg-red-100 selection:text-red-900 transition-colors duration-300">
        {/* Top Navbar */}
        <Navbar
          onOpenEmergencyModal={openEmergencyModal}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((current) => !current)}
        />

        {/* Dynamic Route Content */}
        <div className="flex-1">
          <Routes>
            <Route
              path="/"
              element={<LandingPage onOpenEmergencyModal={openEmergencyModal} />}
            />
            <Route
              path="/map"
              element={<AccidentMapPage />}
            />
            <Route
              path="/report"
              element={<AccidentReportPage onOpenEmergencyModal={openEmergencyModal} />}
            />
            <Route
              path="/accidents/:reportId"
              element={<AccidentDetailPage onOpenEmergencyModal={openEmergencyModal} />}
            />
            <Route
              path="/dashboard/incidents"
              element={<IncidentDashboardPage onOpenEmergencyModal={openEmergencyModal} />}
            />
            <Route
              path="/help"
              element={<HelpPlaceholder onOpenEmergencyModal={openEmergencyModal} />}
            />
            <Route
              path="/about"
              element={<AboutPage onOpenEmergencyModal={openEmergencyModal} />}
            />
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Global Footer */}
        <Footer onOpenEmergencyModal={openEmergencyModal} />

        {/* Accessible Emergency Helpline Modal */}
        <EmergencyModal
          isOpen={isEmergencyModalOpen}
          onClose={closeEmergencyModal}
        />
      </div>
    </BrowserRouter>
  );
}
