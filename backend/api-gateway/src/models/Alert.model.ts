import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
    alert_id: string;
    tenant_id: string;
    type: 'fire' | 'flood' | 'earthquake' | 'accident' | 'cyclone' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    center: {
        type: 'Point';
        coordinates: [number, number];
    };
    radius_km: number;
    status: 'active' | 'resolved' | 'expired';
    priority: 'low' | 'medium' | 'high' | 'critical';
    recipients_count: number;
    created_by: string;
    created_at: Date;
    expires_at?: Date;
    resolved_at?: Date;
}

const alertSchema = new Schema<IAlert>({
    alert_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    tenant_id: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['fire', 'flood', 'earthquake', 'accident', 'cyclone', 'other'],
        required: true
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    center: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    radius_km: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'resolved', 'expired'],
        default: 'active',
        index: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    recipients_count: {
        type: Number,
        default: 0
    },
    created_by: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    expires_at: Date,
    resolved_at: Date
});

// Geospatial index
alertSchema.index({ center: '2dsphere' });

// Compound indexes
alertSchema.index({ tenant_id: 1, status: 1, created_at: -1 });

export const Alert = mongoose.model<IAlert>('Alert', alertSchema);
