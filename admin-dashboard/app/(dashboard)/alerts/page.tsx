'use client';

import useSWR from 'swr';
import { useState } from 'react';
import apiClient from '@/lib/api/client';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data.data);

export default function AlertsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { data: alerts, mutate } = useSWR('/api/v1/alerts?limit=50', fetcher, {
        refreshInterval: 30000
    });

    const handleCreateAlert = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            await apiClient.post('/api/v1/admin/alerts', {
                type: formData.get('type'),
                severity: formData.get('severity'),
                title: formData.get('title'),
                message: formData.get('message'),
                center: {
                    type: 'Point',
                    coordinates: [parseFloat(formData.get('lng') as string), parseFloat(formData.get('lat') as string)]
                },
                radius_km: parseInt(formData.get('radius') as string),
                priority: formData.get('severity')
            });

            mutate();
            setShowCreateModal(false);
            alert('Alert created successfully');
        } catch (error) {
            alert('Failed to create alert');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Emergency Alerts</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                >
                    + Create Alert
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {alerts?.items?.map((alert: any) => (
                    <div key={alert._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${alert.status === 'active' ? 'bg-red-100 text-red-800' :
                                    alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {alert.status}
                            </span>
                            <span className="text-2xl">
                                {alert.type === 'fire' ? '🔥' :
                                    alert.type === 'flood' ? '🌊' :
                                        alert.type === 'earthquake' ? '🌍' : '⚠️'}
                            </span>
                        </div>

                        <h3 className="font-bold text-lg mb-2">{alert.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{alert.message}</p>

                        <div className="text-xs text-gray-500 space-y-1">
                            <div>📍 {alert.radius_km} km radius</div>
                            <div>👥 {alert.recipients_count} recipients</div>
                            <div>🕐 {new Date(alert.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                ))}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Create Emergency Alert</h2>

                        <form onSubmit={handleCreateAlert} className="space-y-4">
                            <input name="title" placeholder="Alert Title" required className="w-full px-4 py-2 border rounded" />
                            <textarea name="message" placeholder="Alert Message" required className="w-full px-4 py-2 border rounded" rows={3} />

                            <select name="type" required className="w-full px-4 py-2 border rounded">
                                <option value="">Select Type</option>
                                <option value="fire">Fire</option>
                                <option value="flood">Flood</option>
                                <option value="earthquake">Earthquake</option>
                                <option value="cyclone">Cyclone</option>
                                <option value="other">Other</option>
                            </select>

                            <select name="severity" required className="w-full px-4 py-2 border rounded">
                                <option value="">Select Severity</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>

                            <div className="grid grid-cols-2 gap-2">
                                <input name="lat" type="number" step="0.000001" placeholder="Latitude" required className="px-4 py-2 border rounded" />
                                <input name="lng" type="number" step="0.000001" placeholder="Longitude" required className="px-4 py-2 border rounded" />
                            </div>

                            <input name="radius" type="number" placeholder="Radius (km)" required className="w-full px-4 py-2 border rounded" />

                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                                    Create Alert
                                </button>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
