import pool from '../config/db.js';

export const getMenu = async (req, res) => {
  try {
    const { category } = req.query;

    let queryText = `
      SELECT 
        d.id, d.name, d.description, 
        d.detailed_description, 
        d.price, d.image_url,
        d.calories, d.proteins, d.fats, d.carbs, 
        d.ingredients,
        d.is_vegetarian, d.is_gluten_free, d.is_spicy,
        c.name as category_name, c.slug as category_slug
      FROM dishes d
      LEFT JOIN categories c ON d.category_id = c.id
    `;

    const queryParams = [];

    if (category && category !== 'all') {
      queryText += ` WHERE c.slug = $1`;
      queryParams.push(category);
    }

    queryText += ` ORDER BY d.id ASC`;

    const result = await pool.query(queryText, queryParams);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Помилка сервера при отриманні меню' });
  }
};

export const addDish = async (req, res) => {
  const { name, description, detailed_description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients } = req.body;

  try {
    const newDish = await pool.query(
      `INSERT INTO dishes (name, description, detailed_description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [name, description, detailed_description || description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients]
    );
    res.json(newDish.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM dishes WHERE id = $1', [id]);
    res.json({ message: 'Страву видалено' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const updateDish = async (req, res) => {
  const { id } = req.params;
  const { name, description, detailed_description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients } = req.body;

  try {
    const updatedDish = await pool.query(
      `UPDATE dishes 
       SET name = $1, description = $2, detailed_description = $3, price = $4, category_id = $5, 
           calories = $6, proteins = $7, fats = $8, carbs = $9, 
           image_url = $10, ingredients = $11
       WHERE id = $12 RETURNING *`,
      [name, description, detailed_description, price, category_id, calories, proteins, fats, carbs, image_url, ingredients, id]
    );
    res.json(updatedDish.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};