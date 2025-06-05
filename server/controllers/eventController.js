import EventModel from '../models/eventModel.js';

class EventController {
    async createEvent(req, res, next) {
        try {
            const userId = req.user.id;
            const eventData = req.body;

            const newEvent = await EventModel.create(eventData, userId);

            res.status(201).json({
                success: true,
                message: 'Event created successfully',
                data: {
                    event: newEvent
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllEvents(req, res, next) {
        try {
            const events = await EventModel.findAll();

            res.status(200).json({
                success: true,
                count: events.length,
                data: {
                    events
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getEventById(req, res, next) {
        try {
            const eventId = req.params.id;
            const event = await EventModel.findById(eventId);

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found'
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    event
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async updateEvent(req, res, next) {
        try {
            const eventId = req.params.id;
            const eventData = req.body;

            // Check if event exists
            const event = await EventModel.findById(eventId);
            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found'
                });
            }

            // Update event
            const updatedEvent = await EventModel.update(eventId, eventData);

            res.status(200).json({
                success: true,
                message: 'Event updated successfully',
                data: {
                    event: updatedEvent
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteEvent(req, res, next) {
        try {
            const eventId = req.params.id;

            // Check if event exists
            const event = await EventModel.findById(eventId);
            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found'
                });
            }

            // Delete event
            await EventModel.delete(eventId);

            res.status(200).json({
                success: true,
                message: 'Event deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    async getEventCreatorId(req) {
        const eventId = req.params.id;
        return await EventModel.getCreatorId(eventId);
    }
}

export default new EventController();
