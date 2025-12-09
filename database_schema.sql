-- =============================================
-- VITALBITE DATABASE SCHEMA & SEED DATA
-- =============================================

DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS dishes CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

DROP TYPE IF EXISTS gender_type;
DROP TYPE IF EXISTS activity_type;
DROP TYPE IF EXISTS goal_type;

CREATE TYPE gender_type AS ENUM ('male', 'female');
CREATE TYPE activity_type AS ENUM ('sedentary', 'light', 'moderate', 'active', 'very_active');
CREATE TYPE goal_type AS ENUM ('lose_weight', 'maintain', 'gain_muscle');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    age INT,
    weight DECIMAL(5, 2), 
    height DECIMAL(5, 2),
    gender gender_type,
    activity_level activity_type DEFAULT 'moderate',
    dietary_goal goal_type DEFAULT 'maintain',
    allergies TEXT[], 
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE dishes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT, 
    detailed_description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL, 
    calories INT DEFAULT 0,
    proteins DECIMAL(5, 1) DEFAULT 0,
    fats DECIMAL(5, 1) DEFAULT 0,
    carbs DECIMAL(5, 1) DEFAULT 0,
    ingredients TEXT[],
    is_vegetarian BOOLEAN DEFAULT FALSE, 
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_spicy BOOLEAN DEFAULT FALSE
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    total_calories INT NOT NULL,
    status VARCHAR(20) DEFAULT 'new', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE dishes_id_seq RESTART WITH 1;

INSERT INTO categories (name, slug) VALUES 
('Сніданки', 'breakfast'),   
('Салати', 'salads'),        
('Основні страви', 'main'),  
('Супи', 'soups'),           
('Десерти', 'desserts'),    
('Напої', 'drinks');         

