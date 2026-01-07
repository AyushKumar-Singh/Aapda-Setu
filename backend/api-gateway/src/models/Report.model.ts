import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
    report_id: string;
    tenant_id: string;
    user_id: string;
    type: 'fire' | 'flood' | 'earthquake' | 'accident' | 'landslide' | 'cyclone' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [lng, lat]
    };
    address: {
        formatted: string;
        city: string;
        state: string;
        country?: string;
        postal_code?: string;
    };
    media: Array<{
        media_id: string;
        type: 'image' | 'video';
        url: string;
        thumbnail_url?: string;
    }>;
    status: 'pending' | 'verified' | 'rejected' | 'false_positive';
    confidence_score: number;
    ml_results?: {
        text_score?: number;
        image_score?: number;
        fusion_score?: number;
        is_duplicate?: boolean;
        is_tampered?: boolean;
    };
    verified_by?: string;
    verification_note?: string;
    nearby_confirmations: number;
    is_anonymous: boolean;
    created_at: Date;
    updated_at: Date;
}

const reportSchema = new Schema<IReport>({
    report_id: {
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
    user_id: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['fire', 'flood', 'earthquake', 'accident', 'landslide', 'cyclone', 'other'],
        required: true,
        index: true
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
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
    address: {
        formatted: String,
        city: { type: String, index: true },
        state: String,
        country: String,
        postal_code: String
    },
    media: [{
        media_id: String,
        type: {
            type: String,
            enum: ['image', 'video']
        },
        url: String,
        thumbnail_url: String
    }],
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected', 'false_positive'],
        default: 'pending',
        index: true
    },
    confidence_score: {
        type: Number,
        default: 0
    },
    ml_results: {
        text_score: Number,
        image_score: Number,
        fusion_score: Number,
        is_duplicate: Boolean,
        is_tampered: Boolean
    },
    verified_by: String,
    verification_note: String,
    nearby_confirmations: {
        type: Number,
        default: 0
    },
    is_anonymous: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now,
        index: true
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Geospatial index for location-based queries
reportSchema.index({ location: '2dsphere' });

// Compound indexes for common queries
reportSchema.index({ tenant_id: 1, status: 1, created_at: -1 });
reportSchema.index({ user_id: 1, created_at: -1 });

export const Report = mongoose.model<IReport>('Report', reportSchema);
