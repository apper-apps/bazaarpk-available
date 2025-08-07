import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import { ProductService } from '@/services/api/ProductService';
import { CategoryService } from '@/services/api/CategoryService';
import { RecipeBundleService } from '@/services/api/RecipeBundleService';

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalBundles: 0,
    recentOrders: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [products, categories, bundles] = await Promise.all([
        ProductService.getAll(),
        CategoryService.getAll(), 
        RecipeBundleService.getAll()
      ]);
      
      setDashboardData({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalBundles: bundles.length,
        recentOrders: Math.floor(Math.random() * 50) + 10 // Mock data
      });
    } catch (error) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    showToast('Successfully logged out', 'success');
    navigate('/');
  };

  const simulateAdminAction = (action) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast(`${action} completed successfully`, 'success');
    }, 1500);
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: 'BarChart3' },
    { id: 'users', label: 'User Management', icon: 'Users' },
    { id: 'products', label: 'Product Management', icon: 'Package' },
    { id: 'content', label: 'Content Moderation', icon: 'Shield' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' },
    { id: 'settings', label: 'System Settings', icon: 'Settings' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Products</p>
              <p className="text-2xl font-bold text-blue-900">{dashboardData.totalProducts}</p>
            </div>
            <ApperIcon name="Package" className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Categories</p>
              <p className="text-2xl font-bold text-green-900">{dashboardData.totalCategories}</p>
            </div>
            <ApperIcon name="Grid3X3" className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Recipe Bundles</p>
              <p className="text-2xl font-bold text-purple-900">{dashboardData.totalBundles}</p>
            </div>
            <ApperIcon name="ChefHat" className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Recent Orders</p>
              <p className="text-2xl font-bold text-orange-900">{dashboardData.recentOrders}</p>
            </div>
            <ApperIcon name="ShoppingCart" className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Activity" className="w-5 h-5 mr-2 text-primary-600" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button 
              onClick={() => simulateAdminAction('Product sync')}
              className="w-full justify-start"
              variant="ghost"
            >
              <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
              Sync Product Database
            </Button>
            <Button 
              onClick={() => simulateAdminAction('Cache clear')}
              className="w-full justify-start"
              variant="ghost"
            >
              <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
              Clear System Cache
            </Button>
            <Button 
              onClick={() => simulateAdminAction('Report generation')}
              className="w-full justify-start"
              variant="ghost"
            >
              <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
              Generate Analytics Report
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Bell" className="w-5 h-5 mr-2 text-accent-600" />
            System Alerts
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Low Stock Alert</p>
                <p className="text-xs text-yellow-600">5 products below minimum threshold</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <ApperIcon name="Info" className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">System Update Available</p>
                <p className="text-xs text-blue-600">Version 2.1.3 ready for installation</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">User Management</h3>
            <p className="text-gray-600 mb-4">Manage user accounts, roles, and permissions.</p>
            <Button onClick={() => simulateAdminAction('User management update')}>
              Update User Roles
            </Button>
          </Card>
        );
      case 'products':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Product Management</h3>
            <p className="text-gray-600 mb-4">Add, edit, and manage product inventory.</p>
            <Button onClick={() => simulateAdminAction('Product update')}>
              Bulk Update Products
            </Button>
          </Card>
        );
      case 'content':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Content Moderation</h3>
            <p className="text-gray-600 mb-4">Review and moderate user-generated content.</p>
            <Button onClick={() => simulateAdminAction('Content review')}>
              Review Pending Content
            </Button>
          </Card>
        );
      case 'analytics':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Analytics Dashboard</h3>
            <p className="text-gray-600 mb-4">View detailed analytics and reports.</p>
            <Button onClick={() => simulateAdminAction('Analytics refresh')}>
              Refresh Analytics Data
            </Button>
          </Card>
        );
      case 'settings':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">System Settings</h3>
            <p className="text-gray-600 mb-4">Configure system-wide settings and preferences.</p>
            <Button onClick={() => simulateAdminAction('Settings update')}>
              Update System Configuration
            </Button>
          </Card>
        );
      default:
        return renderOverview();
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Shield" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">Welcome back, {user.name || 'Administrator'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ApperIcon name="Home" className="w-4 h-4 mr-2" />
                Back to Site
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="admin-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;