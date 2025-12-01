import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Перевіряємо, чи є змінна DATABASE_URL (вона є тільки на Render)
const isProduction = !!process.env.DATABASE_URL;

const pool = new Pool({
    // Якщо є URL (Render) — використовуємо його, інакше (Local) — беремо параметри з .env
    connectionString: process.env.DATABASE_URL,

    // Якщо це продакшн (Render) — вмикаємо SSL, але дозволяємо самопідписані сертифікати Neon
    ssl: isProduction ? { rejectUnauthorized: false } : false,

    // Для локальної розробки (якщо немає DATABASE_URL, беруться ці змінні)
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Помилка підключення до БД:', err.message);
    }
    console.log('✅ Успішне підключення до PostgreSQL');
    release();
});

export default pool;