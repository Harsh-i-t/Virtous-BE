const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('PostgreSQL connected successfully');
  } catch (err) {
    console.error('PostgreSQL connection failed');
    console.error(err);
    process.exit(1); 
  }
};

module.exports = {
  pool,
  connectDB,
};
