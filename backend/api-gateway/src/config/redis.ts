import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

export const connectRedis = async (): Promise<RedisClientType> => {
    try {
        redisClient = createClient({
            socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379')
            },
            password: process.env.REDIS_PASSWORD || undefined
        });

        redisClient.on('error', (error) => {
            console.error('Redis error:', error);
        });

        redisClient.on('connect', () => {
            console.log('Redis client connected');
        });

        redisClient.on('reconnecting', () => {
            console.log('Redis client reconnecting');
        });

        redisClient.on('ready', () => {
            console.log('Redis client ready');
        });

        await redisClient.connect();

        return redisClient;
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        throw error;
    }
};

export const getRedisClient = (): RedisClientType => {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }
    return redisClient;
};
