const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const router = express.Router();
const app = express();

app.set('secret', 'mysecretkey');

// PostgreSQL connection setup
const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5430, // Docker Compose port
});

const signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id', [username, password]);
    const newAdmin = {
      id: result.rows[0].id,
    };
    res.json(newAdmin);
    client.release();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM admins WHERE username = $1 AND password = $2', [username, password]);

    if (result.rows.length > 0) {
      var token = jwt.sign(
        { username }, // payload should be an object
        app.get('secret'), // secretkey
        { expiresIn: "1d"} // expiresIn
      )
      res.json({
        success: true,
        message: 'Success to login.',
        token: token
      })
    } else {
      res.json({
        success: false,
        message: 'Failed to login.',
      })
    }
    client.release();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Routes
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;