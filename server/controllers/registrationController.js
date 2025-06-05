import RegistrationModel from '../models/registrationModel.js';
import EventModel from '../models/eventModel.js';

class RegistrationController {
    async registerForEvent(req, res, next) {
        try {
            const eventId = req.params.id;
            const userId = req.user.id;
            const { reason } = req.body;

            // Check if event exists
            const event = await EventModel.findById(eventId);
            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found'
                });
            }

            // Check if user is already registered
            const alreadyRegistered = await RegistrationModel.isRegistered(userId, eventId);
            if (alreadyRegistered) {
                return res.status(409).json({
                    success: false,
                    message: 'You are already registered for this event'
                });
            }

            // Register user
            const registration = await RegistrationModel.register(userId, eventId, reason);

            res.status(201).json({
                success: true,
                message: 'Successfully registered for event',
                data: {
                    registration
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getEventParticipants(req, res, next) {
        try {
            const eventId = req.params.id;
            const userId = req.user.id;

            // Check if event exists
            const event = await EventModel.findById(eventId);
            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found'
                });
            }

            // Check if user is the event creator
            if (event.created_by !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: You can only view participants for events you created'
                });
            }

            // Get participants
            const participants = await RegistrationModel.getParticipants(eventId);

            res.status(200).json({
                success: true,
                count: participants.length,
                data: {
                    eventId,
                    eventName: event.name,
                    participants
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async cancelRegistration(req, res, next) {
        try {
            const registrationId = req.params.id;

            // Check if registration exists
            const registration = await RegistrationModel.findById(registrationId);
            if (!registration) {
                return res.status(404).json({
                    success: false,
                    message: 'Registration not found'
                });
            }

            // Cancel registration
            await RegistrationModel.cancel(registrationId);

            res.status(200).json({
                success: true,
                message: 'Registration canceled successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserRegistrations(req, res, next) {
        try {
            const userId = req.user.id;

            // Get user's registrations
            const registrations = await RegistrationModel.getUserRegistrations(userId);

            res.status(200).json({
                success: true,
                count: registrations.length,
                data: {
                    registrations
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getRegistrationEventCreatorId(req) {
        const registrationId = req.params.id;

        // Get registration details
        const registration = await RegistrationModel.findById(registrationId);
        if (!registration) {
            throw new Error('Registration not found');
        }

        // Get event creator ID
        return await EventModel.getCreatorId(registration.event_id);
    }

    async getEventCreatorId(req) {
        const eventId = req.params.id;

        // Get event creator ID
        return await EventModel.getCreatorId(eventId);
    }
}

export default new RegistrationController();
