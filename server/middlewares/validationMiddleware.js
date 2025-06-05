import { z } from 'zod';

export const userSchemas = {
    // Registration schema
    register: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').max(100),
        email: z.string().email('Invalid email address'),
        password: z.string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    }),

    // Login schema
    login: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required')
    })
};

export const eventSchemas = {
    // Create/update event schema
    eventData: z.object({
        name: z.string().min(3, 'Name must be at least 3 characters').max(255),
        description: z.string().optional(),
        date: z.string()
            .refine(val => !isNaN(Date.parse(val)), {
                message: 'Invalid date format'
            }),
        location: z.string().min(3, 'Location must be at least 3 characters').max(255)
    })
};

export const registrationSchemas = {
    // Register for an event
    eventRegister: z.object({
        reason: z.string().optional()
    })
};

export const validate = (schema) => {
    return (req, res, next) => {
        try {
            // Validate request body against schema
            schema.parse(req.body);
            next();
        } catch (error) {
            // Extract and format validation errors
            const formattedErrors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: formattedErrors
            });
        }
    };
};

export default validate;
