const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// --- ROUTES ---

// 1. GET Listings (Marketplace)
app.get('/api/listings', async (req, res) => {
  try {
    const { type, max_price } = req.query;
    let query = 'SELECT * FROM ip_listings WHERE status = $1';
    let params = ['active'];
    
    // Add logic here for dynamic filtering based on query params
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 2. GET Experts (Directory)
app.get('/api/experts', async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.full_name, e.title, e.hourly_rate, e.rating_avg 
      FROM users u
      JOIN expert_profiles e ON u.id = e.user_id
      WHERE u.role = 'expert'
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 3. POST Service Request (Job Post)
// Middleware 'authenticateToken' would be required here
app.post('/api/services', async (req, res) => {
  const { title, description, budget, client_id } = req.body;
  try {
    const newRequest = await pool.query(
      'INSERT INTO service_requests (client_id, title, description, budget_range) VALUES ($1, $2, $3, $4) RETURNING *',
      [client_id, title, description, budget]
    );
    res.json(newRequest.rows[0]);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`TechXchange API running on port ${PORT}`);
});
