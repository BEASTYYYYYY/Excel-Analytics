/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const colorOptions = [
  { from: "from-gray-800", to: "to-gray-700", border: "border-black" },
  { from: "from-gray-100", to: "to-gray-100", border: "border-gray-200" },
  { from: "from-green-400", to: "to-green-600", border: "border-transparent" },
  { from: "from-orange-400", to: "to-orange-600", border: "border-transparent" },
  { from: "from-red-400", to: "to-red-600", border: "border-transparent" },
  { from: "from-pink-400", to: "to-pink-600", border: "border-transparent" },
];

const typeOptions = [
  { label: "Dark", className: "bg-gradient-to-tr from-[#1f1f1f] to-[#3a3a3a] text-white" },
  { label: "Transparent", className: "bg-transparent text-gray-900" },
  { label: "White", className: "bg-white text-gray-900" },
];

const DashboardConfigurator = ({
  onColorChange,
  onTypeChange,
  activeColorProp,
  activeTypeProp,
  isStickyEnabled,
  onStickyToggle,
  isOpen,
  onClose,
}) => {
  const activeColor = activeColorProp || {};
  const activeType = activeTypeProp || {};
  const configuratorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (configuratorRef.current && !configuratorRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Configurator Panel */}
      <aside
        ref={configuratorRef}
        className={`fixed top-0 right-0 z-50 h-screen w-96 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-all duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        style={{
          boxShadow: '-10px 0 50px -12px rgba(0, 0, 0, 0.25)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200/20 bg-white/80 backdrop-blur-sm">
          <div>
            <h5 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
              Dashboard Configurator
            </h5>
            <p className="text-sm text-gray-600 mt-1">Customize your dashboard appearance</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
            aria-label="Close Configurator"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="py-6 px-6 overflow-y-auto h-full">
          {/* Sidebar Colors Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h6 className="text-base font-semibold text-gray-900">Sidebar Colors</h6>
              <div className="w-8 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Choose your preferred sidebar color scheme</p>

            <div className="grid grid-cols-3 gap-3">
              {colorOptions.map((color, index) => (
                <button
                  key={index}
                  onClick={() => onColorChange(color)}
                  className={`relative h-12 w-full cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg bg-gradient-to-br ${color.from} ${color.to} ${activeColor.from === color.from && activeColor.to === color.to
                      ? "ring-2 ring-blue-500 ring-offset-2 border-blue-500"
                      : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {activeColor.from === color.from && activeColor.to === color.to && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Types Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h6 className="text-base font-semibold text-gray-900">Sidebar Types</h6>
              <div className="w-8 h-[2px] bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Select between different sidebar styles</p>

            <div className="space-y-3">
              {typeOptions.map((type) => (
                <button
                  key={type.label}
                  onClick={() => onTypeChange(type)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${activeType.label === type.label
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-offset-1"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{type.label}</span>
                      <p className="text-xs text-gray-500 mt-1">
                        {type.label === "Dark" && "Dark theme with gradients"}
                        {type.label === "Transparent" && "Transparent background"}
                        {type.label === "White" && "Clean white background"}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${activeType.label === type.label
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                      }`}>
                      {activeType.label === type.label && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200/50 my-6"></div>

          {/* Navbar Fixed Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h6 className="text-base font-semibold text-gray-900">Navbar Settings</h6>
              <div className="w-8 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">Fixed Navbar</span>
                  <p className="text-xs text-gray-600 mt-1">Keep navbar always visible</p>
                </div>

                {/* Enhanced Toggle Switch */}
                <div className="relative">
                  <input
                    id="navbar-fixed"
                    type="checkbox"
                    className="sr-only"
                    checked={isStickyEnabled}
                    onChange={onStickyToggle}
                  />
                  <label
                    htmlFor="navbar-fixed"
                    className={`relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isStickyEnabled ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition duration-200 ease-in-out ${isStickyEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200/50 pt-6 mt-8">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Made with ❤️ for better user experience
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardConfigurator;
export { colorOptions, typeOptions };