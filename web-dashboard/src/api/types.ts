// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// User & Auth Types
export interface User {
    id: string;
    user_id: string;
    name: string;
    phone: string;
    email?: string;
    role: 'user' | 'verifier' | 'responder' | 'ngo_admin' | 'admin' | 'superadmin';
    trust_score: number;
    total_reports: number;
    verified_reports: number;
    status: 'active' | 'suspended' | 'banned';
    created_at: string;
    last_login?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: User;
}

// Report Types
export interface Location {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
}

export interface Report {
    _id: string;
    report_id: string;
    tenant_id: string;
    user_id: string;
    type: 'fire' | 'flood' | 'earthquake' | 'accident' | 'landslide' | 'cyclone' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    location: Location;
    address: {
        formatted: string;
        city: string;
        state: string;
    };
    media: Array<{
        media_id: string;
        type: 'image' | 'video';
        url: string;
        thumbnail_url?: string;
    }>;
    status: 'pending' | 'verified' | 'rejected' | 'false_positive';
    confidence_score: number;
    verified_by?: string;
    verification_note?: string;
    nearby_confirmations: number;
    created_at: string;
    updated_at: string;
}

export interface CreateReportRequest {
    type: string;
    title: string;
    description: string;
    location: {
        lat: number;
        lng: number;
    };
    severity: string;
    is_anonymous?: boolean;
}

// Alert Types
export interface Alert {
    _id: string;
    alert_id: string;
    tenant_id: string;
    type: 'fire' | 'flood' | 'earthquake' | 'accident' | 'cyclone' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    center: Location;
    radius_km: number;
    status: 'active' | 'resolved' | 'expired';
    priority: 'low' | 'medium' | 'high' | 'critical';
    recipients_count: number;
    created_by: string;
    created_at: string;
    expires_at?: string;
}

// Analytics Types
export interface DashboardStats {
    total_reports_today: number;
    pending_verification: number;
    active_alerts: number;
    total_users: number;
    avg_response_time_min: number;
    verification_accuracy: number;
    auto_verified_percent: number;
    manual_review_percent: number;
    rejected_percent: number;
}

export interface ChartData {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor?: string;
        borderColor?: string;
    }>;
}

// Filter & Query Types
export interface ReportFilters {
    status?: string;
    type?: string;
    from_date?: string;
    to_date?: string;
    min_confidence?: number;
    city?: string;
    page?: number;
    limit?: number;
    sort?: string;
}

export interface UserFilters {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface AlertFilters {
    type?: string;
    status?: string;
    severity?: string;
    page?: number;
    limit?: number;
}
