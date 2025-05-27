// src/pages/NotAuthorized.jsx
const NotAuthorized = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
                <p className="text-gray-600 dark:text-gray-300">
                    You do not have permission to view this page.
                </p>
                <a href="/" className="text-blue-600 hover:underline">Go Home</a>
            </div>
        </div>
    );
};
export default NotAuthorized;
