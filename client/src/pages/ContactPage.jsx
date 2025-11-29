import React from 'react';

const ContactPage = () => {
    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Зв'яжіться з нами 📞</h1>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">

                <div className="flex items-center gap-4">
                    <span className="text-2xl bg-blue-50 dark:bg-gray-700 p-3 rounded-full">📍</span>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase">Адреса</p>
                        <p className="text-lg text-gray-900 dark:text-white">м. Харків, пр. Науки 14, ХНУРЕ</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-2xl bg-green-50 dark:bg-gray-700 p-3 rounded-full">📧</span>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase">Email</p>
                        <p className="text-lg text-gray-900 dark:text-white">support@nutriorder.com</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-2xl bg-purple-50 dark:bg-gray-700 p-3 rounded-full">📱</span>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase">Телефон</p>
                        <p className="text-lg text-gray-900 dark:text-white">+380 (99) 123-45-67</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactPage;