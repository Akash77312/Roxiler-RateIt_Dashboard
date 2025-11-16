import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import Header from "./components/common/Header";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Header />

      <main className="p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/"
            element={
              !user ? (
                <Navigate to="/login" />
              ) : user.role === "ADMIN" ? (
                <Navigate to="/admin" />
              ) : user.role === "OWNER" ? (
                <Navigate to="/owner" />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["USER"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner"
            element={
              <ProtectedRoute roles={["OWNER"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["ADMIN", "USER", "OWNER"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}
