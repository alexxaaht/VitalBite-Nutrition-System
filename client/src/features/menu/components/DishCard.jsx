import React from 'react';
import NutritionBadge from './NutritionBadge';
import { useCart } from '../../../context/CartContext';

const DishCard = ({ dish, onClick }) => {
    const { addToCart } = useCart();

    return (
        <div
            onClick={() => onClick(dish)}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer group"
        >

            <div className="h-52 overflow-hidden relative">
                <img
                    src={dish.image_url || 'https://via.placeholder.com/400x300'}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                    {dish.is_vegetarian && (
                        <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                            VEGAN
                        </span>
                    )}
                    {dish.is_spicy && (
                        <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                            HOT
                        </span>
                    )}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow text-center">

                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight mb-1">
                    {dish.name}
                </h3>

                <div className="text-green-600 dark:text-green-400 font-bold text-lg mb-3">
                    {dish.price} <span className="text-sm font-medium text-gray-400">₴</span>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm mb-5 line-clamp-2 leading-relaxed flex-grow px-2">
                    {dish.description || 'Смачна та корисна страва'}
                </p>

                <div className="grid grid-cols-4 gap-2 mb-5">
                    <NutritionBadge label="Ккал" value={dish.calories} unit="" color="red" />
                    <NutritionBadge label="Білки" value={dish.proteins} unit="г" color="blue" />
                    <NutritionBadge label="Жири" value={dish.fats} unit="г" color="orange" />
                    <NutritionBadge label="Вугл" value={dish.carbs} unit="г" color="green" />
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(dish);
                    }}
                    className="w-full bg-black text-white py-3.5 rounded-2xl font-bold text-sm 
                            hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200 dark:shadow-none
                            dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white"
                >
                    Додати в кошик
                </button>
            </div>
        </div>
    );
};

export default DishCard;