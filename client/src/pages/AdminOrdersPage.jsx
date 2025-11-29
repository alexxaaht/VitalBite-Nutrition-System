import React, { useEffect, useState } from 'react';
import { orderService } from '../services/api';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        try {
            const data = await orderService.getAllOrders();
            setOrders(data);
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
                            <div className="flex items-center gap-3 mb-2">
                                <span className="font-bold text-lg dark:text-white">#{order.id}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(order.created_at).toLocaleString('uk-UA')}
                                </span>
                                <span className="text-sm font-medium bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded">
                                    👤 {order.client_name} ({order.client_email})
                                </span>
                            </div>

                            <div className="mt-3 space-y-1">
                                {order.items && order.items.map((item, idx) => (
                                    <div key={`${order.id}-item-${idx}`} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <span className="font-bold">{item.quantity}x</span> {item.name}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-3 font-bold text-gray-900 dark:text-white">
                                Сума: {order.total_price} ₴ | Калорії: {order.total_calories}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[200px]">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Статус замовлення</label>
                            <div className="flex flex-col gap-2">
                                {statusOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleStatusChange(order.id, option.value)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all text-left border ${order.status === option.value
                                            ? `${option.color} ring-2 ring-offset-1 ring-gray-300 dark:ring-gray-600 font-bold shadow-sm`
                                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
                                            }`}
                                    >
                                        {option.label} {order.status === option.value && '✓'}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrdersPage;