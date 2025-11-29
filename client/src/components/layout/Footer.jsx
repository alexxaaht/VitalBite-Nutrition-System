import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        © 2025 <span className="font-bold text-gray-700 dark:text-white">VitalBite</span>. Smart Nutrition System.
                    </div>

                    <div className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Link to="/about" className="hover:text-black dark:hover:text-white transition-colors">
                            Про нас
                        </Link>
                        <Link to="/contacts" className="hover:text-black dark:hover:text-white transition-colors">
                            Контакти
                        </Link>
                        <Link to="/privacy" className="hover:text-black dark:hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;