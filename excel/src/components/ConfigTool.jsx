// ConfigToggleButton.jsx
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

const ConfigTool = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-50 bg-white p-3 rounded-full shadow-md hover:shadow-lg transition"
        >
            <Cog6ToothIcon className="w-6 h-6 text-gray-800" />
        </button>
    );
};

export default ConfigTool;
