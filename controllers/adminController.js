const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const AdminsModel = require('../models/admins.model'); // Import the AdminsModel

app.set('secret', 'mysecretkey');

const signup = async (req, res) => {
  try {
    const adminId = await AdminsModel.insert(req.body);
    const newAdmin = {
      id: adminId,
    };
    res.json(newAdmin);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const result = await AdminsModel.login(req.body);
    if (result.rows.length > 0) {
      // If a matching record is found, generate a JWT token
      const username = result.rows[0].username;

      const token = jwt.sign(
        { username },
        app.get('secret'), // secretkey
        { expiresIn: "1d" } // expiresIn
      );
      res.json({
        success: true,
        token: token
      });
    } else {
      res.json(
        {
          success: false,
          message: 'Invalid username or password'
        });
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { signup, login };
