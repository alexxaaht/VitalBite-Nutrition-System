import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPersonalizedRecommendation } from '../services/aiService.js';

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Користувач з таким email вже існує' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            `INSERT INTO users (username, email, password_hash, weight, height, age, activity_level, allergies) 
             VALUES ($1, $2, $3, 70, 170, 25, 'moderate', '{}') 
             RETURNING id, username, email`,
            [username, email, passwordHash]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Помилка сервера');
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Невірний email або пароль' });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Невірний email або пароль' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                is_admin: user.is_admin,
                allergies: user.allergies,
                dislikes: user.dislikes || [],
                favorites: user.favorites || [],
                bio: user.bio,
                dietary_goal: user.dietary_goal
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Помилка сервера');
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await pool.query(
            `SELECT id, username, is_admin, email, weight, height, age, gender, 
                    activity_level, dietary_goal, allergies, dislikes, favorites, bio 
             FROM users WHERE id = $1`,
            [req.user.id]
        );
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Помилка сервера');
    }
};

export const updateProfile = async (req, res) => {
    const {
        weight, height, age, gender,
        activity_level, dietary_goal,
        allergies, dislikes, favorites, bio
    } = req.body;

    try {
        const updatedUser = await pool.query(
            `UPDATE users 
             SET weight = $1, height = $2, age = $3, gender = $4, activity_level = $5, 
                 dietary_goal = $6, allergies = $7, dislikes = $8, favorites = $9, bio = $10
             WHERE id = $11
             RETURNING id, username, email, weight, height, age, gender, activity_level, dietary_goal, allergies, dislikes, favorites, bio`,
            [weight, height, age, gender, activity_level, dietary_goal, allergies, dislikes, favorites, bio, req.user.id]
        );
        res.json(updatedUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Помилка оновлення профілю');
    }
};

export const getAIRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRequest = req.query.prompt || '';

        const userResult = await pool.query(
            `SELECT id, dietary_goal, allergies, dislikes, favorites, bio 
             FROM users WHERE id = $1`,
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "Користувача не знайдено" });
        }
        const userProfile = userResult.rows[0];

        const menuResult = await pool.query(`
            SELECT d.*, c.name as category_name 
            FROM dishes d
            LEFT JOIN categories c ON d.category_id = c.id
        `);
        const menuItems = menuResult.rows;

        if (menuItems.length === 0) {
            return res.status(404).json({ message: "Меню порожнє" });
        }

        const recommendations = await getPersonalizedRecommendation(userProfile, menuItems, userRequest);

        const fullRecommendations = recommendations.map(rec => {
            const dish = menuItems.find(d => d.id == rec.dish_id);
            if (!dish) return null;
            return { ...dish, ai_reason: rec.reason };
        }).filter(item => item !== null);

        res.json(fullRecommendations);

    } catch (err) {
        console.error("Помилка отримання AI рекомендацій:", err.message);
        res.status(500).json({ message: "Не вдалося згенерувати рекомендації" });
    }
};