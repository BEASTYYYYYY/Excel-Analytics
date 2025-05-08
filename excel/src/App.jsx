import { Routes, Route, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "./context/themeProvider";
import store from "./redux/store";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard.jsx";
import LandingPage from "./components/LandingPage";
import AboutPage from "./components/AboutPage.jsx";
import ContactPage from "./components/ContactPage.jsx";
import AdminPage from "./AdminPage.jsx";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { setUser, logout } from "./redux/authSlice";
import '../chartConfig.js';
import Loading from "./components/Loading";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGd9lEUBaCB4yNGCF7IyNAlg23DgAZt6c",
  authDomain: "excelwiz-dad69.firebaseapp.com",
  projectId: "excelwiz-dad69",
  storageBucket: "excelwiz-dad69.firebasestorage.app",
  messagingSenderId: "1058594841348",
  appId: "1:1058594841348:web:12b7663264c568bc3e6651"
};

// Initialize Firebase
initializeApp(firebaseConfig);

function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.auth.user);
  const isAuthenticated = !!user;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
        }));
      } else {
        dispatch(logout());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Wait until authentication state is determined
  if (loading) {
    return <Loading />;
  }

  return (
    <ThemeProvider>
      <div className="font-sans min-h-screen flex flex-col bg-[rgb(var(--bg-primary))] text-[rgb(var(--text-primary))]">
        <main className="flex-grow">
          <Routes>
            {/* Public route - Landing page visible to all */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <LandingPage />
                </>
              }
            />

            {/* Auth routes - redirect to dashboard if already logged in */}
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
              }
            />

            <Route
              path="/register"
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
              }
            />

            {/* Protected routes - require authentication */}
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <>
                    <Navbar />
                    <Dashboard />
                  </>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/about"
              element={
                isAuthenticated ? (
                  <>
                    <Navbar />
                    <AboutPage />
                  </>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/contact"
              element={
                isAuthenticated ? (
                  <>
                    <Navbar />
                    <ContactPage />
                  </>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/admin"
              element={
                isAuthenticated ? (
                  <AdminPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default AppWrapper;