export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface ActionCardItem {
  id: string;
  title: string;
  emoji: string;
  description: string;
  ctaText: string;
  route: string;
  badge?: string;
  variant: 'primary' | 'secondary' | 'accent';
}

export interface StepItem {
  step: string;
  title: string;
  description: string;
  details: string;
}

export interface TrustCardItem {
  title: string;
  subtitle: string;
  description: string;
  highlight: string;
}

export type AccidentType =
  | 'Road Accident'
  | 'Vehicle Collision'
  | 'Pedestrian Accident'
  | 'Motorcycle Accident'
  | 'Other';

export type AccidentSeverity = 'LOW' | 'MODERATE' | 'CRITICAL';

export interface LocationData {
  latitude: number | null;
  longitude: number | null;
  accuracy?: number | null;
  timestamp?: number | null;
}

export interface ReporterInfo {
  name: string;
  phone?: string;
}

export type IncidentStatus =
  | 'reported'
  | 'under_review'
  | 'verified'
  | 'responder_assigned'
  | 'responding'
  | 'resolved'
  | 'disputed';

export interface AccidentReport {
  reportId: string;
  accidentType: AccidentType | '';
  severity: AccidentSeverity | '';
  injuredPeople: number;
  description: string;
  location: LocationData;
  photo: string | null;
  photoName?: string | null;
  reporter: ReporterInfo;
  createdAt: string | null;
  status: IncidentStatus;
  confirmations?: number;
  disputes?: number;
}
