import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/api';
import { Link } from 'react-router-dom';

const HistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getMyOrders();
                setOrders(data);
            } catch (error) {
                console.error('Помилка завантаження історії:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cooking': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'ready': return 'bg-green-100 text-green-800 border-green-200';
            case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'new': return 'Нове';
            case 'cooking': return 'Готується';
            case 'ready': return 'Готово до видачі';
            case 'completed': return 'Завершено';
            default: return status;
        }
    };

    if (loading) return <div className="text-center py-20">Завантаження історії...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 dark:text-white">
                <span>📜</span> Історія замовлень
            </h1>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="text-5xl mb-4">🍽️</div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Ви ще нічого не замовляли</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Саме час скуштувати щось корисне!</p>
                    <Link to="/" className="bg-black dark:bg-white dark:text-black text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-all">
                        Перейти до меню
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-50 dark:border-gray-700">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-bold text-lg text-gray-900 dark:text-white">Замовлення #{order.id}</span>
                                        <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(order.created_at).toLocaleString('uk-UA', {
                                            day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{order.total_price} ₴</p>
                                    <span className="text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-lg inline-block mt-1">
                                        ⚡ {order.total_calories} ккал
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {order.items && order.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                {item.name} <span className="text-gray-400">x{item.quantity}</span>
                                            </span>
                                        </div>
                                        <span className="text-gray-900 dark:text-white font-semibold">{item.price * item.quantity} ₴</span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
