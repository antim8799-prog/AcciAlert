import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  Shield,
  ThumbsDown,
  ThumbsUp,
  Users,
  AlertOctagon,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { AccidentReport, IncidentStatus } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface IncidentDashboardPageProps {
  onOpenEmergencyModal?: () => void;
}

export const IncidentDashboardPage: React.FC<IncidentDashboardPageProps> = ({
  onOpenEmergencyModal,
}) => {
  const [incidents, setIncidents] = useState<AccidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/accidents`);
      const data = await res.json().catch(() => null);

      if (!res.ok || !data || !data.success) {
        throw new Error(data?.message || 'Could not fetch incidents');
      }

      setIncidents(data.data || []);
    } catch (err: any) {
      console.error('Error fetching incidents:', err);
      setError(err.message || 'Failed to load incidents. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      // Status filter
      if (statusFilter !== 'all' && incident.status !== statusFilter) {
        return false;
      }

      // Severity filter
      if (
        severityFilter !== 'all' &&
        incident.severity?.toLowerCase() !== severityFilter.toLowerCase()
      ) {
        return false;
      }

      // Search query (matches reportId, accidentType, description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = incident.reportId?.toLowerCase().includes(q);
        const matchType = incident.accidentType?.toLowerCase().includes(q);
        const matchDesc = incident.description?.toLowerCase().includes(q);
        if (!matchId && !matchType && !matchDesc) return false;
      }

      return true;
    });
  }, [incidents, statusFilter, severityFilter, searchQuery]);

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'reported':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Reported
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Under Review
          </span>
        );
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified
          </span>
        );
      case 'responder_assigned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Responder Assigned
          </span>
        );
      case 'responding':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
            Responding
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-800 border border-neutral-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-600" />
            Resolved
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            Disputed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
            {status}
          </span>
        );
    }
  };

  const getSeverityBadge = (severity: string) => {
    const s = severity?.toLowerCase();
    if (s === 'critical') {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700 border border-red-200 uppercase">
          Critical
        </span>
      );
    }
    if (s === 'moderate') {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase">
          Moderate
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase">
        Low
      </span>
    );
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'reported', label: 'Reported' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'verified', label: 'Verified' },
    { value: 'responder_assigned', label: 'Responder Assigned' },
    { value: 'responding', label: 'Responding' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'disputed', label: 'Disputed' },
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'low', label: 'Low' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider mb-2 border border-red-100">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Incident Verification Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-['Space_Grotesk',sans-serif]">
            Active & Recent Accident Incidents
          </h1>
          <p className="text-neutral-600 text-xs sm:text-sm mt-1">
            Monitor reported emergencies, community validation signals, and dispatch lifecycle progress.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/map"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <span>View Live Map</span>
          </Link>

          <button
            type="button"
            onClick={fetchIncidents}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-700 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <span>Report Accident</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Report ID (e.g. ACC-4563D7) or incident type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-neutral-50"
            />
          </div>

          {/* Status filter dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-500 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Severity filter dropdown */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              {severityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter status summary pill */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 text-xs text-neutral-500">
          <span>
            Showing <strong>{filteredIncidents.length}</strong> incident{filteredIncidents.length === 1 ? '' : 's'}
            {statusFilter !== 'all' ? ` (Status: ${statusFilter})` : ''}
            {severityFilter !== 'all' ? ` (Severity: ${severityFilter})` : ''}
          </span>
          {(statusFilter !== 'all' || severityFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setSeverityFilter('all');
                setSearchQuery('');
              }}
              className="text-red-600 hover:text-red-700 font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Incident List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center shadow-sm">
          <RefreshCw className="w-8 h-8 text-red-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-neutral-600">Loading incident records...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-8 text-center text-red-900">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <h3 className="font-bold text-base mb-1">Failed to Load Incidents</h3>
          <p className="text-xs text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchIncidents}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : filteredIncidents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 font-['Space_Grotesk',sans-serif]">
            No matching incidents found
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            {incidents.length === 0
              ? 'No accident reports have been submitted yet. Submit an incident to start tracking.'
              : 'Try changing your filter settings or search terms.'}
          </p>
          <div className="mt-4">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
            >
              <span>Submit New Accident Report</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIncidents.map((incident) => (
            <div
              key={incident.reportId}
              className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-sm hover:border-neutral-300 hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: ID & Main details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-300">
                      {incident.reportId}
                    </span>
                    {getStatusBadge(incident.status)}
                    {getSeverityBadge(incident.severity)}
                    <span className="text-xs font-bold text-neutral-700 px-2 py-0.5 bg-neutral-50 rounded border border-neutral-200">
                      {incident.accidentType}
                    </span>
                  </div>

                  <p className="text-sm text-neutral-800 line-clamp-2 leading-relaxed">
                    {incident.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-500 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="font-mono">
                        {incident.location.latitude?.toFixed(4)}°, {incident.location.longitude?.toFixed(4)}°
                      </span>
                    </span>

                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Injured: {incident.injuredPeople}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>
                        {incident.createdAt
                          ? new Date(incident.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Recent'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Right: Community Signals & Action CTA */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100">
                  {/* Community Confirmation counters */}
                  <div className="flex items-center gap-2">
                    <div
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200"
                      title="Eyewitness confirmations"
                    >
                      <ThumbsUp className="w-3 h-3 text-emerald-600" />
                      <span>{incident.confirmations ?? 0}</span>
                    </div>

                    <div
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200"
                      title="Disputed signals"
                    >
                      <ThumbsDown className="w-3 h-3 text-rose-600" />
                      <span>{incident.disputes ?? 0}</span>
                    </div>
                  </div>

                  {/* View Details link */}
                  <Link
                    to={`/accidents/${incident.reportId}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors"
                  >
                    <span>View Lifecycle & Verify</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
