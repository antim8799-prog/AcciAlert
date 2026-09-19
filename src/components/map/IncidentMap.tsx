import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, ExternalLink, MapPin, Users, Crosshair } from 'lucide-react';
import { AccidentReport, IncidentStatus } from '../../types';
import { getUserLocationIcon, getAccidentIcon } from './markerIcons';
import { formatDistance } from '../../utils/distance';

export interface IncidentWithDistance extends AccidentReport {
  distanceInMeters?: number;
}

interface IncidentMapProps {
  userLocation: { latitude: number; longitude: number } | null;
  incidents: IncidentWithDistance[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string | null) => void;
  recenterTrigger: number;
  onRecenter: () => void;
  locationDenied: boolean;
}

// Map Controller for smooth flyTo and bounds fitting
const MapController: React.FC<{
  userLocation: { latitude: number; longitude: number } | null;
  incidents: IncidentWithDistance[];
  selectedIncidentId: string | null;
  recenterTrigger: number;
}> = ({ userLocation, incidents, selectedIncidentId, recenterTrigger }) => {
  const map = useMap();
  const hasInitiallyFitted = useRef(false);

  // Recenter on user location when requested
  useEffect(() => {
    if (recenterTrigger > 0 && userLocation) {
      map.flyTo([userLocation.latitude, userLocation.longitude], 15, {
        duration: 1.2,
      });
    }
  }, [recenterTrigger, userLocation, map]);

  // Focus on selected incident when user clicks a card in the list
  useEffect(() => {
    if (selectedIncidentId) {
      const match = incidents.find((inc) => inc.reportId === selectedIncidentId);
      if (
        match &&
        typeof match.location.latitude === 'number' &&
        typeof match.location.longitude === 'number'
      ) {
        map.flyTo([match.location.latitude, match.location.longitude], 16, {
          duration: 1,
        });
      }
    }
  }, [selectedIncidentId, incidents, map]);

  // Initial bounds: If user location exists, center on user; otherwise fit to incidents
  useEffect(() => {
    if (hasInitiallyFitted.current) return;

    if (userLocation) {
      map.setView([userLocation.latitude, userLocation.longitude], 14);
      hasInitiallyFitted.current = true;
    } else if (incidents.length > 0) {
      const validPoints = incidents
        .filter(
          (inc) =>
            typeof inc.location.latitude === 'number' &&
            typeof inc.location.longitude === 'number' &&
            !isNaN(inc.location.latitude) &&
            !isNaN(inc.location.longitude)
        )
        .map((inc) => [inc.location.latitude, inc.location.longitude] as [number, number]);

      if (validPoints.length > 0) {
        map.fitBounds(validPoints, { padding: [40, 40], maxZoom: 14 });
        hasInitiallyFitted.current = true;
      }
    }
  }, [userLocation, incidents, map]);

  return null;
};

