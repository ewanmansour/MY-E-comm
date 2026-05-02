import { pool } from '../db/pool.js';

const productSelect = `
  SELECT
    id,
    name,
    description,
    price,
    image_urls,
    category,
    sub_category,
    sizes,
    stock,
    bestseller,
    active,
    created_at,
    updated_at
  FROM products
`;

function mapProduct(row) {
  return {
    _id: String(row.id),
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    image: row.image_urls,
    imageUrls: row.image_urls,
    category: row.category,
    subCategory: row.sub_category,
    sizes: row.sizes,
    stock: row.stock,
    bestseller: row.bestseller,
    active: row.active,
    date: new Date(row.created_at).getTime(),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getProducts({ includeInactive = false } = {}) {
  const where = includeInactive ? '' : 'WHERE active = TRUE';
  const { rows } = await pool.query(`${productSelect} ${where} ORDER BY created_at DESC, id DESC`);
  return rows.map(mapProduct);
}

export async function getProductById(id, { includeInactive = false } = {}) {
  const activeClause = includeInactive ? '' : 'AND active = TRUE';
  const { rows } = await pool.query(`${productSelect} WHERE id = $1 ${activeClause}`, [id]);
  return rows[0] ? mapProduct(rows[0]) : null;
}

export async function createProduct(product) {
  const { rows } = await pool.query(
    `INSERT INTO products
      (name, description, price, image_urls, category, sub_category, sizes, stock, bestseller, active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      product.name,
      product.description,
      product.price,
      product.imageUrls,
      product.category,
      product.subCategory,
      product.sizes,
      product.stock,
      product.bestseller,
      product.active,
    ],
  );

  return mapProduct(rows[0]);
}

export async function updateProduct(id, product) {
  const { rows } = await pool.query(
    `UPDATE products
     SET
      name = $1,
      description = $2,
      price = $3,
      image_urls = $4,
      category = $5,
      sub_category = $6,
      sizes = $7,
      stock = $8,
      bestseller = $9,
      active = $10,
      updated_at = NOW()
     WHERE id = $11
     RETURNING *`,
    [
      product.name,
      product.description,
      product.price,
      product.imageUrls,
      product.category,
      product.subCategory,
      product.sizes,
      product.stock,
      product.bestseller,
      product.active,
      id,
    ],
  );

  return rows[0] ? mapProduct(rows[0]) : null;
}

export async function deleteProduct(id) {
  const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
  return rowCount > 0;
}
