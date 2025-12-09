import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/db.js';
import menuRoutes from './routes/menuRoutes.js';
import userRoutes from './routes/userRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js'; 
import orderRoutes from './routes/orderRoutes.js';
import chatRoutes from './routes/chatRoutes.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
}));
app.use(express.json());

app.use('/api/menu', menuRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes); 

app.listen(PORT, () => {
    console.log(`✅ Сервер запущено на порту ${PORT}`);
});