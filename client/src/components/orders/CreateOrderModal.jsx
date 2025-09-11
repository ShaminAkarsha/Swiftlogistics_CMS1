import React, { useState } from 'react';
import { X, MapPin, Package, Truck, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { useOrders } from '../../contexts/OrderContext';
import { useNotifications } from '../../contexts/NotificationContext';

const CreateOrderModal = ({ isOpen, onClose }) => {
  const { createOrder } = useOrders();
  const { addNotification } = useNotifications();
  
  const [formData, setFormData] = useState({
    pickupAddress: '',
    pickupContact: '',
    pickupPhone: '',
    sourceAddress: '',
    sourceContact: '',
    sourcePhone: '',
    packageDescription: '',
    packageWeight: '',
    packageValue: '',
    serviceType: 'standard',
    sourceInstructions: '',
    urgency: 'normal'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const serviceTypes = [
    { id: 'standard', name: 'Standard Delivery', description: '2-3 business days', rate: 'LKR 350/kg' },
    { id: 'express', name: 'Express Delivery', description: 'Next business day', rate: 'LKR 800/kg' },
    { id: 'same-day', name: 'Same Day Delivery', description: 'Within 6 hours', rate: 'LKR 1200/kg' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.pickupAddress) newErrors.pickupAddress = 'Pickup address is required';
    if (!formData.pickupContact) newErrors.pickupContact = 'Pickup contact is required';
    if (!formData.pickupPhone) newErrors.pickupPhone = 'Pickup phone is required';
    if (!formData.sourceAddress) newErrors.sourceAddress = 'Source address is required';
    if (!formData.sourceContact) newErrors.sourceContact = 'Source contact is required';
    if (!formData.sourcePhone) newErrors.sourcePhone = 'Source phone is required';
    if (!formData.packageDescription) newErrors.packageDescription = 'Package description is required';
    if (!formData.packageWeight) newErrors.packageWeight = 'Package weight is required';
    if (!formData.packageValue) newErrors.packageValue = 'Package value is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    const orderData = {
      ...formData,
      packageInfo: `${formData.packageWeight}kg ${formData.packageDescription}`,
      estimatedSource: getEstimatedSource(formData.serviceType)
    };
    
    const result = await createOrder(orderData);
    
    if (result.success) {
      addNotification({
        title: 'Order Created Successfully',
        message: `Your order ${result.order.trackingNumber} has been submitted for processing.`,
        type: 'success'
      });
      onClose();
      setFormData({
        pickupAddress: '', pickupContact: '', pickupPhone: '',
        sourceAddress: '', sourceContact: '', sourcePhone: '',
        packageDescription: '', packageWeight: '', packageValue: '',
        serviceType: 'standard', sourceInstructions: '', urgency: 'normal'
      });
    }
    
    setLoading(false);
  };

  const getEstimatedSource = (serviceType) => {
    const today = new Date();
    const sourceDays = serviceType === 'same-day' ? 0 : serviceType === 'express' ? 1 : 2;
    const estimatedDate = new Date(today);
    estimatedDate.setDate(today.getDate() + sourceDays);
    return estimatedDate.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Order</h2>
            <p className="text-gray-600">Fill in the Source details below</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Pickup Information */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Pickup Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Address *
                </label>
                <input
                  type="text"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.pickupAddress ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="123 Business Street, Colombo 03"
                />
                {errors.pickupAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.pickupAddress}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="pickupContact"
                  value={formData.pickupContact}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.pickupContact ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Kasun Mendis"
                />
                {errors.pickupContact && (
                  <p className="mt-1 text-sm text-red-600">{errors.pickupContact}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="pickupPhone"
                  value={formData.pickupPhone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.pickupPhone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+94 77 123 4567"
                />
                {errors.pickupPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.pickupPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Source Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Source Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sent Address *
                </label>
                <input
                  type="text"
                  name="sourceAddress"
                  value={formData.sourceAddress}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.sourceAddress ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="456 Customer Avenue, Kandy"
                />
                {errors.sourceAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.sourceAddress}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Driver Name *
                </label>
                <input
                  type="text"
                  name="sourceContact"
                  value={formData.sourceContact}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.sourceContact ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Akarsha Shamin"
                />
                {errors.sourceContact && (
                  <p className="mt-1 text-sm text-red-600">{errors.sourceContact}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="sourcePhone"
                  value={formData.sourcePhone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.sourcePhone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+94 77 987 6543"
                />
                {errors.sourcePhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.sourcePhone}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  name="sourceInstructions"
                  value={formData.sourceInstructions}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Special source instructions, building access codes, etc."
                />
              </div>
            </div>
          </div>

          {/* Package Information */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Package Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Description *
                </label>
                <input
                  type="text"
                  name="packageDescription"
                  value={formData.packageDescription}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.packageDescription ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Electronics, Documents, etc."
                />
                {errors.packageDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.packageDescription}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  name="packageWeight"
                  value={formData.packageWeight}
                  onChange={handleChange}
                  step="0.1"
                  min="0.1"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.packageWeight ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="2.5"
                />
                {errors.packageWeight && (
                  <p className="mt-1 text-sm text-red-600">{errors.packageWeight}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Declared Value (LKR) *
                </label>
                <input
                  type="number"
                  name="packageValue"
                  value={formData.packageValue}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.packageValue ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="50000"
                />
                {errors.packageValue && (
                  <p className="mt-1 text-sm text-red-600">{errors.packageValue}</p>
                )}
              </div>
            </div>
          </div>

          {/* Cost Estimation */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Cost Estimation</h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Rate ({formData.serviceType}):</span>
                <span className="font-medium">
                  {formData.packageWeight ? 
                    `LKR ${(parseFloat(formData.packageWeight || 0) * (formData.serviceType === 'same-day' ? 1200 : formData.serviceType === 'express' ? 800 : 350)).toFixed(2)}` : 
                    'LKR 0.00'}
                </span>
              </div>
              {formData.urgency !== 'normal' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority Surcharge:</span>
                  <span className="font-medium text-orange-600">
                    +{formData.urgency === 'urgent' ? '50%' : '25%'}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-medium text-gray-900">Estimated Total:</span>
                <span className="font-bold text-blue-600">
                  {formData.packageWeight ? 
                    `LKR ${(parseFloat(formData.packageWeight || 0) * (formData.serviceType === 'same-day' ? 1200 : formData.serviceType === 'express' ? 800 : 350) * (formData.urgency === 'urgent' ? 1.5 : formData.urgency === 'high' ? 1.25 : 1)).toFixed(2)}` : 
                    'LKR 0.00'}
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Creating Order...</span>
                </div>
              ) : (
                'Create Order'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;