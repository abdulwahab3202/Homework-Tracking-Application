import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading application...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" style={{overflowY: 'scroll',scrollbarWidth: 'none',msOverflowStyle: 'none',}}>
      <style>
        {`
          /* Hide scrollbar for Chrome, Safari, and Edge */
          ::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      <Navbar />
      <main className="flex-grow p-4">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student-dashboard" element={<StudentDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
            <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
          </Route>

          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="*" element={<h1 className="text-center text-red-500 text-2xl mt-10">404 - Page Not Found</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
