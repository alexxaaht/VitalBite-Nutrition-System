-- =============================================
-- VITALBITE DATABASE SCHEMA
-- =============================================

-- 1. Очищення старих даних 
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS dishes CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS gender_type;
DROP TYPE IF EXISTS activity_type;
DROP TYPE IF EXISTS goal_type;

-- 2. Типи даних (ENUMS)
CREATE TYPE gender_type AS ENUM ('male', 'female');
CREATE TYPE activity_type AS ENUM ('sedentary', 'light', 'moderate', 'active', 'very_active');
CREATE TYPE goal_type AS ENUM ('lose_weight', 'maintain', 'gain_muscle');

-- 3. Таблиця Користувачів
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Фізіологічні дані
    age INT,
    weight DECIMAL(5, 2), -- кг
    height DECIMAL(5, 2), -- см
    gender gender_type,
    activity_level activity_type DEFAULT 'moderate',
    dietary_goal goal_type DEFAULT 'maintain',
    
    -- Медичні дані
    allergies TEXT[], 
    
    -- Права доступу
    is_admin BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Таблиця Категорій
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL
);

-- 5. Таблиця Страв
CREATE TABLE dishes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT, 
    detailed_description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    
    -- Макронутрієнти
    calories INT DEFAULT 0,
    proteins DECIMAL(5, 1) DEFAULT 0,
    fats DECIMAL(5, 1) DEFAULT 0,
    carbs DECIMAL(5, 1) DEFAULT 0,
    
    -- Склад і Теги
    ingredients TEXT[],
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_spicy BOOLEAN DEFAULT FALSE
);

-- 6. Таблиця Замовлень
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    total_calories INT NOT NULL,
    status VARCHAR(20) DEFAULT 'new', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Деталі Замовлень
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    dish_id INT REFERENCES dishes(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    price_at_moment DECIMAL(10, 2) NOT NULL
);

-- =============================================
-- ДАНІ (SEED DATA)
-- =============================================

-- Категорії
INSERT INTO categories (name, slug) VALUES 
('Сніданки', 'breakfast'),
('Салати', 'salads'),
('Основні страви', 'main'),
('Супи', 'soups'),
('Десерти', 'desserts'),
('Напої', 'drinks');

-- Страви

-- СНІДАНКИ
INSERT INTO dishes (name, description, detailed_description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients, is_gluten_free) VALUES
('Авокадо Тост з Лососем', 
 'Хрусткий цільнозерновий тост із гуакамоле та слайсами лосося.', 
 'Король корисних сніданків. Підсмажений хліб із цільного зерна, щедрий шар ніжного крему з авокадо Хаас, слайси слабосоленого лосося преміум-якості та яйце пашот. Страва багата на корисні Омега-3 жирні кислоти та складні вуглеводи, що дарують енергію на весь день.', 
 240.00, 1, 420, 22.5, 28.0, 35.0, 'https://images.unsplash.com/photo-1603046891727-d64c112953f0?auto=format&fit=crop&w=800&q=80', ARRAY['bread', 'avocado', 'salmon', 'egg', 'lemon'], FALSE),

