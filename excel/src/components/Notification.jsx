import { Check, AlertTriangle, X } from 'lucide-react';

export default function Notification({ notification, onClose }) {
    if (!notification || !notification.message) return null;

    const bgColor = notification.type === 'success'
        ? 'bg-green-100 dark:bg-green-800 border-green-500'
        : 'bg-red-100 dark:bg-red-800 border-red-500';

    const textColor = notification.type === 'success'
        ? 'text-green-700 dark:text-green-200'
        : 'text-red-700 dark:text-red-200';

    const Icon = notification.type === 'success' ? Check : AlertTriangle;

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 ${bgColor} flex items-start max-w-md animate-slideIn`}>
            <Icon className={`h-5 w-5 ${textColor} mr-3 mt-0.5 flex-shrink-0`} />
            <div className="flex-grow">
                <p className={`${textColor} font-medium`}>{notification.message}</p>
            </div>
            <button
                onClick={onClose}
                className="ml-4 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}