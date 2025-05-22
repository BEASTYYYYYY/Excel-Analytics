import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "./context/themeProvider";
import store from "./redux/store";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard.jsx";
import LandingPage from "./components/LandingPage";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { setUser, logout } from "./redux/authSlice";
import '../chartConfig.js';
import Loading from "./components/Loading";
import HistoryPage from "./components/HistoryPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import Settings from "./components/Settings.jsx";
import Support from "./components/Support.jsx";
import Playground from "./components/Playground";
import Sidebar from "./components/Sidebar";
import DashboardConfigurator from "./components/Configurator";
import { colorOptions, typeOptions } from "./components/Configurator";
import ConfigTool from "./components/ConfigTool";
import Insight from "./components/Insight";
import AdminDashboard from "../admin/AdminDash";
import UploadStats from "../admin/components/UploadStats";
import AdminSettings from "../admin/components/AdminSettings";

const firebaseConfig = {
  apiKey: "AIzaSyDGd9lEUBaCB4yNGCF7IyNAlg23DgAZt6c",
  authDomain: "excelwiz-dad69.firebaseapp.com",
  projectId: "excelwiz-dad69",
  storageBucket: "excelwiz-dad69.firebasestorage.app",
  messagingSenderId: "1058594841348",
  appId: "1:1058594841348:web:12b7663264c568bc3e6651"
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

  const [activeColorClass, setActiveColorClass] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("sidebarColor"));
    return stored ? `${stored.from} ${stored.to}` : "from-gray-800 to-gray-700";
  });

  const [sidebarStyle, setSidebarStyle] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("sidebarType"));
    return stored ? stored.className : "bg-white text-gray-900";
  });

  const handleColorChange = (newColor) => {
    const fullClass = `${newColor.from} ${newColor.to}`;
    setActiveColorClass(fullClass);
    localStorage.setItem("sidebarColor", JSON.stringify(newColor));
  };

  const handleTypeChange = (newType) => {
    setSidebarStyle(newType.className);
    localStorage.setItem("sidebarType", JSON.stringify(newType));
  };

  const [configOpen, setConfigOpen] = useState(false);
  const hideSidebarRoutes = ["/login", "/register"];
  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(setUser({
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          uid: firebaseUser.uid
        }));
      } else {
        dispatch(logout());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [dispatch]);

  if (loading) return <Loading />;



  return (
    <ThemeProvider>
      <div className="font-sans min-h-screen flex flex-col">
        {shouldShowSidebar && isAuthenticated && (
          <>
            <Sidebar activeColorClass={activeColorClass} sidebarStyle={sidebarStyle} />
            <Navbar isStickyEnabled={isSticky}></Navbar>
            {configOpen && (
              <DashboardConfigurator
                onColorChange={handleColorChange}
                onTypeChange={handleTypeChange}
                activeColorProp={colorOptions.find(c => `${c.from} ${c.to}` === activeColorClass) || colorOptions[0]}
                activeTypeProp={typeOptions.find(t => t.className === sidebarStyle) || typeOptions[0]}
                isStickyEnabled={isSticky}
                onStickyToggle={() => setIsSticky((prev) => !prev)}
              />
            )}
            <ConfigTool onClick={() => setConfigOpen(prev => !prev)} />
          </>
        )}

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<><LandingPage /></>} />
            <Route path="/insight/:fileId" element={<Insight />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/uploadhistory" element={isAuthenticated ? <HistoryPage /> : <Navigate to="/login" replace />} />
            <Route path="/playground" element={isAuthenticated ? <Playground /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
            <Route path="/admin" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" replace />} />
            <Route path="/upload-stats" element={isAuthenticated ? <UploadStats /> : <Navigate to="/login" replace />} />
            <Route path="/admin-settings" element={isAuthenticated ? <AdminSettings /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default AppWrapper;
