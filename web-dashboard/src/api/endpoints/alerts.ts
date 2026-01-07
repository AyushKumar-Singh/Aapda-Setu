import apiClient, { useMockData } from '../client';
import type { Alert, AlertFilters, PaginatedResponse } from '../types';

// Mock data
const generateMockAlerts = (count: number = 5): Alert[] => {
    const types: Alert['type'][] = ['fire', 'flood', 'earthquake', 'accident', 'cyclone'];
    const severities: Alert['severity'][] = ['low', 'medium', 'high', 'critical'];
    const statuses: Alert['status'][] = ['active', 'resolved', 'expired'];

    return Array.from({ length: count }, (_, i) => ({
        _id: `alert_${i}`,
        alert_id: `alt_${Date.now()}_${i}`,
        tenant_id: 'tnt_default',
        type: types[i % types.length],
        severity: severities[Math.floor(Math.random() * severities.length)],
        title: `${types[i % types.length].toUpperCase()} Alert - ${i + 1}`,
        message: `Active ${types[i % types.length]} situation detected. Please stay alert and follow safety protocols.`,
        center: {
            type: 'Point',
            coordinates: [72.8777 + Math.random() * 0.5, 19.0760 + Math.random() * 0.5],
        },
        radius_km: 5 + Math.floor(Math.random() * 15),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: severities[Math.floor(Math.random() * severities.length)] as Alert['priority'],
        recipients_count: Math.floor(Math.random() * 10000) + 500,
        created_by: 'admin_001',
        created_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + Math.random() * 48 * 60 * 60 * 1000).toISOString(),
    }));
};

/**
 * Get all alerts
 */
export const getAlerts = async (filters: AlertFilters = {}): Promise<PaginatedResponse<Alert>> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 400));

        const allAlerts = generateMockAlerts(20);
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const start = (page - 1) * limit;
        const end = start + limit;

        // Apply filters
        let filteredAlerts = allAlerts;
        if (filters.status) {
            filteredAlerts = filteredAlerts.filter((a) => a.status === filters.status);
        }
        if (filters.type) {
            filteredAlerts = filteredAlerts.filter((a) => a.type === filters.type);
        }
        if (filters.severity) {
            filteredAlerts = filteredAlerts.filter((a) => a.severity === filters.severity);
        }

        const paginatedAlerts = filteredAlerts.slice(start, end);

        return {
            items: paginatedAlerts,
            total: filteredAlerts.length,
            page,
            limit,
            totalPages: Math.ceil(filteredAlerts.length / limit),
        };
    }

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
    });

    const response = await apiClient.get<PaginatedResponse<Alert>>(`/api/v1/alerts?${params.toString()}`);
    return response.data;
};

/**
 * Get active alerts
 */
export const getActiveAlerts = async (): Promise<Alert[]> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return generateMockAlerts(5).map((a) => ({ ...a, status: 'active' as const }));
    }

    const response = await apiClient.get<Alert[]>('/api/v1/alerts?status=active');
    return response.data;
};

/**
 * Get alert by ID
 */
export const getAlertById = async (id: string): Promise<Alert> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return generateMockAlerts(1)[0];
    }

    const response = await apiClient.get<Alert>(`/api/v1/alerts/${id}`);
    return response.data;
};

/**
 * Create a new alert
 */
export const createAlert = async (data: Partial<Alert>): Promise<Alert> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        const newAlert = generateMockAlerts(1)[0];
        return { ...newAlert, ...data };
    }

    const response = await apiClient.post<Alert>('/api/v1/admin/alerts', data);
    return response.data;
};

/**
 * Update alert status
 */
export const updateAlertStatus = async (alertId: string, status: Alert['status']): Promise<void> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        console.log(`Mock update alert ${alertId} to ${status}`);
        return;
    }

    await apiClient.patch(`/api/v1/admin/alerts/${alertId}`, { status });
};
