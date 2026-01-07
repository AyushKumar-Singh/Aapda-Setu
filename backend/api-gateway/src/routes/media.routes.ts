import { Router } from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppError } from '../middlewares/error.middleware';
import { authenticate, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();

// Configure S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and MP4 allowed.'));
        }
    }
});

/**
 * POST /api/v1/media/upload
 * Upload media file to S3
 */
router.post(
    '/upload',
    authenticate,
    upload.single('file'),
    async (req: AuthRequest, res) => {
        try {
            if (!req.file) {
                throw new AppError('No file provided', 400);
            }

            const fileKey = `media/${req.user!.tenantId}/${Date.now()}-${req.file.originalname}`;

            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME!,
                Key: fileKey,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                ACL: 'public-read'
            });

            await s3Client.send(command);

            const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

            res.json({
                success: true,
                data: {
                    media_id: `media_${Date.now()}`,
                    url: fileUrl,
                    type: req.file.mimetype.startsWith('image') ? 'image' : 'video',
                    size: req.file.size
                }
            });
        } catch (error: any) {
            throw new AppError(error.message || 'Upload failed', 500);
        }
    }
);

/**
 * GET /api/v1/media/presigned-url  
 * Get presigned URL for direct upload from client
 */
router.get('/presigned-url', authenticate, async (req: AuthRequest, res) => {
    try {
        const { filename, contentType } = req.query;

        if (!filename || !contentType) {
            throw new AppError('Filename and contentType required', 400);
        }

        const fileKey = `media/${req.user!.tenantId}/${Date.now()}-${filename}`;

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: fileKey,
            ContentType: contentType as string
        });

        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        res.json({
            success: true,
            data: {
                upload_url: presignedUrl,
                file_key: fileKey,
                expires_in: 3600
            }
        });
    } catch (error: any) {
        throw new AppError(error.message || 'Failed to generate presigned URL', 500);
    }
});

export { router as mediaRouter };
