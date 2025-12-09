import { useState } from 'react';
import api from '../../../services/api';

const useAiChat = (onSuccessCallback) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Привіт! 👋 Я ваш AI дієтолог. Оберіть швидку дію нижче або напишіть свій запит.' }
    ]);

    const quickActions = [
        { label: '📋 За профілем', query: '', display: '📋 Підібрати за моїми даними' },
        { label: '🥗 Обід', query: 'Хочу збалансований та смачний обід', display: '🥗 Хочу ідеальний обід' },
        { label: '🍏 Легка вечеря', query: 'Щось легке на вечерю, до 400 ккал', display: '🍏 Легка вечеря (<400 ккал)' },
        { label: '🍰 Хочу солодкого', query: 'Порадь корисний десерт або щось солодке', display: '🍰 Хочу щось солодке' },
    ];

    /**
     * @param {string|null} customQuery 
     * @param {string|null} customDisplay 
     */

    const sendMessage = async (customQuery = null, customDisplay = null) => {
        if (isLoading) return;

        const textToSend = customQuery !== null ? customQuery : prompt.trim();
        const textToDisplay = customDisplay || textToSend || '🔍 Підібрати за моїм профілем';

        if (!textToSend && customQuery === null) return;

        setMessages(prev => [...prev, { sender: 'user', text: textToDisplay }]);
        setPrompt('');
        setIsLoading(true);

        try {
            const response = await api.get('/users/recommendations', {
                params: { prompt: textToSend }
            });

            if (onSuccessCallback) {
                onSuccessCallback(response.data);
            }

            setMessages(prev => [...prev, {
                sender: 'ai',
                text: 'Готово! Я оновив рекомендації зверху сторінки. Смачного! 😋'
            }]);

        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                sender: 'ai',
                text: 'Вибачте, сталася помилка. Спробуйте ще раз.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        prompt,
        isLoading,
        quickActions,
        setPrompt,
        sendMessage
    };
};

export default useAiChat;