import { Router } from 'express';
import { Report } from '../models/Report.model';
import { Alert } from '../models/Alert.model';
import { User } from '../models/User.model';
import { authenticate, authorize, AuthRequest } from '../middlewares/auth.middleware';
import { AppError } from '../middlewares/error.middleware';

const router = Router();

// GET /api/v1/admin/analytics - Dashboard statistics
router.get('/admin/analytics', authenticate, authorize('admin', 'verifier', 'superadmin'), async (req: AuthRequest, res) => {
    try {
        const tenantId = req.user!.tenantId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            total_reports_today,
            pending_verification,
            active_alerts,
            total_users,
            verified_reports,
            rejected_reports
        ] = await Promise.all([
            Report.countDocuments({ tenant_id: tenantId, created_at: { $gte: today } }),
            Report.countDocuments({ tenant_id: tenantId, status: 'pending' }),
            Alert.countDocuments({ tenant_id: tenantId, status: 'active' }),
            User.countDocuments({ tenant_id: tenantId }),
            Report.countDocuments({ tenant_id: tenantId, status: 'verified' }),
            Report.countDocuments({ tenant_id: tenantId, status: 'rejected' })
        ]);

        const total_all_reports = verified_reports + rejected_reports + pending_verification;

        res.json({
            success: true,
            data: {
                total_reports_today,
                pending_verification,
                active_alerts,
                total_users,
                avg_response_time_min: Math.floor(Math.random() * 10) + 5, // TODO: Calculate real avg
                verification_accuracy: total_all_reports > 0 ? verified_reports / total_all_reports : 0.9,
                auto_verified_percent: 0.7, // TODO: Calculate from ML results
                manual_review_percent: 0.2,
                rejected_percent: total_all_reports > 0 ? rejected_reports / total_all_reports : 0.1
            }
        });
    } catch (error) {
        throw new AppError('Failed to fetch analytics', 500);
    }
});

// GET /api/v1/admin/analytics/trend - Reports trend last 7 days
router.get('/admin/analytics/trend', authenticate, authorize('admin', 'superadmin'), async (req: AuthRequest, res) => {
    try {
        const days = Number(req.query.days) || 7;
        const labels: string[] = [];
        const data: number[] = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const count = await Report.countDocuments({
                tenant_id: req.user!.tenantId,
                created_at: { $gte: date, $lt: nextDate }
            });

            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            data.push(count);
        }

        res.json({
            success: true,
            data: {
                labels,
                datasets: [{ label: 'Total Reports', data, borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }]
            }
        });
    } catch (error) {
        throw new AppError('Failed to fetch trend data', 500);
    }
});

// GET /api/v1/admin/analytics/disaster-types - Distribution by type
router.get('/admin/analytics/disaster-types', authenticate, authorize('admin', 'superadmin'), async (req: AuthRequest, res) => {
    try {
        const distribution = await Report.aggregate([
            { $match: { tenant_id: req.user!.tenantId } },
            { $group: { _id: '$type', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const labels = distribution.map(d => d._id.charAt(0).toUpperCase() + d._id.slice(1));
        const data = distribution.map(d => d.count);

        res.json({
            success: true,
            data: {
                labels,
                datasets: [{ label: 'Reports by Type', data, backgroundColor: ['#ef4444', '#3b82f6', '#eab308', '#f97316', '#84cc16'] }]
            }
        });
    } catch (error) {
        throw new AppError('Failed to fetch disaster type distribution', 500);
    }
});

export { router as analyticsRouter };
