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
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate authentication check delay
    const timer = setTimeout(checkAdminAccess, 800);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('admin-route');
    };
  }, []);

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