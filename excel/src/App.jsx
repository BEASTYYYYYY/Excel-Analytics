/* eslint-disable no-unused-vars */
// src/App.jsx
import {  useLocation } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "./context/ThemeProvider";
import store from "./redux/store";
import Navbar from "./components/Navbar";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { setUser, logout } from "./redux/authSlice";
import '../chartConfig.js';
import Loading from "./components/Loading";
import Sidebar from "./components/Sidebar";
import DashboardConfigurator from "./components/Configurator";
import { colorOptions, typeOptions } from "./components/Configurator";
import ConfigTool from "./components/ConfigTool";
import AppRoutes from "./routes/AppRoutes";
import axios from "axios";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

initializeApp(firebaseConfig);

function AppWrapper() {
  return <Provider store={store}><App /></Provider>;
}

function App() {
  const [isSticky, setIsSticky] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.auth.user);
  const isAuthenticated = !!user;

  // Enhanced state management for configurator
  const [configOpen, setConfigOpen] = useState(false);

  // Initialize active color from localStorage or default
  const [activeColor, setActiveColor] = useState(() => {
    const stored = localStorage.getItem("sidebarColor");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Error parsing stored sidebar color:", error);
      }
    }
    return colorOptions[0]; // Default to first color option
  });

  // Initialize active type from localStorage or default
  const [activeType, setActiveType] = useState(() => {
    const stored = localStorage.getItem("sidebarType");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Error parsing stored sidebar type:", error);
      }
    }
    return typeOptions[2]; // Default to "White" type
  });

  // Generate activeColorClass for backward compatibility
  const activeColorClass = `${activeColor.from} ${activeColor.to}`;
  const sidebarStyle = activeType.className;

  const handleColorChange = (newColor) => {
    setActiveColor(newColor);
    localStorage.setItem("sidebarColor", JSON.stringify(newColor));
  };

  const handleTypeChange = (newType) => {
    setActiveType(newType);
    localStorage.setItem("sidebarType", JSON.stringify(newType));
  };

  const handleConfiguratorOpen = () => {
    setConfigOpen(true);
  };

  const handleConfiguratorClose = () => {
    setConfigOpen(false);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const res = await axios.get("/api/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data && res.data.user) {
            dispatch(setUser({
              ...res.data.user,
              displayName: firebaseUser.displayName || res.data.user.name || "",
              photoURL: firebaseUser.photoURL || res.data.user.photo || "",
              email: firebaseUser.email,
              uid: firebaseUser.uid
            }));
          } else {
            // fallback to firebase only
            dispatch(setUser({
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              uid: firebaseUser.uid
            }));
          }
        } catch (err) {
          // fallback to firebase only
          dispatch(setUser({
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            uid: firebaseUser.uid
          }));
        }
      } else {
        dispatch(logout());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [dispatch]);

  // Routes where sidebar and navbar should be hidden
  const hideSidebarRoutes = ["/login", "/register", "/blocked"];
  const isAdminRoute = location.pathname.startsWith('/admin');
  const userIsBlocked = user?.isActive === false;
  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname) && !isAdminRoute && !userIsBlocked;

  // Handle ESC key to close configurator
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && configOpen) {
        handleConfiguratorClose();
      }
    };

    if (configOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [configOpen]);

  if (loading) return <Loading />;

  return (
    <ThemeProvider>
      <div className="font-sans min-h-screen flex flex-col bg-gray-50">
        {/* Show sidebar and navbar only for non-admin routes */}
        {shouldShowSidebar && isAuthenticated && (
          <>
            <Sidebar
              activeColorClass={activeColorClass}
              sidebarStyle={sidebarStyle}
            />
            <Navbar isStickyEnabled={isSticky} />

            {/* Config Tool Button - Now receives configurator state */}
            <ConfigTool
              onClick={handleConfiguratorOpen}
              isConfiguratorOpen={configOpen}
            />

            {/* Dashboard Configurator */}
            <DashboardConfigurator
              onColorChange={handleColorChange}
              onTypeChange={handleTypeChange}
              activeColorProp={activeColor}
              activeTypeProp={activeType}
              isStickyEnabled={isSticky}
              onStickyToggle={() => setIsSticky((prev) => !prev)}
              isOpen={configOpen}
              onClose={handleConfiguratorClose}
            />
          </>
        )}

        <main className={`flex-grow ${shouldShowSidebar && isAuthenticated ? 'xl:ml-80' : 'w-full'}`}>
          <AppRoutes />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default AppWrapper;