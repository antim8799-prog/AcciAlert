import L from 'leaflet';

/**
 * Creates a distinct user location marker icon.
 * Features a pulsing halo and "👤 You" pill for immediate clarity.
 */
export const getUserLocationIcon = () => {
  return L.divIcon({
    className: 'accialert-user-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); pointer-events: auto;">
        <div style="
          background: #2563eb;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          padding: 2px 8px;
          border-radius: 9999px;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          margin-bottom: 4px;
        ">
          <span>👤</span>
          <span>You</span>
        </div>
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px;">
          <div style="
            position: absolute;
            width: 28px;
            height: 28px;
            border-radius: 9999px;
            background: rgba(37, 99, 235, 0.35);
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            width: 16px;
            height: 16px;
            border-radius: 9999px;
            background: #2563eb;
            border: 3px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.25);
          "></div>
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

/**
 * Creates accessible, distinct accident markers based on severity.
 * Incorporates distinct symbols, colors, and text labels for accessibility.
 */
export const getAccidentIcon = (severity: string, isSelected = false) => {
  const s = (severity || '').toLowerCase();

  let bgColor = '#dc2626'; // red-600
  let symbol = '🚨';
  let label = 'Critical';
  let borderColor = '#ffffff';

  if (s === 'moderate') {
    bgColor = '#d97706'; // amber-600
    symbol = '⚠️';
    label = 'Moderate';
  } else if (s === 'low') {
    bgColor = '#2563eb'; // blue-600
    symbol = 'ℹ️';
    label = 'Low';
  }

  const ringStyle = isSelected
    ? 'box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.5), 0 8px 16px rgba(0,0,0,0.3);'
    : 'box-shadow: 0 4px 8px rgba(0,0,0,0.25);';

  return L.divIcon({
    className: `accialert-incident-marker-${s}`,
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); pointer-events: auto; cursor: pointer;">
        <div style="
          background: ${bgColor};
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 6px;
          border-radius: 6px;
          border: 1.5px solid ${borderColor};
          display: flex;
          align-items: center;
          gap: 3px;
          white-space: nowrap;
          margin-bottom: 2px;
          ${ringStyle}
        ">
          <span>${symbol}</span>
          <span>${label}</span>
        </div>
        <div style="
          width: 24px;
          height: 24px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          background: ${bgColor};
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #ffffff;
            transform: rotate(45deg);
          "></div>
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};
