import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

let io: SocketIOServer;

export const initializeWebSocket = (httpServer: HTTPServer) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
            methods: ['GET', 'POST']
        }
    });

    // Authentication middleware for WebSocket
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            socket.data.userId = decoded.userId;
            socket.data.tenantId = decoded.tenantId;
            socket.data.role = decoded.role;
            next();
        } catch (error) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`WebSocket connected: ${socket.id} (User: ${socket.data.userId})`);

        // Join tenant room for scoped updates
        const tenantRoom = `tenant_${socket.data.tenantId}`;
        socket.join(tenantRoom);

        // Join role-based rooms
        if (socket.data.role === 'admin' || socket.data.role === 'superadmin') {
            socket.join('admins');
        }

        socket.on('disconnect', () => {
            console.log(`WebSocket disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = (): SocketIOServer => {
    if (!io) {
        throw new Error('WebSocket not initialized');
    }
    return io;
};

// Helper functions to emit events

export const emitNewReport = (tenantId: string, report: any) => {
    if (io) {
        io.to(`tenant_${tenantId}`).emit('new_report', report);
        io.to('admins').emit('new_report', report);
    }
};

export const emitReportVerified = (tenantId: string, reportId: string, status: string) => {
    if (io) {
        io.to(`tenant_${tenantId}`).emit('report_verified', { reportId, status });
    }
};

export const emitNewAlert = (tenantId: string, alert: any) => {
    if (io) {
        io.to(`tenant_${tenantId}`).emit('new_alert', alert);
    }
};

export const emitMLResultsReady = (tenantId: string, reportId: string, results: any) => {
    if (io) {
        io.to('admins').emit('ml_results', { reportId, results });
    }
};
