// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../components/Login";
import Register from "../components/Register";
import Dashboard from "../components/Dashboard.jsx";
import LandingPage from "../components/LandingPage";
import HistoryPage from "../components/HistoryPage.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import ProfilePage from "../components/ProfilePage.jsx";
import Settings from "../components/Settings.jsx";
import Support from "../components/Support.jsx";
import Playground from "../components/Playground";
import Insight from "../components/Insight";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => {
    const user = useSelector(state => state.auth.user);
    const isAuthenticated = !!user;

    return (
        <Routes>
            {/* Landing Page - only for non-authenticated users */}
            <Route
                path="/"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
            />

            {/* Auth Routes */}
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
            />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
            />
            <Route
                path="/insight/:fileId"
                element={isAuthenticated ? <Insight /> : <Navigate to="/login" replace />}
            />
            <Route
                path="/uploadhistory"
                element={isAuthenticated ? <HistoryPage /> : <Navigate to="/login" replace />}
            />
            <Route
                path="/playground"
                element={isAuthenticated ? <Playground /> : <Navigate to="/login" replace />}
            />
            <Route
                path="/profile"
                element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
            />
            <Route
                path="/settings"
                element={<ProtectedRoute><Settings /></ProtectedRoute>}
            />
            <Route
                path="/support"
                element={<ProtectedRoute><Support /></ProtectedRoute>}
            />

            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Fallback - redirect to appropriate page based on auth status */}
            <Route
                path="*"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />}
            />
        </Routes>
    );
};

export default AppRoutes;