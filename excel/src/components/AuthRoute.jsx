import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

const AuthRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoading(false); // Authenticated
            } else {
                setLoading(false);
                navigate('/login'); // Not authenticated → redirect
            }
        });

        return () => unsubscribe(); // Clean up listener
    }, [auth, navigate]);

    if (loading) {
        return <Loading></Loading>; // JSX is valid here, not in backend
    }

    return <>{children}</>;
};

export default AuthRoute;
