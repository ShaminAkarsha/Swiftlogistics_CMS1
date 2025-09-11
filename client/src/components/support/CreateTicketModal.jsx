import React, { useState } from 'react';
import { X, HelpCircle, AlertTriangle, Wrench, CreditCard, Package } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

const CreateTicketModal = ({ isOpen, onClose }) => {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    category: '',
    priority: 'medium',
    title: '',
    description: '',
    orderNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'delivery-issue', label: 'Delivery Issue', icon: Package, description: 'Problems with delivery or pickup' },
    { id: 'billing', label: 'Billing & Payment', icon: CreditCard, description: 'Invoice or payment related queries' },
    { id: 'technical', label: 'Technical Support', icon: Wrench, description: 'API, integration, or platform issues' },
    { id: 'general', label: 'General Inquiry', icon: HelpCircle, description: 'Other questions or feedback' }
  ];

  const priorities = [
    { id: 'low', label: 'Low', description: 'General inquiry, non-urgent' },
    { id: 'medium', label: 'Medium', description: 'Standard business impact' },
    { id: 'high', label: 'High', description: 'Significant business impact' },
    { id: 'urgent', label: 'Urgent', description: 'Critical issue, immediate attention needed' }
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
    
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const ticketId = `TICKET${Date.now()}`;
    
    addNotification({
      title: 'Support Ticket Created',
      message: `Your ticket ${ticketId} has been submitted. Our team will respond within 24 hours.`,
      type: 'success'
    });
    
    setLoading(false);
    onClose();
    setFormData({
      category: '',
      priority: 'medium',
      title: '',
      description: '',
      orderNumber: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Support Ticket</h2>
            <p className="text-gray-600">Describe your issue and we'll help you resolve it</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Issue Category *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.category === category.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={formData.category === category.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <Icon className={`h-6 w-6 mt-0.5 ${
                        formData.category === category.id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <h3 className={`font-medium ${
                          formData.category === category.id ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {category.label}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority Level
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {priorities.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.label} - {priority.description}
                </option>
              ))}
            </select>
          </div>

          {/* Order Number (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Related Order Number (Optional)
            </label>
            <input
              type="text"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ST2024001"
            />
            <p className="mt-1 text-sm text-gray-500">Include if your issue is related to a specific order</p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Brief description of your issue"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Please provide as much detail as possible about the issue you're experiencing..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Include any error messages, steps to reproduce the issue, or relevant order details
            </p>
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
              className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Creating Ticket...</span>
                </div>
              ) : (
                'Create Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;