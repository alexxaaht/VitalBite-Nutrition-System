-- =============================================
-- VITALBITE DATABASE SCHEMA & SEED DATA
-- =============================================

-- 1. Очищення старих даних та таблиць
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
    is_vegetarian BOOLEAN DEFAULT FALSE, -- (додано у вашому сіді, тому додаємо колонку сюди якщо її не було, або використовуємо існуючу)
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
-- ДАНІ (SEED DATA) - НОВЕ МЕНЮ (50 СТРАВ)
-- =============================================

-- Скидаємо лічильники ID (про всяк випадок, хоча таблиці перестворені)
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE dishes_id_seq RESTART WITH 1;

-- Вставляємо Категорії
INSERT INTO categories (name, slug) VALUES 
('Сніданки', 'breakfast'),   -- id 1
('Салати', 'salads'),        -- id 2
('Основні страви', 'main'),  -- id 3
('Супи', 'soups'),           -- id 4
('Десерти', 'desserts'),     -- id 5
('Напої', 'drinks');         -- id 6

-- Вставляємо Страви

-- === КАТЕГОРІЯ 1: СНІДАНКИ ===
INSERT INTO dishes (name, description, detailed_description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients, is_gluten_free, is_vegetarian) VALUES
('Авокадо Тост з Лососем', 
 'Хрусткий цільнозерновий тост із гуакамоле та слайсами лосося.', 
 'Король корисних сніданків. Підсмажений хліб, ніжний крем з авокадо Хаас, слабосолений лосось та яйце пашот.', 
 240.00, 1, 420, 22.5, 28.0, 35.0, 'https://images.unsplash.com/photo-1603046891727-d64c112953f0?auto=format&fit=crop&w=800&q=80', ARRAY['bread', 'avocado', 'salmon', 'egg', 'lemon'], FALSE, FALSE),

