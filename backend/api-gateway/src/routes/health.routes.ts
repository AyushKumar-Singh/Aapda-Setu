import { Router, Request, Response } from 'express';
import axios from 'axios';
import { getConnectionStatus } from '../config/database';

const router = Router();

// Ollama configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'aapda-assistant';

/**
 * GET /api/v1/health/db
 * Database health check endpoint for hackathon demo reliability
 */
router.get('/db', (req: Request, res: Response) => {
    try {
        const dbStatus = getConnectionStatus();

        if (dbStatus.isConnected) {
            res.status(200).json({
                success: true,
                status: 'ok',
                database: dbStatus.database,
                mongo: 'connected',
                host: dbStatus.host
            });
        } else {
            res.status(503).json({
                success: false,
                status: 'error',
                mongo: 'offline',
                state: dbStatus.state,
                message: dbStatus.error || 'Database connection is not established',
                troubleshooting: [
                    'Ensure MongoDB service is running',
                    'Check MONGODB_URI in .env file',
                    'Verify port 27017 is accessible',
                    'Check Windows Firewall settings'
                ]
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            status: 'error',
            message: error.message || 'Failed to check database status'
        });
    }
});

/**
 * GET /api/v1/health/ollama
 * Ollama AI service health check endpoint
 */
router.get('/ollama', async (req: Request, res: Response) => {
    try {
        console.log(`[Health] Checking Ollama at ${OLLAMA_URL}...`);

        // Check Ollama tags endpoint
        const tagsResponse = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });

        // Check if model exists
        const models = tagsResponse.data?.models || [];
        const modelNames = models.map((m: any) => m.name);
        const hasModel = modelNames.some((name: string) =>
            name.includes('aapda-assistant') || name === OLLAMA_MODEL
        );

        if (hasModel) {
            res.status(200).json({
                success: true,
                status: 'ok',
                ollama: 'online',
                model: 'ready',
                expected_model: OLLAMA_MODEL,
                available_models: modelNames,
                message: '✅ Ollama is operational'
            });
        } else {
            res.status(200).json({
                success: true,
                status: 'warning',
                ollama: 'online',
                model: 'not_found',
                expected_model: OLLAMA_MODEL,
                available_models: modelNames,
                message: '⚠️ Ollama running but model not found',
                fix: `Run: cd backend/ollama && ollama create ${OLLAMA_MODEL} -f Modelfile`
            });
        }
    } catch (error: any) {
        console.error('[Health] Ollama check failed:', error.message);

        const errorResponse: any = {
            success: false,
            status: 'error',
            ollama: 'offline',
            model: 'unavailable',
            expected_model: OLLAMA_MODEL,
            error: error.message
        };

        if (error.code === 'ECONNREFUSED') {
            errorResponse.message = '❌ Ollama not running';
            errorResponse.fix = 'Run: ollama serve';
        } else if (error.code === 'ETIMEDOUT') {
            errorResponse.message = '❌ Ollama connection timeout';
            errorResponse.fix = 'Check if Ollama is responding';
        } else {
            errorResponse.message = '❌ Failed to connect to Ollama';
        }

        res.status(503).json(errorResponse);
    }
});

/**
 * GET /api/v1/health/all
 * Comprehensive system status for pre-demo verification
 */
router.get('/all', async (req: Request, res: Response) => {
    try {
        const results: any = {
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            services: {}
        };

        // Check API
        results.services.api = { status: 'ok', port: process.env.PORT || 5000 };

        // Check Database
        const dbStatus = getConnectionStatus();
        results.services.database = {
            status: dbStatus.isConnected ? 'ok' : 'error',
            name: dbStatus.database,
            host: dbStatus.host
        };

        // Check Ollama
        try {
            const ollamaResp = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 3000 });
            const models = ollamaResp.data?.models || [];
            const hasModel = models.some((m: any) =>
                m.name.includes('aapda-assistant') || m.name === OLLAMA_MODEL
            );
            results.services.ollama = {
                status: hasModel ? 'ok' : 'warning',
                model: hasModel ? 'ready' : 'not_found',
                url: OLLAMA_URL
            };
        } catch (e) {
            results.services.ollama = { status: 'error', message: 'offline' };
        }

        // Overall status
        const allOk = Object.values(results.services).every((s: any) => s.status === 'ok');
        const hasErrors = Object.values(results.services).some((s: any) => s.status === 'error');

        results.overall = allOk ? 'healthy' : (hasErrors ? 'degraded' : 'partial');
        results.ready_for_demo = results.services.database.status === 'ok';

        res.status(allOk ? 200 : 503).json({
            success: true,
            ...results
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to check system status'
        });
    }
});

/**
 * GET /api/v1/health
 * General health check with all service statuses
 */
router.get('/', (req: Request, res: Response) => {
    try {
        const dbStatus = getConnectionStatus();

        res.status(dbStatus.isConnected ? 200 : 503).json({
            success: true,
            status: dbStatus.isConnected ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            services: {
                api: 'ok',
                database: {
                    status: dbStatus.isConnected ? 'connected' : 'disconnected',
                    name: dbStatus.database,
                    host: dbStatus.host
                }
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            status: 'error',
            message: error.message || 'Health check failed'
        });
    }
});

export const healthRouter = router;
