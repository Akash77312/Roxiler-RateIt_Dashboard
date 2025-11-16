import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function getDashboardLink(user) {
  if (!user) return "/";
  switch (user.role) {
    case "ADMIN":
      return "/admin";
    case "OWNER":
      return "/owner";
    case "USER":
      return "/dashboard";
    default:
      return "/";
  }
}

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={getDashboardLink(user)} className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              Roxiler-RateIt
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <Link to={getDashboardLink(user)} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                <Link to="/profile" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
                <button onClick={handleLogout} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium">
                  Logout
                </button>
              </>
            )}
            {!user && (
              <>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