('Вівсянка з ягодами та медом', 
 'Класична вівсяна каша на воді або молоці зі свіжими ягодами.', 
 'Вівсяні пластівці довгого варіння, подаються з лохиною, полуницею та натуральним медом.', 
 95.00, 1, 320, 6.0, 5.0, 55.0, 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80', ARRAY['oats', 'milk', 'honey', 'blueberries', 'strawberries'], FALSE, TRUE),

('Омлет зі шпинатом та фетою', 
 'Повітряний омлет із трьох яєць зі свіжим шпинатом та сиром.', 
 'Білковий сніданок. Збиті яйця зі шпинатом та солоною фетою. Подається з міксом салату.', 
 145.00, 1, 380, 22.0, 28.0, 4.0, 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80', ARRAY['eggs', 'spinach', 'feta cheese', 'oil'], TRUE, TRUE),

('Сирники домашні', 
 'Ніжні сирники зі сметаною та ягідним джемом.', 
 'Традиційний український сніданок з домашнього кисломолочного сиру. Подаються рум’яними та теплими.', 
 160.00, 1, 450, 28.0, 20.0, 38.0, 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?auto=format&fit=crop&w=800&q=80', ARRAY['cottage cheese', 'flour', 'eggs', 'sugar', 'sour cream', 'jam'], FALSE, TRUE),

('Шакшука класична', 
 'Яйця, запечені в пряному соусі з томатів та перцю.', 
 'Близькосхідний хіт. Яйця пашот у густому соусі з помідорів, чилі, цибулі та зіри. Подається з пітою.', 
 175.00, 1, 360, 18.0, 22.0, 15.0, 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80', ARRAY['eggs', 'tomato', 'pepper', 'onion', 'spices'], FALSE, TRUE),

('Англійський сніданок', 
 'Ситний набір: ковбаски, квасоля, бекон, яйця та тости.', 
 'Сніданок чемпіонів. Смажені ковбаски, хрусткий бекон, яєчня, тушкована квасоля в томаті та гриби.', 
 290.00, 1, 850, 45.0, 60.0, 30.0, 'https://images.unsplash.com/photo-1533089862017-5614ec45e25a?auto=format&fit=crop&w=800&q=80', ARRAY['sausages', 'bacon', 'eggs', 'beans', 'mushrooms', 'toast'], FALSE, FALSE),

('Яйця Бенедикт з беконом', 
 'Тост бріош, хрусткий бекон, яйце пашот та голландський соус.', 
 'Класика світової кухні. Ніжний соус холандез ідеально поєднується з жовтком, що витікає.', 
 220.00, 1, 510, 24.0, 35.0, 28.0, 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80', ARRAY['brioche', 'bacon', 'eggs', 'hollandaise sauce'], FALSE, FALSE),

('Панкейки з кленовим сиропом', 
 'Пухкі американські млинці з вершковим маслом.', 
 'Стопка пухких панкейків, щедро полита канадським кленовим сиропом та прикрашена ягодами.', 
 150.00, 1, 480, 8.0, 12.0, 75.0, 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80', ARRAY['flour', 'milk', 'eggs', 'maple syrup', 'butter'], FALSE, TRUE);


-- === КАТЕГОРІЯ 2: САЛАТИ ===
INSERT INTO dishes (name, description, detailed_description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients, is_vegetarian, is_gluten_free) VALUES
('Боул з Кіноа та Тофу', 
 'Легкий та поживний боул з кіноа, тофу-гриль та соусом тахіні.', 
 'Веганська страва. Тофу гриль, кіноа, боби едамаме, огірок та горіховий соус.', 
 195.00, 2, 380, 18.0, 15.5, 45.0, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', ARRAY['quinoa', 'tofu', 'edamame', 'cucumber', 'tahini'], TRUE, TRUE),

('Цезар з креветками', 
 'Класичний салат з тигровими креветками, пармезаном та сухариками.', 
 'Салат Ромен, креветки гриль, пармезан, грінки та фірмовий соус.', 
 260.00, 2, 410, 28.0, 25.0, 15.0, 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80', ARRAY['shrimp', 'lettuce', 'parmesan', 'croutons', 'eggs', 'sauce'], FALSE, FALSE),

('Грецький салат', 
 'Свіжі овочі, оливки Каламата та сир Фета.', 
 'Огірки, томати, перець, червона цибуля, оливки та шматок фети з орегано.', 
 180.00, 2, 290, 8.0, 22.0, 10.0, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80', ARRAY['tomato', 'cucumber', 'feta cheese', 'olives', 'onion'], TRUE, TRUE),

('Капрезе', 
 'Італійська класика: моцарела, томати та песто.', 
 'Ніжна моцарела буффало, стиглі томати, свіжий базилік та соус песто.', 
 210.00, 2, 340, 18.0, 26.0, 5.0, 'https://images.unsplash.com/photo-1529312266912-b33cf6227e24?auto=format&fit=crop&w=800&q=80', ARRAY['mozzarella', 'tomato', 'basil', 'pesto', 'olive oil'], TRUE, TRUE),

('Салат з качкою та манго', 
 'Мікс салатів з качиним філе та солодким манго.', 
 'Вишукане поєднання копченої качиної грудки, соковитого манго та кедрових горішків під цитрусовою заправкою.', 
 285.00, 2, 390, 25.0, 20.0, 18.0, 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=800&q=80', ARRAY['duck breast', 'mango', 'lettuce', 'pine nuts', 'citrus dressing'], FALSE, TRUE),

('Нісуаз з тунцем', 
 'Французький салат з тунцем, квасолею та яйцем.', 
 'Свіжий тунець (medium rare), стручкова квасоля, картопля бебі, анчоуси та яйце.', 
 310.00, 2, 440, 35.0, 22.0, 18.0, 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80', ARRAY['tuna', 'green beans', 'potato', 'eggs', 'anchovies'], FALSE, TRUE),

('Теплий салат з телятиною', 
 'Мікс салату з обсмаженою телятиною та овочами гриль.', 
 'Ситний салат зі шматочками вирізки, баклажаном, цукіні та болгарським перцем.', 
 270.00, 2, 380, 28.0, 24.0, 12.0, 'https://images.unsplash.com/photo-1550951177-3e117469796e?auto=format&fit=crop&w=800&q=80', ARRAY['beef', 'eggplant', 'zucchini', 'pepper', 'lettuce'], FALSE, TRUE);


-- === КАТЕГОРІЯ 3: ОСНОВНІ СТРАВИ ===
INSERT INTO dishes (name, description, detailed_description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients, is_gluten_free, is_vegetarian) VALUES
('Стейк Рібай з Овочами', 
 'Соковитий стейк із мармурової яловичини з овочами гриль.', 
 'Преміальна яловичина зернової відгодівлі, овочі гриль та розмарин.', 
 450.00, 3, 650, 48.0, 45.0, 10.0, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80', ARRAY['beef', 'zucchini', 'bell pepper', 'oil'], FALSE, TRUE),

('Лосось гриль зі спаржею', 
 'Філе лосося на грилі з молодою спаржею.', 
 'Атлантичний лосось з хрусткою скоринкою та бланшированою спаржею.', 
 420.00, 3, 480, 34.0, 28.0, 6.0, 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=800&q=80', ARRAY['salmon', 'asparagus', 'lemon', 'spices'], FALSE, TRUE),

('Куряче філе з диким рисом', 
 'Дієтичне куряче філе су-від з чорним рисом.', 
 'Ніжна куряча грудка (су-від), дикий рис та броколі на пару.', 
 210.00, 3, 350, 32.0, 5.0, 45.0, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80', ARRAY['chicken', 'wild rice', 'broccoli', 'salt'], FALSE, TRUE),

('Паста Карбонара', 
 'Спагеті з гуанчале, жовтком та пекоріно.', 
 'Класика. Тільки жовтки, сир пекоріно романо, гуанчале та чорний перець.', 
 280.00, 3, 580, 22.0, 30.0, 55.0, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80', ARRAY['spaghetti', 'guanciale', 'eggs', 'pecorino cheese', 'black pepper'], FALSE, FALSE),

('Котлета по-київськи', 
 'Легендарна українська страва з пюре та зеленим горошком.', 
 'Куряче філе в паніровці з шматочком вершкового масла та зеленню всередині. Подається з ніжним картопляним пюре.', 
 230.00, 3, 620, 28.0, 35.0, 42.0, 'https://images.unsplash.com/photo-1621852004158-b3c0dd580879?auto=format&fit=crop&w=800&q=80', ARRAY['chicken', 'butter', 'dill', 'breadcrumbs', 'potato'], FALSE, FALSE),

('Хачапурі по-аджарськи', 
 'Човник з тіста з сиром сулугуні та жовтком.', 
 'Грузинська класика. Гарячий сир сулугуні, запечений у дріжджовому тісті з додаванням вершкового масла та яйця.', 
 245.00, 3, 750, 25.0, 38.0, 60.0, 'https://images.unsplash.com/photo-1624300626315-18880628d0eb?auto=format&fit=crop&w=800&q=80', ARRAY['flour', 'suluguni cheese', 'eggs', 'butter'], FALSE, TRUE),

('Пад Тай з куркою', 
 'Тайська смажена рисова локшина з кисло-солодким соусом.', 
 'Рисова локшина, обсмажена з куркою, яйцем, тофу, арахісом та паростками сої в соусі тамаринд.', 
 265.00, 3, 520, 26.0, 18.0, 65.0, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80', ARRAY['rice noodles', 'chicken', 'peanuts', 'tofu', 'egg', 'tamarind sauce'], FALSE, FALSE),

('Лазанья Болоньєзе', 
 'Італійська запіканка з м’ясним рагу та соусом бешамель.', 
 'Багатошарова паста з рагу болоньєзе (яловичина), соусом бешамель та пармезаном.', 
 290.00, 3, 680, 32.0, 38.0, 48.0, 'https://images.unsplash.com/photo-1574868233977-458734e8c147?auto=format&fit=crop&w=800&q=80', ARRAY['pasta sheets', 'beef', 'tomato sauce', 'milk', 'cheese'], FALSE, FALSE),

('Різотто з білими грибами', 
 'Кремовий рис Арборіо з лісовими грибами.', 
 'Насичений смак білих грибів, вершкове масло, пармезан та трюфельна олія.', 
 295.00, 3, 490, 12.0, 24.0, 52.0, 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80', ARRAY['rice arborio', 'porcini mushrooms', 'parmesan', 'butter', 'wine'], TRUE, TRUE),

('Хінкалі з бараниною (3 шт)', 
 'Грузинські мішечки з тіста з пряним м’ясом та бульйоном.', 
 'Традиційні хінкалі з рубленою бараниною, кінзою та перцем. Їсти руками!', 
 180.00, 3, 450, 18.0, 20.0, 48.0, 'https://images.unsplash.com/photo-1628286952771-8656722d99c7?auto=format&fit=crop&w=800&q=80', ARRAY['flour', 'mutton', 'onion', 'cilantro', 'spices'], FALSE, FALSE),

('Деруни зі сметаною', 
 'Хрусткі картопляні оладки з грибним соусом.', 
 'Золотисті деруни зі смаженою цибулею. Подаються зі сметаною або грибною підливою.', 
 165.00, 3, 540, 8.0, 32.0, 50.0, 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=800&q=80', ARRAY['potato', 'onion', 'flour', 'sour cream'], FALSE, TRUE),

('Банош з бринзою', 
 'Гуцульська кукурудзяна каша на вершках зі шкварками.', 
 'Ситна страва Карпат. Кукурудзяна крупа, зварена на сметані, з овечою бринзою та шкварками.', 
 190.00, 3, 610, 15.0, 40.0, 45.0, 'https://images.unsplash.com/photo-1598155523122-38423ae4d6c8?auto=format&fit=crop&w=800&q=80', ARRAY['cornmeal', 'sour cream', 'brynza', 'bacon'], TRUE, FALSE),

('Рамен з куркою', 
 'Японський суп-локшина з яйцем та норі.', 
 'Насичений курячий бульйон, пшенична локшина, мариноване яйце, курка теріякі та зелена цибуля.', 
 255.00, 3, 560, 28.0, 22.0, 55.0, 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=800&q=80', ARRAY['noodles', 'chicken broth', 'chicken', 'egg', 'nori'], FALSE, FALSE);


-- === КАТЕГОРІЯ 4: СУПИ ===
INSERT INTO dishes (name, description, detailed_description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients, is_gluten_free, is_vegetarian) VALUES
('Гарбузовий Крем-суп', 
 'Ніжний суп з печеного гарбуза з кокосовим молоком.', 
 'Оксамитовий суп на кокосовому молоці з гарбузовим насінням. Веган френдлі.', 
 120.00, 4, 210, 4.0, 12.0, 25.0, 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=800&q=80', ARRAY['pumpkin', 'coconut milk', 'onion', 'pumpkin seeds'], TRUE, TRUE),

('Український Борщ', 
 'Традиційний червоний борщ з телятиною та сметаною.', 
 'Зварений на м’ясному бульйоні з буряком. Подається з пампушками з часником.', 
 140.00, 4, 320, 18.0, 14.0, 25.0, 'https://images.unsplash.com/photo-1546506671-f1c3d7b6433d?auto=format&fit=crop&w=800&q=80', ARRAY['beef', 'beetroot', 'cabbage', 'potato', 'sour cream'], FALSE, FALSE),

('Грибний крем-суп', 
 'Суп з лісових грибів на вершках.', 
 'Густий суп з білих грибів та печериць. Подається з грінками.', 
 130.00, 4, 280, 6.0, 20.0, 15.0, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80', ARRAY['mushrooms', 'cream', 'onion', 'potato', 'croutons'], FALSE, TRUE),

('Том Ям з креветками', 
 'Гострий тайський суп на кокосовому молоці.', 
 'Кисло-гострий смак, креветки, кальмари, гриби шиітаке та кінза. Подається з рисом.', 
 320.00, 4, 350, 22.0, 18.0, 12.0, 'https://images.unsplash.com/photo-1548943487-a2e4e43b485c?auto=format&fit=crop&w=800&q=80', ARRAY['shrimp', 'coconut milk', 'lemongrass', 'mushrooms', 'chili'], TRUE, FALSE),

('Мінестроне', 
 'Легкий італійський овочевий суп.', 
 'Багато сезонних овочів, квасоля та трохи пасти в прозорому бульйоні з песто.', 
 115.00, 4, 180, 6.0, 5.0, 25.0, 'https://images.unsplash.com/photo-1594966606085-f8ce6b01479d?auto=format&fit=crop&w=800&q=80', ARRAY['zucchini', 'carrot', 'beans', 'pasta', 'tomato'], FALSE, TRUE),

('Курячий бульйон', 
 'Цілющий прозорий бульйон з локшиною та яйцем.', 
 'Домашній смак. Домашня локшина, перепелине яйце та шматочки курки.', 
 95.00, 4, 150, 12.0, 5.0, 15.0, 'https://images.unsplash.com/photo-1627915579294-f2549247c439?auto=format&fit=crop&w=800&q=80', ARRAY['chicken broth', 'noodles', 'egg', 'carrot'], FALSE, FALSE);


-- === КАТЕГОРІЯ 5: ДЕСЕРТИ ===
INSERT INTO dishes (name, description, detailed_description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients, is_gluten_free, is_vegetarian) VALUES
('Чізкейк Нью-Йорк', 
 'Класичний десерт на пісочній основі з ягідним соусом.', 
 'Щільна кремова текстура, ваніль та соус із малини.', 
 110.00, 5, 450, 7.0, 28.0, 38.0, 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=800&q=80', ARRAY['cheese', 'cream', 'sugar', 'flour', 'berries'], FALSE, TRUE),

('Мафін шоколадний з бананом', 
 'Пухкий десерт без цукру з бананом та какао.', 
 'Вологий мафін на основі бананового пюре з малиною.', 
 90.00, 5, 400, 4.7, 5.5, 51.0, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80', ARRAY['banana', 'cocoa', 'flour', 'raspberries'], FALSE, TRUE),

('Чіа-пудинг з манго', 
 'Корисний десерт на кокосовому молоці.', 
 'Насіння чіа в кокосовому молоці з шаром пюре манго. Без цукру.', 
 115.00, 5, 240, 5.0, 12.0, 28.0, 'https://images.unsplash.com/photo-1490474504059-bf6201b70190?auto=format&fit=crop&w=800&q=80', ARRAY['chia seeds', 'coconut milk', 'mango'], TRUE, TRUE),

('Тірамісу', 
 'Італійський десерт з савоярді та маскарпоне.', 
 'Печиво, просочене еспресо та амарето, ніжний крем з маскарпоне та какао.', 
 165.00, 5, 420, 8.0, 24.0, 40.0, 'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=800&q=80', ARRAY['mascarpone', 'savoiardi', 'coffee', 'eggs', 'cocoa'], FALSE, TRUE),

('Вареники з вишнею', 
 'Українські вареники на пару з соковитою вишнею.', 
 'Тонке тісто, багато кисло-солодкої вишні. Подаються зі сметаною та цукром.', 
 140.00, 5, 380, 6.0, 8.0, 65.0, 'https://images.unsplash.com/photo-1510626353982-f384a5665805?auto=format&fit=crop&w=800&q=80', ARRAY['flour', 'cherries', 'sugar', 'sour cream'], FALSE, TRUE),

('Наполеон', 
 'Багатошаровий торт із заварним кремом.', 
 'Хрусткі коржі з листкового тіста та ніжний ванільний заварний крем.', 
 135.00, 5, 510, 7.0, 32.0, 45.0, 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=800&q=80', ARRAY['flour', 'butter', 'milk', 'eggs', 'sugar'], FALSE, TRUE),

('Панакота з маракуйєю', 
 'Легке вершкове желе з тропічним соусом.', 
 'Десерт на основі вершків та ванілі з освіжаючим пюре маракуї.', 
 125.00, 5, 310, 4.0, 18.0, 22.0, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80', ARRAY['cream', 'gelatin', 'passion fruit', 'sugar'], TRUE, TRUE);


-- === КАТЕГОРІЯ 6: НАПОЇ ===
INSERT INTO dishes (name, description, detailed_description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients, is_gluten_free, is_vegetarian) VALUES
('Зелений чай з жасмином', 
 'Ароматний листовий чай.', 
 'Китайський чай з квітками жасмину. Чайник 500мл.', 
 65.00, 6, 2, 0.0, 0.0, 0.5, 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=800&q=80', ARRAY['green tea', 'jasmine', 'water'], TRUE, TRUE),

('Ягідний Смузі', 
 'Вітамінний коктейль з полуниці, чорниці та банана.', 
 'Густий напій без цукру. Тільки ягоди та банан.', 
 90.00, 6, 180, 2.0, 0.5, 40.0, 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=800&q=80', ARRAY['strawberry', 'blueberry', 'banana'], TRUE, TRUE),

('Фреш Апельсиновий', 
 'Свіжовичавлений сік 250мл.', 
 '100% натуральний сік з солодких апельсинів.', 
 110.00, 6, 112, 1.4, 0.4, 26.0, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80', ARRAY['orange'], TRUE, TRUE),

('Капучино', 
 'Класична кава з молочною пінкою.', 
 'Еспресо (100% арабіка) та збите фермерське молоко.', 
 60.00, 6, 120, 6.0, 7.0, 9.0, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80', ARRAY['coffee', 'milk'], TRUE, TRUE),

('Лате на мигдальному молоці', 
 'Ніжна кава з рослинним молоком.', 
 'Веганський варіант класичного лате. М’який горіховий присмак.', 
 85.00, 6, 90, 2.0, 5.0, 8.0, 'https://images.unsplash.com/photo-1536998638804-0c58778f0293?auto=format&fit=crop&w=800&q=80', ARRAY['coffee', 'almond milk'], TRUE, TRUE),

('Лимонад Класичний', 
 'Освіжаючий напій з лимоном та м’ятою.', 
 'Холодний лимонад власного виробництва. Лимон, лайм, м’ята, лід.', 
 75.00, 6, 140, 0.0, 0.0, 35.0, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', ARRAY['lemon', 'lime', 'mint', 'sugar', 'soda water'], TRUE, TRUE),

('Лимонад Тархун', 
 'Грузинський лимонад з естрагоном.', 
 'Яскравий смак свіжого тархуну (естрагону) та лимонного соку.', 
 80.00, 6, 150, 0.0, 0.0, 38.0, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80', ARRAY['tarragon', 'lemon', 'syrup', 'soda water'], TRUE, TRUE),

('Узвар', 
 'Традиційний український напій із сухофруктів.', 
 'Насичений компот із сушених яблук, груш та слив. Подається холодним.', 
 50.00, 6, 160, 1.0, 0.0, 40.0, 'https://images.unsplash.com/photo-1606913079723-c3679e3206d0?auto=format&fit=crop&w=800&q=80', ARRAY['dried apples', 'dried pears', 'prunes', 'honey'], TRUE, TRUE),

('Матча Лате', 
 'Японський зелений чай з молоком.', 
 'Порошковий чай матча, збитий з кокосовим молоком. Потужний антиоксидант.', 
 95.00, 6, 130, 3.0, 8.0, 12.0, 'https://images.unsplash.com/photo-1515825838458-f2a94b20105a?auto=format&fit=crop&w=800&q=80', ARRAY['matcha', 'coconut milk', 'water'], TRUE, TRUE),

('Еспресо Тонік', 
 'Бадьорий холодний мікс кави та тоніка.', 
 'Подвійний еспресо, тонік, лід та слайс грейпфрута. Ідеально для спеки.', 
 95.00, 6, 85, 0.0, 0.0, 20.0, 'https://images.unsplash.com/photo-1594261685827-0435420374e2?auto=format&fit=crop&w=800&q=80', ARRAY['coffee', 'tonic', 'grapefruit', 'ice'], TRUE, TRUE);