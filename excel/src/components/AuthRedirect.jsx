import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const AuthRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkRole = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) return navigate('/login');

                const token = await user.getIdToken();

                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    return navigate('/dashboard');
                }

                const data = await res.json();
                const role = data.user?.role;

                if (role === 'superadmin') navigate('/admin/dashboard');
                else if (role === 'admin') navigate('/admin-key-entry');
                else navigate('/dashboard');

            } catch (err) {
                console.error('Redirect error:', err);
                navigate('/dashboard');
            }
        };

        checkRole();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400">
            Redirecting based on role...
        </div>
    );
};

export default AuthRedirect;
