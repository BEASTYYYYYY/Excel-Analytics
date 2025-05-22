/* eslint-disable react-refresh/only-export-components */
// ✅ FINAL FIXED FILE: Configurator.jsx
import { useEffect, useState } from "react";

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
}) => {
  const activeColor = activeColorProp || {};
  const activeType = activeTypeProp || {};
    const [animationClass, setAnimationClass] = useState("translate-x-full");

    useEffect(() => {
        const enter = setTimeout(() => setAnimationClass("translate-x-0"), 10);
        return () => clearTimeout(enter);
    }, []);

    const handleClose = () => {
        setAnimationClass("translate-x-full");
        setTimeout(() => onclose(), 400);
    };

  return (
      <aside className={`fixed top-0 right-0 z-50 h-screen w-96 bg-white px-2.5 shadow-lg transform transition-transform duration-500 ${animationClass}`}>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>

      <div className="flex items-start justify-between px-6 pt-8 pb-6">
        <div>
            <h5 className="font-sans text-xl font-semibold leading-snug text-gray-900">Dashboard Configurator</h5>
          <p className="text-base text-gray-600">See our dashboard options.</p>
        </div>
          <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-900 transition-colors duration-300 text-3xl font-bold"
              aria-label="Close Configurator"
          >
              &times;
          </button>
      </div>
      <div className="py-4 px-6">
        <div className="mb-12">
          <h6 className="text-base font-semibold text-blue-gray-900">Sidenav Colors</h6>
          <div className="mt-3 flex items-center gap-2">
            {colorOptions.map((color, index) => (
              <span
                key={index}
                onClick={() => onColorChange(color)}
                className={`h-6 w-6 cursor-pointer rounded-full border transition-transform hover:scale-105 bg-gradient-to-br ${color.from} ${color.to} ${color.border} ${
                  activeColor.from === color.from && activeColor.to === color.to
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h6 className="text-base font-semibold text-blue-gray-900">Sidenav Types</h6>
          <p className="text-sm text-gray-700">Choose between 3 different sidenav types.</p>
          <div className="mt-3 flex items-center gap-2">
            {typeOptions.map((type) => (
              <button
                key={type.label}
                onClick={() => onTypeChange(type)}
                className={`text-xs py-3 px-6 rounded-lg uppercase font-bold border ${
                  activeType.label === type.label
                    ? "bg-gradient-to-tr from-gray-900 to-gray-800 text-white"
                    : "border-gray-900 text-gray-900"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
            <hr />
              <div className="flex items-center justify-between py-5">
                  <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900">Navbar Fixed</h6>
                  <div className="inline-flex items-center">
                      <div className="relative inline-block w-8 h-4 cursor-pointer rounded-full">
                          <input
                              id="navbar-fixed"
                              type="checkbox"
                              className="peer appearance-none w-8 h-4 absolute bg-gray-300 rounded-full cursor-pointer transition-colors duration-300 checked:bg-gray-900 peer-checked:border-gray-900 peer-checked:before:bg-gray-900"
                              checked={isStickyEnabled}
                              onChange={onStickyToggle}
                          />
                          <label
                              htmlFor="navbar-fixed"
                              className="bg-white w-5 h-5 border border-blue-gray-100 rounded-full shadow-md absolute top-2/4 -left-1 -translate-y-2/4 peer-checked:translate-x-full transition-all duration-300 cursor-pointer before:content-[''] before:block before:bg-blue-gray-500 before:w-10 before:h-10 before:rounded-full before:absolute before:top-2/4 before:left-2/4 before:-translate-y-2/4 before:-translate-x-2/4 before:transition-opacity before:opacity-0 hover:before:opacity-10 peer-checked:border-gray-900 peer-checked:before:bg-gray-900"
                          >
                              <div
                                  className="inline-block top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 p-5 rounded-full"
                                  style={{ position: "relative", overflow: "hidden" }}
                              ></div>
                          </label>
                      </div>
                  </div>
              </div>
            <hr />
      </div>
    </aside>
  );
};

export default DashboardConfigurator;
export { colorOptions, typeOptions };