('Вівсянка з ягодами та медом', 
 'Класична вівсяна каша на воді або молоці зі свіжими ягодами.', 
 'Ідеальний початок дня. Вівсяні пластівці довгого варіння, приготовані до ніжної консистенції. Подається зі свіжою лохиною, полуницею та поливається натуральним квітковим медом. Джерело складних вуглеводів.', 
 95.00, 1, 320, 6.0, 5.0, 55.0, 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80', ARRAY['oats', 'milk', 'honey', 'blueberries', 'strawberries'], FALSE),

('Омлет зі шпинатом та фетою', 
 'Повітряний омлет із трьох яєць зі свіжим шпинатом та сиром.', 
 'Білковий сніданок для енергійного дня. Збиті яйця, обсмажені з листям молодого шпинату та шматочками солоної фети. Подається з міксом салату.', 
 145.00, 1, 380, 22.0, 28.0, 4.0, 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80', ARRAY['eggs', 'spinach', 'feta cheese', 'oil', 'salt'], TRUE);

-- САЛАТИ
INSERT INTO dishes (name, description, detailed_description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients, is_vegetarian, is_gluten_free) VALUES
('Боул з Кіноа та Тофу', 
 'Легкий та поживний боул з кіноа, тофу-гриль та соусом тахіні.', 
 'Ідеально збалансована веганська страва. Ніжний тофу, обсмажений на грилі, подається з розсипчастою кіноа, хрусткими бобами едамаме та свіжими овочами. Всі інгредієнти поєднані фірмовим горіховим соусом тахіні, що додає страві насиченості та корисних жирів.', 
 195.00, 2, 380, 18.0, 15.5, 45.0, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', ARRAY['quinoa', 'tofu', 'edamame', 'cucumber', 'tahini', 'sesame'], TRUE, TRUE),

('Цезар з креветками', 
 'Класичний салат з тигровими креветками, пармезаном та сухариками.', 
 'Хрустке листя салату Ромен, соковиті тигрові креветки гриль, перепелині яйця та пластівці Пармезану. Заправлений фірмовим соусом Цезар на основі анчоусів.', 
 260.00, 2, 410, 28.0, 25.0, 15.0, 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80', ARRAY['shrimp', 'lettuce', 'parmesan', 'croutons', 'eggs', 'sauce'], FALSE, FALSE),

('Грецький салат', 
 'Свіжі овочі, оливки Каламата та сир Фета.', 
 'Легкий та вітамінний салат. Великі шматки огірків, томатів, солодкого перцю та червоної цибулі. Доповнено справжніми грецькими оливками та шматком ніжної фети. Заправлено орегано та оливковою олією.', 
 180.00, 2, 290, 8.0, 22.0, 10.0, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80', ARRAY['tomato', 'cucumber', 'feta cheese', 'olives', 'onion', 'olive oil'], TRUE, TRUE);

-- ОСНОВНІ СТРАВИ
INSERT INTO dishes (name, description, detailed_description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients, is_gluten_free) VALUES
('Стейк Рібай з Овочами', 
 'Соковитий стейк із мармурової яловичини з овочами гриль.', 
 'Класика для справжніх м''ясоїдів. Стейк із добірної яловичини зернової відгодівлі, обсмажений до ідеальної скоринки зі збереженням соковитості всередині. Подається з гарніром із сезонних овочів-гриль (цукіні, солодкий перець, баклажан), приправлених гілочкою розмарину та морською сіллю. Потужне джерело білка та заліза.', 
 450.00, 3, 650, 48.0, 45.0, 10.0, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80', ARRAY['beef', 'zucchini', 'bell pepper', 'oil', 'rosemary'], TRUE),

('Лосось гриль зі спаржею', 
 'Філе лосося на грилі з молодою спаржею та лимоном.', 
 'Корисна та вишукана вечеря. Свіже філе атлантичного лосося, приготоване на грилі до золотої скоринки. Гарнірується бланшированою спаржею та часточкою лимона. Багато Омега-3.', 
 420.00, 3, 480, 34.0, 28.0, 6.0, 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=800&q=80', ARRAY['salmon', 'asparagus', 'lemon', 'olive oil', 'spices'], TRUE),

('Куряче філе з диким рисом', 
 'Дієтичне куряче філе су-від з гарніром із чорного рису.', 
 'Ідеальний вибір для спортсменів. Куряча грудка, приготована методом су-від (максимально соковита та корисна), подається з відвареним диким рисом та броколі.', 
 210.00, 3, 350, 32.0, 5.0, 45.0, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80', ARRAY['chicken', 'wild rice', 'broccoli', 'salt'], TRUE);

-- СУПИ
INSERT INTO dishes (name, description, detailed_description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients, is_gluten_free) VALUES
('Гарбузовий Крем-суп', 
 'Ніжний суп з печеного гарбуза з кокосовим молоком та насінням.', 
 'Оксамитовий зігріваючий суп на основі запеченого солодкого гарбуза. Замість вершків ми використовуємо кокосове молоко, що робить страву легкою та підходящою для веганів. Подається з хрустким гарбузовим насінням та краплею оливкової олії для багатства смаку.', 
 120.00, 4, 210, 4.0, 12.0, 25.0, 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=800&q=80', ARRAY['pumpkin', 'coconut milk', 'onion', 'pumpkin seeds'], TRUE),

('Український Борщ', 
 'Традиційний червоний борщ з телятиною та сметаною.', 
 'Насичений та ароматний, зварений на м’ясному бульйоні з додаванням буряка, капусти, картоплі та моркви. Подається зі сметаною та зеленню.', 
 140.00, 4, 320, 18.0, 14.0, 25.0, 'https://images.unsplash.com/photo-1546506671-f1c3d7b6433d?auto=format&fit=crop&w=800&q=80', ARRAY['beef', 'beetroot', 'cabbage', 'potato', 'carrot', 'sour cream'], FALSE),

('Грибний крем-суп', 
 'Ніжний суп з печериць та білих грибів з вершками.', 
 'Густий суп з насиченим грибним смаком. Готується з суміші печериць та сушених білих грибів з додаванням вершків та цибулі. Подається з грінками.', 
 130.00, 4, 280, 6.0, 20.0, 15.0, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80', ARRAY['mushrooms', 'cream', 'onion', 'potato', 'croutons'], FALSE);

-- ДЕСЕРТИ
INSERT INTO dishes (name, description, detailed_description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients, is_gluten_free) VALUES
('Чізкейк Нью-Йорк', 
 'Класичний десерт на пісочній основі з ягідним соусом.', 
 'Легендарний десерт за традиційним рецептом. Має щільну, але водночас кремову текстуру завдяки якісному вершковому сиру та ноткам натуральної ванілі. Подається з кисло-солодким соусом із лісових ягід (малина, чорниця), який ідеально відтіняє солодкість основи. Містить глютен та лактозу.', 
 110.00, 5, 450, 7.0, 28.0, 38.0, 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=800&q=80', ARRAY['cheese', 'cream', 'sugar', 'flour', 'eggs', 'berries'], FALSE),

('Мафін шоколадний з бананом', 
 'Пухкий шоколадний десерт на основі стиглих бананів та малини.', 
 'Вологий та неймовірно ароматний мафін без додавання рафінованого цукру. Природну солодкість забезпечує пюре зі стиглих бананів, а глибокий смак — якісне какао. Всередині прихована свіжа малина, яка додає десерту яскравої кислинки та свіжості.', 
 90.00, 5, 400, 4.7, 5.5, 51.0, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80', ARRAY['banana', 'cocoa', 'flour', 'sugar', 'raspberries'], FALSE),

('Чіа-пудинг з манго', 
 'Корисний десерт на кокосовому молоці без цукру.', 
 'Суперфуд у вигляді десерту. Насіння чіа, замочене в кокосовому молоці, з шаром пюре зі стиглого манго. Багатий на клітковину та не містить глютену.', 
 115.00, 5, 240, 5.0, 12.0, 28.0, 'https://images.unsplash.com/photo-1490474504059-bf6201b70190?auto=format&fit=crop&w=800&q=80', ARRAY['chia seeds', 'coconut milk', 'mango', 'honey'], TRUE);

-- НАПОЇ
INSERT INTO dishes (name, description, detailed_description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients, is_gluten_free) VALUES
('Зелений чай з жасмином', 
 'Ароматний листовий чай.', 
 'Високоякісний китайський зелений чай з квітками жасмину. Тонізує та заспокоює. Подається у чайнику.', 
 65.00, 6, 2, 0.0, 0.0, 0.5, 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=800&q=80', ARRAY['green tea', 'jasmine', 'water'], TRUE),

('Ягідний Смузі', 
 'Вітамінний коктейль з полуниці, чорниці та банана.', 
 'Густий напій зі свіжоморожених ягід та банана. Без додавання цукру. Чудово освіжає та наповнює вітамінами.', 
 90.00, 6, 180, 2.0, 0.5, 40.0, 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=800&q=80', ARRAY['strawberry', 'blueberry', 'banana', 'water', 'mint'], TRUE),

('Фреш Апельсиновий', 
 'Свіжовичавлений сік із солодких апельсинів.', 
 '100% натуральний сік. Готується безпосередньо перед подачею з охолоджених апельсинів. Заряд вітаміну С.', 
 110.00, 6, 112, 1.4, 0.4, 26.0, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80', ARRAY['orange'], TRUE);