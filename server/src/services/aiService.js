import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Основна функція (Гібридна)
export const getPersonalizedRecommendation = async (userProfile, menuItems) => {
  try {
    console.log("📡 Спроба підключення до AI (Gemini)...");
    return await getGeminiRecommendation(userProfile, menuItems);
  } catch (error) {
    console.error("⚠️ AI недоступний (або помилка):", error.message);
    console.log("🔄 Перемикання на локальний алгоритм рекомендацій...");
    return getLocalRecommendation(userProfile, menuItems);
  }
};

// Логіка Google Gemini 
const getGeminiRecommendation = async (userProfile, menuItems) => {
  const simplifiedMenu = menuItems.map(item => ({
    id: item.id,
    name: item.name,
    ingredients: item.ingredients || [],
    info: `Ккал:${item.calories}, Білки:${item.proteins}, Жири:${item.fats}`
  }));

  const prompt = `
    Ти дієтолог.
    Клієнт: Мета - ${userProfile.dietary_goal}, Алергії - ${userProfile.allergies.join(', ') || 'Немає'}.
    
    Меню: ${JSON.stringify(simplifiedMenu)}
    
    Завдання:
    1. Виключи алергени.
    2. Вибери 3 найкращі страви.
    3. JSON формат: { "recommendations": [{ "dish_id": 1, "reason": "..." }] }
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

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
      dish.ingredients && dish.ingredients.some(ing => ing.includes(allergen))
    );
    return !hasAllergen;
  });

  if (userProfile.dietary_goal === 'lose_weight') {
    safeDishes.sort((a, b) => a.calories - b.calories);
  } else if (userProfile.dietary_goal === 'gain_muscle') {
    safeDishes.sort((a, b) => b.proteins - a.proteins);
  } else {
    safeDishes.sort((a, b) => Math.abs(a.calories - 500) - Math.abs(b.calories - 500));
  }

  const top3 = safeDishes.slice(0, 3);

  return top3.map(dish => ({
    dish_id: dish.id,
    reason: `⚡ (Алгоритм) Підібрано під мету: ${userProfile.dietary_goal === 'lose_weight' ? 'Низька калорійність' : 'Високий вміст білка'}`
  }));
};