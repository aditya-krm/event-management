import express from 'express';
import AuthController from '../controllers/authController.js';
import { validate, userSchemas } from '../middlewares/validationMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', validate(userSchemas.register), AuthController.register);

// POST /api/auth/login - Login user
router.post('/login', validate(userSchemas.login), AuthController.login);

// GET /api/auth/me - Get current user profile (protected route)
router.get('/me', authMiddleware, AuthController.getCurrentUser);

export default router;
