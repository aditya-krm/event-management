import express from 'express';
import RegistrationController from '../controllers/registrationController.js';
import { validate, registrationSchemas } from '../middlewares/validationMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/events/:id/register - Register for an event (protected)
router.post(
    '/:id/register',
    authMiddleware,
    validate(registrationSchemas.eventRegister),
    RegistrationController.registerForEvent
);

// GET /api/events/:id/participants - Get event participants (protected, creator only)
router.get(
    '/:id/participants',
    authMiddleware,
    RegistrationController.getEventParticipants
);

export default router;
