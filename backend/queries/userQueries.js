const { pool } = require('../utils/db');

const getUserByUsername = async (username) => {
  const query = `
    SELECT id, username, password, role
    FROM users
    WHERE username = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [username]);
  return rows[0];
};

module.exports = {
  getUserByUsername,
};