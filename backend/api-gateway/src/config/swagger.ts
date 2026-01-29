import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Aapda Setu API Documentation',
            version: '1.0.0',
            description: 'AI-Powered Disaster Response Management System API',
            contact: {
                name: 'Aapda Setu Team',
                email: 'support@aapdasetu.in'
            }
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}`,
                description: 'Development server'
            },
            {
                url: process.env.RENDER_EXTERNAL_URL || 'https://aapda-setu-api.onrender.com',
                description: 'Render deployment'
            },
            {
                url: 'https://api.aapdasetu.in',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Report: {
                    type: 'object',
                    properties: {
                        report_id: { type: 'string' },
                        type: { type: 'string', enum: ['fire', 'flood', 'earthquake', 'accident', 'landslide', 'cyclone'] },
                        severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        location: {
                            type: 'object',
                            properties: {
                                type: { type: 'string', example: 'Point' },
                                coordinates: { type: 'array', items: { type: 'number' } }
                            }
                        },
                        status: { type: 'string', enum: ['pending', 'verified', 'rejected'] },
                        confidence_score: { type: 'number' }
                    }
                },
                Alert: {
                    type: 'object',
                    properties: {
                        alert_id: { type: 'string' },
                        type: { type: 'string' },
                        severity: { type: 'string' },
                        title: { type: 'string' },
                        message: { type: 'string' },
                        radius_km: { type: 'number' },
                        status: { type: 'string', enum: ['active', 'resolved', 'expired'] }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        user_id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string', enum: ['user', 'verifier', 'admin', 'superadmin'] },
                        trust_score: { type: 'number' }
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.ts'] // Path to API routes
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Aapda Setu API Docs'
    }));

    // JSON endpoint for spec
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.log('📚 Swagger docs available at /api-docs');
};
