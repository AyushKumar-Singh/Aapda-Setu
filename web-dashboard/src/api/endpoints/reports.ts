import apiClient, { useMockData } from '../client';
import type { Report, CreateReportRequest, ReportFilters, PaginatedResponse } from '../types';

// Mock data
const generateMockReports = (count: number = 10): Report[] => {
    const types: Report['type'][] = ['fire', 'flood', 'earthquake', 'accident', 'landslide'];
    const severities: Report['severity'][] = ['low', 'medium', 'high', 'critical'];
    const statuses: Report['status'][] = ['pending', 'verified', 'rejected', 'false_positive'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'];

    return Array.from({ length: count }, (_, i) => ({
        _id: `report_${i}`,
        report_id: `rpt_${Date.now()}_${i}`,
        tenant_id: 'tnt_default',
        user_id: `usr_${i}`,
        type: types[Math.floor(Math.random() * types.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        title: `${types[i % types.length]} Incident ${i + 1}`,
        description: `This is a mock ${types[i % types.length]} report for testing purposes.`,
        location: {
            type: 'Point',
            coordinates: [72.8777 + Math.random() * 0.5, 19.0760 + Math.random() * 0.5],
        },
        address: {
            formatted: `${cities[i % cities.length]}, India`,
            city: cities[i % cities.length],
            state: 'Maharashtra',
        },
        media: [],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        confidence_score: 0.5 + Math.random() * 0.5,
        nearby_confirmations: Math.floor(Math.random() * 10),
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
    }));
};

/**
 * Get all reports with filters
 */
export const getReports = async (filters: ReportFilters = {}): Promise<PaginatedResponse<Report>> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const allReports = generateMockReports(50);
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const start = (page - 1) * limit;
        const end = start + limit;

        // Apply filters
        let filteredReports = allReports;
        if (filters.status) {
            filteredReports = filteredReports.filter((r) => r.status === filters.status);
        }
        if (filters.type) {
            filteredReports = filteredReports.filter((r) => r.type === filters.type);
        }

        const paginatedReports = filteredReports.slice(start, end);

        return {
            items: paginatedReports,
            total: filteredReports.length,
            page,
            limit,
            totalPages: Math.ceil(filteredReports.length / limit),
        };
    }

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
    });

    const response = await apiClient.get<PaginatedResponse<Report>>(`/api/v1/reports?${params.toString()}`);
    return response.data;
};

/**
 * Get single report by ID
 */
export const getReportById = async (id: string): Promise<Report> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return generateMockReports(1)[0];
    }

    const response = await apiClient.get<Report>(`/api/v1/reports/${id}`);
    return response.data;
};

/**
 * Get pending reports for verification
 */
export const getPendingReports = async (): Promise<Report[]> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return generateMockReports(5).map((r) => ({ ...r, status: 'pending' as const }));
    }

    const response = await apiClient.get<Report[]>('/api/v1/admin/reports/pending');
    return response.data;
};

/**
 * Verify a report
 */
export const verifyReport = async (reportId: string, status: 'verified' | 'rejected', note?: string): Promise<void> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        console.log(`Mock verify report ${reportId} as ${status}`);
        return;
    }

    await apiClient.post(`/api/v1/admin/reports/${reportId}/verify`, {
        status,
        note,
    });
};

/**
 * Create a new report (admin)
 */
export const createReport = async (data: CreateReportRequest): Promise<Report> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const newReport = generateMockReports(1)[0];
        return { ...newReport, ...data };
    }

    const response = await apiClient.post<Report>('/api/v1/reports', data);
    return response.data;
};
