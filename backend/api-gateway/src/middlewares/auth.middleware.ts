import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import admin from '../config/firebase';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
        tenantId: string;
    };
}

/**
 * Middleware to verify JWT token (for web admin)
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
 * Middleware to verify Firebase token (for mobile app)
 */
export const verifyFirebaseToken = async (
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
            const decodedToken = await admin.auth().verifyIdToken(token);

            req.user = {
                userId: decodedToken.uid,
                role: decodedToken.role || 'user',
                tenantId: decodedToken.tenantId || 'default'
            };

            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                error: 'Invalid Firebase token'
            });
            return;
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Hybrid auth middleware - accepts both JWT and Firebase tokens
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

    // Try JWT first (for web admin)
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
            tenantId: decoded.tenantId
        };
        return next();
    } catch (jwtError) {
        // If JWT fails, try Firebase token (for mobile)
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            req.user = {
                userId: decodedToken.uid,
                role: decodedToken.role || 'user',
                tenantId: decodedToken.tenantId || 'default'
            };
            return next();
        } catch (firebaseError) {
            res.status(401).json({
                success: false,
                error: 'Invalid authentication token'
            });
            return;
        }
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
