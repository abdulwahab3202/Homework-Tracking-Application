import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          <Link
            to="/"
            className="text-xl md:text-2xl font-extrabold tracking-wide hover:opacity-90 transition"
          >
            Homework Tracker
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
                  {user.username} · {user.role}
                </span>

                <Link
                  to="/dashboard"
                  className="hover:text-gray-200 transition font-medium"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full font-semibold transition shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-gray-200 transition font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-full font-semibold transition shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition"
            >
              {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gradient-to-b from-indigo-700 to-purple-700 px-6 py-4 space-y-4 shadow-xl">
          {user ? (
            <>
              <div className="text-sm bg-white/10 px-4 py-2 rounded-full text-center">
                {user.username} · {user.role}
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block text-center font-medium hover:text-gray-200 transition"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-full font-semibold shadow-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-center font-medium hover:text-gray-200 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block bg-green-500 hover:bg-green-600 py-2 rounded-full font-semibold text-center shadow-md transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;