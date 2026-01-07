import { Queue, Worker } from 'bullmq';
import { getRedisClient } from '../config/redis';
import axios from 'axios';

const ML_CPU_URL = process.env.ML_CPU_URL || 'http://localhost:8000';
const ML_GPU_URL = process.env.ML_GPU_URL || 'http://localhost:8001';

// Create queues
export const textAnalysisQueue = new Queue('text-analysis', {
    connection: getRedisClient() as any
});

export const imageAnalysisQueue = new Queue('image-analysis', {
    connection: getRedisClient() as any
});

export const fusionQueue = new Queue('fusion-analysis', {
    connection: getRedisClient() as any
});

// Text Analysis Worker
const textWorker = new Worker(
    'text-analysis',
    async (job) => {
        const { report_id, text, metadata } = job.data;

        try {
            const response = await axios.post(`${ML_CPU_URL}/analyze/text`, {
                text,
                report_id,
                metadata
            });

            return response.data;
        } catch (error: any) {
            console.error('Text analysis failed:', error.message);
            throw error;
        }
    },
    { connection: getRedisClient() as any }
);

// Image Analysis Worker
const imageWorker = new Worker(
    'image-analysis',
    async (job) => {
        const { report_id, image_url } = job.data;

        try {
            // Download image and send to ML service
            const imageResponse = await axios.get(image_url, { responseType: 'arraybuffer' });

            const formData = new FormData();
            formData.append('file', new Blob([imageResponse.data]), 'image.jpg');

            const response = await axios.post(`${ML_GPU_URL}/analyze/image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error: any) {
            console.error('Image analysis failed:', error.message);
            throw error;
        }
    },
    { connection: getRedisClient() as any }
);

// Fusion Worker (combines text + image scores)
const fusionWorker = new Worker(
    'fusion-analysis',
    async (job) => {
        const { report_id, text_score, image_score, metadata_features } = job.data;

        try {
            const response = await axios.post(`${ML_CPU_URL}/analyze/fusion`, {
                text_score,
                image_score,
                metadata_features
            });

            // Update report with final ML results
            // TODO: Import Report model and update
            console.log(`Fusion analysis complete for ${report_id}:`, response.data);

            return response.data;
        } catch (error: any) {
            console.error('Fusion analysis failed:', error.message);
            throw error;
        }
    },
    { connection: getRedisClient() as any }
);

// Helper function to trigger ML pipeline
export const triggerMLPipeline = async (reportId: string, text: string, imageUrls: string[]) => {
    try {
        // Queue text analysis
        const textJob = await textAnalysisQueue.add('analyze', {
            report_id: reportId,
            text,
            metadata: {}
        });

        // Queue image analysis (if images exist)
        let imageJob;
        if (imageUrls.length > 0) {
            imageJob = await imageAnalysisQueue.add('analyze', {
                report_id: reportId,
                image_url: imageUrls[0] // Analyze first image
            });
        }

        // Wait for both to complete, then run fusion
        Promise.all([
            textJob.waitUntilFinished(textAnalysisQueue.events),
            imageJob ? imageJob.waitUntilFinished(imageAnalysisQueue.events) : Promise.resolve({ image_score: 0.5 })
        ]).then(async ([textResult, imageResult]) => {
            await fusionQueue.add('fuse', {
                report_id: reportId,
                text_score: textResult.text_score,
                image_score: imageResult.image_score,
                metadata_features: {
                    has_image: imageUrls.length > 0 ? 1 : 0,
                    text_length: text.length
                }
            });
        });

        console.log(`ML pipeline triggered for report ${reportId}`);
    } catch (error: any) {
        console.error('Failed to trigger ML pipeline:', error.message);
    }
};

// Event listeners for queue monitoring
textWorker.on('completed', (job) => {
    console.log(`Text analysis completed: ${job.id}`);
});

imageWorker.on('completed', (job) => {
    console.log(`Image analysis completed: ${job.id}`);
});

fusionWorker.on('completed', (job) => {
    console.log(`Fusion analysis completed: ${job.id}`);
});

textWorker.on('failed', (job, err) => {
    console.error(`Text analysis failed: ${job?.id}`, err.message);
});

imageWorker.on('failed', (job, err) => {
    console.error(`Image analysis failed: ${job?.id}`, err.message);
});

fusionWorker.on('failed', (job, err) => {
    console.error(`Fusion analysis failed: ${job?.id}`, err.message);
});
