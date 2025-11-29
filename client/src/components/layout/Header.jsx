import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
    const { user, logout, loading } = useAuth();
    const { cartCount } = useCart();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
                        <div className="bg-gradient-to-tr from-green-500 to-emerald-700 text-white p-1.5 rounded-lg shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                            <span className="text-xl font-bold">VB</span>
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                            VitalBite
                        </span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-4">

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Змінити тему"
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>

                        <Link to="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group mr-1">
                            <span className="text-2xl group-hover:scale-110 transition-transform block">🛒</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {loading ? (
                            <div className="flex items-center justify-end gap-3 w-16 opacity-50">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></div>
                            </div>
                        ) : (
                            <>
                                <div className="hidden md:flex items-center gap-4">
                                    {user ? (
                                        <>
                                            {user?.is_admin && (
                                                <div className="flex gap-2 mr-2">
                                                    <Link to="/admin" className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                                        Замовлення
                                                    </Link>
                                                    <Link to="/admin/menu" className="px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm font-bold rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
                                                        Меню +
                                                    </Link>
                                                </div>
                                            )}

                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                                            >
                                                <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                    {user.username?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    {user.username}
                                                </span>
                                            </Link>

                                            <button
                                                onClick={logout}
                                                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-1"
                                            >
                                                Вийти
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex gap-3">
                                            <Link to="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors px-3 py-2">
                                                Вхід
                                            </Link>
                                            <Link
                                                to="/login"
                                                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-md active:scale-95"
                                            >
                                                Реєстрація
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* MOBILE BURGER */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    {isMobileMenuOpen ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                        </svg>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* MOBILE MENU DROPDOWN */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl animate-fadeIn">
                    <div className="px-4 py-4 space-y-3">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 px-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {user.username?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{user.username}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                    </div>
                                </div>

                                <Link to="/profile" onClick={closeMenu} className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium">
                                    👤 Мій профіль
                                </Link>

                                {user?.is_admin && (
                                    <>
                                        <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Адміністратор
                                        </div>
                                        <Link to="/admin" onClick={closeMenu} className="block px-4 py-3 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg font-medium mb-1">
                                            📋 Замовлення
                                        </Link>
                                        <Link to="/admin/menu" onClick={closeMenu} className="block px-4 py-3 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium">
                                            🍔 Керування меню
                                        </Link>
                                    </>
                                )}

                                <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2">
                                    <button
                                        onClick={() => { logout(); closeMenu(); }}
                                        className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium"
                                    >
                                        Вийти
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link to="/login" onClick={closeMenu} className="block text-center w-full py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-bold text-gray-700 dark:text-gray-200">
                                    Вхід
                                </Link>
                                <Link to="/login" onClick={closeMenu} className="block text-center w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold">
                                    Реєстрація
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;