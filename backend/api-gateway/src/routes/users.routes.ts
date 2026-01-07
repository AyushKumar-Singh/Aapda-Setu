import { Router } from 'express';
import { User } from '../models/User.model';
import { authenticate, authorize, AuthRequest } from '../middlewares/auth.middleware';
import { AppError } from '../middlewares/error.middleware';

const router = Router();

// GET /api/v1/admin/users - List users (admin only)
router.get('/admin/users', authenticate, authorize('admin', 'superadmin'), async (req: AuthRequest, res) => {
    try {
        const { role, status, search, page = 1, limit = 20 } = req.query;
        const filter: any = { tenant_id: req.user!.tenantId };

        if (role) filter.role = role;
        if (status) filter.status = status;
        if (search) filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
        ];

        const skip = (Number(page) - 1) * Number(limit);
        const [users, total] = await Promise.all([
            User.find(filter).sort('-created_at').skip(skip).limit(Number(limit)),
            User.countDocuments(filter)
        ]);

        res.json({ success: true, data: { items: users, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } });
    } catch (error) {
        throw new AppError('Failed to fetch users', 500);
    }
});

// PUT /api/v1/admin/users/:id - Update user role/status
router.put('/admin/users/:id', authenticate, authorize('admin', 'superadmin'), async (req: AuthRequest, res) => {
    try {
        const { role, status } = req.body;
        const updateData: any = {};
        if (role) updateData.role = role;
        if (status) updateData.status = status;

        const user = await User.findOneAndUpdate(
            { user_id: req.params.id, tenant_id: req.user!.tenantId },
            updateData,
            { new: true }
        );

        if (!user) throw new AppError('User not found', 404);
        res.json({ success: true, data: user });
    } catch (error) {
        throw error;
    }
});

export { router as usersRouter };
