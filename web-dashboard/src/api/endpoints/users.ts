import apiClient, { useMockData } from '../client';
import type { User, UserFilters, PaginatedResponse } from '../types';

// Mock data
const generateMockUsers = (count: number = 20): User[] => {
    const roles: User['role'][] = ['user', 'verifier', 'responder', 'ngo_admin', 'admin'];
    const statuses: User['status'][] = ['active', 'suspended', 'banned'];
    const names = ['Raj Kumar', 'Priya Singh', 'Amit Patel', 'Sneha Sharma', 'Vikram Reddy'];

    return Array.from({ length: count }, (_, i) => ({
        id: `${i + 1}`,
        user_id: `usr_${String(i + 1).padStart(4, '0')}`,
        name: names[i % names.length] + ` ${i + 1}`,
        phone: `+919${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
        email: `user${i + 1}@example.com`,
        role: roles[Math.floor(Math.random() * roles.length)],
        trust_score: 0.5 + Math.random() * 0.5,
        total_reports: Math.floor(Math.random() * 50),
        verified_reports: Math.floor(Math.random() * 40),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        last_login: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    }));
};

/**
 * Get all users with filters
 */
export const getUsers = async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const allUsers = generateMockUsers(100);
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const start = (page - 1) * limit;
        const end = start + limit;

        // Apply filters
        let filteredUsers = allUsers;
        if (filters.role) {
            filteredUsers = filteredUsers.filter((u) => u.role === filters.role);
        }
        if (filters.status) {
            filteredUsers = filteredUsers.filter((u) => u.status === filters.status);
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredUsers = filteredUsers.filter(
                (u) =>
                    u.name.toLowerCase().includes(searchLower) ||
                    u.email?.toLowerCase().includes(searchLower) ||
                    u.phone.includes(searchLower)
            );
        }

        const paginatedUsers = filteredUsers.slice(start, end);

        return {
            items: paginatedUsers,
            total: filteredUsers.length,
            page,
            limit,
            totalPages: Math.ceil(filteredUsers.length / limit),
        };
    }

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
    });

    const response = await apiClient.get<PaginatedResponse<User>>(`/api/v1/admin/users?${params.toString()}`);
    return response.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<User> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return generateMockUsers(1)[0];
    }

    const response = await apiClient.get<User>(`/api/v1/admin/users/${id}`);
    return response.data;
};

/**
 * Update user role
 */
export const updateUserRole = async (userId: string, role: User['role']): Promise<void> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        console.log(`Mock update user ${userId} role to ${role}`);
        return;
    }

    await apiClient.put(`/api/v1/admin/users/${userId}`, { role });
};

/**
 * Ban/Suspend user
 */
export const updateUserStatus = async (userId: string, status: User['status']): Promise<void> => {
    if (useMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        console.log(`Mock update user ${userId} status to ${status}`);
        return;
    }

    await apiClient.put(`/api/v1/admin/users/${userId}`, { status });
};
