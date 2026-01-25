import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

// System prompt for emergency assistant context
const SYSTEM_PROMPT = `You are an AI Emergency Assistant for Aapda Setu, a disaster response app in India. 
Your role is to provide helpful, accurate, and life-saving information during emergencies.

Guidelines:
- Be concise but thorough in emergency situations
- Always prioritize safety first
- Provide relevant emergency contact numbers for India (Police: 100, Fire: 101, Ambulance: 102, Disaster: 108, NDMA: 1078)
- Give step-by-step actionable advice
- If you're unsure, recommend contacting emergency services
- Be calm and reassuring in your responses
- Format responses clearly with bullet points or numbered lists when appropriate

Types of emergencies you help with: Fire, Flood, Earthquake, Cyclone, Landslide, Building Collapse, Medical emergencies, and other disasters.`;

// Chat history storage (in-memory, per session - in production use Redis/DB)
const chatHistories = new Map<string, { role: string; parts: { text: string }[] }[]>();

// Lazy initialization of GenAI client (to ensure env vars are loaded)
let genAI: GoogleGenerativeAI | null = null;

const getGenAI = () => {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not configured');
        }
        console.log('Initializing Gemini AI with key:', apiKey.substring(0, 10) + '...');
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
};

/**
 * @swagger
 * /api/v1/chatbot/chat:
 *   post:
 *     summary: Chat with Gemini AI assistant
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

        // Get or create chat history for session
        const sessionId = session_id || 'default';
        let history = chatHistories.get(sessionId) || [];

        // Initialize Gemini AI
        const ai = getGenAI();

        // Try gemini-1.5-pro (widely available)
        let model;
        try {
            model = ai.getGenerativeModel({
                model: 'gemini-1.5-pro',
                systemInstruction: SYSTEM_PROMPT
            });
        } catch (e) {
            console.log('Falling back to gemini-pro model');
            model = ai.getGenerativeModel({
                model: 'gemini-pro'
            });
        }

        // Start chat with history
        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            }
        });

        // Send message and get response
        console.log('Sending message to Gemini...');
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini response received:', text.substring(0, 100) + '...');

        // Update history
        history.push({ role: 'user', parts: [{ text: message }] });
        history.push({ role: 'model', parts: [{ text: text }] });

        // Keep only last 10 exchanges to avoid token limits
        if (history.length > 20) {
            history = history.slice(-20);
        }
        chatHistories.set(sessionId, history);

        return res.json({
            success: true,
            data: {
                response: text,
                session_id: sessionId
            }
        });

    } catch (error: any) {
        console.error('Chatbot error details:', {
            message: error.message,
            status: error.status,
            statusText: error.statusText,
            details: error.errorDetails
        });

        // Return fallback emergency info on error
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to get AI response',
            details: `API Error: ${error.status || 'unknown'} - ${error.statusText || error.message}`,
            fallback: 'Emergency services: Police-100, Fire-101, Ambulance-102, Disaster-108. Stay safe!'
        });
    }
});

/**
 * @swagger
 * /api/v1/chatbot/clear:
 *   post:
 *     summary: Clear chat history for a session
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
 * /api/v1/chatbot/test:
 *   get:
 *     summary: Test Gemini API connection
 *     tags: [Chatbot]
 */
router.get('/test', async (req: Request, res: Response) => {
    try {
        const ai = getGenAI();
        const model = ai.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const result = await model.generateContent('Say hello in one word');
        const text = result.response.text();

        return res.json({
            success: true,
            message: 'Gemini API is working!',
            response: text
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            error: error.message,
            status: error.status,
            hint: 'Check if your GEMINI_API_KEY is valid at https://aistudio.google.com/app/apikey'
        });
    }
});

export { router as chatbotRouter };
