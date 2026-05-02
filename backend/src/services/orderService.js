import { pool } from '../db/pool.js';

const DELIVERY_FEE = 10;

function mapOrder(row, items = []) {
  return {
    id: `ORD-${row.id}`,
    orderId: row.id,
    deliveryInfo: row.delivery_info,
    paymentMethod: row.payment_method,
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    amount: Number(row.amount),
    status: row.status,
    date: row.created_at,
    items,
  };
}

function mapItem(row) {
  return {
    productId: row.product_id ? String(row.product_id) : '',
    name: row.product_name,
    image: row.image_urls,
    size: row.size,
    quantity: row.quantity,
    price: Number(row.price),
  };
}

export async function createOrder(userId, { deliveryInfo, paymentMethod = 'COD', items }) {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error('Order items are required.');
    error.status = 400;
    throw error;
  }

  if (paymentMethod !== 'COD') {
    const error = new Error('Only cash on delivery is available right now.');
    error.status = 400;
    throw error;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const normalizedItems = [];

    for (const item of items) {
      const quantity = Number(item.quantity);
      const productId = Number(item.productId);

      if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity <= 0 || !item.size) {
        const error = new Error('Invalid order item.');
        error.status = 400;
        throw error;
      }

      const { rows } = await client.query(
        `SELECT id, name, price, image_urls, stock, active
         FROM products
         WHERE id = $1
         FOR UPDATE`,
        [productId],
      );
      const product = rows[0];

      if (!product || !product.active) {
        const error = new Error('One of the products is no longer available.');
        error.status = 400;
        throw error;
      }

      if (product.stock < quantity) {
        const error = new Error(`${product.name} has only ${product.stock} item(s) left.`);
        error.status = 400;
        throw error;
      }

      await client.query('UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2', [
        quantity,
        productId,
      ]);

      normalizedItems.push({
        productId,
        productName: product.name,
        imageUrls: product.image_urls,
        size: item.size,
        quantity,
        price: Number(product.price),
      });
    }

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const amount = subtotal + DELIVERY_FEE;

    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (user_id, delivery_info, payment_method, subtotal, delivery_fee, amount)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, deliveryInfo, paymentMethod, subtotal, DELIVERY_FEE, amount],
    );
    const order = orderRows[0];

    for (const item of normalizedItems) {
      await client.query(
        `INSERT INTO order_items
          (order_id, product_id, product_name, image_urls, size, quantity, price)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          order.id,
          item.productId,
          item.productName,
          item.imageUrls,
          item.size,
          item.quantity,
          item.price,
        ],
      );
    }

    await client.query('COMMIT');
    return mapOrder(order, normalizedItems.map((item) => ({
      productId: String(item.productId),
      name: item.productName,
      image: item.imageUrls,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    })));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getOrdersByUser(userId) {
  const { rows: orderRows } = await pool.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
    [userId],
  );

  if (orderRows.length === 0) return [];

  const orderIds = orderRows.map((order) => order.id);
  const { rows: itemRows } = await pool.query(
    'SELECT * FROM order_items WHERE order_id = ANY($1::int[]) ORDER BY id ASC',
    [orderIds],
  );

  return orderRows.map((order) => {
    const items = itemRows.filter((item) => item.order_id === order.id).map(mapItem);
    return mapOrder(order, items);
  });
}
