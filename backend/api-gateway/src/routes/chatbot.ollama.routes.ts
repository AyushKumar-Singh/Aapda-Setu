import axios from 'axios';
import { Router, Request, Response } from 'express';

const router = Router();

// Ollama server configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL_NAME = 'aapda-assistant';

// Chat history storage (in-memory - use Redis in production)
const chatHistories = new Map<string, { role: string; content: string }[]>();

/**
 * @swagger
 * /api/v1/chatbot/chat:
 *   post:
 *     summary: Chat with Aapda Assistant (Ollama)
 *     tags: [Chatbot]
 */
router.post('/chat', async (req: Request, res: Response) => {
    try {
        const { message, session_id } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        console.log('Chatbot request received:', message);

        // Get or create chat history
        const sessionId = session_id || 'default';
        let history = chatHistories.get(sessionId) || [];

        // Add user message to history
        history.push({ role: 'user', content: message });

        // Call Ollama API
        console.log('Sending to Ollama...');
        const response = await axios.post(`${OLLAMA_URL}/api/chat`, {
            model: MODEL_NAME,
            messages: history,
            stream: false,
            options: {
                temperature: 0.3,
                top_p: 0.9,
                num_ctx: 4096
            }
        }, {
            timeout: 60000 // 60 second timeout for slower responses
        });

        const assistantMessage = response.data.message.content;
        console.log('Ollama response:', assistantMessage.substring(0, 100) + '...');

        // Add assistant response to history
        history.push({ role: 'assistant', content: assistantMessage });

        // Keep only last 10 exchanges
        if (history.length > 20) {
            history = history.slice(-20);
        }
        chatHistories.set(sessionId, history);

        return res.json({
            success: true,
            data: {
                response: assistantMessage,
                session_id: sessionId,
                model: MODEL_NAME
            }
        });

    } catch (error: any) {
        console.error('Ollama error:', error.message);

        // Check if Ollama is running
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                error: 'AI service unavailable. Please ensure Ollama is running.',
                hint: 'Run: ollama serve',
                fallback: 'Emergency: 112 | Fire: 101 | Ambulance: 108 | Police: 100'
            });
        }

        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to get AI response',
            fallback: 'Emergency: 112 | Fire: 101 | Ambulance: 108 | Police: 100'
        });
    }
});

/**
 * @swagger
 * /api/v1/chatbot/clear:
 *   post:
 *     summary: Clear chat history
 *     tags: [Chatbot]
 */
router.post('/clear', (req: Request, res: Response) => {
    const { session_id } = req.body;
    const sessionId = session_id || 'default';

    chatHistories.delete(sessionId);

    return res.json({
        success: true,
        message: 'Chat history cleared'
    });
});

/**
 * @swagger
 * /api/v1/chatbot/health:
 *   get:
 *     summary: Check Ollama health
 *     tags: [Chatbot]
 */
router.get('/health', async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
        const models = response.data.models || [];
        const hasAapdaModel = models.some((m: any) => m.name.includes('aapda-assistant'));

        return res.json({
            success: true,
            ollama: 'connected',
            url: OLLAMA_URL,
            models: models.map((m: any) => m.name),
            aapda_assistant_ready: hasAapdaModel,
            hint: hasAapdaModel ? 'Ready!' : 'Run: ollama create aapda-assistant -f backend/ollama/Modelfile'
        });
    } catch (error: any) {
        return res.status(503).json({
            success: false,
            ollama: 'disconnected',
            error: 'Cannot connect to Ollama',
            hint: 'Run: ollama serve'
        });
    }
});

/**
 * @swagger
 * /api/v1/chatbot/test:
 *   get:
 *     summary: Test Aapda Assistant
 *     tags: [Chatbot]
 */
router.get('/test', async (req: Request, res: Response) => {
    try {
        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: MODEL_NAME,
            prompt: 'Say "Aapda Assistant ready!" in one line.',
            stream: false,
            options: { temperature: 0.1 }
        }, { timeout: 30000 });

        return res.json({
            success: true,
            message: 'Aapda Assistant is working!',
            response: response.data.response,
            model: MODEL_NAME
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            error: error.message,
            hint: 'Ensure Ollama is running and aapda-assistant model is created'
        });
    }
});

export { router as ollamaChatbotRouter };
