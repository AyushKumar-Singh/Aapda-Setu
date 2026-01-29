import { Router, Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User.model';
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
        const accessTokenOptions = {
            expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as string
        } as SignOptions;
        const accessToken = jwt.sign(
            {
                userId: user.user_id,
                role: user.role,
                tenantId: user.tenant_id
            },
            process.env.JWT_SECRET!,
            accessTokenOptions
        );

        const refreshTokenOptions = {
            expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN || '7d') as string
        } as SignOptions;
        const refreshToken = jwt.sign(
            {
                userId: user.user_id
            },
            process.env.JWT_SECRET!,
            refreshTokenOptions
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
 * Phone-based mobile authentication (dev mode)
 * Creates/finds user by phone number and returns JWT token
 */
router.post('/mobile/verify', async (req: Request, res: Response) => {
    try {
        const { phone, name } = req.body;

        if (!phone) {
            throw new AppError('Phone number required', 400);
        }

        // Find or create user by phone number
        let user = await User.findOne({ phone: phone });

        if (!user) {
            // Create new user
            user = await User.create({
                user_id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                tenant_id: 'default',
                name: name || 'Mobile User',
                phone: phone,
                role: 'user',
                status: 'active'
            });
        }

        // Generate JWT token for the mobile user
        const accessToken = jwt.sign(
            {
                userId: user.user_id,
                role: user.role,
                tenantId: user.tenant_id
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: '30d' // Longer expiry for mobile
            }
        );

        // Update last login
        await User.findByIdAndUpdate(user._id, { last_login: new Date() });

        res.json({
            success: true,
            data: {
                access_token: accessToken,
                expires_in: 2592000, // 30 days in seconds
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
        throw error;
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

        const newAccessTokenOptions = {
            expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as string
        } as SignOptions;
        const newAccessToken = jwt.sign(
            {
                userId: user.user_id,
                role: user.role,
                tenantId: user.tenant_id
            },
            process.env.JWT_SECRET!,
            newAccessTokenOptions
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
