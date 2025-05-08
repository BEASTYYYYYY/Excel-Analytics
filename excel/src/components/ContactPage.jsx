import { useState } from 'react';
import { Mail, Linkedin, Instagram, Github, Send, MapPin, Phone, MessageSquare, Check, Copy } from 'lucide-react';

export default function ContactPage() {
    const [copied, setCopied] = useState(null);

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(index);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    const socialLinks = [
        {
            name: 'Email',
            icon: <Mail className="w-5 h-5" />,
            link: 'mailto:hr@zidio.in',
            handle: 'hr@zidio.in',
            bgColor: 'bg-red-500 hover:bg-red-600',
            textColor: 'text-red-600 dark:text-red-400'
        },
        {
            name: 'LinkedIn',
            icon: <Linkedin className="w-5 h-5" />,
            link: 'https://linkedin.com/company/zidio',
            handle: 'zidio',
            bgColor: 'bg-blue-600 hover:bg-blue-700',
            textColor: 'text-blue-600 dark:text-blue-400'
        },
        {
            name: 'Instagram',
            icon: <Instagram className="w-5 h-5" />,
            link: 'https://instagram.com/zidio.in',
            handle: '@zidio.in',
            bgColor: 'bg-pink-600 hover:bg-pink-700',
            textColor: 'text-pink-600 dark:text-pink-400'
        },
        {
            name: 'GitHub',
            icon: <Github className="w-5 h-5" />,
            link: 'https://github.com/zidio',
            handle: 'zidio',
            bgColor: 'bg-gray-800 hover:bg-gray-900',
            textColor: 'text-gray-700 dark:text-gray-400'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 pb-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white dark:bg-gray-800 py-20">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full opacity-5 blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600 rounded-full opacity-5 blur-3xl"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Have questions about our Excel Analytics Platform? We're here to help! Reach out to us through any of the channels below.
                    </p>
                </div>
            </div>
            {/* Contact Info Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {socialLinks.map((social, index) => (
                        <div
                            key={index}
                            className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className={`${social.bgColor} text-white p-3 rounded-full`}>
                                    {social.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{social.name}</h3>
                                    <p className={`${social.textColor} font-medium`}>{social.handle}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                                <a
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 dark:text-gray-400 flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    <span>Connect with us</span>
                                    <span className="transform transition-transform group-hover:translate-x-1">→</span>
                                </a>
                                <button
                                    onClick={() => copyToClipboard(social.handle, index)}
                                    className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                                >
                                    {copied === index ? (
                                        <Check className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <Copy className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Info Cards */}
            <div className="container mx-auto px-4 py-12">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="p-8 md:border-r border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
                            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Office Location</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                12th Floor, Tech Hub One<br />
                                Silicon Valley, CA 94024
                            </p>
                        </div>

                        <div className="p-8 md:border-r border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
                            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
                                <Phone className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Phone Number</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                +1 (800) 123-4567<br />
                                Monday - Friday, 9AM - 6PM
                            </p>
                        </div>

                        <div className="p-8 flex flex-col items-center text-center">
                            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Live Support</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Chat with our support team<br />
                                Available 24/7
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Contact Card */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-6 text-center">Direct Contact Methods</h2>

                            <div className="space-y-6">
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Email Us Directly</h3>
                                            <p className="text-gray-600 dark:text-gray-400">We'll respond within 24 hours</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-4 border border-indigo-100 dark:border-indigo-900/50">
                                        <span className="font-medium">hr@zidio.in</span>
                                        <button
                                            onClick={() => copyToClipboard('hr@zidio.in', 'email')}
                                            className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 p-2"
                                        >
                                            {copied === 'email' ? (
                                                <Check className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <Copy className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Call Our Support</h3>
                                            <p className="text-gray-600 dark:text-gray-400">For immediate assistance</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-4 border border-blue-100 dark:border-blue-900/50">
                                        <span className="font-medium">+1 (800) 123-4567</span>
                                        <button
                                            onClick={() => copyToClipboard('+1 (800) 123-4567', 'phone')}
                                            className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-2"
                                        >
                                            {copied === 'phone' ? (
                                                <Check className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <Copy className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Need to send us detailed information?<br />
                                    <a
                                        href="mailto:hr@zidio.in"
                                        className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                                    >
                                        Click here to compose an email directly
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Map Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
                        <div className="text-center">
                            <MapPin className="w-16 h-16 text-indigo-600/30 dark:text-indigo-400/30 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Our Location</h3>
                            <p className="text-gray-500 dark:text-gray-400">Map loading...</p>
                        </div>
                        <div className="absolute inset-0 border-8 border-white dark:border-gray-800"></div>
                    </div>
                </div>
            </div>
            {/* FAQ Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Find quick answers to common questions about our Excel Analytics Platform
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-6">
                    {[
                        {
                            question: "How do I get started with the Excel Analytics Platform?",
                            answer: "Simply create an account, navigate to the dashboard, and upload your first Excel file. From there, you can choose columns to analyze and create visualizations."
                        },
                        {
                            question: "What file formats are supported?",
                            answer: "Our platform supports Excel formats including .xls and .xlsx files. We're constantly working to add support for additional spreadsheet formats."
                        },
                        {
                            question: "How secure is my data?",
                            answer: "We take data security seriously. All uploaded files are encrypted, and we never share your data with third parties without your explicit permission."
                        },
                        {
                            question: "Can I export the generated charts?",
                            answer: "Yes! All visualizations can be downloaded as PNG or PDF files, making them perfect for reports, presentations, or sharing with colleagues."
                        }
                    ].map((faq, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <a
                        href="#"
                        className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    >
                        View all FAQs →
                    </a>
                </div>
            </div>
            {/* Contact Form */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-6 text-center">Send Us a Message</h2>
                            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                                Have a specific query or feedback? Fill out the form below and we'll get back to you shortly.
                            </p>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows="6"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Type your message here..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>Send Message</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Newsletter Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-indigo-600 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 md:p-12 text-white">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="md:w-1/2 mb-6 md:mb-0">
                                <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
                                <p className="text-indigo-100">
                                    Stay updated with the latest features, tips, and tutorials for our Excel Analytics Platform
                                </p>
                            </div>
                            <div className="md:w-1/2">
                                <div className="flex w-full">
                                    <input
                                        type="email"
                                        className="flex-grow w-full px-4 py-3 rounded-l-lg border-2 border-white bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white focus:bg-white/20"
                                        placeholder="Your email address"
                                    />
                                    <button className="bg-white text-indigo-600 font-medium px-6 py-3 rounded-r-lg hover:bg-indigo-50 transition-colors duration-300 whitespace-nowrap">
                                        Subscribe
                                    </button>
                                </div>
                                <p className="text-xs text-indigo-100 mt-2">
                                    We respect your privacy. Unsubscribe at any time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <h3 className="text-lg font-bold mb-4">About Zidio</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Zidio's Excel Analytics Platform helps businesses transform their spreadsheet data into actionable insights without complex data analysis tools.
                            </p>
                            <div className="flex space-x-4">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${social.bgColor.split(' ')[0]} text-white p-2 rounded-full hover:opacity-80 transition-opacity`}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                {['Home', 'Features', 'Pricing', 'About Us', 'Blog', 'Contact'].map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href="#"
                                            className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        12th Floor, Tech Hub One<br />
                                        Silicon Valley, CA 94024
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        +1 (800) 123-4567
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        hr@zidio.in
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            © {new Date().getFullYear()} Zidio. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}