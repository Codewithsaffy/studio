
import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUser } from './User';
import type { Vendor } from '@/lib/data';

export interface IBooking extends Document {
    user: Types.ObjectId | IUser;
    vendor: Types.ObjectId | Vendor;
    vendorId: string;
    vendorName: string;
    vendorCategory: string;
    bookingDate: Date;
    guests?: number;
    totalPrice: number;
    status: 'confirmed' | 'pending' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    vendorId: {
        type: String,
        required: true,
    },
    vendorName: {
        type: String,
        required: true,
    },
    vendorCategory: {
        type: String,
        required: true,
    },
    bookingDate: {
        type: Date,
        required: true,
    },
    guests: {
        type: Number,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['confirmed', 'pending', 'cancelled'],
        default: 'confirmed',
    },
}, {
    timestamps: true
});

BookingSchema.index({ user: 1 });
BookingSchema.index({ vendorId: 1 });
BookingSchema.index({ bookingDate: 1 });

const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
