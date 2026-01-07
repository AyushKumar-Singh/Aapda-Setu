'use client';

import useSWR from 'swr';
import { useState } from 'react';
import apiClient from '@/lib/api/client';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data.data);

export default function UsersPage() {
    const [filters, setFilters] = useState({
        role: '',
        status: '',
        search: '',
        page: 1,
        limit: 20
    });

    const [editingUser, setEditingUser] = useState<any>(null);

    const queryString = new URLSearchParams({
        ...(filters.role && { role: filters.role }),
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        page: filters.page.toString(),
        limit: filters.limit.toString()
    }).toString();

    const { data, error, mutate } = useSWR(
        `/api/v1/admin/users?${queryString}`,
        fetcher
    );

    const handleUpdateUser = async (userId: string, updates: { role?: string; status?: string }) => {
        try {
            await apiClient.put(`/api/v1/admin/users/${userId}`, updates);
            mutate();
            setEditingUser(null);
            alert('User updated successfully');
        } catch (error) {
            alert('Failed to update user');
        }
    };

    const roleColors = {
        user: 'bg-gray-100 text-gray-800',
        verifier: 'bg-blue-100 text-blue-800',
        responder: 'bg-green-100 text-green-800',
        ngo_admin: 'bg-purple-100 text-purple-800',
        admin: 'bg-red-100 text-red-800',
        superadmin: 'bg-red-200 text-red-900'
    };

    if (error) return <div className="p-8">Error loading users</div>;
    if (!data) return <div className="p-8">Loading users...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">User Management</h1>
                <div className="text-sm text-gray-600">
                    Total: {data?.total || 0} users
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search by name, email, phone..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                        className="px-4 py-2 border rounded-lg"
                    />

                    <select
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="">All Roles</option>
                        <option value="user">User</option>
                        <option value="verifier">Verifier</option>
                        <option value="responder">Responder</option>
                        <option value="ngo_admin">NGO Admin</option>
                        <option value="admin">Admin</option>
                    </select>

                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="banned">Banned</option>
                    </select>

                    <button
                        onClick={() => setFilters({ role: '', status: '', search: '', page: 1, limit: 20 })}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trust Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reports</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {data?.items?.map((user: any) => (
                            <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4">
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email || user.phone}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role as keyof typeof roleColors]}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                                            user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{ width: `${user.trust_score * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm">{(user.trust_score * 100).toFixed(0)}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {user.total_reports} ({user.verified_reports} verified)
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => setEditingUser(user)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Edit User: {editingUser.name}</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Role</label>
                                <select
                                    defaultValue={editingUser.role}
                                    id="role-select"
                                    className="w-full px-4 py-2 border rounded"
                                >
                                    <option value="user">User</option>
                                    <option value="verifier">Verifier</option>
                                    <option value="responder">Responder</option>
                                    <option value="ngo_admin">NGO Admin</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <select
                                    defaultValue={editingUser.status}
                                    id="status-select"
                                    className="w-full px-4 py-2 border rounded"
                                >
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="banned">Banned</option>
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        const role = (document.getElementById('role-select') as HTMLSelectElement).value;
                                        const status = (document.getElementById('status-select') as HTMLSelectElement).value;
                                        handleUpdateUser(editingUser.user_id, { role, status });
                                    }}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
