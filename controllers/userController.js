const UsersModel = require('../models/users.model'); // Import the AdminsModel
const express = require('express');
const app = express();

app.set('secret', 'mysecretkey');

const getAllUsers = async (req, res) => {
  try {
    const result = await UsersModel.selectAll();
    console.info("result:", result);
    res.status(200)
    result.rows.length > 0 ? res.json(result.rows) : res.json({});
    return result.rows; // 返回结果数组
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' })
  }
};

const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const result = await UsersModel.selectById(userId);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addUser = async (req, res) => {
  try {
    const result = await UsersModel.insert(req.body);
    const newUser = {
      id: result.rows[0].id,
    };
    res.json(newUser);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const result = await UsersModel.delete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllUsers, getUserById, addUser, deleteUserById };
