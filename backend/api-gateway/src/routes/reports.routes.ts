import { Router, Request, Response } from 'express';
import { Report } from '../models/Report.model';
import { authenticate, authorize, AuthRequest } from '../middlewares/auth.middleware';
import { AppError } from '../middlewares/error.middleware';

const router = Router();

/**
 * GET /api/v1/reports
 * List reports with filters (public + authenticated)
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const {
            status,
            type,
            from_date,
            to_date,
            city,
            page = 1,
            limit = 10,
            sort = '-created_at'
        } = req.query;

        const filter: any = { tenant_id: req.user!.tenantId };

        if (status) filter.status = status;
        if (type) filter.type = type;
        if (city) filter['address.city'] = city;
        if (from_date || to_date) {
            filter.created_at = {};
            if (from_date) filter.created_at.$gte = new Date(from_date as string);
            if (to_date) filter.created_at.$lte = new Date(to_date as string);
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [reports, total] = await Promise.all([
            Report.find(filter)
                .sort(sort as string)
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            Report.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: {
                items: reports,
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        throw new AppError('Failed to fetch reports', 500);
    }
});

/**
 * GET /api/v1/reports/:id
 * Get single report details
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const report = await Report.findOne({
            report_id: req.params.id,
            tenant_id: req.user!.tenantId
        });

        if (!report) {
            throw new AppError('Report not found', 404);
        }

        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        throw error;
    }
});

/**
 * POST /api/v1/reports
 * Create new report
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const reportData = {
            ...req.body,
            report_id: `rpt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            tenant_id: req.user!.tenantId,
            user_id: req.user!.userId,
            status: 'pending',
            confidence_score: 0,
            nearby_confirmations: 0
        };

        const report = await Report.create(reportData);

        // TODO: Trigger ML pipeline via BullMQ queue

        res.status(201).json({
            success: true,
            data: report
        });
    } catch (error) {
        throw new AppError('Failed to create report', 500);
    }
});

/**
 * POST /api/v1/reports/:id/verify
 * Verify or reject report (admin only)
 */
router.post(
    '/:id/verify',
    authenticate,
    authorize('admin', 'verifier', 'superadmin'),
    async (req: AuthRequest, res: Response) => {
        try {
            const { status, note } = req.body;

            if (!['verified', 'rejected', 'false_positive'].includes(status)) {
                throw new AppError('Invalid status', 400);
            }

            const report = await Report.findOneAndUpdate(
                {
                    report_id: req.params.id,
                    tenant_id: req.user!.tenantId
                },
                {
                    status,
                    verified_by: req.user!.userId,
                    verification_note: note,
                    updated_at: new Date()
                },
                { new: true }
            );

            if (!report) {
                throw new AppError('Report not found', 404);
            }

            // TODO: Send notification to reporter

            res.json({
                success: true,
                data: report
            });
        } catch (error) {
            throw error;
        }
    }
);

/**
 * GET /api/v1/admin/reports/pending
 * Get pending reports for verification
 */
router.get('/admin/pending', authenticate, authorize('admin', 'verifier'), async (req: AuthRequest, res: Response) => {
    try {
        const reports = await Report.find({
            tenant_id: req.user!.tenantId,
            status: 'pending'
        })
            .sort('-created_at')
            .limit(50)
            .lean();

        res.json({
            success: true,
            data: reports
        });
    } catch (error) {
        throw new AppError('Failed to fetch pending reports', 500);
    }
});

export { router as reportsRouter };
