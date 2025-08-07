import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    // Simulate admin access attempt for demo purposes
    const simulateAdminLogin = () => {
      showToast('Try clicking "Simulate Admin Access" to test the admin dashboard', 'info');
    };
    
    const timer = setTimeout(simulateAdminLogin, 1000);
    return () => clearTimeout(timer);
  }, [showToast]);

  const handleSimulateAdmin = () => {
    // Create mock admin user
    const adminUser = {
      id: 1,
      name: 'Administrator',
      email: 'admin@bazaarpk.com',
      role: 'admin'
    };
    
    localStorage.setItem('user', JSON.stringify(adminUser));
    showToast('Admin access granted! Redirecting to dashboard...', 'success');
    
    setTimeout(() => {
      navigate('/admin');
    }, 1500);
  };

  const handleSimulateRegularUser = () => {
    const regularUser = {
      id: 2,
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user'
    };
    
    localStorage.setItem('user', JSON.stringify(regularUser));
    showToast('Logged in as regular user', 'success');
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center">
            <ApperIcon name="ShieldAlert" className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Access Denied
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          You don't have permission to access this area
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="text-center">
              <ApperIcon name="Lock" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Admin Access Required
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                This section is restricted to administrators only. Please contact your system administrator if you believe you should have access.
              </p>
            </div>

            {/* Demo Controls */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Demo Access:</h4>
              <div className="space-y-3">
                <Button 
                  onClick={handleSimulateAdmin}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <ApperIcon name="Shield" className="w-4 h-4 mr-2" />
                  Simulate Admin Access
                </Button>
                
                <Button 
                  onClick={handleSimulateRegularUser}
                  variant="outline"
                  className="w-full"
                >
                  <ApperIcon name="User" className="w-4 h-4 mr-2" />
                  Login as Regular User
                </Button>
              </div>
            </div>

            {/* Navigation Options */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <Button 
                onClick={handleGoHome}
                variant="ghost"
                className="w-full"
              >
                <ApperIcon name="Home" className="w-4 h-4 mr-2" />
                Return to Home Page
              </Button>
              
              <Button 
                onClick={() => navigate(-1)}
                variant="ghost"
                className="w-full"
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Contact Support */}
            <div className="border-t border-gray-200 pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">Need help?</p>
                <Link 
                  to="/"
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Error Code: 403 - Forbidden Access
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;