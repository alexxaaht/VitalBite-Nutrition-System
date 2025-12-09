import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getPersonalizedRecommendation = async (userProfile, menuItems) => {
  try {
    console.log("📡 Спроба підключення до AI (Gemini)...");
    return await getGeminiRecommendation(userProfile, menuItems);
  } catch (error) {
    console.error("⚠️ AI недоступний:", error.message);

    if (error.message.includes('429') || error.message.includes('503')) {
      console.log("⏳ Перевищено ліміт запитів до AI. Використовуємо локальний алгоритм.");
    }

    return getLocalRecommendation(userProfile, menuItems);
  }
};

const getGeminiRecommendation = async (userProfile, menuItems) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const menuList = menuItems.map(item =>
    `- ID: ${item.id}, Назва: ${item.name}, Ккал: ${item.calories}, Білки: ${item.proteins}, Жири: ${item.fats}, Вугл: ${item.carbs}, Склад: ${item.ingredients ? item.ingredients.join(', ') : 'Не вказано'}`
  ).join('\n');

  const allergies = userProfile.allergies?.length > 0 ? userProfile.allergies.join(', ') : 'Немає';
  const dislikes = userProfile.dislikes?.length > 0 ? userProfile.dislikes.join(', ') : 'Немає';
  const favorites = userProfile.favorites?.length > 0 ? userProfile.favorites.join(', ') : 'Немає';
  const bio = userProfile.bio || 'Немає';

  const prompt = `
    Ти досвідчений дієтолог. Підбери страви.
    
    ПРОФІЛЬ:
    - Ціль: ${userProfile.dietary_goal}
    - Алергії (ВИКЛЮЧИТИ): ${allergies}
    - Не любить: ${dislikes}
    - Любить: ${favorites}
    - Побажання: ${bio}

    МЕНЮ:
    ${menuList}

    ЗАВДАННЯ:
    1. Вибери ТОП-3 страви.
    2. Виключи алергени.
    3. JSON формат відповіді:
    {
      "recommendations": [
        { "dish_id": 1, "reason": "Коротке пояснення" }
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  console.log("🤖 Відповідь Gemini:", text); // Лог для перевірки

  text = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const jsonStartIndex = text.indexOf('{');
  const jsonEndIndex = text.lastIndexOf('}');

  if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
    text = text.substring(jsonStartIndex, jsonEndIndex + 1);
  }

  const data = JSON.parse(text);
  return data.recommendations || [];
};

const getLocalRecommendation = (userProfile, menuItems) => {
  let safeDishes = menuItems.filter(dish => {
    if (!userProfile.allergies || userProfile.allergies.length === 0) return true;
    const hasAllergen = userProfile.allergies.some(allergen =>
      dish.ingredients && dish.ingredients.some(ing => ing.toLowerCase().includes(allergen.toLowerCase()))
    );
    return !hasAllergen;
  });

  if (userProfile.dietary_goal === 'lose_weight') {
    safeDishes.sort((a, b) => (a.calories || 0) - (b.calories || 0));
  } else if (userProfile.dietary_goal === 'gain_muscle') {
    safeDishes.sort((a, b) => (b.proteins || 0) - (a.proteins || 0));
  } else {
    safeDishes.sort((a, b) => Math.abs((a.calories || 0) - 500) - Math.abs((b.calories || 0) - 500));
  }

  return safeDishes.slice(0, 3).map(dish => ({
    dish_id: dish.id,
    reason: `⚡ (Алгоритм) Підібрано під мету: ${userProfile.dietary_goal === 'lose_weight' ? 'Низька калорійність' : 'Збалансоване харчування'}`
  }));
};
