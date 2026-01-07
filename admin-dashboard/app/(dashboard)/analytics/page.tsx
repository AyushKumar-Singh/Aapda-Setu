'use client';

import useSWR from 'swr';
import apiClient from '@/lib/api/client';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data.data);

export default function AnalyticsPage() {
    const { data: stats } = useSWR('/api/v1/admin/analytics', fetcher);
    const { data: trendData } = useSWR('/api/v1/admin/analytics/trend?days=7', fetcher);
    const { data: typeDistribution } = useSWR('/api/v1/admin/analytics/disaster-types', fetcher);

    const COLORS = ['#ef4444', '#3b82f6', '#eab308', '#f97316', '#84cc16', '#a855f7'];

    const pieData = typeDistribution?.labels?.map((label: string, index: number) => ({
        name: label,
        value: typeDistribution.datasets[0].data[index]
    })) || [];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Analytics & Insights</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="Total Reports Today"
                    value={stats?.total_reports_today || 0}
                    trend="+12%"
                    icon="📊"
                />
                <MetricCard
                    title="Pending Verification"
                    value={stats?.pending_verification || 0}
                    trend="-5%"
                    icon="⏳"
                    color="yellow"
                />
                <MetricCard
                    title="Active Alerts"
                    value={stats?.active_alerts || 0}
                    icon="🚨"
                    color="red"
                />
                <MetricCard
                    title="Total Users"
                    value={stats?.total_users || 0}
                    trend="+23%"
                    icon="👥"
                    color="green"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Trend Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Reports Trend (7 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData?.labels?.map((label: string, i: number) => ({
                            name: label,
                            reports: trendData.datasets[0].data[i]
                        })) || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="reports" stroke="#ef4444" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Disaster Type Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Disaster Type Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => entry.name}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* System Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">System Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Response Time</div>
                        <div className="text-2xl font-bold">{stats?.avg_response_time_min || 0} min</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Verification Accuracy</div>
                        <div className="text-2xl font-bold">{((stats?.verification_accuracy || 0) * 100).toFixed(1)}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stats?.verification_accuracy || 0) * 100}%` }}></div>
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Auto-Verified</div>
                        <div className="text-2xl font-bold">{((stats?.auto_verified_percent || 0) * 100).toFixed(1)}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(stats?.auto_verified_percent || 0) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, trend, icon, color = 'blue' }: any) {
    const colors = {
        blue: 'bg-blue-50 dark:bg-blue-900/20',
        yellow: 'bg-yellow-50 dark:bg-yellow-900/20',
        red: 'bg-red-50 dark:bg-red-900/20',
        green: 'bg-green-50 dark:bg-green-900/20'
    };

    return (
        <div className={`${colors[color as keyof typeof colors]} rounded-lg p-6 border border-gray-200 dark:border-gray-700`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{icon}</span>
                {trend && (
                    <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {trend}
                    </span>
                )}
            </div>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{title}</div>
        </div>
    );
}
