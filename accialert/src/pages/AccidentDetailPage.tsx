import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Copy,
  ExternalLink,
  MapPin,
  RefreshCw,
  Share2,
  Shield,
  ThumbsUp,
  ThumbsDown,
  User,
  Users,
  AlertOctagon,
  Clock,
  Info,
  Check,
  Building,
  Navigation,
} from 'lucide-react';
import { AccidentReport, IncidentStatus } from '../types';
import { StatusTimeline } from '../components/incident/StatusTimeline';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface AccidentDetailPageProps {
  onOpenEmergencyModal?: () => void;
}

export const AccidentDetailPage: React.FC<AccidentDetailPageProps> = ({ onOpenEmergencyModal }) => {
  const { reportId } = useParams<{ reportId: string }>();

  const [incident, setIncident] = useState<AccidentReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Community action state (stored in localStorage for prototype duplicate prevention)
  const storageKey = `accident_action_${reportId?.toUpperCase()}`;
  const [userCommunityAction, setUserCommunityAction] = useState<string | null>(null);
  const [isSubmittingCommunity, setIsSubmittingCommunity] = useState(false);
  const [communityMessage, setCommunityMessage] = useState<string | null>(null);

  // Status transition state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionError, setTransitionError] = useState<string | null>(null);
  const [transitionSuccess, setTransitionSuccess] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Fetch incident details
  const fetchIncident = async () => {
    if (!reportId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/accidents/${reportId.toUpperCase()}`);
      const data = await res.json().catch(() => null);

      if (!res.ok || !data || !data.success) {
        throw new Error(data?.message || 'Accident incident could not be found.');
      }

      setIncident(data.data);
    } catch (err: any) {
      console.error('Error fetching incident:', err);
      setError(err.message || 'Failed to load accident details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncident();

    // Check local storage for previous community action
    if (reportId) {
      const savedAction = localStorage.getItem(`accident_action_${reportId.toUpperCase()}`);
      if (savedAction) {
        setUserCommunityAction(savedAction);
      }
    }
  }, [reportId]);

  // Handle Community Confirm
  const handleCommunityConfirm = async () => {
    if (!incident || isSubmittingCommunity || userCommunityAction) return;

    setIsSubmittingCommunity(true);
    setCommunityMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/accidents/${incident.reportId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data || !data.success) {
        throw new Error(data?.message || 'Could not register community confirmation.');
      }

      // Update incident counts locally
      setIncident((prev) =>
        prev
          ? {
              ...prev,
              confirmations: data.data.confirmations,
              disputes: data.data.disputes,
            }
          : null
      );

      // Save to localStorage to prevent duplicate action in current browser
      localStorage.setItem(storageKey, 'confirmed');
      setUserCommunityAction('confirmed');
      setCommunityMessage('Your signal ("I Can See It") was recorded. Thank you for contributing ground feedback.');
    } catch (err: any) {
      setCommunityMessage(err.message || 'Failed to record signal. Please try again.');
    } finally {
      setIsSubmittingCommunity(false);
    }
  };

  // Handle Community Dispute
  const handleCommunityDispute = async () => {
    if (!incident || isSubmittingCommunity || userCommunityAction) return;

    setIsSubmittingCommunity(true);
    setCommunityMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/accidents/${incident.reportId}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data || !data.success) {
        throw new Error(data?.message || 'Could not register dispute signal.');
      }

      // Update incident counts locally
      setIncident((prev) =>
        prev
          ? {
              ...prev,
              confirmations: data.data.confirmations,
              disputes: data.data.disputes,
            }
          : null
      );

      // Save to localStorage to prevent duplicate action in current browser
      localStorage.setItem(storageKey, 'disputed');
      setUserCommunityAction('disputed');
      setCommunityMessage('Your signal ("I Don\'t See It") was recorded. Ground dispute logged for dispatch review.');
    } catch (err: any) {
      setCommunityMessage(err.message || 'Failed to record dispute signal. Please try again.');
    } finally {
      setIsSubmittingCommunity(false);
    }
  };

  // Handle Status Transition
  const handleStatusTransition = async (newStatus: string) => {
    if (!incident || isTransitioning) return;

    setIsTransitioning(true);
    setTransitionError(null);
    setTransitionSuccess(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/accidents/${incident.reportId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data || !data.success) {
        throw new Error(data?.message || 'Status transition rejected by server.');
      }

      setIncident((prev) => (prev ? { ...prev, status: data.data.status } : null));
      setTransitionSuccess(`Status successfully transitioned to "${data.data.status}".`);
    } catch (err: any) {
      setTransitionError(err.message || 'Transition failed.');
    } finally {
      setIsTransitioning(false);
    }
  };

  // Clipboard API is unavailable on plain http:// (non-localhost), so guard every use.
  const copyText = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      /* fall through to legacy copy */
    }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  };

  const copyReportId = async () => {
    if (!incident) return;
    if (await copyText(incident.reportId)) {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Share message: accident facts + map link + incident page link.
  // Deliberately NEVER includes reporter name or phone number (privacy).
  const buildShareContent = () => {
    if (!incident) return { text: '', url: '' };
    const url = `${window.location.origin}/accidents/${incident.reportId}`;
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${incident.location.latitude},${incident.location.longitude}`;
    const severity = (incident.severity || 'unknown').toUpperCase();
    const injured = incident.injuredPeople || 0;
    const text =
      `🚨 AcciAlert: ${severity} ${incident.accidentType} reported. ` +
      `${injured} ${injured === 1 ? 'person' : 'people'} reportedly injured.\n` +
      `📍 Location: ${mapsLink}\n` +
      `If you are nearby and it is safe, please help or call 112 / 108.\n` +
      `Details: ${url}`;
    return { text, url };
  };

  const showShareFeedback = (msg: string) => {
    setShareFeedback(msg);
    setTimeout(() => setShareFeedback(null), 3000);
  };

  const handleShare = async () => {
    const { text, url } = buildShareContent();
    if (!text) return;

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'AcciAlert - Accident nearby', text, url });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return; // user closed the share sheet
        // any other failure -> fall back to copying below
      }
    }

    showShareFeedback((await copyText(text)) ? 'Alert message copied. Paste it anywhere to share.' : 'Could not copy. Use the WhatsApp button instead.');
  };

  const whatsappHref = incident
    ? `https://wa.me/?text=${encodeURIComponent(buildShareContent().text)}`
    : '#';

  const getSeverityBadge = (severity: string) => {
    const s = severity?.toLowerCase();
    if (s === 'critical') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-700 border border-red-200">
          Critical Severity
        </span>
      );
    }
    if (s === 'moderate') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
          Moderate Severity
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-700 border border-blue-200">
        Low Severity
      </span>
    );
  };

  // Determine allowed transitions for Prototype Controls
  const getAllowedNextTransitions = (status: IncidentStatus): { target: IncidentStatus; label: string; color: string }[] => {
    switch (status) {
      case 'reported':
        return [
          { target: 'under_review', label: 'Triage: Move to Under Review', color: 'bg-blue-600 hover:bg-blue-700 text-white' },
        ];
      case 'under_review':
        return [
          { target: 'verified', label: 'Verify: Confirm Genuine Incident', color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
          { target: 'disputed', label: 'Dispute: Mark Incident as Disputed', color: 'bg-rose-600 hover:bg-rose-700 text-white' },
        ];
      case 'verified':
        return [
          { target: 'responder_assigned', label: 'Dispatch: Assign Responders', color: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
        ];
      case 'responder_assigned':
        return [
          { target: 'responding', label: 'En Route: Mark Responding', color: 'bg-amber-600 hover:bg-amber-700 text-white' },
        ];
      case 'responding':
        return [
          { target: 'resolved', label: 'Complete: Mark Scene Resolved', color: 'bg-emerald-700 hover:bg-emerald-800 text-white' },
        ];
      case 'resolved':
      case 'disputed':
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <RefreshCw className="w-8 h-8 text-red-600 animate-spin mb-3" />
        <p className="text-neutral-600 text-sm font-medium">Loading accident incident details...</p>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 font-['Space_Grotesk',sans-serif]">
          Incident Not Found
        </h2>
        <p className="mt-2 text-neutral-600 text-sm max-w-md mx-auto">
          {error || `Report ID "${reportId}" could not be located in the database.`}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/dashboard/incidents"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Incident Dashboard</span>
          </Link>
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors"
          >
            <span>Report New Incident</span>
          </Link>
        </div>
      </div>
    );
  }

  const allowedTransitions = getAllowedNextTransitions(incident.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 self-start">
          <Link
            to="/dashboard/incidents"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <span className="text-neutral-300">•</span>
          <Link
            to="/map"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>Live Incident Map</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchIncident}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            title="Refresh Incident Details"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={copyReportId}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedId ? 'Copied ID' : 'Copy ID'}</span>
          </button>
        </div>
      </div>

      {/* Incident Header Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs uppercase font-extrabold px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-300">
                {incident.reportId}
              </span>
              {getSeverityBadge(incident.severity)}
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                {incident.accidentType}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-['Space_Grotesk',sans-serif]">
              {incident.accidentType} Incident
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-xs text-neutral-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>
                  Reported: {incident.createdAt ? new Date(incident.createdAt).toLocaleString('en-IN') : 'Recently'}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-mono">
                  {incident.location.latitude?.toFixed(4)}°, {incident.location.longitude?.toFixed(4)}°
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-neutral-400" />
                <span>Injured Count: {incident.injuredPeople}</span>
              </span>
            </div>
          </div>

          {/* Quick Emergency Notice */}
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <div className="text-xs text-neutral-500">Need immediate emergency dispatch?</div>
            <button
              type="button"
              onClick={onOpenEmergencyModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors"
            >
              <span>Emergency 112 Helplines</span>
            </button>

            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                id="share-alert-btn"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Alert</span>
              </button>
              <a
                id="share-whatsapp-btn"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                <span>WhatsApp</span>
              </a>
            </div>
            <div className="text-[11px] text-neutral-400 md:text-right max-w-[260px]">
              Alert nearby people. Your contact details are never included.
            </div>
            {shareFeedback && (
              <div role="status" className="text-xs font-semibold text-emerald-700">
                {shareFeedback}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1. VISUAL STATUS TIMELINE */}
      <div className="mb-8">
        <StatusTimeline currentStatus={incident.status} />
      </div>

      {/* 2. COMMUNITY CONFIRMATION MODULE */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-7 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-neutral-700" />
              <h2 className="text-lg font-bold text-neutral-950 font-['Space_Grotesk',sans-serif]">
                Community Verification Signals
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Crowdsourced eyewitness indicators from people near the location coordinates
            </p>
          </div>

          {/* Aggregate Counters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <ThumbsUp className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold">{incident.confirmations ?? 0}</span>
              <span className="text-[11px] uppercase font-semibold text-emerald-700">Confirmed</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
              <ThumbsDown className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold">{incident.disputes ?? 0}</span>
              <span className="text-[11px] uppercase font-semibold text-rose-700">Disputed</span>
            </div>
          </div>
        </div>

        {/* Mandatory Requirement Wording Notice */}
        <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2.5 mb-5">
          <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-neutral-800">
              Community confirmations are supporting signals and do not independently verify an incident.
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">
              Official verification requires dispatch review, emergency operator triage, or verified first-responder confirmation.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5">
          {/* Confirm Button */}
          <button
            type="button"
            id="community-confirm-btn"
            onClick={handleCommunityConfirm}
            disabled={isSubmittingCommunity || Boolean(userCommunityAction)}
            className={`w-full sm:w-1/2 inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-bold transition-all border ${
              userCommunityAction === 'confirmed'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm cursor-default'
                : userCommunityAction === 'disputed'
                ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                : 'bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-900 border-emerald-300 hover:border-emerald-400'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${userCommunityAction === 'confirmed' ? 'text-white' : 'text-emerald-700'}`} />
            <span>
              {userCommunityAction === 'confirmed'
                ? 'You Confirmed This Incident ("I Can See It")'
                : 'I CAN SEE IT'}
            </span>
          </button>

          {/* Dispute Button */}
          <button
            type="button"
            id="community-dispute-btn"
            onClick={handleCommunityDispute}
            disabled={isSubmittingCommunity || Boolean(userCommunityAction)}
            className={`w-full sm:w-1/2 inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-bold transition-all border ${
              userCommunityAction === 'disputed'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm cursor-default'
                : userCommunityAction === 'confirmed'
                ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                : 'bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-900 border-rose-300 hover:border-rose-400'
            }`}
          >
            <ThumbsDown className={`w-4 h-4 ${userCommunityAction === 'disputed' ? 'text-white' : 'text-rose-700'}`} />
            <span>
              {userCommunityAction === 'disputed'
                ? 'You Disputed This Incident ("I Don\'t See It")'
                : "I DON'T SEE IT"}
            </span>
          </button>
        </div>

        {/* Action Status Feedback */}
        {communityMessage && (
          <div className="mt-4 p-3 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-800 flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{communityMessage}</span>
          </div>
        )}

        {/* Prototype Duplicate Prevention Callout */}
        <div className="mt-4 text-[11px] text-neutral-400 leading-relaxed">
          * <strong>Prototype duplicate prevention:</strong> Your response is remembered locally in this browser via localStorage so you cannot vote repeatedly. Real production deployment incorporates authenticated device identity and server-side rate limits.
        </div>
      </div>

      {/* 3. INCIDENT DETAILS & MEDIA GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Incident Details */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-6 sm:p-7 shadow-sm space-y-5">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Incident Narrative / Description
            </h3>
            <p className="text-neutral-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              {incident.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Estimated Injured Casualties
              </span>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-red-600" />
                <span className="text-lg font-bold text-neutral-900">
                  {incident.injuredPeople} {incident.injuredPeople === 1 ? 'person' : 'people'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Incident Coordinates
              </span>
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-neutral-900">
                <Navigation className="w-4 h-4 text-neutral-600" />
                <span>
                  {incident.location.latitude?.toFixed(5)}°, {incident.location.longitude?.toFixed(5)}°
                </span>
              </div>
            </div>
          </div>

          {/* Reporter privacy notice */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-start gap-3">
            <User className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-600">
              <span className="font-bold text-neutral-900 block mb-0.5">
                Reporter: {incident.reporter?.name || 'Anonymous Good Samaritan'}
              </span>
              <span>
                Personal contact details (phone number) are strictly secured on the backend and are not visible in public incident logs.
              </span>
            </div>
          </div>
        </div>

        {/* Media / Photo Column */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-3">
              Scene Photo Evidence
            </h3>
            {incident.photo ? (
              <div className="rounded-xl overflow-hidden border border-neutral-200 max-h-64">
                <img
                  src={incident.photo}
                  alt="Incident Scene"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-center flex flex-col items-center justify-center text-neutral-400">
                <AlertOctagon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs font-semibold">No scene image provided</span>
                <span className="text-[11px] text-neutral-400 mt-1">Incident reported with coordinates & description</span>
              </div>
            )}
          </div>

          {/* Quick External Map Link */}
          {incident.location.latitude && incident.location.longitude && (
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${incident.location.latitude},${incident.location.longitude}`}
                target="_blank"
                rel="noreferrer noopener"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-bold text-neutral-700 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>Open Location in Google Maps</span>
                <ExternalLink className="w-3 h-3 text-neutral-400 ml-0.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 4. PROTOTYPE / ADMIN STATUS TRANSITION CONTROLS */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-7 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <h3 className="text-base font-bold font-['Space_Grotesk',sans-serif] text-neutral-100">
                Prototype Status Transition Controls
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Simulate emergency operator & responder lifecycle progression (Admin simulation)
            </p>
          </div>

          <span className="px-2.5 py-1 rounded bg-neutral-800 text-[11px] font-mono text-neutral-300 border border-neutral-700 self-start sm:self-auto">
            Current: <span className="font-bold text-white uppercase">{incident.status}</span>
          </span>
        </div>

        {/* Transition Error or Success Banner */}
        {transitionError && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-bold text-white mb-0.5">Backend Rejection:</strong>
              <span>{transitionError}</span>
            </div>
          </div>
        )}

        {transitionSuccess && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-bold text-white mb-0.5">Status Transition Accepted:</strong>
              <span>{transitionSuccess}</span>
            </div>
          </div>
        )}

        {/* Action Buttons for Allowed Transitions */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-neutral-400">
            Allowed Next Lifecycle Transitions:
          </div>

          {allowedTransitions.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {allowedTransitions.map((t) => (
                <button
                  key={t.target}
                  type="button"
                  onClick={() => handleStatusTransition(t.target)}
                  disabled={isTransitioning}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${t.color} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTransitioning ? 'animate-spin' : ''}`} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs text-neutral-500 italic p-3 rounded-lg bg-neutral-800/60 border border-neutral-800">
              Terminal state reached ({incident.status}). No further transitions allowed under current lifecycle rules.
            </div>
          )}

          {/* Test Invalid Transition Button for verification */}
          <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center gap-3">
            <span className="text-[11px] text-neutral-400">Testing Tools:</span>
            <button
              type="button"
              id="test-invalid-transition-btn"
              onClick={() => handleStatusTransition('resolved')}
              disabled={isTransitioning || incident.status === 'responding'}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-semibold border border-neutral-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Attempt jumping directly to resolved to test backend validation rejection"
            >
              Test Invalid Transition (Jump to "Resolved")
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
