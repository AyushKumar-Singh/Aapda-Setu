import mongoose from 'mongoose';

// Connection configuration
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 5000;

// Connection state for health checks
let connectionState: 'disconnected' | 'connecting' | 'connected' | 'error' = 'disconnected';
let connectionError: string | null = null;

/**
 * Get the current MongoDB connection status for health checks
 */
export const getConnectionStatus = () => {
    const conn = mongoose.connection;
    return {
        state: connectionState,
        isConnected: conn.readyState === 1,
        database: conn.name || null,
        host: conn.host ? `${conn.host}:${conn.port}` : null,
        error: connectionError
    };
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Connect to MongoDB with retry logic
 */
export const connectDatabase = async (): Promise<void> => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        connectionError = 'MONGODB_URI is not defined in environment variables';
        connectionState = 'error';
        throw new Error(connectionError);
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
        try {
            connectionState = 'connecting';
            console.log(`🔄 MongoDB connection attempt ${attempt}/${MAX_RETRY_ATTEMPTS}...`);

            await mongoose.connect(mongoUri, {
                serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
                socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            });

            // Connection successful
            connectionState = 'connected';
            connectionError = null;

            const conn = mongoose.connection;
            console.log('');
            console.log('╔════════════════════════════════════════════╗');
            console.log('║       ✅ MongoDB Connected Successfully    ║');
            console.log('╠════════════════════════════════════════════╣');
            console.log(`║  Database: ${conn.name.padEnd(30)}║`);
            console.log(`║  Host: ${(conn.host + ':' + conn.port).padEnd(34)}║`);
            console.log('╚════════════════════════════════════════════╝');
            console.log('');

            // Set up connection event handlers
            mongoose.connection.on('error', (error) => {
                connectionState = 'error';
                connectionError = error.message;
                console.error('❌ MongoDB connection error:', error.message);
            });

            mongoose.connection.on('disconnected', () => {
                connectionState = 'disconnected';
                console.warn('⚠️  MongoDB disconnected. Will attempt to reconnect automatically...');
            });

            mongoose.connection.on('reconnected', () => {
                connectionState = 'connected';
                connectionError = null;
                console.log('✅ MongoDB reconnected successfully');
            });

            return; // Success - exit the function

        } catch (error) {
            lastError = error as Error;
            connectionState = 'error';
            connectionError = lastError.message;

            console.error(`❌ MongoDB connection attempt ${attempt} failed:`, lastError.message);

            if (attempt < MAX_RETRY_ATTEMPTS) {
                console.log(`⏳ Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
                await sleep(RETRY_DELAY_MS);
            }
        }
    }

    // All retries exhausted
    console.error('');
    console.error('╔════════════════════════════════════════════════════════════╗');
    console.error('║           ❌ MongoDB Connection Failed                     ║');
    console.error('╠════════════════════════════════════════════════════════════╣');
    console.error('║  All connection attempts exhausted.                        ║');
    console.error('║                                                            ║');
    console.error('║  Common fixes:                                             ║');
    console.error('║  1. Ensure MongoDB service is running                      ║');
    console.error('║  2. Check if port 27017 is not blocked                     ║');
    console.error('║  3. Verify MONGODB_URI in .env file                        ║');
    console.error('║  4. Try: mongod --dbpath <your-data-path>                  ║');
    console.error('╚════════════════════════════════════════════════════════════╝');
    console.error('');

    throw new Error(`Failed to connect to MongoDB after ${MAX_RETRY_ATTEMPTS} attempts: ${lastError?.message}`);
};
