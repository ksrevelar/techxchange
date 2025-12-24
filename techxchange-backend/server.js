const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_123';

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// --- AUTH ROUTES ---

// 1. REGISTER
app.post('/api/register', async (req, res) => {
  const { email, password, full_name, role } = req.body;
  try {
    // Hash the password (encrypt it)
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Save to DB
    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role',
      [email, hash, full_name, role || 'inventor']
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "User already exists or server error" });
  }
});

// 2. LOGIN
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) return res.status(400).json({ error: "User not found" });

    // Check password
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) return res.status(400).json({ error: "Invalid password" });

    // Generate Token
    const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, JWT_SECRET);

    res.json({ token, user: { id: user.rows[0].id, full_name: user.rows[0].full_name, role: user.rows[0].role } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --- MARKETPLACE ROUTES ---

app.get('/api/listings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ip_listings WHERE status = $1', ['active']);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`TechXchange API running on port ${PORT}`);
});