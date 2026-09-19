# 🚨 AcciAlert — Road Accident Alert & Response

Public web app where anyone can report a road accident with GPS location in seconds,
and people nearby can see it on a live map, confirm/dispute it, and reach emergency
helplines (112 / 108 / 1033) immediately.

## Features
- Report accident: type, severity, injured count, description, live GPS location, optional photo (preview only)
- Live map (Leaflet + OpenStreetMap) with nearest-first list, distance/severity filters, auto-refresh every 20 s
- Incident details: status timeline, community "I can see it / I don't see it" signals, open in Google Maps
- Incident dashboard with search and filters
- One-tap emergency helpline modal (India)
- Reporter phone number is stored but never exposed publicly (privacy by design)

## Tech stack
React 19 + TypeScript + Vite + Tailwind 4 · React-Leaflet · Express · MongoDB (Mongoose)
If `MONGODB_URI` is not set the server falls back to in-memory storage (data resets on restart).

## Run locally
```bash
npm install
cp .env.example .env        # then set MONGODB_URI (optional for a quick demo)
npm run dev                 # frontend + API together on http://localhost:3000
```
Health check: http://localhost:3000/api/health

## Production build
```bash
npm run build
npm start
```

## Notes
- Browser GPS only works on `https://` or `localhost`. To demo on a phone, deploy (Render/Railway/Cloud Run) or use an HTTPS tunnel such as ngrok.
- Status-change buttons on the incident page are prototype controls for the demo (no auth yet).

## API
| Method | Route | Purpose |
|---|---|---|
| POST | `/api/accidents` | Create report |
| GET | `/api/accidents` | Latest 50 reports |
| GET | `/api/accidents/:reportId` | Single report |
| PATCH | `/api/accidents/:reportId/status` | Move through status flow |
| POST | `/api/accidents/:reportId/confirm` | Community confirmation |
| POST | `/api/accidents/:reportId/dispute` | Community dispute |
