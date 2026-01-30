
export type AuthMode = 'login' | 'signup';

export interface User {
  id: string;
  email: string;
  name: string;
  mobile?: string;
  gender?: 'Male' | 'Female' | 'Other';
}

export interface EmergencyAction {
  title: string;
  steps: string[];
  severity: 'low' | 'medium' | 'high';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AmbulanceDetails {
  id: string;
  driverName: string;
  eta: string;
  specialty: string;
  avatar: string;
  rating: number;
}

export interface PatientRequest {
  id: string;
  name: string;
  location: string;
  emergencyType: string;
  distance: string;
  vitals: {
    bp: string;
    pulse: number | null;
  };
}

export interface EmergencyRequest {
  patientName: string;
  mobile: string;
  email: string;
  emergencyType: string;
  whatHappened: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface MedicalRecord {
  id: string;
  patientName: string;
  timestamp: string;
  arrivalTime?: string;
  emergencyType: string;
  bp: string;
  pulse: number;
  ambulanceId: string;
  status: 'En Route' | 'Arrived';
}

export type MissionStatus = 'pending' | 'active' | 'completed' | 'declined';
