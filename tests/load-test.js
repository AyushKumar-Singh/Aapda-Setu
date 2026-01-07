import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

export const options = {
    stages: [
        { duration: '30s', target: 20 },  // Ramp up to 20 users
        { duration: '1m', target: 50 },   // Ramp up to 50 users
        { duration: '30s', target: 100 }, // Spike to 100 users
        { duration: '1m', target: 50 },   // Scale down
        { duration: '30s', target: 0 },   // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        errors: ['rate<0.1'],              // Error rate should be below 10%
    },
};

const BASE_URL = 'http://localhost:3000';
let authToken = '';

export function setup() {
    // Login to get token
    const loginRes = http.post(`${BASE_URL}/api/v1/auth/admin/login`, JSON.stringify({
        email: 'admin@test.com',
        password: 'test123'
    }), {
        headers: { 'Content-Type': 'application/json' },
    });

    if (loginRes.status === 200) {
        const data = JSON.parse(String(loginRes.body));
        return { token: data.data.access_token };
    }

    return { token: '' };
}

export default function (data) {
    const token = data.token;

    // Test 1: Health Check
    const healthRes = http.get(`${BASE_URL}/health`);
    check(healthRes, {
        'health check status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);

    // Test 2: List Reports
    const reportsRes = http.get(`${BASE_URL}/api/v1/reports?limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    check(reportsRes, {
        'reports API status is 200': (r) => r.status === 200,
        'reports API returns data': (r) => {
            const body = JSON.parse(String(r.body));
            return body.success === true;
        },
    }) || errorRate.add(1);

    // Test 3: Dashboard Analytics
    const analyticsRes = http.get(`${BASE_URL}/api/v1/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    check(analyticsRes, {
        'analytics API status is 200': (r) => r.status === 200,
        'analytics API latency < 1s': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);

    // Test 4: Create Report (POST)
    const createPayload = JSON.stringify({
        type: 'fire',
        severity: 'high',
        title: 'Load Test Report',
        description: 'Automated load testing report',
        location: {
            type: 'Point',
            coordinates: [72.8777, 19.0760]
        },
        address: {
            formatted: 'Mumbai, India',
            city: 'Mumbai',
            state: 'Maharashtra'
        }
    });

    const createRes = http.post(`${BASE_URL}/api/v1/reports`, createPayload, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    });

    check(createRes, {
        'create report status is 201': (r) => r.status === 201,
        'create report returns report_id': (r) => {
            const body = JSON.parse(String(r.body));
            return body.data && body.data.report_id;
        },
    }) || errorRate.add(1);

    sleep(1);
}

export function teardown(data) {
    console.log('Load test completed');
}

// Run with: k6 run load-test.js
