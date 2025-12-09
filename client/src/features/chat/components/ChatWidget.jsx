import React, { useRef, useEffect } from 'react';
import useAiChat from '../hooks/useAiChat';

const ChatWidget = ({ isOpen, onClose, onRecommendationReceived }) => {
    const {
        messages,
        prompt,
        isLoading,
        setPrompt,
        sendMessage,
        quickActions
    } = useAiChat(onRecommendationReceived);

    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700 z-50 animate-slideUp">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-t-2xl flex justify-between items-center text-white shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🤖</span>
                    <div>
                        <h3 className="font-bold text-sm">AI Помічник</h3>
                        <p className="text-xs text-indigo-100 opacity-90">Онлайн</p>
                    </div>
                </div>
                <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-3">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-bl-none shadow-sm'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 dark:border-gray-600">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="px-4 pb-2 pt-2 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400 mb-2 ml-1">Швидкі запити:</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {quickActions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => sendMessage(action.query, action.display)}
                            disabled={isLoading}
                            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-100 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-gray-600 transition-colors shrink-0"
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-3 bg-white dark:bg-gray-800 rounded-b-2xl">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Напишіть запит..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-900 border-none rounded-full focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={isLoading || (!prompt && !isLoading)}
                        className={`p-2 rounded-full text-white transition-all ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWidget;