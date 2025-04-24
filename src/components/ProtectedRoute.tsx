
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: ('student' | 'company')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role if attempting to access unauthorized route
    if (user?.role === 'student') {
      return <Navigate to="/student-portal" replace />;
    } else if (user?.role === 'company') {
      return <Navigate to="/company-dashboard" replace />;
    }
    
    // Fallback to login if role is undefined
    return <Navigate to="/login" replace />;
  }

  // If authenticated and authorized, render the route's children
  return <Outlet />;
};

export default ProtectedRoute;
