import apiClient, { useMockData } from '../client';
import type { AuthResponse, LoginRequest, User } from '../types';

// Mock data for development
const mockUser: User = {
    id: '1',
    user_id: 'usr_admin001',
    name: 'Admin User',
    phone: '+919876543210',
    email: 'admin@aapdasetu.in',
    role: 'admin',
    trust_score: 1.0,
    total_reports: 0,
    verified_reports: 0,
    status: 'active',
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
};

const mockAuthResponse: AuthResponse = {
    access_token: 'mock_jwt_token_12345',
    refresh_token: 'mock_refresh_token_67890',
    expires_in: 3600,
    user: mockUser,
};

/**
 * Admin Login
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    if (useMockData()) {
        // Mock successful login
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Store in localStorage
        localStorage.setItem('auth_token', mockAuthResponse.access_token);
        localStorage.setItem('user', JSON.stringify(mockAuthResponse.user));

        return mockAuthResponse;
    }

    const response = await apiClient.post<AuthResponse>('/api/v1/auth/admin/login', credentials);

    // Store tokens
    localStorage.setItem('auth_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
};

/**
 * Refresh Token
 */
export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/refresh', {
        refresh_token: refreshToken,
    });

    // Update tokens
    localStorage.setItem('auth_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);

    return response.data;
};

/**
 * Logout
 */
export const logout = async (): Promise<void> => {
    if (useMockData()) {
        // Clear storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        return;
    }

    await apiClient.post('/api/v1/auth/logout');

    // Clear storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
};

/**
 * Get Current User
 */
export const getCurrentUser = async (): Promise<User> => {
    if (useMockData()) {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : mockUser;
    }

    const response = await apiClient.get<User>('/api/v1/users/me');
    return response.data;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('auth_token');
};

/**
 * Get stored user
 */
export const getStoredUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};
