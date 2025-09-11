import React from 'react';
import { X, MapPin, Package, Calendar, DollarSign, User, Phone, FileText, Truck } from 'lucide-react';

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      'submitted': { color: 'bg-blue-100 text-blue-800', label: 'Submitted' },
      'processing': { color: 'bg-yellow-100 text-yellow-800', label: 'Processing' },
      'in-transit': { color: 'bg-orange-100 text-orange-800', label: 'In Transit' },
      'delivered': { color: 'bg-green-100 text-green-800', label: 'Delivered' }
    };
    
    const config = statusConfig[status] || statusConfig['submitted'];
    return (
      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getProgressStep = (currentStatus) => {
    const steps = ['submitted', 'processing', 'in-transit', 'delivered'];
    return steps.indexOf(currentStatus) + 1;
  };

  const currentStep = getProgressStep(order.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-gray-600">{order.trackingNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Order Status & Progress */}
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
              {getStatusBadge(order.status)}
            </div>
            
            {/* Progress Bar */}
            <div className="relative">
              <div className="flex items-center justify-between">
                {['Submitted', 'Processing', 'In Transit', 'Delivered'].map((step, index) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      index < currentStep 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : index === currentStep - 1
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'bg-gray-200 border-gray-300 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${
                      index < currentStep ? 'text-blue-600' : index === currentStep - 1 ? 'text-orange-600' : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 -z-10">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-orange-500 transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Order Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pickup Details */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Pickup Details</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Address</p>
                  <p className="text-gray-600">{order.pickupAddress}</p>
                </div>
                {order.pickupContact && (
                  <div>
                    <p className="font-medium text-gray-700">Contact Person</p>
                    <p className="text-gray-600">{order.pickupContact}</p>
                  </div>
                )}
                {order.pickupPhone && (
                  <div>
                    <p className="font-medium text-gray-700">Phone</p>
                    <p className="text-gray-600">{order.pickupPhone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Delivery Details</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Address</p>
                  <p className="text-gray-600">{order.deliveryAddress}</p>
                </div>
                {order.deliveryContact && (
                  <div>
                    <p className="font-medium text-gray-700">Contact Person</p>
                    <p className="text-gray-600">{order.deliveryContact}</p>
                  </div>
                )}
                {order.deliveryPhone && (
                  <div>
                    <p className="font-medium text-gray-700">Phone</p>
                    <p className="text-gray-600">{order.deliveryPhone}</p>
                  </div>
                )}
                {order.deliveryInstructions && (
                  <div>
                    <p className="font-medium text-gray-700">Special Instructions</p>
                    <p className="text-gray-600">{order.deliveryInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Package & Service Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Package className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Package Information</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Description</p>
                  <p className="text-gray-600">{order.packageInfo}</p>
                </div>
                {order.packageValue && (
                  <div>
                    <p className="font-medium text-gray-700">Declared Value</p>
                    <p className="text-gray-600">LKR {order.packageValue}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Service Information</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Service Type</p>
                  <p className="text-gray-600 capitalize">{order.serviceType || 'Standard'} Delivery</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Order Date</p>
                  <p className="text-gray-600">{order.createdAt}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Estimated Delivery</p>
                  <p className="text-gray-600">{order.estimatedDelivery}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Total Cost</p>
                  <p className="text-blue-600 font-semibold">{order.cost}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
            <button className="flex-1 bg-blue-100 text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center justify-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Download Invoice</span>
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
              <Truck className="h-4 w-4" />
              <span>Track Live</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-orange-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;