export const IncidentMap: React.FC<IncidentMapProps> = ({
  userLocation,
  incidents,
  selectedIncidentId,
  onSelectIncident,
  recenterTrigger,
  onRecenter,
  locationDenied,
}) => {
  // Determine initial center: user location or first incident or fallback
  const initialCenter: [number, number] = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : incidents.length > 0 &&
      typeof incidents[0].location.latitude === 'number' &&
      typeof incidents[0].location.longitude === 'number'
    ? [incidents[0].location.latitude, incidents[0].location.longitude]
    : [20.5937, 78.9629]; // General overview if completely empty

  const getSeverityTitle = (severity: string) => {
    const s = (severity || '').toLowerCase();
    if (s === 'critical') return '🚨 Critical Accident';
    if (s === 'moderate') return '⚠️ Moderate Accident';
    return 'ℹ️ Low Severity Incident';
  };

  const getCleanStatus = (status: IncidentStatus) => {
    switch (status) {
      case 'reported':
        return 'Reported';
      case 'under_review':
        return 'Under Review';
      case 'verified':
        return 'Verified';
      case 'responder_assigned':
        return 'Responder Assigned';
      case 'responding':
        return 'Responding';
      case 'resolved':
        return 'Resolved';
      case 'disputed':
        return 'Disputed';
      default:
        return status;
    }
  };

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100 flex flex-col">
      {/* Floating Recenter Button */}
      {userLocation && (
        <div className="absolute top-4 right-4 z-[1000]">
          <button
            type="button"
            id="recenter-map-btn"
            onClick={onRecenter}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/95 hover:bg-white text-neutral-800 text-xs font-bold shadow-lg border border-neutral-200 transition-all hover:scale-105 active:scale-95"
            title="Recenter on your current GPS location"
          >
            <Crosshair className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>📍 Recenter on Me</span>
          </button>
        </div>
      )}

      {/* Top Warning Banner if Location is Denied */}
      {locationDenied && (
        <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-md z-[1000] bg-amber-50/95 backdrop-blur-sm border border-amber-200 p-3 rounded-xl shadow-md text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block text-amber-950">Location Permission Required</span>
            <span>
              Location access is required to calculate your distance from incidents. Showing general incident coordinates.
            </span>
          </div>
        </div>
      )}

      {/* Leaflet Map Container */}
      <MapContainer
        center={initialCenter}
        zoom={userLocation ? 14 : 6}
        scrollWheelZoom={true}
        className="w-full h-full flex-1 z-0"
        style={{ minHeight: '460px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapController
          userLocation={userLocation}
          incidents={incidents}
          selectedIncidentId={selectedIncidentId}
          recenterTrigger={recenterTrigger}
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={getUserLocationIcon()}
          >
            <Popup className="accialert-popup">
              <div className="p-1 text-center">
                <div className="font-bold text-neutral-900 text-xs flex items-center justify-center gap-1">
                  <span>👤</span>
                  <span>Your Current Location</span>
                </div>
                <div className="text-[11px] font-mono text-neutral-500 mt-1">
                  {userLocation.latitude.toFixed(5)}°, {userLocation.longitude.toFixed(5)}°
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  Distances to nearby incidents are calculated from here
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Incident Markers */}
        {incidents.map((incident) => {
          const lat = incident.location.latitude;
          const lng = incident.location.longitude;

          if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
            return null;
          }

          const isSelected = selectedIncidentId === incident.reportId;
          const severityTitle = getSeverityTitle(incident.severity);

          return (
            <Marker
              key={incident.reportId}
              position={[lat, lng]}
              icon={getAccidentIcon(incident.severity, isSelected)}
              eventHandlers={{
                click: () => onSelectIncident(incident.reportId),
              }}
            >
              <Popup className="accialert-popup" minWidth={240}>
                <div className="p-1 space-y-2">
                  {/* Header with Severity & ID */}
                  <div>
                    <div className="font-extrabold text-sm text-neutral-900 leading-tight">
                      {severityTitle}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[11px] font-bold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                        {incident.reportId}
                      </span>
                      <span className="text-[11px] font-semibold text-neutral-600">
                        {incident.accidentType}
                      </span>
                    </div>
                  </div>

                  {/* Casualty Count */}
                  <div className="flex items-center gap-1.5 text-xs text-neutral-700">
                    <Users className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>
                      <strong>{incident.injuredPeople}</strong>{' '}
                      {incident.injuredPeople === 1 ? 'person' : 'people'} reportedly injured
                    </span>
                  </div>

                  {/* Distance (if available) */}
                  <div className="text-xs text-neutral-600 bg-neutral-50 p-1.5 rounded border border-neutral-200">
                    <span className="text-neutral-500">Approx. distance: </span>
                    <strong className="text-neutral-900">
                      {typeof incident.distanceInMeters === 'number'
                        ? formatDistance(incident.distanceInMeters)
                        : 'Location required'}
                    </strong>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-100">
                    <span className="text-neutral-500">Status:</span>
                    <span className="font-bold text-neutral-800">
                      {getCleanStatus(incident.status)}
                    </span>
                  </div>

                  {/* Action Link to Details */}
                  <div className="pt-1">
                    <Link
                      to={`/accidents/${incident.reportId}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
