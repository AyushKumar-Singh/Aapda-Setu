'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import apiClient from '@/lib/api/client';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data.data);

export default function DashboardPage() {
    const { data: stats, error, isLoading } = useSWR('/api/v1/admin/analytics', fetcher, {
        refreshInterval: 30000 // Refresh every 30 seconds
    });

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
                    Failed to load dashboard data
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Reports Today"
                    value={stats?.total_reports_today || 0}
                    icon="📊"
                    color="blue"
                />
                <StatCard
                    title="Pending Verification"
                    value={stats?.pending_verification || 0}
                    icon="⏳"
                    color="yellow"
                />
                <StatCard
                    title="Active Alerts"
                    value={stats?.active_alerts || 0}
                    icon="🚨"
                    color="red"
                />
                <StatCard
                    title="Total Users"
                    value={stats?.total_users || 0}
                    icon="👥"
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        System Metrics
                    </h3>
                    <div className="space-y-3">
                        <MetricRow label="Avg Response Time" value={`${stats?.avg_response_time_min || 0} min`} />
                        <MetricRow label="Verification Accuracy" value={`${((stats?.verification_accuracy || 0) * 100).toFixed(1)}%`} />
                        <MetricRow label="Auto-Verified" value={`${((stats?.auto_verified_percent || 0) * 100).toFixed(1)}%`} />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Quick Actions
                    </h3>
                    <div className="space-y-2">
                        <a href="/dashboard/verification" className="block p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                            <div className="font-medium text-gray-900 dark:text-white">Review Pending Reports</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{stats?.pending_verification || 0} waiting</div>
                        </a>
                        <a href="/dashboard/alerts" className="block p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                            <div className="font-medium text-gray-900 dark:text-white">Create New Alert</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Broadcast emergency notification</div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: any) {
    const colors = {
        blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
        red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    };

    return (
        <div className={`${colors[color]} border rounded-lg p-6`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{icon}</span>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
        </div>
    );
}

function MetricRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <span className="text-gray-600 dark:text-gray-400">{label}</span>
            <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
        </div>
    );
}
