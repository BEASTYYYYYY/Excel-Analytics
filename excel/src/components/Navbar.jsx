import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  BellIcon,
} from "@heroicons/react/24/solid";

const Navbar = ({ isStickyEnabled }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", icon: HomeIcon, label: "Home" },
    { to: "/profile", icon: UserCircleIcon, label: "profile" },
    { to: "/UploadHistory", icon: TableCellsIcon, label: "History" },
    { to: "/playground", icon: BellIcon, label: "Playground" },
  ];

  const getCurrentPageLabel = () => {
    const item = navItems.find(({ to }) => location.pathname.startsWith(to));
    return item ? item.label : "Home";
  };

  const breadcrumbItems = ["Dashboard", getCurrentPageLabel()].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    console.log("Search query:", searchQuery);
  };

  const stickyStyles = isStickyEnabled
    ? "sticky top-4 z-50 backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 bg-white/80 shadow-md border border-gray-200 rounded-xl"
    : "bg-transparent";

  return (
    <header className={`ml-[21rem] mr-9 mt-4 px-4 py-3 transition-all duration-500 ease-in-out ${stickyStyles}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <nav className="text-sm text-gray-500 flex items-center gap-2 capitalize">
            {breadcrumbItems.map((crumb, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-1">/</span>}
                <span className={i === breadcrumbItems.length - 1 ? "text-black font-semibold" : ""}>{crumb}</span>
              </span>
            ))}
          </nav>
          <h2 className="text-lg font-semibold text-gray-900 mt-1 capitalize">
            {getCurrentPageLabel()}
          </h2>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-700"
              aria-label="Search"
            >
              🔍
            </button>
          </form>

          <nav className="hidden md:flex gap-2">
            {navItems.map(({ to }) => (
              <NavLink
                key={to}
                to={to}
                ></NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
