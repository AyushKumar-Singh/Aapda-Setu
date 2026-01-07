import { Router } from 'express';
import { Alert } from '../models/Alert.model';
import { authenticate, authorize, AuthRequest } from '../middlewares/auth.middleware';
import { AppError } from '../middlewares/error.middleware';

const router = Router();

// GET /api/v1/alerts - List all alerts
router.get('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const { status, type, page = 1, limit = 10 } = req.query;
        const filter: any = { tenant_id: req.user!.tenantId };

        if (status) filter.status = status;
        if (type) filter.type = type;

        const skip = (Number(page) - 1) * Number(limit);
        const [alerts, total] = await Promise.all([
            Alert.find(filter).sort('-created_at').skip(skip).limit(Number(limit)),
            Alert.countDocuments(filter)
        ]);

        res.json({ success: true, data: { items: alerts, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } });
    } catch (error) {
        throw new AppError('Failed to fetch alerts', 500);
    }
});

// POST /api/v1/admin/alerts - Create alert (admin only)
router.post('/admin/alerts', authenticate, authorize('admin', 'superadmin'), async (req: AuthRequest, res) => {
    try {
        const alertData = {
            ...req.body,
            alert_id: `alt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            tenant_id: req.user!.tenantId,
            created_by: req.user!.userId
        };

        const alert = await Alert.create(alertData);
        // TODO: Trigger FCM notifications to users in radius
        res.status(201).json({ success: true, data: alert });
    } catch (error) {
        throw new AppError('Failed to create alert', 500);
    }
});

// PATCH /api/v1/admin/alerts/:id - Update alert status
router.patch('/admin/alerts/:id', authenticate, authorize('admin', 'superadmin'), async (req: AuthRequest, res) => {
    try {
        const { status } = req.body;
        const alert = await Alert.findOneAndUpdate(
            { alert_id: req.params.id, tenant_id: req.user!.tenantId },
            { status, ...(status === 'resolved' && { resolved_at: new Date() }) },
            { new: true }
        );

        if (!alert) throw new AppError('Alert not found', 404);
        res.json({ success: true, data: alert });
    } catch (error) {
        throw error;
    }
});

export { router as alertsRouter };
