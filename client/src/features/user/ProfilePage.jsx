import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        weight: '', height: '', age: '', gender: 'male',
        activity_level: 'moderate', dietary_goal: 'maintain',
        allergies: []
    });

    const [stats, setStats] = useState({ bmr: 0, dailyCalories: 0 });

    useEffect(() => {
        if (user) {
            setFormData({
                weight: user.weight || '',
                height: user.height || '',
                age: user.age || '',
                gender: user.gender || 'male',
                activity_level: user.activity_level || 'moderate',
                dietary_goal: user.dietary_goal || 'maintain',
                allergies: user.allergies || []
            });
        }
    }, [user]);

    useEffect(() => {
        if (formData.weight && formData.height && formData.age) {
            let bmr = 0;
            if (formData.gender === 'male') {
                bmr = 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5;
            } else {
                bmr = 10 * formData.weight + 6.25 * formData.height - 5 * formData.age - 161;
            }

            const activityMultipliers = {
                sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9
            };

            const daily = Math.round(bmr * (activityMultipliers[formData.activity_level] || 1.2));
            setStats({ bmr: Math.round(bmr), dailyCalories: daily });
        }
    }, [formData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAllergyChange = (allergen) => {
        setFormData(prev => {
            const newAllergies = prev.allergies.includes(allergen)
                ? prev.allergies.filter(a => a !== allergen)
                : [...prev.allergies, allergen];
            return { ...prev, allergies: newAllergies };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.updateProfile(formData);
            setMessage('✅ Профіль успішно оновлено!');
        } catch (error) {
            setMessage('❌ Помилка збереження');
        } finally {
            setLoading(false);
        }
    };

    const allergensList = ['nuts', 'lactose', 'gluten', 'honey', 'seafood', 'eggs'];
    const inputClass = "w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors";
    const labelClass = "block text-sm text-gray-600 dark:text-gray-400 mb-1";

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 dark:text-white">Мій Профіль Здоров'я 📋</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="mb-8">
                        <Link
                            to="/history"
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl bg-white dark:bg-gray-600 p-2 rounded-lg group-hover:scale-110 transition-transform shadow-sm">📜</span>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Історія замовлень</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Перегляньте свої минулі покупки та їх калорійність</p>
                                </div>
                            </div>
                            <span className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">→</span>
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Вага (кг)</label>
                                <input type="number" name="weight" value={formData.weight} onChange={handleChange} className={inputClass} placeholder="70" />
                            </div>
                            <div>
                                <label className={labelClass}>Зріст (см)</label>
                                <input type="number" name="height" value={formData.height} onChange={handleChange} className={inputClass} placeholder="170" />
                            </div>
                            <div>
                                <label className={labelClass}>Вік</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClass} placeholder="25" />
                            </div>
                            <div>
                                <label className={labelClass}>Стать</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                                    <option value="male">Чоловіча</option>
                                    <option value="female">Жіноча</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Активність</label>
                            <select name="activity_level" value={formData.activity_level} onChange={handleChange} className={inputClass}>
                                <option value="sedentary">Сидячий спосіб життя</option>
                                <option value="light">Легка активність (1-3 рази/тиждень)</option>
                                <option value="moderate">Помірна (3-5 разів/тиждень)</option>
                                <option value="active">Висока (6-7 разів/тиждень)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 font-bold">Алергії (Важливо для безпеки!)</label>
                            <div className="flex flex-wrap gap-3">
                                {allergensList.map(allergen => (
                                    <button
                                        key={allergen}
                                        type="button"
                                        onClick={() => handleAllergyChange(allergen)}
                                        className={`px-3 py-1 rounded-full text-sm border transition-all ${formData.allergies.includes(allergen)
                                                ? 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700'
                                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {allergen}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg hover:opacity-80 mt-4 font-bold transition-opacity">
                            {loading ? 'Збереження...' : 'Зберегти зміни'}
                        </button>
                        {message && <p className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">{message}</p>}
                    </form>
                </div>
                <div className="md:col-span-1">
                    <div className="bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 p-6 rounded-2xl sticky top-24 transition-colors">
                        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-4">Ваша норма 📊</h3>

                        <div className="mb-6">
                            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Денна норма калорій:</p>
                            <p className="text-4xl font-bold text-blue-800 dark:text-white">{stats.dailyCalories} <span className="text-lg">ккал</span></p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm dark:text-gray-300">
                                <span>Базовий обмін (BMR):</span>
                                <span className="font-bold">{stats.bmr}</span>
                            </div>
                            <div className="h-px bg-blue-200 dark:bg-gray-600"></div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                                Це орієнтовна норма для підтримки ваги. AI буде використовувати це число для підбору порцій.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;