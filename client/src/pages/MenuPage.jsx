import React, { useState, useEffect } from 'react';
import { menuService } from '../services/api';
import DishCard from '../features/menu/DishCard';
import DishModal from '../features/menu/DishModal';
import api from '../services/api';

const MenuPage = () => {
    const [categories, setCategories] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [aiRecommendations, setAiRecommendations] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [selectedDish, setSelectedDish] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await menuService.getCategories();
                setCategories([{ id: 0, name: 'Всі страви', slug: 'all' }, ...cats]);
            } catch (error) {
                console.error('Помилка завантаження категорій:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchDishes = async () => {
            try {
                setLoading(true);

                setDishes([]);

                const items = await menuService.getDishes(activeCategory);

                if (isMounted) {
                    console.log(`Завантажено страви для категорії: ${activeCategory}`, items.length);
                    setDishes(items);
                }
            } catch (error) {
                console.error('Помилка завантаження страв:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDishes();

        return () => {
            isMounted = false;
        };
    }, [activeCategory]);

    const handleAiRecommendation = async () => {
        try {
            setIsAiLoading(true);
            setAiRecommendations(null);

            const response = await api.get('/recommendations/ai');
            console.log("🤖 Відповідь AI:", response.data);
            setAiRecommendations(response.data);

        } catch (error) {
            console.error("AI Error:", error);
            alert("Не вдалося отримати рекомендацію. Перевірте вхід в систему.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const resetAi = () => setAiRecommendations(null);

    return (
        <div className="min-h-[calc(100vh-64px)]">

            {selectedDish && (
                <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
            )}

            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-8 mb-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Оберіть свій ідеальний обід 🍽️</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Ми поєднали смак високої кухні з точністю штучного інтелекту.
                        Обирайте страви, які ідеально вписуються у ваші макронутрієнти, або дозвольте AI створити персональний раціон за секунду.</p>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex gap-3 overflow-x-auto p-2 scrollbar-hide w-full md:w-auto">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.slug)}
                                    className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ease-in-out ${activeCategory === cat.slug
                                        ? 'bg-gray-900 text-white shadow-lg scale-105 dark:bg-indigo-600 dark:text-white'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={aiRecommendations ? resetAi : handleAiRecommendation}
                            disabled={isAiLoading}
                            className={`px-6 py-2.5 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 whitespace-nowrap ${aiRecommendations
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90'
                                }`}
                        >
                            {isAiLoading ? 'Думаю... 🧠' : aiRecommendations ? '❌ Закрити підбір' : '✨ AI Підбір'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                {aiRecommendations && (
                    <div className="mb-12 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/10 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-800 shadow-sm animate-fadeIn">
                        <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-200 mb-6 flex items-center gap-3">
                            <span className="text-3xl">🤖</span>
                            <span>Персональна рекомендація</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {aiRecommendations.map((dish) => (
                                <div key={dish.id} className="flex flex-col h-full">
                                    <div className="flex-grow">
                                        <DishCard
                                            dish={dish}
                                            onClick={(clickedDish) => setSelectedDish(clickedDish)}
                                        />
                                    </div>
                                    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-indigo-100 dark:border-indigo-900 shadow-sm relative">
                                        <div className="absolute -top-2 left-8 w-4 h-4 bg-white dark:bg-gray-800 border-t border-l border-indigo-100 dark:border-indigo-900 transform rotate-45"></div>
                                        <p className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed font-medium">
                                            <span className="text-xl mr-2">💡</span>
                                            {dish.ai_reason}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                ) : (
                    <>
                        {dishes.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                                {dishes.map((dish) => (
                                    <DishCard
                                        key={dish.id}
                                        dish={dish}
                                        onClick={(clickedDish) => setSelectedDish(clickedDish)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="text-4xl mb-4">🥗</div>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">У цій категорії поки порожньо</h3>
                                <p className="text-gray-500 dark:text-gray-400">Спробуйте обрати іншу категорію</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MenuPage;