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

// --- MIDDLEWARE (Security Check) ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401); // No token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user; // Save user info for the next step
    next();
  });
};

// --- AUTH ROUTES ---
app.post('/api/register', async (req, res) => {
  const { email, password, full_name, role } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role',
      [email, hash, full_name, role || 'inventor']
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "User already exists" });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) return res.status(400).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, JWT_SECRET);
    res.json({ token, user: { id: user.rows[0].id, full_name: user.rows[0].full_name, role: user.rows[0].role } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --- POSTING ROUTES (Protected) ---

// Create Listing
app.post('/api/listings', authenticateToken, async (req, res) => {
  const { title, description, price, category, ip_type } = req.body;
  try {
    const newListing = await pool.query(
      'INSERT INTO ip_listings (seller_id, title, description, price, category, ip_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, title, description, price, category, ip_type]
    );
    res.json(newListing.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Become Expert
app.post('/api/experts', authenticateToken, async (req, res) => {
  const { title, bio, hourly_rate, location } = req.body;
  try {
    const newProfile = await pool.query(
      'INSERT INTO expert_profiles (user_id, title, bio, hourly_rate, location) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, title, bio, hourly_rate, location]
    );
    // Update user role
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', ['expert', req.user.id]);

    res.json(newProfile.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --- PUBLIC READ ROUTES ---
app.get('/api/listings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ip_listings WHERE status = $1', ['active']);
    res.json(result.rows);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.get('/api/experts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.full_name, e.* FROM expert_profiles e
      JOIN users u ON e.user_id = u.id
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.listen(PORT, () => {
  console.log(`TechXchange API running on port ${PORT}`);
});
