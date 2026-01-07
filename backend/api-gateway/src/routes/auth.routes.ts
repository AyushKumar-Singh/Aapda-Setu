import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import admin from '../config/firebase';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest, authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * POST /api/v1/auth/admin/login
 * Admin login with email/password (generates JWT)
 */
router.post('/admin/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // TODO: Implement proper admin user validation
        // For now, checking if user exists and has admin role
        const user = await User.findOne({ email, role: { $in: ['admin', 'superadmin'] } });

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        // Generate JWT token
        const accessToken = jwt.sign(
            {
                userId: user.user_id,
                role: user.role,
                tenantId: user.tenant_id
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1h'
            }
        );

        const refreshToken = jwt.sign(
            {
                userId: user.user_id
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
            }
        );

        // Update last login
        await User.findByIdAndUpdate(user._id, { last_login: new Date() });

        res.json({
            success: true,
            data: {
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_in: 3600,
                user: {
                    user_id: user.user_id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        throw error;
    }
});

/**
 * POST /api/v1/auth/mobile/verify
 * Verify Firebase OTP token and create/update user
 */
router.post('/mobile/verify', async (req: Request, res: Response) => {
    try {
        const { firebase_token } = req.body;

        if (!firebase_token) {
            throw new AppError('Firebase token required', 400);
        }

        // Verify Firebase token
        const decodedToken = await admin.auth().verifyIdToken(firebase_token);

        // Find or create user
        let user = await User.findOne({ firebase_uid: decodedToken.uid });

        if (!user) {
            // Create new user
            user = await User.create({
                user_id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                tenant_id: 'default', // TODO: Handle multi-tenancy
                firebase_uid: decodedToken.uid,
                name: decodedToken.name || 'User',
                phone: decodedToken.phone_number || '',
                email: decodedToken.email,
                role: 'user',
                status: 'active'
            });
        }

        // Update last login
        await User.findByIdAndUpdate(user._id, { last_login: new Date() });

        res.json({
            success: true,
            data: {
                user: {
                    user_id: user.user_id,
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    role: user.role,
                    trust_score: user.trust_score
                }
            }
        });
    } catch (error) {
        throw new AppError('Invalid Firebase token', 401);
    }
});

/**
 * POST /api/v1/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req: Request, res: Response) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            throw new AppError('Refresh token required', 400);
        }

        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET!) as any;

        const user = await User.findOne({ user_id: decoded.userId });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        const newAccessToken = jwt.sign(
            {
                userId: user.user_id,
                role: user.role,
                tenantId: user.tenant_id
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1h'
            }
        );

        res.json({
            success: true,
            data: {
                access_token: newAccessToken,
                expires_in: 3600
            }
        });
    } catch (error) {
        throw new AppError('Invalid refresh token', 401);
    }
});

/**
 * GET /api/v1/auth/me
 * Get current user profile
 */
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findOne({ user_id: req.user!.userId });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        throw error;
    }
});

export { router as authRouter };
