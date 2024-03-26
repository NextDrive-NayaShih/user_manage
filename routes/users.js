const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken')

const router = express.Router();
// PostgreSQL connection setup
const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5430, // Docker Compose port
});

// Controller functions
const getAllUsers = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    const users = result.rows;
    res.json(users);
    client.release();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
    client.release();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addUser = async (req, res) => {
  const { name, nickname, age } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO users (name, nickname, age) VALUES ($1, $2, $3) RETURNING id', [name, nickname, age]);
    const newUser = {
      id: result.rows[0].id,
    };
    res.json(newUser);
    client.release();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const client = await pool.connect();
    await client.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ message: 'User deleted successfully' });
    client.release();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', addUser);
router.delete('/:id', deleteUserById);

module.exports = router;
