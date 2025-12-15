import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { Link } from 'react-router-dom';
import PreferenceSelector from './PreferenceSelector';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        weight: '', height: '', age: '', gender: 'male',
        activity_level: 'moderate', dietary_goal: 'maintain',
        allergies: [],
        dislikes: [],
        favorites: [],
        bio: ''
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
                allergies: user.allergies || [],
                dislikes: user.dislikes || [],
                favorites: user.favorites || [],
                bio: user.bio || ''
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
    }, [formData.weight, formData.height, formData.age, formData.gender, formData.activity_level]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleListUpdate = (category, newItems) => {
        setFormData(prev => ({ ...prev, [category]: newItems }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedUserResponse = await authService.updateProfile(formData);
            updateUser(updatedUserResponse);
            setMessage('✅ Профіль успішно оновлено!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            setMessage('❌ Помилка збереження');
        } finally {
            setLoading(false);
        }
    };

    const commonAllergies = ['Горіхи', 'Лактоза', 'Глютен', 'Мед', 'Морепродукти', 'Яйця'];
    const commonDislikes = ['Цибуля', 'Кінза', 'Гриби', 'Свинина', 'Гостре'];
    const commonFavorites = ['Курка', 'Лосось', 'Авокадо', 'Паста', 'Шоколад'];

    const inputClass = "w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors";
    const labelClass = "block text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium";

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-2 dark:text-white">Налаштування AI-Дієтолога 🤖</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Заповніть ці дані, щоб штучний інтелект підбирав ідеальні страви саме для вас.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">📏 Фізичні параметри</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className={labelClass}>Вага (кг)</label>
                                <input type="number" name="weight" value={formData.weight} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Зріст (см)</label>
                                <input type="number" name="height" value={formData.height} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Вік</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Стать</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                                    <option value="male">Чоловіча</option>
                                    <option value="female">Жіноча</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className={labelClass}>Рівень активності</label>
                            <select name="activity_level" value={formData.activity_level} onChange={handleChange} className={inputClass}>
                                <option value="sedentary">Сидячий (офіс)</option>
                                <option value="light">Легка (прогулянки)</option>
                                <option value="moderate">Помірна (тренування 3р/тижд)</option>
                                <option value="active">Висока (спортзал щодня)</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
                            🍽 Смакові вподобання
                            <span className="text-xs font-normal px-2 py-1 bg-blue-100 text-blue-800 rounded-lg">Важливо для AI</span>
                        </h3>

                        <PreferenceSelector
                            title="Алергії та заборони (Суворий фільтр)"
                            items={formData.allergies}
                            options={commonAllergies}
                            onChange={(newItems) => handleListUpdate('allergies', newItems)}
                            icon="⛔️"
                            colorClass={{
                                selected: "bg-red-100 border-red-500 text-red-700 dark:bg-red-900/40 dark:text-red-300",
                                unselected: "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 dark:bg-gray-700 dark:text-gray-300"
                            }}
                        />

                        <hr className="my-6 border-gray-200 dark:border-gray-700" />

                        <PreferenceSelector
                            title="Не люблю (Уникати)"
                            items={formData.dislikes}
                            options={commonDislikes}
                            onChange={(newItems) => handleListUpdate('dislikes', newItems)}
                            icon="👎"
                            colorClass={{
                                selected: "bg-orange-100 border-orange-500 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200",
                                unselected: "bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600 dark:bg-gray-700 dark:text-gray-300"
                            }}
                        />

                        <hr className="my-6 border-gray-200 dark:border-gray-700" />

                        <PreferenceSelector
                            title="Обожнюю (Пріоритет)"
                            items={formData.favorites}
                            options={commonFavorites}
                            onChange={(newItems) => handleListUpdate('favorites', newItems)}
                            icon="❤️"
                            colorClass={{
                                selected: "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-200",
                                unselected: "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 dark:bg-gray-700 dark:text-gray-300"
                            }}
                        />

                        <div className="mt-6">
                            <label className={labelClass}>Додаткові побажання для AI</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Наприклад: 'Я намагаюся їсти менше солі через тиск' або 'Хочу більше білка на сніданок'."
                                className={`${inputClass} h-24 resize-none`}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50"
                    >
                        {loading ? 'Збереження налаштувань...' : '💾 Зберегти профіль'}
                    </button>
                    {message && <p className="text-center mt-2 font-medium text-green-600 dark:text-green-400">{message}</p>}
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl text-white shadow-xl">
                        <h3 className="text-lg font-bold mb-1 opacity-90">Ваша норма</h3>
                        <p className="text-5xl font-bold mb-4">{stats.dailyCalories} <span className="text-xl font-normal">ккал</span></p>

                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <div className="flex justify-between text-sm mb-2">
                                <span>BMR (База):</span>
                                <span className="font-bold">{stats.bmr}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Активність:</span>
                                <span className="font-bold">{formData.activity_level.replace('_', ' ')}</span>
                            </div>
                        </div>
                        <p className="text-xs mt-4 opacity-75">Ці дані використовуються AI для розрахунку розміру порцій.</p>
                    </div>
                    <Link to="/history" className="block bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-blue-500 transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">📜 Історія замовлень</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Аналіз минулих страв</p>
                            </div>
                            <span className="text-2xl group-hover:scale-110 transition-transform">👉</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;