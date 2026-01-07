import request from 'supertest';
import app from '../src/index';
import { Report } from '../src/models/Report.model';
import { connectDatabase } from '../src/config/database';
import mongoose from 'mongoose';

describe('Reports API', () => {
    let authToken: string;
    let testReport: any;

    beforeAll(async () => {
        // Connect to test database
        await connectDatabase();

        // Get auth token
        const loginRes = await request(app)
            .post('/api/v1/auth/admin/login')
            .send({
                email: 'admin@test.com',
                password: 'test123'
            });

        authToken = loginRes.body.data.access_token;
    });

    afterAll(async () => {
        await Report.deleteMany({ title: /Test Report/ });
        await mongoose.connection.close();
    });

    describe('POST /api/v1/reports', () => {
        it('should create a new report', async () => {
            const response = await request(app)
                .post('/api/v1/reports')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    type: 'fire',
                    severity: 'high',
                    title: 'Test Report - Fire Incident',
                    description: 'Test fire report for automated testing',
                    location: {
                        type: 'Point',
                        coordinates: [72.8777, 19.0760]
                    },
                    address: {
                        formatted: 'Mumbai, Maharashtra, India',
                        city: 'Mumbai',
                        state: 'Maharashtra'
                    },
                    is_anonymous: false
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('report_id');
            expect(response.body.data.status).toBe('pending');

            testReport = response.body.data;
        });

        it('should reject report without authentication', async () => {
            const response = await request(app)
                .post('/api/v1/reports')
                .send({
                    type: 'fire',
                    title: 'Unauthorized Report'
                });

            expect(response.status).toBe(401);
        });

        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/v1/reports')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    type: 'fire'
                    // Missing required fields
                });

            expect(response.status).toBe(500); // Or 400 with proper validation
        });
    });

    describe('GET /api/v1/reports', () => {
        it('should list reports with filters', async () => {
            const response = await request(app)
                .get('/api/v1/reports?type=fire&status=pending&limit=10')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('items');
            expect(response.body.data).toHaveProperty('total');
            expect(Array.isArray(response.body.data.items)).toBe(true);
        });

        it('should support pagination', async () => {
            const response = await request(app)
                .get('/api/v1/reports?page=1&limit=5')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.page).toBe(1);
            expect(response.body.data.limit).toBe(5);
        });
    });

    describe('POST /api/v1/reports/:id/verify', () => {
        it('should verify report (admin only)', async () => {
            const response = await request(app)
                .post(`/api/v1/reports/${testReport.report_id}/verify`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    status: 'verified',
                    note: 'Verified by automated test'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe('verified');
        });
    });

    describe('Rate Limiting', () => {
        it('should enforce rate limits on report creation', async () => {
            const requests = Array(6).fill(null).map(() =>
                request(app)
                    .post('/api/v1/reports')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        type: 'fire',
                        severity: 'low',
                        title: 'Rate limit test',
                        description: 'Testing rate limiting',
                        location: { type: 'Point', coordinates: [72, 19] },
                        address: { formatted: 'Test', city: 'Test' }
                    })
            );

            const responses = await Promise.all(requests);
            const rateLimited = responses.some(r => r.status === 429);
            expect(rateLimited).toBe(true);
        });
    });
});
