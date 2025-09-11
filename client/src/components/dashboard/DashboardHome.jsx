import React from 'react';
import { Package, TrendingUp, Clock, DollarSign, Truck, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrderContext';
import { useNotifications } from '../../contexts/NotificationContext';

const DashboardHome = () => {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { notifications, unreadCount } = useNotifications();

  const stats = {
    totalOrders: orders.length,
    activeOrders: orders.filter(o => ['processing', 'in-transit'].includes(o.status)).length,
    completedOrders: orders.filter(o => o.status === 'delivered').length,
    pendingPayments: 2
  };

  const recentOrders = orders.slice(0, 5);
  const recentNotifications = notifications.slice(0, 3);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'submitted': { color: 'bg-blue-100 text-blue-800', label: 'Submitted' },
      'processing': { color: 'bg-yellow-100 text-yellow-800', label: 'Processing' },
      'in-transit': { color: 'bg-orange-100 text-orange-800', label: 'In Transit' },
      'delivered': { color: 'bg-green-100 text-green-800', label: 'Delivered' }
    };
    
    const config = statusConfig[status] || statusConfig['submitted'];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              Welcome back, {user?.companyName}!
            </h1>
            <p className="text-blue-100 text-lg">
              Manage your deliveries and track your business growth
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Truck className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.trackingNumber}</p>
                      <p className="text-sm text-gray-500">{order.createdAt}</p>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">From:</span> {order.pickupAddress}</p>
                  <p><span className="font-medium">To:</span> {order.deliveryAddress}</p>
                  <p><span className="font-medium">Package:</span> {order.packageInfo}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 border-t border-gray-100">
            <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium">
              View All Orders
            </button>
          </div>
        </div>
    </div>
  );
};

export default DashboardHome;