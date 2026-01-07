'use client';

import useSWR from 'swr';
import { useState } from 'react';
import apiClient from '@/lib/api/client';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data.data);

export default function VerificationPage() {
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const { data: reports, error, mutate } = useSWR('/api/v1/admin/reports/pending', fetcher, {
        refreshInterval: 10000
    });

    const handleVerify = async (reportId: string, status: 'verified' | 'rejected', note: string) => {
        try {
            await apiClient.post(`/api/v1/reports/${reportId}/verify`, { status, note });
            mutate(); // Refresh the list
            setSelectedReport(null);
            alert(`Report ${status} successfully`);
        } catch (error) {
            alert('Failed to verify report');
        }
    };

    if (error) return <div className="p-8">Error loading reports</div>;
    if (!reports) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Verification Queue</h1>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 dark:text-yellow-200">
                    {reports.length} reports pending verification
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {reports.map((report: any) => (
                    <div key={report._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{report.title}</h3>
                                <p className="text-sm text-gray-500">
                                    {report.type} • {report.severity} • {new Date(report.created_at).toLocaleString()}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${report.confidence_score > 0.8 ? 'bg-green-100 text-green-800' :
                                    report.confidence_score > 0.5 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                }`}>
                                {Math.round(report.confidence_score * 100)}% confidence
                            </span>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-4">{report.description}</p>
                        <p className="text-sm text-gray-500 mb-4">📍 {report.address.formatted}</p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleVerify(report.report_id, 'verified', 'Approved by admin')}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                                ✓ Verify
                            </button>
                            <button
                                onClick={() => handleVerify(report.report_id, 'rejected', 'Does not meet criteria')}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                                ✗ Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {reports.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No reports pending verification
                </div>
            )}
        </div>
    );
}
