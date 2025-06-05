export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error status and message
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';

    // Database-specific error handling
    if (err.code === '23505') { // PostgreSQL unique violation
        return res.status(409).json({
            success: false,
            message: 'A record with this information already exists'
        });
    }

    if (err.code === '23503') { // PostgreSQL foreign key violation
        return res.status(400).json({
            success: false,
            message: 'Referenced record does not exist'
        });
    }

    // General error response
    res.status(status).json({
        success: false,
        message: status === 500 && process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : message
    });
};

export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
};

export default { errorHandler, notFoundHandler };
