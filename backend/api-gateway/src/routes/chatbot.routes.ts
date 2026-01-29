/**
 * Aapda Setu - AI Chatbot Routes (Ollama Only)
 * 
 * =================================================================================
 * HACKATHON DEPLOYMENT:
 * - Ollama runs on laptop at 127.0.0.1:11434
 * - Node.js API Gateway runs on laptop at 0.0.0.0:5000
 * - Phone connects to Node via WiFi using laptop's LAN IP
 * - Flow: Phone → http://<LAN_IP>:5000 → http://127.0.0.1:11434 (Ollama)
 * =================================================================================
 */

import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

// ============================================================================
// CONFIGURATION
// ============================================================================

// Use 127.0.0.1 instead of localhost for reliability
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'aapda-assistant';

// ============================================================================
// NDMA SAFETY WRAPPER (Prepended to every prompt)
// ============================================================================

const NDMA_SAFETY_WRAPPER = `You are Aapda Setu AI Emergency Assistant following NDMA safety rules.

RULES:
1. Always prioritize life safety first
2. Never claim government help has been dispatched
3. Never fabricate evacuation orders
4. Keep answers short and actionable (under 100 words)
5. Always include relevant helpline numbers

EMERGENCY HELPLINES:
- National Emergency: 112
- Fire: 101
- Ambulance: 108
- Police: 100
- NDMA Helpline: 1078

USER QUERY: `;

// ============================================================================
// FALLBACK MESSAGE
// ============================================================================

const FALLBACK_MESSAGE = `⚠️ AI Assistant temporarily unavailable.

For emergencies, call:
• Emergency: 112
• Fire: 101
• Ambulance: 108
• Police: 100
• NDMA: 1078`;

// ============================================================================
// ROUTES
// ============================================================================

/**
 * POST /api/v1/chatbot/chat
 * Main chat endpoint - calls Ollama generate API
 */
router.post('/chat', async (req: Request, res: Response) => {
    const startTime = Date.now();

    try {
        const { message } = req.body;

        // Validate input
        if (!message || typeof message !== 'string' || message.trim() === '') {
            console.log('[Chatbot] Error: Empty message received');
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        console.log(`[Chatbot] Request: "${message.substring(0, 60)}..."`);

        // Build prompt with NDMA safety wrapper
        const fullPrompt = NDMA_SAFETY_WRAPPER + message.trim();

        // Call Ollama generate API
        console.log(`[Chatbot] Calling Ollama at ${OLLAMA_URL}/api/generate`);

        const ollamaResponse = await axios.post(
            `${OLLAMA_URL}/api/generate`,
            {
                model: OLLAMA_MODEL,
                prompt: fullPrompt,
                stream: false,
                options: {
                    temperature: 0.3,
                    top_p: 0.9,
                    num_ctx: 2048
                }
            },
            {
                timeout: 60000, // 60 second timeout
                headers: { 'Content-Type': 'application/json' }
            }
        );

        // Extract response
        const aiResponse = ollamaResponse.data?.response;

        if (!aiResponse) {
            console.error('[Chatbot] Error: Empty response from Ollama');
            console.error('[Chatbot] Ollama raw response:', JSON.stringify(ollamaResponse.data));
            throw new Error('Empty response from Ollama');
        }

        const duration = Date.now() - startTime;
        console.log(`[Chatbot] Success (${duration}ms): "${aiResponse.substring(0, 60)}..."`);

        // Return success response
        return res.json({
            success: true,
            data: {
                response: aiResponse,
                model: OLLAMA_MODEL,
                duration_ms: duration
            }
        });

    } catch (error: any) {
        const duration = Date.now() - startTime;

        // ====== DETAILED ERROR LOGGING ======
        console.error('========================================');
        console.error('[Chatbot] ERROR DETAILS:');
        console.error(`  Time: ${new Date().toISOString()}`);
        console.error(`  Duration: ${duration}ms`);
        console.error(`  Error Code: ${error.code || 'N/A'}`);
        console.error(`  Error Message: ${error.message}`);

        if (error.response) {
            console.error(`  HTTP Status: ${error.response.status}`);
            console.error(`  Response Data: ${JSON.stringify(error.response.data)}`);
        }

        if (error.code === 'ECONNREFUSED') {
            console.error('  ❌ OLLAMA NOT RUNNING!');
            console.error('  💡 Fix: Run "ollama serve" in terminal');
        }

        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            console.error('  ⏱️ REQUEST TIMED OUT');
            console.error('  💡 Fix: Model may be loading, try again');
        }

        console.error('========================================');

        // Return fallback response (not error) so Flutter shows it nicely
        return res.json({
            success: true,
            data: {
                response: FALLBACK_MESSAGE,
                error: error.message,
                is_fallback: true
            }
        });
    }
});

/**
 * GET /api/v1/chatbot/health
 * Health check - verifies Ollama connection and model availability
 */
router.get('/health', async (req: Request, res: Response) => {
    console.log('[Chatbot] Health check requested');

    const health: any = {
        node: 'online',
        ollama: 'unknown',
        model: 'unknown',
        ollama_url: OLLAMA_URL,
        expected_model: OLLAMA_MODEL
    };

    try {
        // Check Ollama tags endpoint
        const tagsResponse = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
        health.ollama = 'online';

        // Check if model exists
        const models = tagsResponse.data?.models || [];
        const modelNames = models.map((m: any) => m.name);
        health.available_models = modelNames;

        const hasModel = modelNames.some((name: string) =>
            name.includes('aapda-assistant') || name === OLLAMA_MODEL
        );

        if (hasModel) {
            health.model = 'ready';
            health.status = '✅ All systems operational';
        } else {
            health.model = 'not_found';
            health.status = '⚠️ Model not found';
            health.fix = `Run: cd backend/ollama && ollama create ${OLLAMA_MODEL} -f Modelfile`;
        }

        return res.json(health);

    } catch (error: any) {
        console.error('[Chatbot] Health check failed:', error.message);

        health.ollama = 'offline';
        health.model = 'unavailable';
        health.error = error.message;

        if (error.code === 'ECONNREFUSED') {
            health.status = '❌ Ollama not running';
            health.fix = 'Run: ollama serve';
        } else {
            health.status = '❌ Connection error';
        }

        return res.status(503).json(health);
    }
});

/**
 * POST /api/v1/chatbot/clear
 * Clear chat session (placeholder for future session management)
 */
router.post('/clear', (req: Request, res: Response) => {
    console.log('[Chatbot] Session cleared');
    return res.json({ success: true, message: 'Session cleared' });
});

/**
 * GET /api/v1/chatbot/test
 * Quick test to verify Ollama responds
 */
router.get('/test', async (req: Request, res: Response) => {
    console.log('[Chatbot] Running quick test...');

    try {
        const response = await axios.post(
            `${OLLAMA_URL}/api/generate`,
            {
                model: OLLAMA_MODEL,
                prompt: 'Say "Aapda Assistant ready!" in exactly 3 words.',
                stream: false,
                options: { temperature: 0.1 }
            },
            { timeout: 30000 }
        );

        return res.json({
            success: true,
            message: '✅ Ollama responding!',
            response: response.data?.response,
            model: OLLAMA_MODEL
        });

    } catch (error: any) {
        console.error('[Chatbot] Test failed:', error.message);

        return res.status(500).json({
            success: false,
            error: error.message,
            code: error.code,
            fix: error.code === 'ECONNREFUSED'
                ? 'Run: ollama serve'
                : 'Check Ollama logs'
        });
    }
});

export { router as chatbotRouter };