-- === КАТЕГОРІЯ 1: СНІДАНКИ ===
INSERT INTO dishes (id, name, description, price, image_url, category_id, calories, proteins, fats, carbs, ingredients, is_vegetarian, is_gluten_free, is_spicy, detailed_description) VALUES 
(1, 'Авокадо Тост з Лососем', 'Хрусткий цільнозерновий тост із гуакамоле та слайсами лосося.', 240.00, 'https://imgs.search.brave.com/h9ByTjCf8b46j4y-kfgjllHpxEauPss5wpPUzE2a94A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9rYW5h/cHVsa2EuY29tLnVh/L2ltYWdlL2NhY2hl/L2NhdGFsb2cvcmVj/aXBlL2JydXNjaGV0/dGEtYXZvY2Fkby1z/YWxtb24vQnJ1c2No/ZXR0YS13aXRoLWF2/b2NhZG8tc2FsbW9u/LTYtNDcweDQ3MC5q/cGc', 1, 420, 22.5, 28.0, 35.0, '{bread,avocado,salmon,egg,lemon}', false, false, false, 'Король корисних сніданків. Підсмажений хліб, ніжний крем з авокадо Хаас, слабосолений лосось та яйце пашот.'),
(2, 'Вівсянка з ягодами та медом', 'Класична вівсяна каша на воді або молоці зі свіжими ягодами.', 95.00, 'https://imgs.search.brave.com/FRDWPnsmVAzp_6AW3mQxNe5AF5CzXPftMIY04pWGwa4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Y3JlYXRlLnZpc3Rh/LmNvbS9hcGkvbWVk/aWEvc21hbGwvNjUw/MzM4MTI2L3N0b2Nr/LXBob3RvLW9hdG1l/YWwtcG9ycmlkZ2Ut/Y2VyYW1pYy1ib3ds/LWRlY29yYXRlZC1m/cmVzaC1iZXJyaWVz/LXJhc3BiZXJyaWVz/LWNoaWEtc2VlZHM', 1, 320, 6.0, 5.0, 55.0, '{oats,milk,honey,blueberries,strawberries}', true, false, false, 'Вівсяні пластівці довгого варіння, подаються з лохиною, полуницею та натуральним медом.'),
(3, 'Омлет зі шпинатом та фетою', 'Повітряний омлет із трьох яєць зі свіжим шпинатом та сиром.', 145.00, 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80', 1, 380, 22.0, 28.0, 4.0, '{eggs,spinach,"feta cheese",oil}', true, true, false, 'Білковий сніданок. Збиті яйця зі шпинатом та солоною фетою. Подається з міксом салату.'),
(4, 'Сирники домашні', 'Ніжні сирники зі сметаною та ягідним джемом.', 160.00, 'https://imgs.search.brave.com/8fUHMq1K3jCeYSa-u5fEzIXTGkHRIz_VpDc2ebD-E5A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zaHVi/YS5saWZlL3N0YXRp/Yy9jb250ZW50L3Ro/dW1icy81NDR4NTQ0/LzkvYzAvY2NmcWRj/LS0tYzF4MXg1MHB4/NTBwLXVwLS1kOTY3/MmFmZmEzNzM4MzIy/MTdkZDM1MjhiM2Q4/OWMwOS5qcGc', 1, 450, 28.0, 20.0, 38.0, '{"cottage cheese",flour,eggs,sugar,"sour cream",jam}', true, false, false, 'Традиційний український сніданок з домашнього кисломолочного сиру. Подаються рум’яними та теплими.'),
(5, 'Шакшука класична', 'Яйця, запечені в пряному соусі з томатів та перцю.', 175.00, 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80', 1, 360, 18.0, 22.0, 15.0, '{eggs,tomato,pepper,onion,spices}', true, false, false, 'Близькосхідний хіт. Яйця пашот у густому соусі з помідорів, чилі, цибулі та зіри. Подається з пітою.'),
(6, 'Англійський сніданок', 'Ситний набір: ковбаски, квасоля, бекон, яйця та тости.', 290.00, 'https://imgs.search.brave.com/zyqGNZqLPOfBdacyJx1B6qZg2cMJ9inucxEgqgJO_TI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy8y/LzI4L0Z1bGxfRW5n/bGlzaF9icmVha2Zh/c3QuanBn', 1, 850, 45.0, 60.0, 30.0, '{sausages,bacon,eggs,beans,mushrooms,toast}', false, false, false, 'Сніданок чемпіонів. Смажені ковбаски, хрусткий бекон, яєчня, тушкована квасоля в томаті та гриби.'),
(7, 'Яйця Бенедикт з беконом', 'Тост бріош, хрусткий бекон, яйце пашот та голландський соус.', 220.00, 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80', 1, 510, 24.0, 35.0, 28.0, '{brioche,bacon,eggs,"hollandaise sauce"}', false, false, false, 'Класика світової кухні. Ніжний соус холандез ідеально поєднується з жовтком, що витікає.'),
(8, 'Панкейки з кленовим сиропом', 'Пухкі американські млинці з вершковим маслом.', 150.00, 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80', 1, 480, 8.0, 12.0, 75.0, '{flour,milk,eggs,"maple syrup",butter}', true, false, false, 'Стопка пухких панкейків, щедро полита канадським кленовим сиропом та прикрашена ягодами.');

-- === КАТЕГОРІЯ 2: САЛАТИ ===
INSERT INTO dishes (id, name, description, price, image_url, category_id, calories, proteins, fats, carbs, ingredients, is_vegetarian, is_gluten_free, is_spicy, detailed_description) VALUES
(9, 'Боул з Кіноа та Тофу', 'Легкий та поживний боул з кіноа, тофу-гриль та соусом тахіні.', 195.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', 2, 380, 18.0, 15.5, 45.0, '{quinoa,tofu,edamame,cucumber,tahini}', true, true, false, 'Веганська страва. Тофу гриль, кіноа, боби едамаме, огірок та горіховий соус.'),
(10, 'Цезар з креветками', 'Класичний салат з тигровими креветками, пармезаном та сухариками.', 260.00, 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80', 2, 410, 28.0, 25.0, 15.0, '{shrimp,lettuce,parmesan,croutons,eggs,sauce}', false, false, false, 'Салат Ромен, креветки гриль, пармезан, грінки та фірмовий соус.'),
(11, 'Грецький салат', 'Свіжі овочі, оливки Каламата та сир Фета.', 180.00, 'https://imgs.search.brave.com/Z6mCemY4f2X07OZ3K5pCGRiv6PWkR0uWEroy7DOcKHQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5pYW4ubmV0/L3Bob3Rvcy8yMDIz/XzA0LzE2ODEwNjUw/NDYtODI4MC5qcGc_/cj0zMzMxODI', 2, 290, 8.0, 22.0, 10.0, '{tomato,cucumber,"feta cheese",olives,onion}', true, true, false, 'Огірки, томати, перець, червона цибуля, оливки та шматок фети з орегано.'),
(12, 'Капрезе', 'Італійська класика: моцарела, томати та песто.', 210.00, 'https://imgs.search.brave.com/tTwKDV-idw_59puL_y9hvsM6nISG19bT_GFfhRzYJQ4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/cG92YXIucnUvbWFp/bi9lZS83Yi9hNy9i/Mi9zYWxhdF9xdW90/a2FwcmV6ZXF1b3Qt/MTg2NzguanBn', 2, 340, 18.0, 26.0, 5.0, '{mozzarella,tomato,basil,pesto,"olive oil"}', true, true, false, 'Ніжна моцарела буффало, стиглі томати, свіжий базилік та соус песто.'),
(13, 'Салат з качкою та манго', 'Мікс салатів з качиним філе та солодким манго.', 285.00, 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=800&q=80', 2, 390, 25.0, 20.0, 18.0, '{"duck breast",mango,lettuce,"pine nuts","citrus dressing"}', false, true, false, 'Вишукане поєднання копченої качиної грудки, соковитого манго та кедрових горішків під цитрусовою заправкою.'),
(14, 'Нісуаз з тунцем', 'Французький салат з тунцем, квасолею та яйцем.', 310.00, 'https://imgs.search.brave.com/cXUz_qh3qCdeakpR3sZ_ckzoaYb1YK1iA2rjtZA2f_Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5pYW4ubmV0/L3Bob3Rvcy8yMDIz/XzAyLzE2Nzc0Mzgy/MzUtODU2OC5qcGc_/cj0xNzQ4MDE', 2, 440, 35.0, 22.0, 18.0, '{tuna,"green beans",potato,eggs,anchovies}', false, true, false, 'Свіжий тунець (medium rare), стручкова квасоля, картопля бебі, анчоуси та яйце.'),
(15, 'Теплий салат з яловичиною', 'Мікс салату з обсмаженою яловичиною та овочами гриль.', 270.00, 'https://imgs.search.brave.com/V24qiyYssSN0dIhUl984uON_4bxvHRdvW8TQN8X1paw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLm9i/b3pyZXZhdGVsLmNv/bS9mb29kL3JlY2lw/ZW1haW4vMjAxOS8z/LzI5LzY4MWExZTJl/OWFiYzQ5NDJiYTI1/MTkwMWQxNmYxN2Uy/LnBuZz9zaXplPTE5/NDR4OTI0', 2, 380, 28.0, 24.0, 12.0, '{beef,eggplant,zucchini,pepper,lettuce}', false, true, false, 'Ситний салат зі шматочками вирізки, баклажаном, цукіні та болгарським перцем.');

-- === КАТЕГОРІЯ 3: ОСНОВНІ СТРАВИ ===
INSERT INTO dishes (id, name, description, price, image_url, category_id, calories, proteins, fats, carbs, ingredients, is_vegetarian, is_gluten_free, is_spicy, detailed_description) VALUES
(16, 'Стейк Рібай з Овочами', 'Соковитий стейк із мармурової яловичини з овочами гриль.', 450.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80', 3, 650, 48.0, 45.0, 10.0, '{beef,zucchini,"bell pepper",oil}', true, false, false, 'Преміальна яловичина зернової відгодівлі, овочі гриль та розмарин.'),
(17, 'Лосось гриль зі спаржею', 'Філе лосося на грилі з молодою спаржею.', 420.00, 'https://imgs.search.brave.com/f02cfdDR2GBbtNxfsD8o0abFZXq1FOGUd7_A3JmChZU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cnVzc2lhbmZvb2Qu/Y29tL2R5Y29udGVu/dC9pbWFnZXNfdXBs/LzUwL2JpZ180OTk5/OC5qcGc', 3, 480, 34.0, 28.0, 6.0, '{salmon,asparagus,lemon,spices}', true, false, false, 'Атлантичний лосось з хрусткою скоринкою та бланшированою спаржею.'),
(18, 'Куряче філе з диким рисом', 'Дієтичне куряче філе су-від з чорним рисом.', 210.00, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80', 3, 350, 32.0, 5.0, 45.0, '{chicken,"wild rice",broccoli,salt}', true, false, false, 'Ніжна куряча грудка (су-від), дикий рис та броколі на пару.'),
(19, 'Паста Карбонара', 'Спагеті з гуанчале, жовтком та пекоріно.', 280.00, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80', 3, 580, 22.0, 30.0, 55.0, '{spaghetti,guanciale,eggs,"pecorino cheese","black pepper"}', false, false, false, 'Класична італійська паста без вершків. Тільки жовтки, сир пекоріно романо, гуанчале та чорний перець.'),
(20, 'Котлета по-київськи', 'Легендарна українська страва з пюре та зеленим горошком.', 230.00, 'https://imgs.search.brave.com/la18IpWDoqY9xz8BB-K4v75uBKL3G-MUcB4Q8gGUyBQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5pYW4ubmV0/L3Bob3Rvcy8yMDIw/XzExLzE2MDU3MDE0/MTktNDg5OC5qcGc_/MC4wNzQ2OTM0NDQ0/NzYzNjAyOA', 3, 620, 28.0, 35.0, 42.0, '{chicken,butter,dill,breadcrumbs,potato}', false, false, false, 'Куряче філе в паніровці з шматочком вершкового масла та зеленню всередині. Подається з ніжним картопляним пюре.'),
(21, 'Хачапурі по-аджарськи', 'Човник з тіста з сиром сулугуні та жовтком.', 245.00, 'https://imgs.search.brave.com/MeYI-M23tdb1vEN0z8jD6wjFTMMpfcsAcgF3uYl_7hQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5pYW4ubmV0/L3Bob3Rvcy8yMDIz/XzAxLzE2NzM2MzM5/MDYtMjEzMS5qcGc_/cj0yOTAxMjQ', 3, 750, 25.0, 38.0, 60.0, '{flour,"suluguni cheese",eggs,butter}', true, false, false, 'Грузинська класика. Гарячий сир сулугуні, запечений у дріжджовому тісті з додаванням вершкового масла та яйця.'),
(22, 'Пад Тай з куркою', 'Тайська смажена рисова локшина з кисло-солодким соусом.', 265.00, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80', 3, 520, 26.0, 18.0, 65.0, '{"rice noodles",chicken,peanuts,tofu,egg,"tamarind sauce"}', false, false, false, 'Рисова локшина, обсмажена з куркою, яйцем, тофу, арахісом та паростками сої в соусі тамаринд.'),
(23, 'Лазанья Болоньєзе', 'Італійська запіканка з м’ясним рагу та соусом бешамель.', 290.00, 'https://imgs.search.brave.com/iImOq0e0VFCGVIse9ou3hZKJ2Q-gJtqWmEJvJpLXjO8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zaHVi/YS5saWZlL3N0YXRp/Yy9jb250ZW50L3Ro/dW1icy83Mzh4NDEw/LzcvZWIvYW40Y2Ft/LS0tYzl4NXg1MHB4/NTBwLXVwLS00ZWE4/NGE5ZGYzNTc0NWNi/ODQyODFjMjk4NjBl/NWViNy5qcGc', 3, 680, 32.0, 38.0, 48.0, '{"pasta sheets",beef,"tomato sauce",milk,cheese}', false, false, false, 'Багатошарова паста з рагу болоньєзе (яловичина), соусом бешамель та пармезаном.');
(24, 'Різотто з білими грибами', 'Кремовий рис Арборіо з лісовими грибами.', 295.00, 'https://imgs.search.brave.com/S6EVx3gwmRxIpvQod7VG5bo-UCStBrfWQozVhaUVPmg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM2/OTE4MzMzMi91ay8l/RDElODQlRDAlQkUl/RDElODIlRDAlQkUv/JUQxJTgwJUQxJTk2/JUQwJUI3JUQwJUJF/JUQxJTgyJUQxJTgy/JUQwJUJFLSVEMCVC/Ny0lRDAlQkElRDAl/QkUlRDElODAlRDAl/QjglRDElODclRDAl/QkQlRDAlQjUlRDAl/QjIlRDAlQjglRDAl/QkMlRDAlQjgtJUQw/JUIzJUQxJTgwJUQw/JUI4JUQwJUIxJUQw/JUIwJUQwJUJDJUQw/JUI4LSVEMCVCRiVE/MCVCNSVEMSU4NyVE/MCVCNSVEMSU4MCVE/MCVCOCVEMSU4NiVE/MSU5Ni5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9MHF4UlJI/ZEhkYlFWdDJYOUxQ/eHF1dHFraWtGWTI3/TndGckM1a3JlYW9r/OD0', 3, 490, 12.0, 24.0, 52.0, '{"rice arborio","porcini mushrooms",parmesan,butter,wine}', true, true, false, 'Насичений смак білих грибів, вершкове масло, пармезан та трюфельна олія.');
(25, 'Хінкалі з бараниною (4 шт)', 'Грузинські мішечки з тіста з пряним м’ясом та бульйоном.', 180.00, 'https://imgs.search.brave.com/fpl9LHC858d4-ijpmNrE9Wo4vP3zRJ1ybUQG91bWW4o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Y3JlYXRlLnZpc3Rh/LmNvbS9hcGkvbWVk/aWEvc21hbGwvNDIy/NzM4MTgyL3N0b2Nr/LXBob3RvLWtoaW5r/YWxpLW5hdGlvbmFs/LWRpc2gtZ2Vvcmdp/YW4tY3Vpc2luZS13/aGl0ZS1wbGF0ZS1z/YXVjZQ', 3, 450, 18.0, 20.0, 48.0, '{flour,mutton,onion,cilantro,spices}', false, false, false, 'Традиційні хінкалі з рубленою бараниною, кінзою та перцем. Їсти руками!');
(26, 'Деруни зі сметаною', 'Хрусткі картопляні оладки з грибним соусом.', 165.00, 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=800&q=80', 3, 540, 8.0, 32.0, 50.0, '{potato,onion,flour,"sour cream"}', true, false, false, 'Золотисті деруни зі смаженою цибулею. Подаються зі сметаною або грибною підливою.');
(27, 'Банош з бринзою', 'Гуцульська кукурудзяна каша на вершках зі шкварками.', 190.00, 'https://imgs.search.brave.com/Y0QpG_G_yNWG0FYXoXs5o4eW_MxoiF-KEUTFDLeBuzs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdGJh/a2NpaS5jb20udWEv/d3AtY29udGVudC91/cGxvYWRzLzIwMjUv/MDMvZGFsbCVDMiVC/N2UtMjAyNS0wMy0y/MS0xMC4yNi4zNy1h/LWJlYXV0aWZ1bC1z/ZXJ2aW5nLW9mLXRy/YWRpdGlvbmFsLWh1/dHN1bC1iYW5vc2gt/dWtyYWluaWFuLWNv/cm5tZWFsLWRpc2gt/aW4tYS1ydXN0aWMt/Y2VyYW1pYy1ib3ds/Li10aGUtZGlzaC1p/cy10b3BwZWQtd2l0/aC1jcnVtYmxlZC1i/cnluZHphLWNoZWVz/ZS1hLTcwMHg3MDAu/d2VicA', 3, 610, 15.0, 40.0, 45.0, '{cornmeal,"sour cream",brynza,bacon}', false, true, false, 'Ситна страва Карпат. Кукурудзяна крупа, зварена на сметані, з овечою бринзою та шкварками.');
(28, 'Рамен з куркою', 'Японський суп-локшина з яйцем та норі.', 255.00, 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=800&q=80', 3, 560, 28.0, 22.0, 55.0, '{noodles,"chicken broth",chicken,egg,nori}', false, false, false, 'Насичений курячий бульйон, пшенична локшина, мариноване яйце, курка теріякі та зелена цибуля.');

-- === КАТЕГОРІЯ 4: СУПИ ===
INSERT INTO dishes (id, name, description, price, image_url, category_id, calories, proteins, fats, carbs, ingredients, is_vegetarian, is_gluten_free, is_spicy, detailed_description) VALUES
(29, 'Гарбузовий Крем-суп', 'Ніжний суп з печеного гарбуза з кокосовим молоком.', 120.00, 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=800&q=80', 4, 210, 4.0, 12.0, 25.0, '{pumpkin,"coconut milk",onion,"pumpkin seeds"}', true, true, false, 'Оксамитовий суп на кокосовому молоці з гарбузовим насінням. Веган френдлі.'),
(30, 'Український Борщ', 'Традиційний червоний борщ з телятиною та сметаною.', 140.00, 'https://imgs.search.brave.com/5dkRHVwULzA1Aa1nne5Hagm6rwuygnVBlE2FN-StnMI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdDIu/ZGVwb3NpdHBob3Rv/cy5jb20vMTMyNjU1/OC84MjY0L2kvNDUw/L2RlcG9zaXRwaG90/b3NfODI2NDM0OTQt/c3RvY2stcGhvdG8t/dHJhZGl0aW9uYWwt/dWtyYWluaWFuLXZl/Z2V0YWJsZS1ib3Jz/Y2h0LmpwZw', 4, 320, 18.0, 14.0, 25.0, '{beef,beetroot,cabbage,potato,"sour cream"}', false, false, false, 'Зварений на м’ясному бульйоні з буряком. Подається з пампушками з часником.'),
(31, 'Грибний крем-суп', 'Суп з лісових грибів на вершках.', 130.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80', 4, 280, 6.0, 20.0, 15.0, '{mushrooms,cream,onion,potato,croutons}', true, false, false, 'Густий суп з білих грибів та печериць. Подається з грінками.'),
(32, 'Том Ям з креветками', 'Гострий тайський суп на кокосовому молоці.', 320.00, 'https://imgs.search.brave.com/bsyIhY9JumiyAxpMpCxJC09Pib_FQd_KGNS3rI-B3X8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bWFnZ2kucnUvc2l0/ZXMvZGVmYXVsdC9m/aWxlcy9zdHlsZXMv/cmVjaXBlX21haW5f/YmFubmVyX3hzX3gy/L3B1YmxpYy9zcmhf/cmVjaXBlcy9mOGQ4/ZTdhYmM4MjVkYWQ4/NWYzMzk1YzQ5ODRk/ZGJlZC5qcGc_aXRv/az1XRVlncTdITQ', 4, 350, 22.0, 18.0, 12.0, '{shrimp,"coconut milk",lemongrass,mushrooms,chili}', false, true, false, 'Кисло-гострий смак, креветки, кальмари, гриби шиітаке та кінза. Подається з рисом.'),
(33, 'Мінестроне', 'Легкий італійський овочевий суп.', 115.00, 'https://imgs.search.brave.com/TPPDcqA_vNZ0tAtx1oH24tSCkln91rEE8qR3cLfq9uQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9rYW5h/cHVsa2EuY29tLnVh/L2ltYWdlL2NhdGFs/b2cvcmVjaXBlL21p/bmVzdHJvbmUtc291/cC9PbGl2ZS1HYXJk/ZW4tTWluZXN0cm9u/ZS1Tb3VwLTkuanBn', 4, 180, 6.0, 5.0, 25.0, '{zucchini,carrot,beans,pasta,tomato}', true, false, false, 'Багато сезонних овочів, квасоля та трохи пасти в прозорому бульйоні з песто.'),
(34, 'Курячий бульйон', 'Цілющий прозорий бульйон з локшиною та яйцем.', 95.00, 'https://imgs.search.brave.com/4Zcb1P2l9kRmDr-F5-X3NPiqzNZLsV-PeJhGHGF2mKQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGFibHljamFrYWxv/cmlqbm9zdGkuY29t/LnVhL2ZpbGUvaW1h/Z2UvZm9vZHN0dWZm/Lzk3MGFiMmViOGI2/NzQyNjM4MDdhY2Qz/MmJlNjlkM2IxLzEz/YjViMjEwNGFkMzQ2/NDQ4ZmM0ODllOGU1/NThhZjQy', 4, 150, 12.0, 5.0, 15.0, '{"chicken broth",noodles,egg,carrot}', false, false, false, 'Домашній смак. Домашня локшина, перепелине яйце та шматочки курки.');

-- === КАТЕГОРІЯ 5: ДЕСЕРТИ ===
INSERT INTO dishes (id, name, description, price, image_url, category_id, calories, proteins, fats, carbs, ingredients, is_vegetarian, is_gluten_free, is_spicy, detailed_description) VALUES
(35, 'Чізкейк Нью-Йорк', 'Класичний десерт на пісочній основі з ягідним соусом.', 110.00, 'https://imgs.search.brave.com/FvuYCq2859LmxKKYbygwvYgAxl2kgb4pOiLOsmYrOx0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLm9i/b3pyZXZhdGVsLmNv/bS9mb29kL3JlY2lw/ZW1haW4vMjAxOS8y/Lzgvb3JpZy5qcGc_/c2l6ZT0xOTQ0eDky/NA', 5, 450, 7.0, 28.0, 38.0, '{cheese,cream,sugar,flour,berries}', true, false, false, 'Щільна кремова текстура, ваніль та соус із малини.'),
(36, 'Мафін шоколадний з бананом', 'Пухкий десерт без цукру з бананом та какао.', 90.00, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80', 5, 400, 4.7, 5.5, 51.0, '{banana,cocoa,flour,raspberries}', true, false, false, 'Вологий мафін на основі бананового пюре з малиною.'),
(37, 'Чіа-пудинг з манго', 'Корисний десерт на кокосовому молоці.', 115.00, 'https://imgs.search.brave.com/ObIq1I949gqUZSCaPzauTTAEAzsWsYV3mxmql4Dmtb0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly95YXBp/a28uY29tLnVhL21l/ZGlhL2NhdGFsb2cv/cHJvZHVjdC9jYWNo/ZS85MGM2MzE4NTFi/ZmM4MmVkMzUzOGE2/NzJmYTk0ODhiYi9j/L2gvY2hpYV9wdWRk/aW5nX3dpdGhfbWFu/Z28uanBn', 5, 240, 5.0, 12.0, 28.0, '{"chia seeds","coconut milk",mango}', true, true, false, 'Насіння чіа в кокосовому молоці з шаром пюре манго. Без цукру.'),
(38, 'Тірамісу', 'Італійський десерт з савоярді та маскарпоне.', 165.00, 'https://imgs.search.brave.com/Mj3n2TCSUEQLUmjCOBj267vyKe7qqT-VMxdqcEF-X3w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdDQu/ZGVwb3NpdHBob3Rv/cy5jb20vMTk5ODYw/MS8yMjE2My9pLzQ1/MC9kZXBvc2l0cGhv/dG9zXzIyMTYzNzU5/Ni1zdG9jay1waG90/by1wb3J0aW9uLXRp/cmFtaXN1LWRlc3Nl/cnQuanBn', 5, 420, 8.0, 24.0, 40.0, '{mascarpone,savoiardi,coffee,eggs,cocoa}', true, false, false, 'Печиво, просочене еспресо та амарето, ніжний крем з маскарпоне та какао.'),
(39, 'Вареники з вишнею', 'Українські вареники на пару з соковитою вишнею.', 140.00, 'https://imgs.search.brave.com/O9xOGDLo4psOxpwEOgiA9IB5RN6IOJK7w654ih6dY1U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ5/NTA1MTMzMS91ay8l/RDElODQlRDAlQkUl/RDElODIlRDAlQkUv/JUQwJUJGJUQwJUJF/JUQxJTgwJUQxJTg2/JUQxJTk2JUQxJThG/LSVEMSU4MCVEMCVC/RSVEMSU4MSVEMSU5/NiVEMCVCOSVEMSU4/MSVEMSU4QyVEMCVC/QSVEMCVCOCVEMSU4/NS0lRDAlQkYlRDAl/QjUlRDAlQkIlRDEl/OEMlRDAlQkMlRDAl/QjUlRDAlQkQlRDEl/OTYlRDAlQjItJUQw/JUIyJUQwJUIwJUQx/JTgwJUQwJUI1JUQw/JUJEJUQwJUI4JUQw/JUJBJUQwJUI4LSVE/MCVCNy0lRDAlQjIl/RDAlQjglRDElODgl/RDAlQkQlRDAlQjUl/RDElOEUuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPWxfdXJp/LWlhTlFuaktrbkVV/MGhaYXhudTB0Q2hH/VVA3MXZRSlJsTV9L/dG89', 5, 380, 6.0, 8.0, 65.0, '{flour,cherries,sugar,"sour cream"}', true, false, false, 'Тонке тісто, багато кисло-солодкої вишні. Подаються зі сметаною та цукром.'),
(40, 'Наполеон', 'Багатошаровий торт із заварним кремом.', 135.00, 'https://imgs.search.brave.com/baASJRrTTt6H9RCeV__dD8QjRKGuh_UQc779-HRmlr0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9uYXBvbGVvbi1j/YWtlLXBsYXRlLXRh/YmxlLWNsb3NldXBf/MzkyODk1LTE3ODkz/NS5qcGc_c2VtdD1h/aXNfaW5jb21pbmcm/dz03NDAmcT04MA', 5, 510, 7.0, 32.0, 45.0, '{flour,butter,milk,eggs,sugar}', true, false, false, 'Хрусткі коржі з листкового тіста та ніжний ванільний заварний крем.'),
(41, 'Панакота з маракуйєю', 'Легке вершкове желе з тропічним соусом.', 125.00, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80', 5, 310, 4.0, 18.0, 22.0, '{cream,gelatin,"passion fruit",sugar}', true, true, false, 'Десерт на основі вершків та ванілі з освіжаючим пюре маракуї.');

-- === КАТЕГОРІЯ 6: НАПОЇ ===
INSERT INTO dishes (id, name, description, price, image_url, category_id, calories, proteins, fats, carbs, ingredients, is_vegetarian, is_gluten_free, is_spicy, detailed_description) VALUES
(42, 'Зелений чай з жасмином', 'Ароматний листовий чай.', 65.00, 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=800&q=80', 6, 2, 0.0, 0.0, 0.5, '{"green tea",jasmine,water}', true, true, false, 'Китайський чай з квітками жасмину. Чайник 500мл.'),
(43, 'Ягідний Смузі', 'Вітамінний коктейль з полуниці, чорниці та банана.', 90.00, 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=800&q=80', 6, 180, 2.0, 0.5, 40.0, '{strawberry,blueberry,banana}', true, true, false, 'Густий напій без цукру. Тільки ягоди та банан.'),
(44, 'Фреш Апельсиновий', 'Свіжовичавлений сік 250мл.', 110.00, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80', 6, 112, 1.4, 0.4, 26.0, '{orange}', true, true, false, '100% натуральний сік з солодких апельсинів.'),
(45, 'Капучино', 'Класична кава з молочною пінкою.', 60.00, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80', 6, 120, 6.0, 7.0, 9.0, '{coffee,milk}', true, true, false, 'Еспресо (100% арабіка) та збите фермерське молоко.'),
(46, 'Лате на мигдальному молоці', 'Ніжна кава з рослинним молоком.', 85.00, 'https://imgs.search.brave.com/lQwUzEWP1weO-5VKyJ4U1VLj28Hg6bqOCpySwoeavWk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9wcm9mZXNzaW9u/YWwtZm9vZC1waG90/b2dyYXBoeS12YW5p/bGxhLWxhdHRlLXdp/dGgtdG9wcGluZ3Mt/aW5ncmVkaWVudHNf/MTMyOTYwOC02NDU1/LmpwZz9zZW10PWFp/c19oeWJyaWQ', 6, 90, 2.0, 5.0, 8.0, '{coffee,"almond milk"}', true, true, false, 'Веганський варіант класичного лате. М’який горіховий присмак.'),
(47, 'Лимонад Класичний', 'Освіжаючий напій з лимоном та м’ятою.', 75.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', 6, 140, 0.0, 0.0, 35.0, '{lemon,lime,mint,sugar,"soda water"}', true, true, false, 'Холодний лимонад власного виробництва. Лимон, лайм, м’ята, лід.'),
(48, 'Лимонад Тархун', 'Грузинський лимонад з естрагоном.', 80.00, 'https://imgs.search.brave.com/S3BwkoIK6aaiG0XXj38dphHpqy_Fo-mwcYd_Q4GYFnA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Y2hlZm1hcmtldC5y/dS9ibG9nL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIyLzA3L2hv/bWVtYWRlLWxlbW9u/YWRlLTMwMHgyMDAu/anBn', 6, 150, 0.0, 0.0, 38.0, '{tarragon,lemon,syrup,"soda water"}', true, true, false, 'Яскравий смак свіжого тархуну (естрагону) та лимонного соку.'),
(49, 'Узвар', 'Традиційний український напій із сухофруктів.', 50.00, 'https://imgs.search.brave.com/3jZvdmNdnEZJBLtB71yyY4y8DHsXrZgEI_PHoKyP92M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cmJjLnVhL3N0YXRp/Yy9pbWcvMi8xLzIx/NDg2NDc5NDZfYWE0/YTk3ZTAxMWJhNWVh/OTYzZTA3ZGRkY2Zl/ZDFkZGFfNjUweDQx/MC5qcGc', 6, 160, 1.0, 0.0, 40.0, '{"dried apples","dried pears",prunes,honey}', true, true, false, 'Насичений компот із сушених яблук, груш та слив. Подається холодним.'),
(50, 'Матча Лате', 'Японський зелений чай з молоком.', 95.00, 'https://imgs.search.brave.com/Zh1yZMqMiyAUJknErnR_l12sv96lbnFp518LvUlnKcU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/bnVyLmt6L2ltYWdl/cy8xMjAweDY3NS80/NWU0ZWRlOTkzNDMy/NWE2LmpwZWc_dmVy/c2lvbj0x', 6, 130, 3.0, 8.0, 12.0, '{matcha,"coconut milk",water}', true, true, false, 'Порошковий чай матча, збитий з кокосовим молоком. Потужний антиоксидант.'),
(51, 'Еспресо Тонік', 'Бадьорий холодний мікс кави та тоніка.', 95.00, 'https://imgs.search.brave.com/x7RfB-jUfJymuzTUz-b1aaBJvxN6LsUXf020i_s-gvo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dG9ycmVmYWN0by5y/dS91cGxvYWQvdWYv/YmQwL2lkMHcweWs3/ZTF5YXhlaDVqNzMx/YTU0cDE5eDJlYXN6/LmpwZw', 6, 85, 0.0, 0.0, 20.0, '{coffee,tonic,grapefruit,ice}', true, true, false, 'Подвійний еспресо, тонік, лід та слайс грейпфрута. Ідеально для спеки.');

SELECT pg_catalog.setval('public.dishes_id_seq', 51, true);