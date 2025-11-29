import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
                allergies: user.allergies
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Помилка сервера');
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await pool.query('SELECT id, username, is_admin, email, weight, height, age, gender, activity_level, allergies FROM users WHERE id = $1', [req.user.id]);
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Помилка сервера');
    }
};

export const updateProfile = async (req, res) => {
    const { weight, height, age, gender, activity_level, allergies, dietary_goal } = req.body;

    try {
        const updatedUser = await pool.query(
            `UPDATE users 
       SET weight = $1, height = $2, age = $3, gender = $4, activity_level = $5, allergies = $6, dietary_goal = $7
       WHERE id = $8
       RETURNING id, username, email, weight, height, age, gender, activity_level, allergies, dietary_goal`,
            [weight, height, age, gender, activity_level, allergies, dietary_goal, req.user.id]
        );

        res.json(updatedUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Помилка оновлення профілю');
    }
};