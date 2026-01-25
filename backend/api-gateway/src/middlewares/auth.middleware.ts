import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
        tenantId: string;
    };
}

/**
 * Middleware to verify JWT token (for web admin and mobile)
 */
export const verifyJWT = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: 'No token provided'
            });
            return;
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

            req.user = {
                userId: decoded.userId,
                role: decoded.role,
                tenantId: decoded.tenantId
            };

            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
            return;
        }
    } catch (error) {
        next(error);
    }
};

/**
 * JWT-only authentication middleware
 * Used for both web admin dashboard and mobile app
 */
export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            error: 'No token provided'
        });
        return;
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
            tenantId: decoded.tenantId
        };
        return next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid authentication token'
        });
        return;
    }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Not authenticated'
            });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: 'Insufficient permissions'
            });
            return;
        }

        next();
    };
};
