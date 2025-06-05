// src/routes/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminDashboard from "../../admin/AdminDash";
import UploadStats from "../../admin/components/UploadStats";
import AdminSettings from "../../admin/components/AdminSettings";
import RecentUploadsTable from "../../admin/components/RecentUploadsTable";
import AdminLayout from "../../admin/AdminLayout";
import AccessBlocked from "../../AccessBlocked";

const AdminRoutes = () => {
    const user = useSelector(state => state.auth.user);
    const isAuthenticated = !!user;
    const isAdmin = true; 
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }
    return (
        <AdminLayout>
            <Routes>
                <Route path="/blocked" element={<AccessBlocked />} />
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="upload-stats" element={<UploadStats />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="uploads" element={<RecentUploadsTable />} />
                <Route path="*" element={<Navigate to="/admin" replace />}/>
            </Routes>
        </AdminLayout>
    );
};
 
export default AdminRoutes;