import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/StudentDashboard';
import FacultyDashboard from '../components/FacultyDashboard';

function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="bg-white rounded-2xl shadow-lg px-8 py-6 text-center">
          <span className="text-lg sm:text-xl font-medium text-gray-700">
            Loading user dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-6 text-center max-w-md">
          <h1 className="text-xl sm:text-2xl font-extrabold text-red-600 mb-2">
            Access Required
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Please log in to view the dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4">
      {user.role === 'student' ? <StudentDashboard /> : <FacultyDashboard />}
    </div>
  );
}

export default Dashboard;