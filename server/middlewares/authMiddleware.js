import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = (req, res, next) => {
    try {
        // Get the authorization header
        const authHeader = req.headers.authorization;

        // Check if authorization header exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Extract the token
        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user ID to request
        req.user = { id: decoded.userId };

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

export const isResourceOwner = (getResourceOwnerId) => {
    return async (req, res, next) => {
        try {
            const ownerId = await getResourceOwnerId(req);

            if (ownerId !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: You do not have permission to access this resource'
                });
            }

            next();
        } catch (error) {
            console.error('Resource owner check error:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while checking resource ownership'
            });
        }
    };
};

export default authMiddleware;
