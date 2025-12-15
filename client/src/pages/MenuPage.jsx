import React, { useState } from 'react';
import DishCard from '../features/menu/components/DishCard';
import DishModal from '../features/menu/components/DishModal';
import ChatWidget from '../features/chat/components/ChatWidget';
import { useMenu } from '../features/menu/hooks/useMenu';

const MenuPage = () => {
    const {
        categories,
        dishes,
        activeCategory,
        isLoading,
        setActiveCategory
    } = useMenu();

    const [selectedDish, setSelectedDish] = useState(null);
    const [aiRecommendations, setAiRecommendations] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleAiRecommendation = (data) => {
        console.log("🔍 Отримано рекомендації:", data);

        setAiRecommendations(data);
        if (window.innerWidth < 768) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const resetAi = () => {
        setAiRecommendations(null);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] relative">
            {selectedDish && (
                <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
            )}

            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-8 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Оберіть свій ідеальний обід 🍽️
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        Створіть ідеальний раціон за секунду. Ви можете обрати страви з меню самостійно або скористатися допомогою нашого{' '}
                        <span
                            className="text-indigo-600 font-bold cursor-pointer hover:text-indigo-800 transition-colors"
                            onClick={() => setIsChatOpen(true)}
                        >
                            AI-асистента
                        </span>
                        {' '}для персонального підбору.
                    </p>

                    <div className="flex gap-3 overflow-x-auto p-2 scrollbar-hide w-full">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.slug)}
                                className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${activeCategory === cat.slug
                                    ? 'bg-gray-900 text-white shadow-lg dark:bg-indigo-600'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {aiRecommendations && (
                    <div className="mb-12 bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-3xl relative border border-indigo-100 dark:border-indigo-800">
                        <button
                            onClick={resetAi}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-sm"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-200 mb-6 flex items-center">
                            🤖 Ваша персональна підбірка
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {aiRecommendations.map((dish) => (
                                <div key={dish.id} className="flex flex-col h-full group">
                                    <div className="flex-grow">
                                        <DishCard
                                            dish={dish}
                                            onClick={setSelectedDish}
                                        />
                                    </div>

                                    {dish.ai_reason && (
                                        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-indigo-100 dark:border-indigo-900 shadow-sm relative transform transition-all duration-300 hover:scale-[1.02]">
                                            <div className="absolute -top-2 left-8 w-4 h-4 bg-white dark:bg-gray-800 border-t border-l border-indigo-100 dark:border-indigo-900 transform rotate-45"></div>

                                            <p className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed font-medium">
                                                <span className="text-xl mr-2 align-middle">💡</span>
                                                {dish.ai_reason}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {dishes.map((dish) => (
                            <DishCard key={dish.id} dish={dish} onClick={setSelectedDish} />
                        ))}
                    </div>
                )}
            </div>

            <ChatWidget
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                onRecommendationReceived={handleAiRecommendation}
            />

            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center z-50 text-white text-3xl hover:bg-indigo-700 transition-transform hover:scale-110 active:scale-95"
            >
                {isChatOpen ? '✕' : '🤖'}
            </button>
        </div>
    );
};

export default MenuPage;