import express from 'express';
import RegistrationController from '../controllers/registrationController.js';
import { authMiddleware, isResourceOwner } from '../middlewares/authMiddleware.js';

const router = express.Router();

// DELETE /api/registrations/:id - Cancel registration (protected, event creator only)
router.delete(
    '/:id',
    authMiddleware,
    isResourceOwner(RegistrationController.getRegistrationEventCreatorId),
    RegistrationController.cancelRegistration
);

// GET /api/registrations/user - Get user's registrations (protected)
router.get(
    '/user',
    authMiddleware,
    RegistrationController.getUserRegistrations
);

export default router;
