import React, { useState } from 'react';
import { LocationData } from '../../types';
import { MapPin, CheckCircle2, AlertTriangle, Loader2, RefreshCw, Crosshair, ExternalLink } from 'lucide-react';

interface LocationCaptureProps {
  location: LocationData;
  onChange: (loc: LocationData) => void;
  error?: string;
}

export const LocationCapture: React.FC<LocationCaptureProps> = ({ location, onChange, error }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const hasLocation = location.latitude !== null && location.longitude !== null;

  const handleCaptureLocation = () => {
    setGeoError(null);

    if (!('geolocation' in navigator)) {
      setGeoError('Geolocation is not supported by your current browser.');
      return;
    }

    setIsCapturing(true);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsCapturing(false);
        onChange({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (err) => {
        setIsCapturing(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setGeoError(
              'Location permission was denied. Please allow location access in your browser or device settings to report the accident location.'
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setGeoError(
              'Location information is currently unavailable. Please verify GPS / network reception and try again.'
            );
            break;
          case err.TIMEOUT:
            setGeoError('Location request timed out. Please tap "Use My Current Location" again.');
            break;
          default:
            setGeoError('An error occurred while retrieving your location. Please retry.');
            break;
        }
      },
      options
    );
  };

  return (
    <div id="section-location" className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-neutral-700" />
          <span>Section 5: Accident Location</span>
          <span className="text-red-600 font-bold">*</span>
        </label>
        <span className="text-xs text-neutral-500">Required</span>
      </div>

      <div
        className={`p-5 rounded-2xl border-2 transition-all ${
          hasLocation
            ? 'border-emerald-500 bg-emerald-50/40'
            : 'border-neutral-200 bg-white'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Status info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {hasLocation ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-sm text-emerald-900">✓ Location captured</span>
                </>
              ) : (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
                  <span className="font-semibold text-sm text-neutral-600">Location not captured</span>
                </>
              )}
            </div>

            <p className="text-xs text-neutral-500 max-w-sm">
              {hasLocation
                ? 'Accurate GPS coordinates retrieved directly from your device.'
                : 'AcciAlert uses device GPS to mark the exact accident spot for responders.'}
            </p>
          </div>

          {/* Action Button */}
          <div className="shrink-0 w-full sm:w-auto">
            <button
              type="button"
              id="capture-location-btn"
              onClick={handleCaptureLocation}
              disabled={isCapturing}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                hasLocation
                  ? 'bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 focus:ring-neutral-400'
                  : 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm focus:ring-red-600'
              }`}
            >
              {isCapturing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Acquiring GPS...</span>
                </>
              ) : hasLocation ? (
                <>
                  <RefreshCw className="w-4 h-4 text-neutral-600" />
                  <span>Update Location</span>
                </>
              ) : (
                <>
                  <Crosshair className="w-4 h-4" />
                  <span>📍 Use My Current Location</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Technical Coordinate Preview if captured */}
        {hasLocation && location.latitude !== null && location.longitude !== null && (
          <div className="mt-4 pt-4 border-t border-emerald-200/70 text-xs text-neutral-700 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-200">
              <span className="text-neutral-500 block text-[11px]">Latitude</span>
              <span className="font-mono font-bold text-neutral-900">
                {location.latitude.toFixed(6)}° N
              </span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-200">
              <span className="text-neutral-500 block text-[11px]">Longitude</span>
              <span className="font-mono font-bold text-neutral-900">
                {location.longitude.toFixed(6)}° E
              </span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-200">
              <span className="text-neutral-500 block text-[11px]">GPS Accuracy</span>
              <span className="font-mono font-bold text-emerald-800">
                {location.accuracy ? `±${Math.round(location.accuracy)} meters` : 'Standard GPS'}
              </span>
            </div>
          </div>
        )}

        {/* Browser Geolocation Error Alert */}
        {geoError && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Location Access Error</span>
              <span>{geoError}</span>
            </div>
          </div>
        )}
      </div>

      {error && !geoError && (
        <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};
