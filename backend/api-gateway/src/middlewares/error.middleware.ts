import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let statusCode = 500;
    let message = 'Internal server error';

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    } else if (err.name === 'MongoError' && (err as any).code === 11000) {
        statusCode = 409;
        message = 'Duplicate entry';
    }

    // Log error in development
    if (process.env.NODE_ENV !== 'production') {
        console.error('Error:', err);
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};
