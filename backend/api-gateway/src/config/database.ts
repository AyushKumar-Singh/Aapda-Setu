import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri);

        mongoose.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...');
        });

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
};
