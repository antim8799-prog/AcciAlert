import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  MapPin,
  Users,
  AlertOctagon,
  ChevronRight,
  Navigation,
} from 'lucide-react';
import { IncidentWithDistance } from './IncidentMap';
import { IncidentStatus } from '../../types';
import { formatDistance } from '../../utils/distance';

interface NearbyIncidentListProps {
  incidents: IncidentWithDistance[];
  hasUserLocation: boolean;
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
  totalBeforeFilters: number;
}

export const NearbyIncidentList: React.FC<NearbyIncidentListProps> = ({
  incidents,
  hasUserLocation,
  selectedIncidentId,
  onSelectIncident,
  totalBeforeFilters,
}) => {
  const getSeverityBadge = (severity: string) => {
    const s = (severity || '').toLowerCase();
    if (s === 'critical') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-700 border border-red-200 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          Critical
        </span>
      );
    }
    if (s === 'moderate') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          Moderate
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-700 border border-blue-200 uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
        Low
      </span>
    );
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'reported':
        return (
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Reported
          </span>
        );
      case 'under_review':
        return (
          <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Under Review
          </span>
        );
      case 'verified':
        return (
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Verified
          </span>
        );
      case 'responder_assigned':
        return (
          <span className="text-[11px] font-semibold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            Responder Assigned
          </span>
        );
      case 'responding':
        return (
          <span className="text-[11px] font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
            Responding
          </span>
        );
      case 'resolved':
        return (
          <span className="text-[11px] font-semibold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300">
            Resolved
          </span>
        );
      case 'disputed':
        return (
          <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            Disputed
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Notice when location is unavailable */}
      {!hasUserLocation && (
        <div className="p-3 mb-3 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2">
          <Navigation className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
          <span>Location unavailable. Showing incidents without distance sorting.</span>
        </div>
      )}

      {/* Empty State: Completely zero incidents */}
      {totalBeforeFilters === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-neutral-900 font-['Space_Grotesk',sans-serif]">
            No active accidents have been reported nearby.
          </h4>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs">
            Road incidents reported in the system will automatically appear on this live map.
          </p>
          <div className="mt-4">
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
            >
              <span>Report An Accident</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : incidents.length === 0 ? (
        /* Empty State: Filters returned no results */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-neutral-900 font-['Space_Grotesk',sans-serif]">
            No incidents match your current filters.
          </h4>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs">
            Try expanding the distance radius or selecting all severities.
          </p>
        </div>
      ) : (
        /* Incident Cards List */
        <div className="space-y-3 overflow-y-auto pr-1 flex-1 max-h-[720px]">
          {incidents.map((incident) => {
            const isSelected = selectedIncidentId === incident.reportId;
            const distanceText =
              typeof incident.distanceInMeters === 'number'
                ? `Approx. ${formatDistance(incident.distanceInMeters)} away`
                : 'Approx. distance unavailable';

            const timeString = incident.createdAt
              ? new Date(incident.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent';

            return (
              <div
                key={incident.reportId}
                onClick={() => onSelectIncident(incident.reportId)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-red-500 shadow-md ring-2 ring-red-100'
                    : 'border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                }`}
              >
                {/* Header: Severity, ID, and Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(incident.severity)}
                    <span className="font-mono text-[11px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                      {incident.reportId}
                    </span>
                  </div>
                  {getStatusBadge(incident.status)}
                </div>

                {/* Accident Type */}
                <h4 className="text-sm font-bold text-neutral-900 font-['Space_Grotesk',sans-serif]">
                  {incident.accidentType}
                </h4>

                {/* Narrative excerpt */}
                {incident.description && (
                  <p className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                    {incident.description}
                  </p>
                )}

                {/* Distance & Casualties Specs */}
                <div className="mt-2.5 pt-2.5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600">
                  <div className="flex items-center gap-1.5 font-medium text-neutral-800">
                    <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{distanceText}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>
                      {incident.injuredPeople}{' '}
                      {incident.injuredPeople === 1 ? 'person' : 'people'} reportedly injured
                    </span>
                  </div>
                </div>

                {/* Footer: Report time and View Incident CTA */}
                <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-neutral-100">
                  <span className="flex items-center gap-1 text-neutral-400 text-[11px]">
                    <Clock className="w-3 h-3" />
                    <span>Reported at {timeString}</span>
                  </span>

                  <Link
                    to={`/accidents/${incident.reportId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>View Incident</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
