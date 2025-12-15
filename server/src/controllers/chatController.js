import pool from '../config/db.js';
import { getPersonalizedRecommendation } from '../services/aiService.js';

export const recommendDish = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Не авторизовано' });
        }
        const userId = req.user.id;
        const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const userProfile = userRes.rows[0];
        const dishesRes = await pool.query('SELECT * FROM dishes');
        const allDishes = dishesRes.rows;
        const recommendation = await getPersonalizedRecommendation(userProfile, allDishes, prompt);

        const fullRecommendations = recommendation.map(rec => {
            const dish = allDishes.find(d => String(d.id) === String(rec.dish_id));

            if (!dish) return null;

            return {
                ...dish,                        
                id: dish.id,
                name: dish.name,
                price: Number(dish.price),

                image_url: dish.image_url,
                imageUrl: dish.image_url,
                ai_reason: rec.reason
            };
        }).filter(item => item !== null);

        console.log(`✅ Знайдено ${fullRecommendations.length} страв. Відправляю на клієнт.`);
        res.json(fullRecommendations);

    } catch (error) {
        console.error("Chat Controller Error:", error);
        res.status(500).json({ error: 'AI Error' });
    }
};