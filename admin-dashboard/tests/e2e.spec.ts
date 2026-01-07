import { test, expect } from '@playwright/test';

test.describe('Aapda Setu Admin Dashboard', () => {
    let authToken: string;

    test.beforeAll(async ({ request }) => {
        // Get auth token
        const response = await request.post('http://localhost:3000/api/v1/auth/admin/login', {
            data: {
                email: 'admin@test.com',
                password: 'test123'
            }
        });

        const data = await response.json();
        authToken = data.data.access_token;
    });

    test('should load login page', async ({ page }) => {
        await page.goto('http://localhost:3001/login');

        await expect(page).toHaveTitle(/Aapda Setu/);
        await expect(page.locator('h2')).toContainText('Aapda Setu Admin');
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test('should login successfully', async ({ page, context }) => {
        await page.goto('http://localhost:3001/login');

        // Store token in localStorage
        await context.addCookies([{
            name: 'auth_token',
            value: authToken,
            domain: 'localhost',
            path: '/'
        }]);

        await page.evaluate((token) => {
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user', JSON.stringify({
                name: 'Test Admin',
                email: 'admin@test.com',
                role: 'admin'
            }));
        }, authToken);

        await page.goto('http://localhost:3001/dashboard');
        await expect(page).toHaveURL(/dashboard/);
    });

    test('should display dashboard stats', async ({ page, context }) => {
        await context.addCookies([{
            name: 'auth_token',
            value: authToken,
            domain: 'localhost',
            path: '/'
        }]);

        await page.evaluate((token) => {
            localStorage.setItem('auth_token', token);
        }, authToken);

        await page.goto('http://localhost:3001/dashboard');

        // Wait for stats to load
        await page.waitForTimeout(2000);

        // Check for stat cards
        await expect(page.locator('text=Reports Today')).toBeVisible();
        await expect(page.locator('text=Pending Verification')).toBeVisible();
        await expect(page.locator('text=Active Alerts')).toBeVisible();
        await expect(page.locator('text=Total Users')).toBeVisible();
    });

    test('should navigate to map page', async ({ page, context }) => {
        await context.addCookies([{
            name: 'auth_token',
            value: authToken,
            domain: 'localhost',
            path: '/'
        }]);

        await page.evaluate((token) => {
            localStorage.setItem('auth_token', token);
        }, authToken);

        await page.goto('http://localhost:3001/map');

        // Wait for map to load
        await page.waitForTimeout(3000);

        // Check for map container
        const mapContainer = page.locator('.maplibregl-map, [class*="maplibre"]');
        await expect(mapContainer).toBeVisible();
    });

    test('should load verification queue', async ({ page, context }) => {
        await context.addCookies([{
            name: 'auth_token',
            value: authToken,
            domain: 'localhost',
            path: '/'
        }]);

        await page.evaluate((token) => {
            localStorage.setItem('auth_token', token);
        }, authToken);

        await page.goto('http://localhost:3001/verification');

        await expect(page.locator('h1')).toContainText('Verification Queue');
    });

    test('should display reports list', async ({ page, context }) => {
        await context.addCookies([{
            name: 'auth_token',
            value: authToken,
            domain: 'localhost',
            path: '/'
        }]);

        await page.evaluate((token) => {
            localStorage.setItem('auth_token', token);
        }, authToken);

        await page.goto('http://localhost:3001/reports');

        await expect(page.locator('h1')).toContainText('All Reports');

        // Check for table
        await expect(page.locator('table')).toBeVisible();
    });

    test('should logout successfully', async ({ page, context }) => {
        await context.addCookies([{
            name: 'auth_token',
            value: authToken,
            domain: 'localhost',
            path: '/'
        }]);

        await page.evaluate((token) => {
            localStorage.setItem('auth_token', token);
        }, authToken);

        await page.goto('http://localhost:3001/settings');

        // Click logout button
        await page.click('text=Logout');

        // Should redirect to login
        await expect(page).toHaveURL(/login/);
    });

    test('should pass accessibility checks', async ({ page, context }) => {
        const { injectAxe, checkA11y } = require('axe-playwright');

        await context.addCookies([{
            name: 'auth_token',
            value: authToken,
            domain: 'localhost',
            path: '/'
        }]);

        await page.evaluate((token) => {
            localStorage.setItem('auth_token', token);
        }, authToken);

        await page.goto('http://localhost:3001/dashboard');
        await injectAxe(page);
        await checkA11y(page, null, {
            detailedReport: true,
            detailedReportOptions: { html: true }
        });
    });
});

// Run with: npx playwright test
