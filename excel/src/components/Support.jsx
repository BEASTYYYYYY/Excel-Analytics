import { useState } from "react";
import { useSelector } from "react-redux";
import { QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const Support = () => {
    const { user } = useSelector((state) => state.auth);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ text: "", type: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setSubmitMessage({
                text: "Your support request has been submitted successfully. We'll get back to you soon.",
                type: "success"
            });
            setSubject("");
            setMessage("");
            setIsSubmitting(false);
        }, 1500);
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    Please login to access support
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Support Center
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                    <QuestionMarkCircleIcon className="h-12 w-12 text-blue-500 mb-4" />
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                        FAQs
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Find answers to commonly asked questions
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Browse FAQs
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 text-blue-500 mb-4" />
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                        Live Chat
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Chat with our support team in real-time
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Start Chat
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                    <DocumentTextIcon className="h-12 w-12 text-blue-500 mb-4" />
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                        Documentation
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Explore our guides and documentation
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                        View Docs
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Contact Support
                </h2>

                {submitMessage.text && (
                    <div
                        className={`mb-4 p-3 rounded-md ${submitMessage.type === "success"
                                ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                                : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                            }`}
                    >
                        {submitMessage.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                            htmlFor="subject"
                        >
                            Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter the subject of your inquiry"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                            htmlFor="message"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows="6"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Describe your issue or question in detail"
                        ></textarea>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Support;