import express from 'express';
import EventController from '../controllers/eventController.js';
import { validate, eventSchemas } from '../middlewares/validationMiddleware.js';
import { authMiddleware, isResourceOwner } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/events - Create a new event (protected)
router.post(
    '/',
    authMiddleware,
    validate(eventSchemas.eventData),
    EventController.createEvent
);

// GET /api/events - Get all events (public)
router.get('/', EventController.getAllEvents);

// GET /api/events/:id - Get event by ID (public)
router.get('/:id', EventController.getEventById);

// PUT /api/events/:id - Update event (protected, owner only)
router.put(
    '/:id',
    authMiddleware,
    isResourceOwner(EventController.getEventCreatorId),
    validate(eventSchemas.eventData),
    EventController.updateEvent
);

// DELETE /api/events/:id - Delete event (protected, owner only)
router.delete(
    '/:id',
    authMiddleware,
    isResourceOwner(EventController.getEventCreatorId),
    EventController.deleteEvent
);

export default router;
