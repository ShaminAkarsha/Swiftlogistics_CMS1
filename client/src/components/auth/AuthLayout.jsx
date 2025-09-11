import React from 'react';
import { Truck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SwiftTrack</h1>
              <p className="text-blue-600 font-medium">by Swift Logistics</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Streamline Your Delivery Operations
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Manage orders, track deliveries, and grow your business with Sri Lanka's most trusted logistics partner.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="text-center p-4">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
              <p className="font-semibold text-gray-900">Real-time Tracking</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              </div>
              <p className="font-semibold text-gray-900">Island-wide Coverage</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
              </div>
              <p className="font-semibold text-gray-900">24/7 Support</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h3>
              <p className="text-gray-600">
                Sign in to your account
              </p>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;