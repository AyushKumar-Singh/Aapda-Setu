import { Router } from 'express';
import { Report } from '../models/Report.model';
import { User } from '../models/User.model';
import { Alert } from '../models/Alert.model';
import { authenticate, authorize, AuthRequest } from '../middlewares/auth.middleware';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

const router = Router();

/**
 * GET /api/v1/export/reports/csv
 * Export reports as CSV
 */
router.get(
    '/reports/csv',
    authenticate,
    authorize('admin', 'superadmin'),
    async (req: AuthRequest, res) => {
        try {
            const { from_date, to_date, status, type } = req.query;

            const filter: any = { tenant_id: req.user!.tenantId };
            if (status) filter.status = status;
            if (type) filter.type = type;
            if (from_date || to_date) {
                filter.created_at = {};
                if (from_date) filter.created_at.$gte = new Date(from_date as string);
                if (to_date) filter.created_at.$lte = new Date(to_date as string);
            }

            const reports = await Report.find(filter).limit(1000).lean();

            const fields = [
                'report_id',
                'type',
                'severity',
                'title',
                'description',
                'status',
                'confidence_score',
                'address.city',
                'created_at'
            ];

            const parser = new Parser({ fields });
            const csv = parser.parse(reports);

            res.header('Content-Type', 'text/csv');
            res.header('Content-Disposition', 'attachment; filename=reports.csv');
            res.send(csv);
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

/**
 * GET /api/v1/export/reports/pdf
 * Export reports as PDF
 */
router.get(
    '/reports/pdf',
    authenticate,
    authorize('admin', 'superadmin'),
    async (req: AuthRequest, res) => {
        try {
            const { from_date, to_date } = req.query;

            const filter: any = { tenant_id: req.user!.tenantId };
            if (from_date || to_date) {
                filter.created_at = {};
                if (from_date) filter.created_at.$gte = new Date(from_date as string);
                if (to_date) filter.created_at.$lte = new Date(to_date as string);
            }

            const reports = await Report.find(filter).limit(100).lean();

            const doc = new PDFDocument();
            res.header('Content-Type', 'application/pdf');
            res.header('Content-Disposition', 'attachment; filename=reports.pdf');
            doc.pipe(res);

            // Title
            doc.fontSize(20).text('Aapda Setu - Reports Export', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
            doc.moveDown(2);

            // Reports
            reports.forEach((report: any, index) => {
                doc.fontSize(14).text(`${index + 1}. ${report.title}`, { underline: true });
                doc.fontSize(10);
                doc.text(`Type: ${report.type} | Severity: ${report.severity} | Status: ${report.status}`);
                doc.text(`Confidence: ${Math.round(report.confidence_score * 100)}%`);
                doc.text(`Location: ${report.address.formatted}`);
                doc.text(`Date: ${new Date(report.created_at).toLocaleString()}`);
                doc.moveDown();

                if (index < reports.length - 1) {
                    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
                    doc.moveDown();
                }
            });

            doc.end();
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

/**
 * GET /api/v1/export/analytics/csv
 * Export analytics data as CSV
 */
router.get(
    '/analytics/csv',
    authenticate,
    authorize('admin', 'superadmin'),
    async (req: AuthRequest, res) => {
        try {
            const stats = await Report.aggregate([
                { $match: { tenant_id: req.user!.tenantId } },
                {
                    $group: {
                        _id: { type: '$type', severity: '$severity' },
                        count: { $sum: 1 },
                        avg_confidence: { $avg: '$confidence_score' }
                    }
                }
            ]);

            const fields = ['_id.type', '_id.severity', 'count', 'avg_confidence'];
            const parser = new Parser({ fields });
            const csv = parser.parse(stats);

            res.header('Content-Type', 'text/csv');
            res.header('Content-Disposition', 'attachment; filename=analytics.csv');
            res.send(csv);
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

export { router as exportRouter };
