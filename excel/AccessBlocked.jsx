import { useEffect, useState } from "react";
import { AlertTriangle, Shield, Mail, User, MessageSquare, Clock, Sun, Moon } from "lucide-react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AccessBlocked() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        reason: "",
        message: "",
        urgency: "normal"
    });
    const [submitted, setSubmitted] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const checkIfBlocked = async () => {
            const auth = getAuth();
            let tries = 0;
            while (!auth.currentUser && tries < 20) {
                await new Promise((res) => setTimeout(res, 100));
                tries++;
            }
            if (!auth.currentUser) return;
            const token = await auth.currentUser.getIdToken();
            for (let i = 0; i < 3; i++) {
                try {
                    const res = await fetch("/api/profile", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.status === 403) {
                        console.log("User is blocked, staying on blocked page");
                        return;
                    }
                    if (!res.ok) {
                        console.warn("Retrying profile check (server not ready):", res.status);
                        await new Promise((res) => setTimeout(res, 1000 * (i + 1)));
                        continue;
                    }
                    const data = await res.json();
                    if (data?.user?.isActive) {
                        console.log("User is unblocked, redirecting...");
                        navigate("/dashboard");
                    }
                    return;
                } catch (err) {
                    console.warn("Network/server issue:", err.message);
                    await new Promise((res) => setTimeout(res, 1000 * (i + 1)));
                }
            }
            console.warn("Unable to confirm block status after retries. Staying on page.");
        };

        checkIfBlocked();
    }, []);
    
    const submitRequest = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const token = await auth.currentUser.getIdToken();

        const res = await fetch("/api/users/unblock-request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)

        });

        if (res.ok) setSubmitted(true);
      };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const toggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${isDark ? 'dark bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
            {/* Theme Toggle */}
            <button
                onClick={() => setIsDark(!isDark)}
                className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 backdrop-blur-sm ${isDark
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-black/10 hover:bg-black/20 text-gray-800'
                    }`}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="flex flex-col items-center justify-center min-h-screen p-6">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-5 ${isDark ? 'bg-red-500' : 'bg-red-400'} animate-pulse`}></div>
                    <div className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-5 ${isDark ? 'bg-blue-500' : 'bg-blue-400'} animate-pulse delay-1000`}></div>
                </div>
                {/* Main Content */}
                <div className="relative z-10 max-w-2xl w-full">
                    {/* Header Section */}
                    <div className="text-center mb-8 transform transition-all duration-700 ease-out">
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${isDark ? 'bg-red-500/20' : 'bg-red-500/10'
                            } animate-bounce`}>
                            <Shield className="w-10 h-10 text-red-500" />
                        </div>
                        <h1 className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                            } tracking-tight`}>
                            ACCESS <span className="text-red-500">RESTRICTED</span>
                        </h1>
                        <div className={`flex items-center justify-center gap-2 mb-6 ${isDark ? 'text-amber-400' : 'text-amber-600'
                            }`}>
                            <AlertTriangle size={20} />
                            <span className="font-medium">Security Protocol Activated</span>
                        </div>

                        <p className={`text-lg max-w-md mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            Your account has been temporarily restricted due to unusual activity patterns.
                            We take security seriously to protect your data.
                        </p>
                    </div>
                    {/* Action Button */}
                    {!submitted && (
                        <div className="text-center mb-8">
                            <button
                                onClick={toggleForm}
                                className={`group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${showForm
                                        ? isDark
                                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                                    }`}>
                                <MessageSquare size={20} className="transition-transform group-hover:rotate-12" />
                                {showForm ? "Cancel Request" : "Request Access Restoration"}
                                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>
                    )}
                    {/* Form Section */}
                    <div className={`transition-all duration-500 ease-in-out transform ${showForm ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
                        }`}>
                        {showForm && !submitted && (
                            <div className={`backdrop-blur-xl rounded-3xl border p-8 shadow-2xl ${isDark
                                    ? 'bg-white/5 border-white/10'
                                    : 'bg-white/70 border-white/20'
                                }`}>
                                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Access Restoration Request
                                </h2>
                                <div className="space-y-6">
                                    {/* Name and Email Row */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'
                                                    }`} size={18} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark
                                                            ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                                                            : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500'
                                                        }`}
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'
                                                    }`} size={18} />
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark
                                                            ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                                                            : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500'
                                                        }`}
                                                    placeholder="your.email@example.com"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Reason and Urgency Row */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Reason for Block
                                            </label>
                                            <select
                                                required
                                                value={formData.reason}
                                                onChange={(e) => handleInputChange('reason', e.target.value)}
                                                className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark
                                                        ? 'bg-white/5 border-white/10 text-white'
                                                        : 'bg-white/50 border-gray-200 text-gray-900'
                                                    }`}>
                                                <option className="text-grey" value="" disabled>Select reason</option>
                                                <option className="text-black" value="false-positive">False Positive Detection</option>
                                                <option className="text-black" value="shared-network">Shared Network Issue</option>
                                                <option className="text-black" value="account-compromise">Account Compromise</option>
                                                <option className="text-black" value="system-error">System Error</option>
                                                <option className="text-black" value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Priority Level
                                            </label>
                                            <div className="relative">
                                                <Clock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'
                                                    }`} size={18} />
                                                <select
                                                    value={formData.urgency}
                                                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark
                                                            ? 'bg-white/5 border-white/10 text-white'
                                                            : 'bg-white/50 border-gray-200 text-gray-900'
                                                        }`}>
                                                    <option className="text-black" value="low">Low - 24-48 hours</option>
                                                    <option className="text-black" value="normal">Normal - 12-24 hours</option>
                                                    <option className="text-black" value="high">High - 2-12 hours</option>
                                                    <option className="text-black" value="urgent">Urgent - Within 2 hours</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Message */}
                                    <div className="space-y-2">
                                        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                            Additional Details
                                        </label>
                                        <textarea
                                            required
                                            rows="4"
                                            value={formData.message}
                                            onChange={(e) => handleInputChange('message', e.target.value)}
                                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${isDark
                                                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                                                    : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500'
                                                }`}
                                            placeholder="Please explain why you believe your account was blocked incorrectly. Include any relevant details that might help us resolve this quickly..."
                                        />
                                    </div>
                                    {/* Submit Button */}
                                    <button
                                        type="button"
                                        onClick={submitRequest}
                                        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-green-500/50 shadow-lg hover:shadow-xl">
                                        Submit Access Request
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Success Message */}
                    <div className={`transition-all duration-500 ease-in-out transform ${submitted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                        }`}>
                        {submitted && (
                            <div className={`text-center p-8 backdrop-blur-xl rounded-3xl border ${isDark
                                    ? 'bg-green-500/10 border-green-500/20'
                                    : 'bg-green-500/10 border-green-500/30'
                                }`}>
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                                    <MessageSquare className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Request Submitted Successfully
                                </h3>
                                <p className={`text-lg ${isDark ? 'text-green-400' : 'text-green-600'
                                    }`}>
                                    Our security team will review your request and respond within the specified timeframe.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}