import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    // Check localStorage synchronously on render
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
        // Not authenticated
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(storedUser);
        
        // Check role requirement
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            // Unauthorized role, redirect to proper home
            if (user.role === 'seller') {
                return <Navigate to="/seller-dashboard" replace />;
            } else if (user.role === 'delivery_man') {
                return <Navigate to="/delivery-dashboard" replace />;
            }
            return <Navigate to="/dashboard" replace />;
        }
    } catch (e) {
        // Malformed data
        console.error("Invalid user data in storage", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
