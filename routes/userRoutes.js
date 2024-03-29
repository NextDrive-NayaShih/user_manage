const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, addUser, deleteUserById } = require('../controllers/userController');

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', addUser);
router.delete('/:id', deleteUserById);

module.exports = router;
