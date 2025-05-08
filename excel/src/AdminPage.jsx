/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
    Bell,
    Settings,
    Search,
    ChevronDown,
    Menu,
    X,
    Home,
    BarChart3,
    LayoutDashboard,
    CreditCard,
    PieChart,
    UserCircle,
    FileText,
    Wallet,
    LineChart
} from "lucide-react";
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar
} from "recharts";

// Sample data for charts
const lineChartData = [
    { name: "Jan", daily: 1400, weekly: 2400, monthly: 2400 },
    { name: "Feb", daily: 1100, weekly: 1398, monthly: 2210 },
    { name: "Mar", daily: 1200, weekly: 9800, monthly: 2290 },
    { name: "Apr", daily: 1700, weekly: 3908, monthly: 2000 },
    { name: "May", daily: 2100, weekly: 4800, monthly: 2181 },
    { name: "Jun", daily: 2200, weekly: 3800, monthly: 2500 },
    { name: "Jul", daily: 2500, weekly: 4300, monthly: 2100 },
];

const barChartData = [
    { name: "Jan", revenue: 4500, profit: 2400 },
    { name: "Feb", revenue: 3800, profit: 1398 },
    { name: "Mar", revenue: 5000, profit: 2800 },
    { name: "Apr", revenue: 4000, profit: 2908 },
    { name: "May", revenue: 6000, profit: 3800 },
    { name: "Jun", revenue: 5000, profit: 3300 },
];

const tableData = [
    { name: "Marketplace", status: "Approved", date: "24 Jan 2022", progress: 75 },
    { name: "Venus DB PRO", status: "Declined", date: "30 Dec 2021", progress: 30 },
    { name: "Venus DS", status: "Approved", date: "12 Jul 2021", progress: 90 },
    { name: "Venus 3D Asset", status: "Pending", date: "20 May 2021", progress: 50 },
    { name: "Marketplace", status: "Approved", date: "12 Apr 2021", progress: 80 },
];

const complexTableData = [
    {
        name: "Horizon UI PRO",
        status: "Approved",
        date: "18 Apr 2022",
        progress: 75,
        quantity: 2458,
        revenue: "$14,000"
    },
    {
        name: "Horizon UI Free",
        status: "Disabled",
        date: "10 Mar 2022",
        progress: 25,
        quantity: 1485,
        revenue: "$4,800"
    },
    {
        name: "Venus Pro",
        status: "Error",
        date: "20 May 2021",
        progress: 90,
        quantity: 1024,
        revenue: "$40,500"
    },
    {
        name: "Venus DB PRO",
        status: "Approved",
        date: "12 Jul 2021",
        progress: 50,
        quantity: 858,
        revenue: "$21,000"
    },
];

const AdminPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState("dashboard");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const getBadgeColor = () => {
            switch (status.toLowerCase()) {
                case "approved":
                    return "bg-green-100 text-green-800";
                case "pending":
                    return "bg-yellow-100 text-yellow-800";
                case "declined":
                case "error":
                    return "bg-red-100 text-red-800";
                case "disabled":
                    return "bg-gray-100 text-gray-800";
                default:
                    return "bg-blue-100 text-blue-800";
            }
        };

        return (
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getBadgeColor()}`}>
                {status}
            </span>
        );
    };

    // Progress bar component
    const ProgressBar = ({ progress }) => {
        const getProgressColor = () => {
            if (progress >= 75) return "bg-green-500";
            if (progress >= 50) return "bg-blue-500";
            if (progress >= 25) return "bg-yellow-500";
            return "bg-red-500";
        };

        return (
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full ${getProgressColor()}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        );
    };

    // Render content based on current page
    const renderContent = () => {
        switch (currentPage) {
            case "dashboard":
                return <DashboardPage />;
            case "tables":
                return <TablesPage />;
            case "profile":
                return <ProfilePage />;
            default:
                return <DashboardPage />;
        }
    };

    // Dashboard page component
    const DashboardPage = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
            {/* Stats Cards */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-gray-500 text-sm">Today's Money</p>
                        <h4 className="text-2xl font-bold">$53,000</h4>
                        <p className="text-green-500 text-sm font-medium flex items-center">
                            +55% <span className="text-gray-500 ml-1">since last month</span>
                        </p>
                    </div>
                    <div className="bg-blue-500 p-3 rounded-full">
                        <Wallet className="text-white" size={20} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-gray-500 text-sm">Today's Users</p>
                        <h4 className="text-2xl font-bold">2,300</h4>
                        <p className="text-green-500 text-sm font-medium flex items-center">
                            +5% <span className="text-gray-500 ml-1">since last month</span>
                        </p>
                    </div>
                    <div className="bg-green-500 p-3 rounded-full">
                        <UserCircle className="text-white" size={20} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-gray-500 text-sm">New Clients</p>
                        <h4 className="text-2xl font-bold">+3,052</h4>
                        <p className="text-red-500 text-sm font-medium flex items-center">
                            -14% <span className="text-gray-500 ml-1">since last month</span>
                        </p>
                    </div>
                    <div className="bg-orange-500 p-3 rounded-full">
                        <FileText className="text-white" size={20} />
                    </div>
                </div>
            </div>

            {/* Line Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm col-span-1 md:col-span-2">
                <div className="mb-4">
                    <h4 className="text-lg font-bold">Sales Overview</h4>
                    <p className="text-gray-500 text-sm">
                        <span className="text-green-500 font-medium">+5% more</span> in 2023
                    </p>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                            data={lineChartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="monthly"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                            />
                            <Line type="monotone" dataKey="weekly" stroke="#82ca9d" />
                        </RechartsLineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="mb-4">
                    <h4 className="text-lg font-bold">Revenue</h4>
                    <p className="text-gray-500 text-sm">Monthly report</p>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="#8884d8" />
                            <Bar dataKey="profit" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Projects Table */}
            <div className="bg-white p-6 rounded-xl shadow-sm col-span-1 md:col-span-3">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold">Projects</h4>
                    <button className="text-blue-500 text-sm font-medium">See all</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="text-gray-500 text-sm">
                                <th className="px-4 py-2 text-left font-medium">NAME</th>
                                <th className="px-4 py-2 text-left font-medium">STATUS</th>
                                <th className="px-4 py-2 text-left font-medium">DATE</th>
                                <th className="px-4 py-2 text-left font-medium">PROGRESS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((item, index) => (
                                <tr key={index} className="border-t border-gray-100">
                                    <td className="px-4 py-4">{item.name}</td>
                                    <td className="px-4 py-4">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500">{item.date}</td>
                                    <td className="px-4 py-4 w-56">
                                        <div className="flex items-center">
                                            <div className="w-full mr-2">
                                                <ProgressBar progress={item.progress} />
                                            </div>
                                            <span className="text-xs font-medium">{item.progress}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // Tables page component
    const TablesPage = () => (
        <div className="grid grid-cols-1 gap-5 mb-5">
            {/* Simple Table */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold">Authors Table</h4>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm">Export</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="text-gray-500 text-sm">
                                <th className="px-4 py-2 text-left font-medium">NAME</th>
                                <th className="px-4 py-2 text-left font-medium">STATUS</th>
                                <th className="px-4 py-2 text-left font-medium">DATE</th>
                                <th className="px-4 py-2 text-left font-medium">PROGRESS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((item, index) => (
                                <tr key={index} className="border-t border-gray-100">
                                    <td className="px-4 py-4">{item.name}</td>
                                    <td className="px-4 py-4">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500">{item.date}</td>
                                    <td className="px-4 py-4 w-56">
                                        <div className="flex items-center">
                                            <div className="w-full mr-2">
                                                <ProgressBar progress={item.progress} />
                                            </div>
                                            <span className="text-xs font-medium">{item.progress}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Complex Table */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold">Complex Table</h4>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm">Export</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="text-gray-500 text-sm">
                                <th className="px-4 py-2 text-left font-medium">NAME</th>
                                <th className="px-4 py-2 text-left font-medium">STATUS</th>
                                <th className="px-4 py-2 text-left font-medium">DATE</th>
                                <th className="px-4 py-2 text-left font-medium">PROGRESS</th>
                                <th className="px-4 py-2 text-left font-medium">QUANTITY</th>
                                <th className="px-4 py-2 text-left font-medium">REVENUE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complexTableData.map((item, index) => (
                                <tr key={index} className="border-t border-gray-100">
                                    <td className="px-4 py-4">{item.name}</td>
                                    <td className="px-4 py-4">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500">{item.date}</td>
                                    <td className="px-4 py-4 w-56">
                                        <div className="flex items-center">
                                            <div className="w-full mr-2">
                                                <ProgressBar progress={item.progress} />
                                            </div>
                                            <span className="text-xs font-medium">{item.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">{item.quantity}</td>
                                    <td className="px-4 py-4">{item.revenue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // Profile page component
    const ProfilePage = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            {/* Profile Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                    <h4 className="text-xl font-bold">Adela Parkson</h4>
                    <p className="text-gray-500">Product Designer</p>
                    <div className="flex space-x-2 mt-4">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm">Follow</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm">Message</button>
                    </div>
                </div>
                <div className="mt-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-2 rounded-full mr-4">
                            <UserCircle className="text-blue-500" size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Education</p>
                            <p className="text-gray-500 text-sm">Stanford University</p>
                        </div>
                    </div>
                    <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-2 rounded-full mr-4">
                            <Wallet className="text-blue-500" size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Work</p>
                            <p className="text-gray-500 text-sm">Product Designer at Horizon UI</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-4">
                            <Home className="text-blue-500" size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Location</p>
                            <p className="text-gray-500 text-sm">San Francisco, USA</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Stats */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-bold mb-4">Profile Information</h4>
                <p className="text-gray-500 text-sm mb-6">
                    Hi, I'm Adela Parkson, Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium">Full Name:</p>
                        <p className="text-gray-500 text-sm">Adela Parkson</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Mobile:</p>
                        <p className="text-gray-500 text-sm">(44) 123 1234 123</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Email:</p>
                        <p className="text-gray-500 text-sm">adela@horizon.com</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Location:</p>
                        <p className="text-gray-500 text-sm">USA</p>
                    </div>
                </div>
            </div>

            {/* Platform Settings */}
            <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-3">
                <h4 className="text-lg font-bold mb-4">Platform Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h5 className="text-md font-medium mb-4">Account</h5>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <input type="checkbox" className="mr-3" defaultChecked />
                                <span className="text-sm">Email me when someone follows me</span>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" className="mr-3" />
                                <span className="text-sm">Email me when someone answers on my post</span>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" className="mr-3" defaultChecked />
                                <span className="text-sm">Email me when someone mentions me</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h5 className="text-md font-medium mb-4">Application</h5>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <input type="checkbox" className="mr-3" defaultChecked />
                                <span className="text-sm">New launches and projects</span>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" className="mr-3" />
                                <span className="text-sm">Monthly product updates</span>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" className="mr-3" />
                                <span className="text-sm">Subscribe to newsletter</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } fixed z-10 md:relative md:translate-x-0 transition-transform duration-300 h-full bg-white shadow-md w-64 overflow-y-auto`}
            >
                <div className="px-6 py-4 flex items-center border-b border-gray-100">
                    <h1 className="text-xl font-bold text-blue-500">HORIZON UI</h1>
                    <button
                        className="md:hidden ml-auto"
                        onClick={toggleSidebar}
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="px-4 py-2">
                    <ul className="space-y-1">
                        <li>
                            <button
                                onClick={() => setCurrentPage("dashboard")}
                                className={`w-full flex items-center px-4 py-2 rounded-lg ${currentPage === "dashboard"
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <LayoutDashboard size={18} className="mr-3" />
                                Dashboard
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage("tables")}
                                className={`w-full flex items-center px-4 py-2 rounded-lg ${currentPage === "tables"
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <BarChart3 size={18} className="mr-3" />
                                Tables
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage("profile")}
                                className={`w-full flex items-center px-4 py-2 rounded-lg ${currentPage === "profile"
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <UserCircle size={18} className="mr-3" />
                                Profile
                            </button>
                        </li>
                        <li>
                            <button
                                className="w-full flex items-center px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                            >
                                <CreditCard size={18} className="mr-3" />
                                Billing
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between h-16 px-4 md:px-6">
                        <div className="flex items-center">
                            <button
                                className="mr-4 block md:hidden"
                                onClick={toggleSidebar}
                            >
                                <Menu size={24} />
                            </button>
                            <div className="flex items-center">
                                <ol className="flex text-sm">
                                    <li className="flex items-center">
                                        <Home size={16} className="text-gray-500" />
                                        <span className="mx-2 text-gray-500">/</span>
                                    </li>
                                    <li className="text-gray-500 capitalize">{currentPage}</li>
                                </ol>
                                <h2 className="text-lg font-bold ml-4 capitalize">
                                    {currentPage}
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="relative mr-4">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={16} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                    <Bell size={20} />
                                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                                </button>
                                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                    <Settings size={20} />
                                </button>
                                <div className="flex items-center cursor-pointer">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                    <button className="ml-2 flex items-center">
                                        <span className="text-sm font-medium hidden md:block">Adela Parkson</span>
                                        <ChevronDown size={16} className="ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminPage;