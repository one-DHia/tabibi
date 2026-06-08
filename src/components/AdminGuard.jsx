
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Read admin emails from environment — single source of truth
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAIL || '')
    .split(',')
    .map(e => e.trim())
    .filter(Boolean);

const AdminGuard = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    // User must be authenticated AND their email must be in the admin list
    if (!user || !ADMIN_EMAILS.includes(user.email)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminGuard;
