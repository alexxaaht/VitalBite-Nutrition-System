import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/api';

const CartPage = () => {
    const { cartItems, addToCart, removeFromCart, clearCart, cartTotal, cartCalories } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isOrdering, setIsOrdering] = useState(false);

    // Підрахунок загальних нутрієнтів
    const totalMacros = cartItems.reduce((acc, item) => ({
        proteins: acc.proteins + (item.proteins * item.quantity),
        fats: acc.fats + (item.fats * item.quantity),
        carbs: acc.carbs + (item.carbs * item.quantity),
    }), { proteins: 0, fats: 0, carbs: 0 });

    const handleCheckout = async () => {
        if (!user) {
            alert('Будь ласка, увійдіть у систему, щоб оформити замовлення');
            navigate('/login');
            return;
        }

        setIsOrdering(true);

        try {
            const orderData = {
                items: cartItems,
                total_price: cartTotal,
                total_calories: cartCalories
            };

            await orderService.createOrder(orderData);

            alert(`✅ Замовлення успішно створено!`);
            clearCart();
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('❌ Помилка при оформленні');
        } finally {
            setIsOrdering(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Ваш кошик порожній</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Додайте корисні страви з меню, щоб сформувати збалансований раціон.</p>
                <Link
                    to="/"
                    className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-all"
                >
                    Перейти до меню
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 dark:text-white">Ваше замовлення</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 items-center transition-colors">
                            <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">{item.name}</h3>
                                    <p className="font-bold text-gray-900 dark:text-white">{item.price * item.quantity} ₴</p>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{item.calories} ккал / порція</p>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300 transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="w-6 text-center font-medium dark:text-white">{item.quantity}</span>
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center justify-center text-lg font-bold transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-24 transition-colors">
                        <h2 className="text-xl font-bold mb-6 dark:text-white">Підсумок</h2>
                        <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Страви ({cartItems.length})</span>
                                <span>{cartTotal} ₴</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Обслуговування</span>
                                <span>0 ₴</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2">
                                <span>До сплати</span>
                                <span>{cartTotal} ₴</span>
                            </div>
                        </div>


                        <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-xl mb-6 border border-blue-100 dark:border-gray-600">
                            <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-3 text-sm uppercase tracking-wider text-center">Харчова цінність замовлення</h3>
                            <div className="grid grid-cols-2 gap-y-3 text-sm">
                                <div className="flex justify-between px-2">
                                    <span className="text-gray-600 dark:text-gray-300 font-medium">Калорії:</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{cartCalories} ккал</span>
                                </div>
                                <div className="flex justify-between px-2">
                                    <span className="text-gray-600 dark:text-gray-300 font-medium">Білки:</span>
                                    <span className="font-bold text-blue-600 dark:text-blue-300">{totalMacros.proteins.toFixed(1)} г</span>
                                </div>
                                <div className="flex justify-between px-2">
                                    <span className="text-gray-600 dark:text-gray-300 font-medium">Жири:</span>
                                    <span className="font-bold text-orange-600 dark:text-orange-300">{totalMacros.fats.toFixed(1)} г</span>
                                </div>
                                <div className="flex justify-between px-2">
                                    <span className="text-gray-600 dark:text-gray-300 font-medium">Вуглеводи:</span>
                                    <span className="font-bold text-green-600 dark:text-green-300">{totalMacros.carbs.toFixed(1)} г</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isOrdering}
                            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all active:scale-95 shadow-green-200/50 shadow-lg disabled:opacity-70 dark:shadow-none"
                        >
                            {isOrdering ? 'Обробка...' : 'Оформити замовлення'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CartPage;