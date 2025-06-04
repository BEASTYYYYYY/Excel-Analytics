// src/App.jsx
import { Route, Routes, useLocation } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "./context/themeProvider";
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

  // Routes where sidebar and navbar should be hidden
  const hideSidebarRoutes = ["/login", "/register", "/blocked"];
  const isAdminRoute = location.pathname.startsWith('/admin');
  const userIsBlocked = user?.isActive === false;
  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname) && !isAdminRoute && !userIsBlocked;

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
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const token = await getAuth().currentUser?.getIdToken();
  //       const res = await fetch("/api/profile", {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       const data = await res.json();
  //       setUser(data.user);
  //     } catch (e) {
  //       setUser(null);
  //     }
  //   };
  //   fetchProfile();
  // }, []);
  if (loading) return <Loading />;

  return (
    <ThemeProvider>

      <div className="font-sans min-h-screen flex flex-col">
        {/* Show sidebar and navbar only for non-admin routes */}
        {shouldShowSidebar && isAuthenticated && (
          <>
            <Sidebar activeColorClass={activeColorClass} sidebarStyle={sidebarStyle} />
            <Navbar isStickyEnabled={isSticky} />
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
        <main className={`flex-grow ${shouldShowSidebar && isAuthenticated ? '' : 'w-full'}`}>
          <AppRoutes />
        </main>
      </div>

    </ThemeProvider>
  );
}

export default AppWrapper;