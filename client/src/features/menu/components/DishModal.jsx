import React from 'react';
import NutritionBadge from './NutritionBadge';
import { useCart } from '../../../context/CartContext';

const DishModal = ({ dish, onClose }) => {
    const { addToCart } = useCart();

    if (!dish) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-scaleUp border border-transparent dark:border-gray-700">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 dark:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10 backdrop-blur-md"
                >
                    ✕
                </button>
                <div className="h-64 sm:h-80 w-full relative">
                    <img
                        src={dish.image_url}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                        {dish.is_vegetarian && (
                            <span className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">🌿 Vegan</span>
                        )}
                        {dish.is_gluten_free && (
                            <span className="bg-yellow-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">🌾 Gluten Free</span>
                        )}
                        {dish.is_spicy && (
                            <span className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">🌶️ Spicy</span>
                        )}
                    </div>
                </div>
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">{dish.name}</h2>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-xl whitespace-nowrap">
                            {dish.price} ₴
                        </span>
                    </div>
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Про страву</h3>
                        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                            {dish.detailed_description || dish.description}
                        </p>
                    </div>
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Склад</h3>
                        <div className="flex flex-wrap gap-2">
                            {dish.ingredients && dish.ingredients.length > 0 ? (
                                dish.ingredients.map((ing, index) => (
                                    <span key={index} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium capitalize border border-gray-200 dark:border-gray-700">
                                        {ing}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 italic">Склад не вказано</span>
                            )}
                        </div>
                    </div>

                    <div className="mb-8 p-6 bg-blue-50 dark:bg-gray-800/50 rounded-2xl border border-blue-100 dark:border-gray-700">
                        <h3 className="text-sm font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider mb-4 text-center">Енергетична цінність</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <NutritionBadge label="Ккал" value={dish.calories} unit="" color="red" />
                            <NutritionBadge label="Білки" value={dish.proteins} unit="г" color="blue" />
                            <NutritionBadge label="Жири" value={dish.fats} unit="г" color="orange" />
                            <NutritionBadge label="Вугл" value={dish.carbs} unit="г" color="green" />
                        </div>
                    </div>

                    <button
                        onClick={() => { addToCart(dish); onClose(); }}
                        className="w-full py-4 rounded-xl font-bold text-lg transition-transform active:scale-95 shadow-xl
                       bg-black text-white hover:bg-gray-800 
                       dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white"
                    >
                        Додати в замовлення
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DishModal;