/**
 * API routes index
 * Consolidates all routes and exports them
 */
import express from 'express';
import authRoutes from './authRoutes.js';
import eventRoutes from './eventRoutes.js';
import eventRegistrationRoutes from './eventRegistrationRoutes.js';
import registrationRoutes from './registrationRoutes.js';

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/events', eventRegistrationRoutes);
router.use('/registrations', registrationRoutes);

export default router;
