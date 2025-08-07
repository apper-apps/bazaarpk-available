import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import AdminDashboard from './AdminDashboard';
import Loading from '@/components/ui/Loading';

const AdminRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { showToast } = useToast();

useEffect(() => {
    // Add admin body class for CSS overrides
    document.body.classList.add('admin-route');
    
    const checkAdminAccess = () => {
      try {
        const userData = localStorage.getItem('user');
        const tokenData = localStorage.getItem('authToken');
        
        if (userData && tokenData) {
          const parsedUser = JSON.parse(userData);
          const tokenInfo = JSON.parse(tokenData);
          
          // Simulate JWT-like token verification
          const currentTime = Date.now();
          const tokenExpiry = tokenInfo.expiry || 0;
          const isTokenValid = currentTime < tokenExpiry;
          const hasAdminRole = parsedUser.role === 'admin';
          
          if (!isTokenValid) {
            // Token expired
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            showToast('Session expired. Please login again.', 'error');
            setIsLoading(false);
            return;
          }
          
          if (!hasAdminRole) {
            // Invalid role
            showToast('Insufficient permissions for admin access.', 'error');
            setIsLoading(false);
            return;
          }
          
          // Log successful admin access attempt
          console.log('Admin access granted:', {
            userId: parsedUser.id,
            role: parsedUser.role,
            timestamp: new Date().toISOString(),
            tokenValid: isTokenValid
          });
          
          setUser(parsedUser);
        } else {
          // No authentication data
          showToast('Authentication required for admin access.', 'warning');
        }
      } catch (error) {
        console.error('Authentication verification failed:', error);
        showToast('Authentication verification failed. Please try again.', 'error');
        // Clear potentially corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate JWT verification delay (network request simulation)
    const timer = setTimeout(checkAdminAccess, 1200);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('admin-route');
    };
  }, [showToast]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      showToast('Access denied. Admin privileges required.', 'error');
    }
  }, [isLoading, user, showToast]);

  if (isLoading) {
    return (
      <div className="admin-loading-overlay">
        <div className="admin-loading-modal">
          <div className="admin-loading-spinner"></div>
          <div className="admin-loading-text">Verifying Admin Access...</div>
          <div className="text-sm text-gray-500">Checking your permissions</div>
        </div>
      </div>
    );
  }

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="admin-dashboard fade-in-admin">
      <AdminDashboard user={user} />
    </div>
  );
};

export default AdminRoute;