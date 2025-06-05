import { Cog6ToothIcon } from "@heroicons/react/24/solid";

const ConfigTool = ({ onClick, isConfiguratorOpen = false }) => {
    return (
        <button
            onClick={onClick}
            className={` bottom-8 z-50 group relative overflow-hidden w-16 h-16 flex items-center justify-center transition-all duration-500 ease-out rounded-full ${isConfiguratorOpen ? 'right-[25rem]' : 'right-8'
                }`}
            style={{
                position: 'fixed',
                bottom: '2rem',
                zIndex: 9999
            }}
            aria-label="Open Dashboard Configurator"
        >
            {/* Main Button */}
            <div className="w-full h-full bg-white/90 backdrop-blur-sm rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 border border-gray-200/50 group-hover:bg-white flex items-center justify-center">
                <Cog6ToothIcon className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-all duration-300 group-hover:rotate-90" />
            </div>

            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full bg-blue-500/20 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out opacity-0 group-hover:opacity-100 pointer-events-none"></div>

            {/* Floating Animation */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse pointer-events-none"></div>

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                <span>Customize Dashboard</span>
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
            </div>
        </button>
    );
};

export default ConfigTool;