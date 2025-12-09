import axios from 'axios';

const API_URL = 'http://localhost:3001/api/chat';

export const getAiRecommendation = async (userText) => {
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios.post(
            `${API_URL}/recommend`,
            { prompt: userText },
            config
        );
        return response.data;
    } catch (error) {
        console.error("Помилка запиту до AI:", error);
        throw error;
    }
};