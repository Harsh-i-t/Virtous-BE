require('dotenv').config({
    path: require('path').resolve(__dirname, '../../.env'),
});

const bcrypt = require('bcrypt');
const { Pool } = require('pg');
console.log('Database URL:', process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    console.log('Starting seed...');

    // User
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const userPasswordHash = await bcrypt.hash('user123', 10);

    await pool.query(
      `
      INSERT INTO users (username, password, role)
      VALUES
        ('admin', $1, 'admin'),
        ('user',  $2, 'user')
      ON CONFLICT (username) DO NOTHING
      `,
      [adminPasswordHash, userPasswordHash]
    );

    console.log('Users seeded');

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed');
    console.error(err);
    process.exit(1);
  }
})();
