'use client';

import useSWR from 'swr';
import { useState } from 'react';
import apiClient from '@/lib/api/client';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data.data);

export default function ReportsPage() {
    const [filters, setFilters] = useState({
        status: '',
        type: '',
        page: 1,
        limit: 20
    });

    const queryString = new URLSearchParams({
        ...(filters.status && { status: filters.status }),
        ...(filters.type && { type: filters.type }),
        page: filters.page.toString(),
        limit: filters.limit.toString()
    }).toString();

    const { data, error, isLoading } = useSWR(
        `/api/v1/reports?${queryString}`,
        fetcher,
        { refreshInterval: 30000 }
    );

    const severityColors = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800'
    };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        verified: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        false_positive: 'bg-gray-100 text-gray-800'
    };

    if (isLoading) return <div className="p-8">Loading reports...</div>;
    if (error) return <div className="p-8">Error loading reports</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">All Reports</h1>
                <div className="text-sm text-gray-600">
                    Total: {data?.total || 0} reports
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <select
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="">All Types</option>
                        <option value="fire">Fire</option>
                        <option value="flood">Flood</option>
                        <option value="earthquake">Earthquake</option>
                        <option value="accident">Accident</option>
                        <option value="landslide">Landslide</option>
                        <option value="cyclone">Cyclone</option>
                    </select>

                    <select
                        value={filters.limit}
                        onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value), page: 1 })}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="10">10 per page</option>
                        <option value="20">20 per page</option>
                        <option value="50">50 per page</option>
                    </select>

                    <button
                        onClick={() => setFilters({ status: '', type: '', page: 1, limit: 20 })}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Report</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Severity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Confidence</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {data?.items?.map((report: any) => (
                            <tr key={report._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4">
                                    <div className="font-medium">{report.title}</div>
                                    <div className="text-sm text-gray-500">{report.address.formatted}</div>
                                </td>
                                <td className="px-6 py-4 text-sm capitalize">{report.type}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors[report.severity as keyof typeof severityColors]}`}>
                                        {report.severity}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[report.status as keyof typeof statusColors]}`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {Math.round(report.confidence_score * 100)}%
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(report.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-600">
                    Showing {((filters.page - 1) * filters.limit) + 1} - {Math.min(filters.page * filters.limit, data?.total || 0)} of {data?.total || 0}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                        disabled={filters.page === 1}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                        disabled={filters.page >= (data?.totalPages || 1)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
