import React from 'react';

const AboutPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Про VitalBite 🥗</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">Ми змінюємо підхід до харчування за допомогою штучного інтелекту.</p>
            </div>

            <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                <p>
                    <span className="font-bold text-green-600">VitalBite</span> — це не просто сервіс доставки їжі. Це ваш персональний нутриціолог у кишені.
                    Ми розуміємо, як важко рахувати калорії та слідкувати за БЖВ у сучасному ритмі життя, тому взяли це на себе.
                </p>

                <div className="grid md:grid-cols-3 gap-6 my-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="text-4xl mb-3">🤖</div>
                        <h3 className="font-bold text-xl mb-2 dark:text-white">AI Технології</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Наш алгоритм аналізує ваші потреби та підбирає ідеальний раціон.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="text-4xl mb-3">🍎</div>
                        <h3 className="font-bold text-xl mb-2 dark:text-white">Свіжість</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ми використовуємо тільки фермерські продукти найвищої якості.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="text-4xl mb-3">🛡️</div>
                        <h3 className="font-bold text-xl mb-2 dark:text-white">Безпека</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Суворий контроль алергенів. Ваше здоров'я — наш пріоритет.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;