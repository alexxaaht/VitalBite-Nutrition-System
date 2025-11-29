import React, { useState, useEffect } from 'react';
import { menuService } from '../services/api';

const AdminMenuPage = () => {
    const [dishes, setDishes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Стан для режиму редагування 
    const [editingId, setEditingId] = useState(null);

    const initialFormState = {
        name: '', description: '', detailed_description: '', price: '', category_id: 1,
        calories: '', proteins: '', fats: '', carbs: '',
        image_url: '', ingredients: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    const loadData = async () => {
        try {
            const [dishesData, catsData] = await Promise.all([
                menuService.getDishes(),
                menuService.getCategories()
            ]);
            setDishes(dishesData);
            setCategories(catsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditClick = (dish) => {
        setEditingId(dish.id);
        setFormData({
            name: dish.name,
            description: dish.description,
            detailed_description: dish.detailed_description || '',
            price: dish.price,
            category_id: dish.category_id || 1,
            calories: dish.calories,
            proteins: dish.proteins,
            fats: dish.fats,
            carbs: dish.carbs,
            image_url: dish.image_url,
            ingredients: dish.ingredients ? dish.ingredients.join(', ') : ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(initialFormState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                ingredients: formData.ingredients.split(',').map(i => i.trim())
            };

            if (editingId) {
                await menuService.updateDish(editingId, payload);
                alert('Страву оновлено!');
            } else {
                await menuService.addDish(payload);
                alert('Страву створено!');
            }

            setFormData(initialFormState);
            setEditingId(null); 
            loadData(); 
        } catch (error) {
            alert('Помилка при збереженні');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Видалити цю страву безповоротно?')) {
            await menuService.deleteDish(id);
            loadData();
        }
    };

    if (loading) return <div className="p-8 text-center">Завантаження...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 dark:text-white">Керування Меню 📋</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                            {editingId ? '✏️ Редагування страви' : '➕ Додати нову страву'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Назва</label>
                                <input name="name" value={formData.name} onChange={handleChange} required
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Наприклад: Салат Грецький" />
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Короткий опис</label>
                                <input name="description" value={formData.description} onChange={handleChange} required
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Детальний опис</label>
                                <textarea name="detailed_description" value={formData.detailed_description} onChange={handleChange} rows="3"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Ціна (грн)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} required
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Категорія</label>
                                    <select name="category_id" value={formData.category_id} onChange={handleChange}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-gray-700/50 p-3 rounded-lg grid grid-cols-4 gap-2 text-center border border-blue-100 dark:border-gray-600">
                                <div><label className="text-xs text-gray-500 dark:text-gray-400">Ккал</label><input name="calories" type="number" value={formData.calories} onChange={handleChange} className="w-full p-1 border rounded text-center dark:bg-gray-600 dark:border-gray-500 dark:text-white" /></div>
                                <div><label className="text-xs text-gray-500 dark:text-gray-400">Біл</label><input name="proteins" type="number" value={formData.proteins} onChange={handleChange} className="w-full p-1 border rounded text-center dark:bg-gray-600 dark:border-gray-500 dark:text-white" /></div>
                                <div><label className="text-xs text-gray-500 dark:text-gray-400">Жир</label><input name="fats" type="number" value={formData.fats} onChange={handleChange} className="w-full p-1 border rounded text-center dark:bg-gray-600 dark:border-gray-500 dark:text-white" /></div>
                                <div><label className="text-xs text-gray-500 dark:text-gray-400">Вугл</label><input name="carbs" type="number" value={formData.carbs} onChange={handleChange} className="w-full p-1 border rounded text-center dark:bg-gray-600 dark:border-gray-500 dark:text-white" /></div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Інгредієнти</label>
                                <textarea name="ingredients" value={formData.ingredients} onChange={handleChange}
                                    className="w-full p-2 border rounded h-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="томати, огірки..." />
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-600 dark:text-gray-400">URL Картинки</label>
                                <input name="image_url" value={formData.image_url} onChange={handleChange}
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button type="submit" className={`flex-1 py-2 rounded-lg font-bold text-white transition-colors ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                                    {editingId ? '💾 Зберегти' : '+ Створити'}
                                </button>
                                {editingId && <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">❌</button>}
                            </div>
                        </form>
                    </div>
                </div>


                <div className="lg:col-span-2 space-y-4">
                    {dishes.map(dish => (
                        <div key={dish.id} className={`flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border transition-all items-center ${editingId === dish.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100 dark:border-gray-700'}`}>
                            <div className="w-20 h-20 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                <img src={dish.image_url} className="w-full h-full object-cover" alt="" />
                            </div>

                            <div className="flex-grow">
                                <h3 className="font-bold text-lg dark:text-white">{dish.name}</h3>
                                <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <span className="font-semibold text-green-600 dark:text-green-400">{dish.price} ₴</span>
                                    <span>•</span>
                                    <span>{dish.calories} ккал</span>
                                    <span>•</span>
                                    <span>{categories.find(c => c.id === dish.category_id)?.name}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 truncate max-w-md">
                                    {dish.ingredients && dish.ingredients.join(', ')}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button onClick={() => handleEditClick(dish)} className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                                    Редагувати
                                </button>
                                <button onClick={() => handleDelete(dish.id)} className="px-4 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">
                                    Видалити
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default AdminMenuPage;