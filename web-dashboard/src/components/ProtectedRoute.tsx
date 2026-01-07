import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '@/api';

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const isAuthenticated = auth.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
