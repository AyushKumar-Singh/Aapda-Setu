import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { authRouter } from './routes/auth.routes';
import { reportsRouter } from './routes/reports.routes';
import { alertsRouter } from './routes/alerts.routes';
import { usersRouter } from './routes/users.routes';
import { analyticsRouter } from './routes/analytics.routes';
import { mediaRouter } from './routes/media.routes';
import { chatbotRouter } from './routes/chatbot.routes';
import { healthRouter } from './routes/health.routes';
import { errorHandler } from './middlewares/error.middleware';

// Import ML queue initializer
import { initializeMLQueues } from './queues/ml.queue';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration - allow all origins for hackathon demo
// For production, restrict to specific origins
app.use(cors({
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/reports', reportsRouter);
app.use('/api/v1/alerts', alertsRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/admin', analyticsRouter);
app.use('/api/v1/media', mediaRouter);
app.use('/api/v1/chatbot', chatbotRouter);
app.use('/api/v1/health', healthRouter);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDatabase();
        console.log('✓ MongoDB connected');

        // Connect to Redis (optional - server will work without it)
        const redisConnected = await connectRedis();
        if (redisConnected) {
            console.log('✓ Redis connected');
            // Initialize ML queues after Redis is ready
            initializeMLQueues();
        } else {
            console.log('⚠ Running without Redis (caching disabled)');
        }

        // Start Express server (bind to 0.0.0.0 for Render compatibility)
        const port = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
        app.listen(port, '0.0.0.0', () => {
            console.log(`🚀 API Gateway running on port ${port}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;
