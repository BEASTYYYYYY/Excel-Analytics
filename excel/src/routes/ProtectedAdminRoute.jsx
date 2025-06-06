// src/routes/ProtectedAdminRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const ProtectedAdminRoute = ({ children }) => {
    const [authorized, setAuthorized] = useState(null); // null = loading
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const token = await getAuth().currentUser?.getIdToken();
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success && ["admin", "superadmin"].includes(data.user.role) && data.user.isActive !== false) {
                    setAuthorized(true);
                } else {
                    setAuthorized(false);
                }                
            } catch (err) {
                console.error("Admin check failed:", err);
                setAuthorized(false);
            } finally {
                setChecking(false);
            }
        };
        checkAdmin();
    }, []);

    if (checking) {
        return <div className="p-6 text-center">Checking permissions...</div>;
    }
    

    return authorized ? children : <Navigate to="/not-authorized" />;
};

export default ProtectedAdminRoute;
