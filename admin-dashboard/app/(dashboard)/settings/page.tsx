'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            {/* Profile Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={user?.name || ''}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Role
                        </label>
                        <input
                            type="text"
                            value={user?.role || ''}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50 capitalize"
                        />
                    </div>
                </div>
            </div>

            {/* System Configuration */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">System Configuration</h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                        <div>
                            <div className="font-medium">ML Auto-Verification</div>
                            <div className="text-sm text-gray-500">Automatically verify reports with high confidence scores</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                        <div>
                            <div className="font-medium">Real-time Alerts</div>
                            <div className="text-sm text-gray-500">Enable push notifications for new reports</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                        <div>
                            <div className="font-medium">Data Export</div>
                            <div className="text-sm text-gray-500">Allow CSV/PDF export of reports</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* API Configuration */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">API Configuration</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Backend API URL</label>
                        <input
                            type="text"
                            value={process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-sm font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">ML CPU Service</label>
                        <input
                            type="text"
                            value="http://localhost:8000"
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-sm font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">ML GPU Service</label>
                        <input
                            type="text"
                            value="http://localhost:8001"
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-sm font-mono"
                        />
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-4">Danger Zone</h2>

                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                    Logout
                </button>
            </div>

            {/* System Info */}
            <div className="mt-6 text-center text-sm text-gray-500">
                <p>Aapda Setu Admin Dashboard v1.0.0</p>
                <p className="mt-1">© 2025 Aapda Setu. All rights reserved.</p>
            </div>
        </div>
    );
}
