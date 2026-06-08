// ============================================================
// ⛔ DEPRECATED — This file is replaced by /pages/Admin/Dashboard.jsx
// ============================================================
// The old admin dashboard had hardcoded credentials (admin123).
// It has been removed for security reasons.
// The active admin dashboard uses Supabase Auth + AdminGuard.
// ============================================================

import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
    // Redirect to the secure admin route
    return <Navigate to="/admin" replace />;
};

export default AdminDashboard;
