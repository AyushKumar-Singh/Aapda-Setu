import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for authentication endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    skipSuccessfulRequests: true,
    message: {
        success: false,
        error: 'Too many login attempts, please try again after 15 minutes.'
    }
});

// Limiter for report creation (prevent spam)
export const createReportLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 reports per minute
    message: {
        success: false,
        error: 'Too many reports submitted, please wait before creating another.'
    }
});

// Limiter for media uploads
export const uploadLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 uploads per minute
    message: {
        success: false,
        error: 'Too many uploads, please wait before uploading again.'
    }
});
