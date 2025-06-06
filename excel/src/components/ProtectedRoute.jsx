import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";

const ProtectedRoute = ({ children }) => {
    const [isAllowed, setIsAllowed] = useState(null); // null = loading
    const [checking, setChecking] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const checkAccess = async () => {
            let tries = 0;
            while (!getAuth().currentUser && tries < 20) {
                await new Promise((res) => setTimeout(res, 100));
                tries++;
            }
            const user = getAuth().currentUser;
            if (!user) {
                setIsAllowed(false);
                setChecking(false); // ✅ add this
                return;
            }

            const token = await user.getIdToken();
            for (let i = 0; i < 3; i++) {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.status === 403) {
                        setIsAllowed(false);
                        setChecking(false); // ✅ add this
                        return;
                    }
                    if (!res.ok) {
                        console.warn("Retrying profile fetch:", res.status);
                        await new Promise((res) => setTimeout(res, 1000 * (i + 1)));
                        continue;
                    }
                    const data = await res.json();
                    setIsAllowed(data.user?.isActive !== false);
                    setChecking(false); // ✅ FINAL resolution
                    return;
                } catch (err) {
                    console.warn("Profile check error, retrying:", err.message);
                    await new Promise((res) => setTimeout(res, 1000 * (i + 1)));
                }
            }

            console.warn("Unable to confirm access after retries");
            setIsAllowed(true); // fallback to allow
            setChecking(false); // ✅ must always end loading
        };
        checkAccess();
    }, []);
    
    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400">
                Checking access...
            </div>
        );
    }
    if (!isAllowed && location.pathname !== "/blocked") {
        console.log("Access denied, redirecting to /blocked");
        return <Navigate to="/blocked" replace />;
    }
    if (isAllowed && location.pathname === "/blocked") {
        console.log("Access granted, redirecting to /dashboard");
        return <Navigate to="/dashboard" replace />;
      }
    
    return children;
};
export default ProtectedRoute;
