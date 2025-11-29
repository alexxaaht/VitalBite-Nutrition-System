import pool from '../config/db.js';
import { getPersonalizedRecommendation } from '../services/aiService.js';

export const getRecommendations = async (req, res) => {
    try {
        const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
        const user = userRes.rows[0];

        const menuRes = await pool.query(`
      SELECT d.*, c.name as category_name 
      FROM dishes d 
      LEFT JOIN categories c ON d.category_id = c.id
    `);
        const menu = menuRes.rows;
        const aiRecommendations = await getPersonalizedRecommendation(user, menu);
        
        const finalResult = aiRecommendations.map(rec => {
            const dish = menu.find(d => d.id == rec.dish_id);

            if (!dish) {
                console.error(`❌ УВАГА: AI рекомендував ID ${rec.dish_id}, але такої страви немає в базі!`);
                return null;
            }

            return {
                ...dish,
                ai_reason: rec.reason
            };
        }).filter(item => item !== null);


        if (finalResult.length === 0) {
            console.log("⚠️ Результат AI пустий, віддаємо випадкові страви як заглушку.");
            const randomDishes = menu.slice(0, 3).map(d => ({ ...d, ai_reason: "Рекомендація шефа (AI не зміг знайти ID)" }));
            return res.json(randomDishes);
        }

        res.json(finalResult);

    } catch (err) {
        console.error("Controller Error:", err.message);
        res.status(500).json({ error: 'Помилка при генерації рекомендацій' });
    }
};