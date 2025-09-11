import React, { useState } from 'react';
import { Package, Plus, Search, Filter, MapPin, Calendar, Truck, Eye, Download, RefreshCw } from 'lucide-react';
import { useOrders } from '../../contexts/OrderContext';
import CreateOrderModal from './CreateOrderModal';
import OrderDetailsModal from './OrderDetailsModal';

const OrderManagement = () => {
  const { orders, searchOrders, getOrdersByStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = () => {
    let result = orders;
    
    if (searchQuery) {
      result = searchOrders(searchQuery);
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setDate(today.getDate());
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          break;
        default:
          return result;
      }
      
      result = result.filter(order => new Date(order.createdAt) >= filterDate);
    }
    
    return result;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'submitted': { color: 'bg-blue-100 text-blue-800', label: 'Submitted', icon: Calendar },
      'processing': { color: 'bg-yellow-100 text-yellow-800', label: 'Processing', icon: RefreshCw },
      'in-transit': { color: 'bg-orange-100 text-orange-800', label: 'In Transit', icon: Truck },
      'delivered': { color: 'bg-green-100 text-green-800', label: 'Delivered', icon: Package }
    };
    
    const config = statusConfig[status] || statusConfig['submitted'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Track and manage all your delivery orders</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Order</span>
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders().map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-900">{order.trackingNumber}</h3>
                    {getStatusBadge(order.status)}
                    <span className="text-sm font-medium text-green-600">{order.cost}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-700">Pickup</p>
                        <p className="text-gray-600">{order.pickupAddress}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-700">Delivery</p>
                        <p className="text-gray-600">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span><strong>Package:</strong> {order.packageInfo}</span>
                    <span><strong>Created:</strong> {order.createdAt}</span>
                    {order.estimatedDelivery && (
                      <span><strong>ETA:</strong> {order.estimatedDelivery}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders().length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first order to get started'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create First Order
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateOrderModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
      
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderManagement;