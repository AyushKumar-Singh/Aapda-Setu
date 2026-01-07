import apiClient, { useMockData } from '../client';
import type { DashboardStats, ChartData } from '../types';

// Mock data generators
const generateMockDashboardStats = (): DashboardStats => {
    return {
        total_reports_today: Math.floor(Math.random() * 50) + 20,
        pending_verification: Math.floor(Math.random() * 15) + 5,
        active_alerts: Math.floor(Math.random() * 10) + 2,
        total_users: Math.floor(Math.random() * 5000) + 1000,
        avg_response_time_min: Math.floor(Math.random() * 10) + 5,
        verification_accuracy: 0.90 + Math.random() * 0.09,
        auto_verified_percent: 0.70 + Math.random() * 0.15,
        manual_review_percent: 0.15 + Math.random() * 0.10,
        rejected_percent: 0.05 + Math.random() * 0.05,
    };
};

const generateMockTrendData = (): ChartData => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return {
        labels,
        datasets: [
            {
                label: 'Total Reports',
                data: labels.map(() => Math.floor(Math.random() * 30) + 10),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
            },
            {
                label: 'Verified',
                data: labels.map(() => Math.floor(Math.random() * 25) + 8),
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
            },
        ],
    };
};

const generateMockDisasterTypeData = (): ChartData => {
    return {
        labels: ['Fire', 'Flood', 'Earthquake', 'Accident', 'Landslide'],
        datasets: [
            {
                label: 'Reports by Type',
                data: [35, 28, 12, 20, 5],
                backgroundColor: [
                    '#ef4444',
                    '#3b82f6',
                    '#eab308',
                    '#f97316',
                    '#84cc16',
                ],
            },
        ],
    };
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return generateMockDashboardStats();
    }

    const response = await apiClient.get<DashboardStats>('/api/v1/admin/analytics');
    return response.data;
};

/**
 * Get reports trend data
 */
export const getReportsTrendData = async (days: number = 7): Promise<ChartData> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return generateMockTrendData();
    }

    const response = await apiClient.get<ChartData>(`/api/v1/admin/analytics/trend?days=${days}`);
    return response.data;
};

/**
 * Get disaster type distribution
 */
export const getDisasterTypeDistribution = async (): Promise<ChartData> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return generateMockDisasterTypeData();
    }

    const response = await apiClient.get<ChartData>('/api/v1/admin/analytics/disaster-types');
    return response.data;
};

/**
 * Get verification statistics
 */
export const getVerificationStats = async () => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 350));
        return {
            total: 1245,
            auto_verified: 978,
            manual_review: 187,
            rejected: 80,
            accuracy: 0.935,
        };
    }

    const response = await apiClient.get('/api/v1/admin/analytics/verification');
    return response.data;
};
