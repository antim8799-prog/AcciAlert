import React, { useState, useEffect } from 'react';
import { AccidentReport, AccidentType, AccidentSeverity, LocationData, ReporterInfo } from '../types';
import { AccidentTypeSelector } from '../components/report/AccidentTypeSelector';
import { SeveritySelector } from '../components/report/SeveritySelector';
import { InjuredPeopleInput } from '../components/report/InjuredPeopleInput';
import { AccidentDescription } from '../components/report/AccidentDescription';
import { LocationCapture } from '../components/report/LocationCapture';
import { PhotoUploader } from '../components/report/PhotoUploader';
import { ReporterInformation } from '../components/report/ReporterInformation';
import { ReportReview } from '../components/report/ReportReview';
import { ReportSuccess } from '../components/report/ReportSuccess';
import { ReportSummarySidebar } from '../components/report/ReportSummarySidebar';
import { AlertTriangle, Phone, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface AccidentReportPageProps {
  onOpenEmergencyModal: () => void;
}

const INITIAL_REPORT_STATE: AccidentReport = {
  reportId: '',
  accidentType: '',
  severity: '',
  injuredPeople: 0,
  description: '',
  location: {
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
  },
  photo: null,
  photoName: null,
  reporter: {
    name: '',
    phone: '',
  },
  createdAt: null,
  status: 'reported',
};

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const AccidentReportPage: React.FC<AccidentReportPageProps> = ({ onOpenEmergencyModal }) => {
  const [report, setReport] = useState<AccidentReport>(INITIAL_REPORT_STATE);
  const [currentStep, setCurrentStep] = useState<'form' | 'review' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationBanner, setValidationBanner] = useState<string | null>(null);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!report.accidentType) {
      newErrors.accidentType = 'Please select the type of accident.';
    }

    if (!report.severity) {
      newErrors.severity = 'Please select the observed severity level.';
    }

    if (!report.description.trim()) {
      newErrors.description = 'Please describe what you observed at the scene.';
    }

    if (report.location.latitude === null || report.location.longitude === null) {
      newErrors.location = 'Please capture the accident location before submitting.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0];
      setValidationBanner(newErrors[firstKey]);

      // Smooth scroll to the offending section
      const elementId = `section-${firstKey.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      const targetElement = document.getElementById(elementId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    setValidationBanner(null);
    return true;
  };

  const handleProceedToReview = () => {
    setSubmissionError(null);
    if (validateForm()) {
      setCurrentStep('review');
    }
  };

  const handleSubmitReport = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const payload = {
        accidentType: report.accidentType,
        severity: report.severity,
        injuredPeople: Number(report.injuredPeople) || 0,
        description: report.description,
        location: {
          latitude: report.location.latitude,
          longitude: report.location.longitude,
        },
        // NOTE: the photo stays on the device (preview only). Sending a multi-MB
        // base64 image made the request exceed the server's 1 MB JSON limit and
        // every submission with a photo failed.
        photo: null,
        reporter: {
          name: report.reporter.name,
          phone: report.reporter.phone,
        },
      };

      const response = await fetch(`${API_BASE_URL}/api/accidents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok || !responseData || !responseData.success) {
        const errorMsg =
          responseData?.message ||
          (responseData?.errors && responseData.errors.join('. ')) ||
          "We couldn't submit the report. Please check your connection and try again.";
        throw new Error(errorMsg);
      }

      const generatedId = responseData.data?.reportId || 'ACC-REPORTED';
      const timestamp = new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const finalizedReport: AccidentReport = {
        ...report,
        reportId: generatedId,
        createdAt: timestamp,
        status: 'reported',
      };

      // Also mirror to localStorage for quick local offline history
      // (without the photo, so we never hit the browser storage quota)
      try {
        const existing = localStorage.getItem('accialert_demo_reports');
        const reports = existing ? JSON.parse(existing) : [];
        reports.unshift({ ...finalizedReport, photo: null });
        localStorage.setItem('accialert_demo_reports', JSON.stringify(reports));
      } catch (e) {
        console.warn('Could not write to localStorage:', e);
      }

      setReport(finalizedReport);
      setIsSubmitting(false);
      setCurrentStep('success');
    } catch (err: any) {
      console.error('Submission failed:', err);
      setIsSubmitting(false);
      // Network failures throw TypeError; otherwise show the server's real reason.
      setSubmissionError(
        err instanceof TypeError || !err?.message
          ? "We couldn't submit the report. Please check your connection and try again."
          : err.message
      );
    }
  };

  const handleResetForm = () => {
    setReport(INITIAL_REPORT_STATE);
    setErrors({});
    setValidationBanner(null);
    setSubmissionError(null);
    setCurrentStep('form');
  };

  const isFormComplete =
    !!report.accidentType &&
    !!report.severity &&
    report.description.trim().length > 0 &&
    report.location.latitude !== null &&
    report.location.longitude !== null;

  return (
    <div className="py-8 sm:py-12 bg-neutral-50 min-h-[calc(100vh-140px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Render Success View */}
        {currentStep === 'success' && (
          <ReportSuccess
            report={report}
            onReset={handleResetForm}
            onOpenEmergencyModal={onOpenEmergencyModal}
          />
        )}

        {/* Render Review View */}
        {currentStep === 'review' && (
          <div className="max-w-3xl mx-auto">
            <ReportReview
              report={report}
              onEdit={() => setCurrentStep('form')}
              onSubmit={handleSubmitReport}
              isSubmitting={isSubmitting}
              submissionError={submissionError}
            />
          </div>
        )}

        {/* Render Form View */}
        {currentStep === 'form' && (
          <div className="space-y-8">
            
            {/* Top Page Header */}
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-['Space_Grotesk',sans-serif] tracking-tight">
                Report an Accident
              </h1>
              <p className="mt-2 text-base text-neutral-600 leading-relaxed">
                Provide the details you know. Sharing accurate information can help others understand the emergency faster.
              </p>
            </div>

            {/* Emergency Notice Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-red-50 border-2 border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-xl sm:text-2xl mt-0.5" role="img" aria-label="Warning">
                  ⚠️
                </span>
                <div>
                  <div className="font-bold text-red-900 text-sm sm:text-base">
                    If someone is in immediate danger, contact local emergency services first.
                  </div>
                  <div className="text-xs text-red-700 mt-0.5">
                    For India, emergency responders can be reached immediately.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="tel:112"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono font-extrabold text-sm shadow-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Emergency: 112</span>
                </a>
                <button
                  type="button"
                  onClick={onOpenEmergencyModal}
                  className="px-3 py-2.5 rounded-xl border border-red-300 bg-white hover:bg-red-100 text-red-900 text-xs font-bold transition-colors"
                >
                  All Helplines
                </button>
              </div>
            </div>

            {/* Validation Banner (if submission attempted with missing fields) */}
            {validationBanner && (
              <div className="p-4 rounded-xl bg-red-100/90 border border-red-300 text-red-900 text-sm flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="font-semibold">{validationBanner}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setValidationBanner(null)}
                  className="text-xs text-red-800 hover:text-red-950 underline shrink-0"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Main Content Layout: Desktop 2-column (Left: Form, Right: Live Summary) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form Sections */}
              <div className="lg:col-span-8 space-y-8 bg-white p-5 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm">
                
                {/* SECTION 1: Accident Type */}
                <AccidentTypeSelector
                  value={report.accidentType}
                  onChange={(val: AccidentType) => {
                    setReport({ ...report, accidentType: val });
                    if (errors.accidentType) setErrors({ ...errors, accidentType: '' });
                  }}
                  error={errors.accidentType}
                />

                <div className="border-t border-neutral-100" />

                {/* SECTION 2: Severity */}
                <SeveritySelector
                  value={report.severity}
                  onChange={(val: AccidentSeverity) => {
                    setReport({ ...report, severity: val });
                    if (errors.severity) setErrors({ ...errors, severity: '' });
                  }}
                  error={errors.severity}
                />

                <div className="border-t border-neutral-100" />

                {/* SECTION 3: Injured People */}
                <InjuredPeopleInput
                  value={report.injuredPeople}
                  onChange={(val: number) => setReport({ ...report, injuredPeople: val })}
                />

                <div className="border-t border-neutral-100" />

                {/* SECTION 4: Description */}
                <AccidentDescription
                  value={report.description}
                  onChange={(val: string) => {
                    setReport({ ...report, description: val });
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                  error={errors.description}
                />

                <div className="border-t border-neutral-100" />

                {/* SECTION 5: Location */}
                <LocationCapture
                  location={report.location}
                  onChange={(loc: LocationData) => {
                    setReport({ ...report, location: loc });
                    if (errors.location) setErrors({ ...errors, location: '' });
                  }}
                  error={errors.location}
                />

                <div className="border-t border-neutral-100" />

                {/* SECTION 6: Optional Photo */}
                <PhotoUploader
                  photo={report.photo}
                  photoName={report.photoName}
                  onChange={(photoUrl: string | null, photoName?: string | null) => {
                    setReport({ ...report, photo: photoUrl, photoName });
                  }}
                />

                <div className="border-t border-neutral-100" />

                {/* SECTION 7: Reporter Information */}
                <ReporterInformation
                  reporter={report.reporter}
                  onChange={(reporter: ReporterInfo) => {
                    setReport({ ...report, reporter });
                  }}
                />

                {/* Form Bottom Action Button */}
                <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-neutral-500">
                    <span className="text-red-600 font-bold">*</span> Indicates mandatory field required for valid report
                  </div>

                  <button
                    type="button"
                    id="review-report-btn"
                    onClick={handleProceedToReview}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
                  >
                    <span>Review Report</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Right Column: Live Report Summary (Desktop) */}
              <div className="hidden lg:block lg:col-span-4">
                <ReportSummarySidebar
                  report={report}
                  isValid={isFormComplete}
                  onOpenEmergencyModal={onOpenEmergencyModal}
                  onReview={handleProceedToReview}
                />
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
