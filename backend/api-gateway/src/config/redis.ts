import { createClient } from 'redis';

// Use ReturnType to get the correct type from createClient
type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;
let redisAvailable = false;

export const connectRedis = async (): Promise<RedisClient | null> => {
    try {
        const client = createClient({
            socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                connectTimeout: 5000,
                reconnectStrategy: (retries) => {
                    if (retries > 3) {
                        console.warn('⚠ Redis not available, continuing without caching');
                        return false; // Stop reconnecting
                    }
                    return Math.min(retries * 100, 1000);
                }
            },
            password: process.env.REDIS_PASSWORD || undefined
        });

        client.on('error', (error) => {
            if (redisAvailable) {
                console.error('Redis error:', error);
            }
        });

        client.on('connect', () => {
            console.log('Redis client connected');
            redisAvailable = true;
        });

        client.on('ready', () => {
            console.log('Redis client ready');
            redisAvailable = true;
        });

        await client.connect();
        redisClient = client;
        redisAvailable = true;

        return redisClient;
    } catch (error) {
        console.warn('⚠ Redis not available, continuing without caching');
        redisAvailable = false;
        return null;
    }
};

export const getRedisClient = (): RedisClient | null => {
    return redisClient;
};

export const isRedisAvailable = (): boolean => {
    return redisAvailable && redisClient !== null;
};
