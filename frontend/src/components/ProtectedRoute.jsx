import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
        <div className="bg-white rounded-2xl shadow-lg px-8 py-6 text-center">
          <div className="text-lg sm:text-xl font-semibold text-gray-700">
            Loading authentication...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-red-200 px-4">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-6 text-center max-w-md">
          <h1 className="text-xl sm:text-2xl font-extrabold text-red-700 mb-2">
            Access Denied
          </h1>
          <p className="text-sm sm:text-base text-red-600">
            You are not authorized to view this page
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;