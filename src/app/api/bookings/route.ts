
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/database/dbConnection';
import Booking from '@/lib/database/models/Booking';
import User from '@/lib/database/models/User';
import { dummyVendors } from '@/lib/data';
import { sendBookingConfirmationEmail } from '@/lib/services/emailService';

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        const body = await request.json();
        const { vendorId, bookingDate, guests, totalPrice } = body;

        if (!vendorId || !bookingDate) {
            return NextResponse.json({ success: false, message: 'Missing required booking information' }, { status: 400 });
        }

        const vendor = dummyVendors.find(v => v.id === vendorId);
        if (!vendor) {
            return NextResponse.json({ success: false, message: 'Vendor not found' }, { status: 404 });
        }
        
        const user = await User.findById(session.user.id);
        if(!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Check if vendor is already booked for this date in our dummy data (and in real DB)
        const dateOnly = new Date(bookingDate).toISOString().split('T')[0];
        if(vendor.bookedDates.includes(dateOnly)) {
            return NextResponse.json({ success: false, message: 'This date is no longer available' }, { status: 409 });
        }

        const existingBooking = await Booking.findOne({ vendorId, bookingDate });
        if(existingBooking) {
             return NextResponse.json({ success: false, message: 'This date is no longer available' }, { status: 409 });
        }


        const newBooking = new Booking({
            user: session.user.id,
            vendorId: vendor.id,
            vendorName: vendor.name,
            vendorCategory: vendor.category,
            bookingDate: new Date(bookingDate),
            guests: guests,
            totalPrice: totalPrice,
            status: 'confirmed'
        });

        await newBooking.save();
        
        // In a real app, you would update the vendor's booked dates here.
        // For this demo, we're not modifying the dummy data source.

        await sendBookingConfirmationEmail(user.email, {
            name: user.name,
            vendorName: vendor.name,
            bookingDate: new Date(bookingDate),
            totalPrice: totalPrice,
        });

        return NextResponse.json({
            success: true,
            message: 'Booking confirmed successfully! A confirmation email has been sent.',
            booking: newBooking
        });

    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}


export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        const bookings = await Booking.find({ user: session.user.id }).sort({ bookingDate: -1 });

        return NextResponse.json({
            success: true,
            bookings
        });

    } catch (error) {
        console.error('Fetch bookings error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
