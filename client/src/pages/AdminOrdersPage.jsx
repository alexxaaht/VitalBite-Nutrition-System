import React, { useEffect, useState } from 'react';
import { orderService } from '../services/api';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        try {
            const data = await orderService.getAllOrders();
            const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setOrders(sortedData);
        } catch (error) {
            console.error("Помилка завантаження замовлень:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === id ? { ...order, status: newStatus } : order
                )
            );
            await orderService.updateStatus(id, newStatus);
        } catch (error) {
            console.error("Помилка оновлення статусу:", error);
            alert('Не вдалося змінити статус. Перевірте консоль.');
            loadOrders();
        }
    };

    const handleDeleteOrder = async (id) => {
        if (!window.confirm(`⚠️ Ви впевнені, що хочете видалити замовлення #${id}?\n\nЦю дію неможливо відмінити.`)) {
            return;
        }

        try {
            await orderService.deleteOrder(id);

            setOrders(prevOrders => prevOrders.filter(order => order.id !== id));

        } catch (error) {
            console.error("Помилка при видаленні:", error);
            alert("Не вдалося видалити замовлення. Можливо, сталася помилка сервера.");
        }
    };

    const statusOptions = [
        { value: 'new', label: '🔵 Нове', color: 'bg-blue-100 text-blue-800 border-blue-200' },
        { value: 'cooking', label: '🟠 Готується', color: 'bg-orange-100 text-orange-800 border-orange-200' },
        { value: 'ready', label: '🟢 Готово до видачі', color: 'bg-green-100 text-green-800 border-green-200' },
        { value: 'completed', label: '⚪ Завершено', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    ];

    if (loading) return <div className="text-center py-20 dark:text-white">Завантаження...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 dark:text-white">Панель Кухні (Адмін) 👨‍🍳</h1>

            <div className="grid gap-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <span className="font-bold text-lg dark:text-white">#{order.id}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(order.created_at).toLocaleString('uk-UA')}
                                </span>
                                <span className="text-sm font-medium bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded">
                                    👤 {order.client_name || order.username || 'Гість'} ({order.client_email || order.email || '-'})
                                </span>
                            </div>

                            <div className="mt-3 space-y-1 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                                {order.items && order.items.map((item, idx) => (
                                    <div key={`${order.id}-item-${idx}`} className="text-sm text-gray-700 dark:text-gray-300 flex justify-between items-center gap-2 border-b border-gray-200 dark:border-gray-600 last:border-0 pb-1 last:pb-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold bg-white dark:bg-gray-600 px-2 rounded text-indigo-600 dark:text-indigo-400">{item.quantity}x</span>
                                            <span>{item.name}</span>
                                        </div>
                                        <span className="text-gray-500 text-xs">
                                            {item.price_at_moment ? `${item.price_at_moment} ₴` : ''}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-3 font-bold text-gray-900 dark:text-white text-lg">
                                Сума: <span className="text-green-600">{order.total_price} ₴</span>
                                <span className="text-gray-400 text-sm font-normal ml-2">| Калорії: {order.total_calories}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 min-w-[220px]">
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Статус замовлення</label>
                                <div className="flex flex-col gap-2">
                                    {statusOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleStatusChange(order.id, option.value)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all text-left border ${order.status === option.value
                                                ? `${option.color} ring-2 ring-offset-1 ring-gray-300 dark:ring-gray-600 font-bold shadow-md transform scale-105`
                                                : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            {option.label} {order.status === option.value && '✓'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                                <button
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className="w-full px-4 py-2 rounded-lg text-sm font-bold text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 hover:shadow-sm transition-all flex items-center justify-center gap-2 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                    🗑 Видалити замовлення
                                </button>
                            </div>

                        </div>

                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        📭 Активних замовлень немає
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrdersPage;