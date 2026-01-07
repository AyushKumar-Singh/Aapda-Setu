// Mock Data for Aapda Setu - Disaster Management System

export type DisasterType = 'fire' | 'flood' | 'earthquake' | 'accident' | 'landslide';
export type AlertStatus = 'active' | 'resolved' | 'pending' | 'verified';
export type VerificationLevel = 'ai-verified' | 'manual-verified' | 'pending' | 'low-confidence';

export interface Alert {
  id: string;
  type: DisasterType;
  title: string;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: AlertStatus;
  severity: 'low' | 'medium' | 'high' | 'critical';
  verification: VerificationLevel;
  confidenceScore: number;
  trustScore: number;
  reportedBy: string;
  reportedAt: string;
  verifiedAt?: string;
  affectedArea: number; // in km radius
  casualties?: number;
  evacuationRequired: boolean;
  responseTeams?: string[];
  images?: string[];
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'citizen' | 'responder' | 'ngo' | 'admin';
  trustScore: number;
  reportsSubmitted: number;
  verifiedReports: number;
  location: string;
  joinedAt: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface IncidentReport {
  id: string;
  userId: string;
  userName: string;
  type: DisasterType;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  photos: string[];
  timestamp: string;
  status: 'pending' | 'verified' | 'rejected';
  aiConfidence: number;
  verificationNotes?: string;
}

// Mock Alerts Data
export const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    type: 'fire',
    title: 'Forest Fire in Uttarakhand Hills',
    description: 'Large forest fire spreading rapidly near residential areas. Smoke visible from 10km away.',
    location: 'Nainital, Uttarakhand',
    coordinates: { lat: 29.3803, lng: 79.4636 },
    status: 'active',
    severity: 'critical',
    verification: 'ai-verified',
    confidenceScore: 94,
    trustScore: 89,
    reportedBy: 'Rajesh Kumar',
    reportedAt: '2025-11-25T09:30:00',
    verifiedAt: '2025-11-25T09:35:00',
    affectedArea: 8.5,
    casualties: 0,
    evacuationRequired: true,
    responseTeams: ['Fire Brigade Unit 3', 'Forest Dept'],
    images: ['fire-1.jpg', 'fire-2.jpg'],
  },
  {
    id: 'ALT-002',
    type: 'flood',
    title: 'Heavy Flooding in Coastal Areas',
    description: 'Rising water levels due to heavy rainfall. Multiple roads submerged.',
    location: 'Kochi, Kerala',
    coordinates: { lat: 9.9312, lng: 76.2673 },
    status: 'active',
    severity: 'high',
    verification: 'manual-verified',
    confidenceScore: 87,
    trustScore: 92,
    reportedBy: 'Priya Menon',
    reportedAt: '2025-11-25T08:15:00',
    verifiedAt: '2025-11-25T08:45:00',
    affectedArea: 12,
    casualties: 2,
    evacuationRequired: true,
    responseTeams: ['NDRF Team 2', 'Local Police'],
    images: ['flood-1.jpg'],
  },
  {
    id: 'ALT-003',
    type: 'earthquake',
    title: 'Moderate Earthquake Tremors',
    description: '4.5 magnitude earthquake felt across the region. Minor structural damages reported.',
    location: 'Shimla, Himachal Pradesh',
    coordinates: { lat: 31.1048, lng: 77.1734 },
    status: 'resolved',
    severity: 'medium',
    verification: 'ai-verified',
    confidenceScore: 96,
    trustScore: 88,
    reportedBy: 'Amit Sharma',
    reportedAt: '2025-11-25T07:20:00',
    verifiedAt: '2025-11-25T07:25:00',
    affectedArea: 15,
    casualties: 0,
    evacuationRequired: false,
    responseTeams: ['Geological Survey Team'],
  },
  {
    id: 'ALT-004',
    type: 'accident',
    title: 'Major Highway Accident',
    description: 'Multi-vehicle collision on NH-44. Traffic blocked in both directions.',
    location: 'Panipat, Haryana',
    coordinates: { lat: 29.3909, lng: 76.9635 },
    status: 'active',
    severity: 'high',
    verification: 'manual-verified',
    confidenceScore: 91,
    trustScore: 85,
    reportedBy: 'Vikram Singh',
    reportedAt: '2025-11-25T10:00:00',
    verifiedAt: '2025-11-25T10:10:00',
    affectedArea: 2,
    casualties: 5,
    evacuationRequired: false,
    responseTeams: ['Highway Patrol', 'Ambulance Service'],
    images: ['accident-1.jpg'],
  },
  {
    id: 'ALT-005',
    type: 'landslide',
    title: 'Landslide Blocks Mountain Road',
    description: 'Heavy landslide after continuous rainfall. Road connectivity disrupted.',
    location: 'Darjeeling, West Bengal',
    coordinates: { lat: 27.0360, lng: 88.2627 },
    status: 'pending',
    severity: 'medium',
    verification: 'pending',
    confidenceScore: 76,
    trustScore: 81,
    reportedBy: 'Anonymous',
    reportedAt: '2025-11-25T11:30:00',
    affectedArea: 3,
    evacuationRequired: false,
  },
  {
    id: 'ALT-006',
    type: 'fire',
    title: 'Building Fire in Commercial Area',
    description: 'Fire in 5-story commercial building. Firefighting operations underway.',
    location: 'Connaught Place, New Delhi',
    coordinates: { lat: 28.6315, lng: 77.2167 },
    status: 'active',
    severity: 'critical',
    verification: 'ai-verified',
    confidenceScore: 98,
    trustScore: 95,
    reportedBy: 'Neha Gupta',
    reportedAt: '2025-11-25T11:45:00',
    verifiedAt: '2025-11-25T11:48:00',
    affectedArea: 1.5,
    casualties: 1,
    evacuationRequired: true,
    responseTeams: ['Fire Brigade Unit 1', 'Fire Brigade Unit 2', 'Ambulance'],
    images: ['building-fire.jpg'],
  },
];

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    role: 'citizen',
    trustScore: 89,
    reportsSubmitted: 12,
    verifiedReports: 10,
    location: 'Nainital, Uttarakhand',
    joinedAt: '2024-03-15',
    status: 'active',
  },
  {
    id: 'USR-002',
    name: 'Priya Menon',
    phone: '+91 98765 43211',
    role: 'responder',
    trustScore: 92,
    reportsSubmitted: 25,
    verifiedReports: 24,
    location: 'Kochi, Kerala',
    joinedAt: '2024-01-10',
    status: 'active',
  },
  {
    id: 'USR-003',
    name: 'Amit Sharma',
    phone: '+91 98765 43212',
    role: 'ngo',
    trustScore: 88,
    reportsSubmitted: 18,
    verifiedReports: 16,
    location: 'Shimla, Himachal Pradesh',
    joinedAt: '2024-02-20',
    status: 'active',
  },
  {
    id: 'USR-004',
    name: 'Vikram Singh',
    phone: '+91 98765 43213',
    role: 'citizen',
    trustScore: 85,
    reportsSubmitted: 8,
    verifiedReports: 7,
    location: 'Panipat, Haryana',
    joinedAt: '2024-06-05',
    status: 'active',
  },
  {
    id: 'USR-005',
    name: 'Neha Gupta',
    phone: '+91 98765 43214',
    role: 'admin',
    trustScore: 95,
    reportsSubmitted: 45,
    verifiedReports: 43,
    location: 'New Delhi',
    joinedAt: '2023-11-01',
    status: 'active',
  },
];

