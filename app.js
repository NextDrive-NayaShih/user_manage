const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// PostgreSQL連線設定
const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5431, // Docker Compose 中定義的端口
});

// API端點，擷取所有使用者
app.get('/users', async (req, res) => {
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
});

// 取得特定使用者資訊
app.get('/users/:id', async (req, res) => {
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
});

// 建立新使用者
app.post('/users', async (req, res) => {
  const { name, nickname, age } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO users (name, nickname, age) VALUES ($1, $2, $3) RETURNING id', [name, nickname, age]);
    const newUser = {
      id: result.rows[0].id,
      name,
      nickname,
      age
    };
    res.json(newUser);
    client.release();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 刪除使用者
app.delete('/users/:id', async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
