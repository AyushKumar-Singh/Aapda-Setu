import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    user_id: string;
    tenant_id: string;
    firebase_uid: string;
    name: string;
    phone: string;
    email?: string;
    role: 'user' | 'verifier' | 'responder' | 'ngo_admin' | 'admin' | 'superadmin';
    trust_score: number;
    total_reports: number;
    verified_reports: number;
    status: 'active' | 'suspended' | 'banned';
    location?: {
        type: 'Point';
        coordinates: [number, number];
    };
    created_at: Date;
    updated_at: Date;
    last_login?: Date;
}

const userSchema = new Schema<IUser>({
    user_id: {
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
    firebase_uid: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        sparse: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ['user', 'verifier', 'responder', 'ngo_admin', 'admin', 'superadmin'],
        default: 'user',
        index: true
    },
    trust_score: {
        type: Number,
        default: 0.5,
        min: 0,
        max: 1
    },
    total_reports: {
        type: Number,
        default: 0
    },
    verified_reports: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'banned'],
        default: 'active',
        index: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: [Number]
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    last_login: Date
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Geospatial index (optional, for location-based features)
userSchema.index({ location: '2dsphere' });

// Compound indexes
userSchema.index({ tenant_id: 1, role: 1, status: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
