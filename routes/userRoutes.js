import express from 'express';
const router = express.Router();
import { getAllUsers, getUserById, addUser, deleteUserById } from '../controllers/userController.js';

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', addUser);
router.delete('/:id', deleteUserById);

export default router;
