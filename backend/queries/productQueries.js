const { pool } = require('../utils/db');

const getProductByName = async (name) => {
  const { rows } = await pool.query(
    'SELECT id FROM products WHERE name = $1 LIMIT 1',
    [name]
  );
  return rows[0];
};

const createProduct = async ({ name, category, price, quantity }) => {
  const { rows } = await pool.query(
    `
    INSERT INTO products (name, category, price, quantity)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [name, category, price, quantity]
  );
  return rows[0];
};

const getAllProductsPaginated = async ({ page, limit }) => {
  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT *
    FROM products
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM products
  `;

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, [limit, offset]),
    pool.query(countQuery),
  ]);

  return {
    products: dataResult.rows,
    total: countResult.rows[0].total,
  };
};


const updateProductQuantity = async (id, quantity) => {
  const { rows } = await pool.query(
    `
    UPDATE products
    SET quantity = $1
    WHERE id = $2
    RETURNING *
    `,
    [quantity, id]
  );

  return rows[0];
};

const deleteProductById = async (id) => {
  const { rowCount } = await pool.query(
    'DELETE FROM products WHERE id = $1',
    [id]
  );

  return rowCount; // 0 or 1
};

module.exports = {
  getProductByName,
  createProduct,
  getAllProductsPaginated,
  updateProductQuantity,
  deleteProductById,
};
