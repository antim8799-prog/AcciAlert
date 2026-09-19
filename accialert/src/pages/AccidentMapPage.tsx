import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  AlertTriangle,
  Filter,
  Layers,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  Compass,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { AccidentReport, IncidentStatus } from '../types';
import { IncidentMap, IncidentWithDistance } from '../components/map/IncidentMap';
import { NearbyIncidentList } from '../components/map/NearbyIncidentList';
import { calculateDistanceInMeters } from '../utils/distance';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

type DistanceFilterOption = 'all' | '1' | '5' | '10';
type SeverityFilterOption = 'all' | 'critical' | 'moderate' | 'low';

export const AccidentMapPage: React.FC = () => {
  // Raw incidents from backend
  const [rawIncidents, setRawIncidents] = useState<AccidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User Geolocation state
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  // Selected incident on map / list
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  // Filters
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilterOption>('all');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilterOption>('all');
  const [includeResolved, setIncludeResolved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch accidents from MongoDB backend
  const fetchAccidents = useCallback(async (silent = false) => {
    // Silent refreshes (auto-polling) must not unmount the map or flash a spinner.
    if (!silent) {
      setLoading(true);
      setError(null);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/accidents`);
      const data = await res.json().catch(() => null);

      if (!res.ok || !data || !data.success) {
        throw new Error(data?.message || 'Unable to load accident reports.');
      }

      setRawIncidents(data.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch accidents:', err);
      // Keep showing the last known incidents if a background refresh fails.
      if (!silent) setError(err.message || 'Unable to load accident reports.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // 2. Request user location via browser Geolocation API
  const requestUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationDenied(true);
      return;
    }

    setIsRequestingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationDenied(false);
        setIsRequestingLocation(false);
      },
      (geoError) => {
        console.warn('Geolocation access denied or unavailable:', geoError.message);
        setLocationDenied(true);
        setIsRequestingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  // On page mount: fetch accidents & request location
  useEffect(() => {
    fetchAccidents();
    requestUserLocation();
  }, [fetchAccidents, requestUserLocation]);

  // Live feed: quietly refresh every 20s so nearby people see new accidents quickly
  useEffect(() => {
    const timer = setInterval(() => fetchAccidents(true), 20000);
    return () => clearInterval(timer);
  }, [fetchAccidents]);

  // Recenter handler
  const handleRecenter = () => {
    if (userLocation) {
      setRecenterTrigger((prev) => prev + 1);
    } else {
      requestUserLocation();
    }
  };

  // 3. Process incidents: compute distance and filter status
  const processedIncidents: IncidentWithDistance[] = useMemo(() => {
    // Only display appropriate incident statuses:
    // reported, under_review, verified, responder_assigned, responding
    // Do NOT show resolved by default
    const validStatuses: IncidentStatus[] = [
      'reported',
      'under_review',
      'verified',
      'responder_assigned',
      'responding',
      'disputed',
    ];

    if (includeResolved) {
      validStatuses.push('resolved');
    }

    return rawIncidents
      .filter((inc) => validStatuses.includes(inc.status))
      .map((inc) => {
        let dist: number | undefined;

        if (
          userLocation &&
          typeof inc.location?.latitude === 'number' &&
          typeof inc.location?.longitude === 'number' &&
          !isNaN(inc.location.latitude) &&
          !isNaN(inc.location.longitude)
        ) {
          dist = calculateDistanceInMeters(
            userLocation.latitude,
            userLocation.longitude,
            inc.location.latitude,
            inc.location.longitude
          );
        }

        return {
          ...inc,
          distanceInMeters: dist,
        };
      });
  }, [rawIncidents, userLocation, includeResolved]);

  // 4. Apply distance, severity, and search filters
  const filteredAndSortedIncidents = useMemo(() => {
    let result = processedIncidents.filter((incident) => {
      // Severity Filter
      if (
        severityFilter !== 'all' &&
        incident.severity?.toLowerCase() !== severityFilter.toLowerCase()
      ) {
        return false;
      }

      // Distance Filter (Requires user location)
      if (distanceFilter !== 'all' && userLocation) {
        const maxMeters = parseInt(distanceFilter, 10) * 1000;
        if (
          typeof incident.distanceInMeters !== 'number' ||
          incident.distanceInMeters > maxMeters
        ) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = incident.reportId?.toLowerCase().includes(q);
        const matchType = incident.accidentType?.toLowerCase().includes(q);
        const matchDesc = incident.description?.toLowerCase().includes(q);
        if (!matchId && !matchType && !matchDesc) return false;
      }

      return true;
    });

    // Sorting:
    // When user location is available -> nearest first
    // When location is unavailable -> newest first
    if (userLocation) {
      result.sort((a, b) => {
        const distA = a.distanceInMeters ?? Infinity;
        const distB = b.distanceInMeters ?? Infinity;
        return distA - distB;
      });
    } else {
      result.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
    }

    return result;
  }, [processedIncidents, severityFilter, distanceFilter, userLocation, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider mb-2 border border-red-100">
            <Compass className="w-3.5 h-3.5" />
            <span>Real-Time Incident Map</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-['Space_Grotesk',sans-serif]">
            Accidents Near You
          </h1>
          <p className="text-neutral-600 text-xs sm:text-sm mt-1">
            View reported incidents around your current location.
          </p>
        </div>

        {/* Top Actions: Refresh & GPS Status */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {userLocation ? (
            <button
              type="button"
              onClick={handleRecenter}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-600" />
              <span>Location Active</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={requestUserLocation}
              disabled={isRequestingLocation}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 text-xs font-bold transition-colors"
            >
              <Navigation className={`w-3.5 h-3.5 ${isRequestingLocation ? 'animate-spin' : ''}`} />
              <span>Enable My Location</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => fetchAccidents()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 text-xs font-bold transition-colors shadow-sm"
            title="Refresh Incident Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Report ID, vehicle type, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-neutral-50"
            />
          </div>

          {/* Filter Group */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Distance Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-neutral-500">Distance:</span>
              <select
                value={distanceFilter}
                onChange={(e) => setDistanceFilter(e.target.value as DistanceFilterOption)}
                disabled={!userLocation}
                className="px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50 disabled:bg-neutral-100 cursor-pointer"
                title={!userLocation ? 'Location access required for distance filtering' : 'Filter by distance'}
              >
                <option value="all">All Distances</option>
                <option value="1">Within 1 km</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-neutral-500">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as SeverityFilterOption)}
                className="px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
              >
                <option value="all">All Severities</option>
                <option value="critical">🚨 Critical</option>
                <option value="moderate">⚠️ Moderate</option>
                <option value="low">ℹ️ Low</option>
              </select>
            </div>

            {/* Optional Resolved Incidents Toggle */}
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700 select-none px-2 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50">
              <input
                type="checkbox"
                checked={includeResolved}
                onChange={(e) => setIncludeResolved(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 w-3.5 h-3.5"
              />
              <span>Show Resolved</span>
            </label>
          </div>
        </div>

        {/* Filter Feedback strip */}
        <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
          <div>
            Showing <strong>{filteredAndSortedIncidents.length}</strong> incident
            {filteredAndSortedIncidents.length === 1 ? '' : 's'} on map
            {distanceFilter !== 'all' ? ` (within ${distanceFilter} km)` : ''}
            {severityFilter !== 'all' ? ` (${severityFilter})` : ''}
            {userLocation ? ' • Sorted nearest first' : ' • Sorted newest first'}
          </div>

          {(distanceFilter !== 'all' || severityFilter !== 'all' || searchQuery || includeResolved) && (
            <button
              type="button"
              onClick={() => {
                setDistanceFilter('all');
                setSeverityFilter('all');
                setSearchQuery('');
                setIncludeResolved(false);
              }}
              className="text-red-600 hover:text-red-700 font-bold text-xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Map & Incident Discovery Layout */}
      {loading && rawIncidents.length === 0 ? (
        <div className="h-[520px] bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col items-center justify-center p-8 text-center">
          <RefreshCw className="w-8 h-8 text-red-600 animate-spin mb-3" />
          <p className="text-neutral-700 font-bold text-sm">Loading nearby incidents...</p>
          <p className="text-neutral-400 text-xs mt-1">
            Retrieving live accident coordinates and checking GPS proximity...
          </p>
        </div>
      ) : error ? (
        <div className="h-[420px] bg-red-50 rounded-2xl border border-red-200 p-8 flex flex-col items-center justify-center text-center text-red-900">
          <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
          <h3 className="font-bold text-base mb-1">Unable to load accident reports</h3>
          <p className="text-xs text-red-700 max-w-sm mb-4">{error}</p>
          <button
            type="button"
            onClick={() => fetchAccidents()}
            className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
          >
            Try Again
          </button>
        </div>
      ) : (
        /* Responsive Grid:
           Desktop: Map occupies ~65% width, Incident list occupies ~35% width.
           Mobile: Map first, Incident list below.
        */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Column (lg: 8 cols ~ 67%) */}
          <div className="lg:col-span-8 h-[480px] lg:h-[680px] w-full sticky top-20">
            <IncidentMap
              userLocation={userLocation}
              incidents={filteredAndSortedIncidents}
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={(id) => setSelectedIncidentId(id)}
              recenterTrigger={recenterTrigger}
              onRecenter={handleRecenter}
              locationDenied={locationDenied}
            />
          </div>

          {/* Nearby Incident List Column (lg: 4 cols ~ 33%) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <h2 className="text-base font-bold text-neutral-900 font-['Space_Grotesk',sans-serif]">
                  Nearby Incidents
                </h2>
              </div>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                {filteredAndSortedIncidents.length} active
              </span>
            </div>

            <NearbyIncidentList
              incidents={filteredAndSortedIncidents}
              hasUserLocation={Boolean(userLocation)}
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={(id) => setSelectedIncidentId(id)}
              totalBeforeFilters={processedIncidents.length}
            />
          </div>
        </div>
      )}
    </div>
  );
};
