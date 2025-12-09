import pool from '../config/db.js';

export const createOrder = async (req, res) => {
    const { items, total_price, total_calories } = req.body;
    const userId = req.user.id; 

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Кошик порожній' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); 

        const orderRes = await client.query(
            `INSERT INTO orders (user_id, total_price, total_calories, status) 
       VALUES ($1, $2, $3, 'new') 
       RETURNING id`,
            [userId, total_price, total_calories]
        );
        const orderId = orderRes.rows[0].id;

        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, dish_id, quantity, price_at_moment) 
         VALUES ($1, $2, $3, $4)`,
                [orderId, item.id, item.quantity, item.price]
            );
        }

        await client.query('COMMIT'); 

        res.status(201).json({ message: 'Замовлення створено', orderId });

    } catch (err) {
        await client.query('ROLLBACK'); 
        console.error(err.message);
        res.status(500).json({ error: 'Помилка при створенні замовлення' });
    } finally {
        client.release();
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const query = `
      SELECT 
        o.id, 
        o.total_price, 
        o.total_calories, 
        o.status, 
        o.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'name', d.name,
              'quantity', oi.quantity,
              'price', oi.price_at_moment,
              'image', d.image_url
            )
          ) FILTER (WHERE oi.id IS NOT NULL), 
          '[]'
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN dishes d ON oi.dish_id = d.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC;
    `;

        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// ADMIN ВСІ замовлення
export const getAllOrders = async (req, res) => {
    try {
        const query = `
      SELECT 
        o.id, o.total_price, o.total_calories, o.status, o.created_at,
        u.username as client_name, u.email as client_email,
        COALESCE(
          json_agg(
            json_build_object('name', d.name, 'quantity', oi.quantity)
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN dishes d ON oi.dish_id = d.id
      GROUP BY o.id, u.id
      ORDER BY o.created_at DESC;
    `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// ADMIN Змінити статус замовлення
export const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    try {
        const result = await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};