// Mock Incident Reports
export const mockReports: IncidentReport[] = [
  {
    id: 'RPT-001',
    userId: 'USR-001',
    userName: 'Rajesh Kumar',
    type: 'fire',
    description: 'Large forest fire spreading rapidly near residential areas.',
    location: 'Nainital, Uttarakhand',
    coordinates: { lat: 29.3803, lng: 79.4636 },
    photos: ['fire-1.jpg', 'fire-2.jpg'],
    timestamp: '2025-11-25T09:30:00',
    status: 'verified',
    aiConfidence: 94,
    verificationNotes: 'Verified through satellite imagery and local fire department.',
  },
  {
    id: 'RPT-002',
    userId: 'USR-002',
    userName: 'Priya Menon',
    type: 'flood',
    description: 'Heavy rainfall causing flooding in low-lying areas.',
    location: 'Kochi, Kerala',
    coordinates: { lat: 9.9312, lng: 76.2673 },
    photos: ['flood-1.jpg'],
    timestamp: '2025-11-25T08:15:00',
    status: 'verified',
    aiConfidence: 87,
    verificationNotes: 'Cross-verified with weather data and local reports.',
  },
  {
    id: 'RPT-003',
    userId: 'USR-006',
    userName: 'Anonymous User',
    type: 'fire',
    description: 'Small fire in garbage dump.',
    location: 'Random Location',
    coordinates: { lat: 28.7041, lng: 77.1025 },
    photos: [],
    timestamp: '2025-11-25T12:00:00',
    status: 'pending',
    aiConfidence: 45,
  },
  {
    id: 'RPT-004',
    userId: 'USR-007',
    userName: 'Suspicious Reporter',
    type: 'earthquake',
    description: 'Felt tremors, very scary!',
    location: 'Unknown',
    coordinates: { lat: 0, lng: 0 },
    photos: [],
    timestamp: '2025-11-25T12:15:00',
    status: 'rejected',
    aiConfidence: 12,
    verificationNotes: 'No seismic activity detected. Likely false report.',
  },
];

// Dashboard Statistics
export const dashboardStats = {
  activeAlerts: 4,
  totalAlerts: 146,
  verifiedToday: 12,
  pendingVerification: 8,
  totalUsers: 1247,
  responseTeams: 24,
  avgResponseTime: 8.5, // minutes
  trustScoreAvg: 87,
  aiAccuracy: 91.5,
};

// Chart Data
export const alertTrendData = [
  { month: 'Jan', alerts: 12, resolved: 10 },
  { month: 'Feb', alerts: 15, resolved: 13 },
  { month: 'Mar', alerts: 18, resolved: 16 },
  { month: 'Apr', alerts: 14, resolved: 12 },
  { month: 'May', alerts: 22, resolved: 20 },
  { month: 'Jun', alerts: 25, resolved: 22 },
  { month: 'Jul', alerts: 20, resolved: 18 },
  { month: 'Aug', alerts: 28, resolved: 25 },
  { month: 'Sep', alerts: 24, resolved: 22 },
  { month: 'Oct', alerts: 19, resolved: 17 },
  { month: 'Nov', alerts: 16, resolved: 14 },
];

export const disasterTypeDistribution = [
  { name: 'Fire', value: 35, color: '#FF473A' },
  { name: 'Flood', value: 28, color: '#0052FF' },
  { name: 'Earthquake', value: 12, color: '#FACC15' },
  { name: 'Accident', value: 20, color: '#EF4444' },
  { name: 'Landslide', value: 5, color: '#8B4513' },
];

export const responseTimeData = [
  { hour: '00:00', time: 12 },
  { hour: '04:00', time: 15 },
  { hour: '08:00', time: 8 },
  { hour: '12:00', time: 6 },
  { hour: '16:00', time: 9 },
  { hour: '20:00', time: 11 },
];

export const verificationStats = {
  aiVerified: 78,
  manualVerified: 15,
  pending: 7,
};
