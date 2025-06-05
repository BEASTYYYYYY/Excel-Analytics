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
import Playground from "../components/Playground";
import Insight from "../components/Insight";
import AdminRoutes from "./AdminRoutes";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import AccessBlocked from "../../AccessBlocked.jsx";
import AuthRedirect from '../components/AuthRedirect.jsx';

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
            <Route path="/blocked" element={<AccessBlocked />} />
            <Route path="/auth-redirect" element={<AuthRedirect />} />
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
            />
            <Route
                path="/dashboard"
                element={isAuthenticated ? <ProtectedRoute><Dashboard /></ProtectedRoute>  : <Navigate to="/login" replace />}
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
            
            <Route path="/admin/*" element={<ProtectedAdminRoute><AdminRoutes /></ProtectedAdminRoute>} />
            <Route
                path="*"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />}
            />
        </Routes>
    );
};

export default AppRoutes;