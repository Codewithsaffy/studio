import nodemailer from 'nodemailer';
import { format } from 'date-fns';

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

export const sendVerificationEmail = async (email: string, token: string, name: string) => {
    const transporter = createTransporter();

    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: {
            name: 'Mehfil AI',
            address: process.env.EMAIL_USER!
        },
        to: email,
        subject: 'Verify Your Email - Mehfil AI',
        html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { background: #8b5cf6; padding: 30px; text-align: center; }
    .logo { width: 60px; height: 60px; background-color: #ffffff; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #8b5cf6; }
    .content { padding: 30px; text-align: center; }
    .button { display: inline-block; background: #8b5cf6; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
    .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">💍</div>
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">Welcome to Mehfil AI</h1>
    </div>
    <div class="content">
      <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px;">Hi ${name},</h2>
      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
        Thank you for joining Mehfil AI – your smart wedding planning assistant.
      </p>
      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 25px 0;">
        Please verify your email to start exploring venues, vendors, and personalized wedding plans with AI recommendations.
      </p>
      <a href="${verificationUrl}" class="button">Verify Email</a>
      <p style="color: #6b7280; font-size: 14px; margin: 25px 0 0 0;">
        If you didn't create an account, please ignore this email.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 5px 0;">© 2025 Mehfil AI. All rights reserved.</p>
      <p style="margin: 0;">This is an automated email, please do not reply.</p>
    </div>
  </div>
</body>
</html>`
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending verification email:', error);
        return { success: false, error };
    }
};

export const sendPasswordResetEmail = async (email: string, token: string, name: string) => {
    const transporter = createTransporter();

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    const mailOptions = {
        from: {
            name: 'Mehfil AI',
            address: process.env.EMAIL_USER!
        },
        to: email,
        subject: 'Reset Your Password - Mehfil AI',
        html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { background: #f59e0b; padding: 30px; text-align: center; }
    .logo { width: 60px; height: 60px; background-color: #ffffff; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #f59e0b; }
    .content { padding: 30px; text-align: center; }
    .button { display: inline-block; background: #f59e0b; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
    .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🔑</div>
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">Password Reset</h1>
    </div>
    <div class="content">
      <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px;">Hi ${name},</h2>
      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
        We received a request to reset your password for your Mehfil AI account.
      </p>
      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 25px 0;">
        Click the button below to set a new password and continue planning your Mehfil stress-free.
      </p>
      <a href="${resetUrl}" class="button">Reset Password</a>
      <p style="color: #6b7280; font-size: 14px; margin: 25px 0 0 0;">
        If you didn't request this, please ignore this email.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 5px 0;">© 2025 Mehfil AI. All rights reserved.</p>
      <p style="margin: 0;">This is an automated email, please do not reply.</p>
    </div>
  </div>
</body>
</html>`
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return { success: false, error };
    }
};

export const sendBookingConfirmationEmail = async (
    email: string,
    bookingDetails: {
        name: string,
        vendorName: string,
        bookingDate: Date,
        totalPrice: number,
    }
) => {
    const transporter = createTransporter();
    const { name, vendorName, bookingDate, totalPrice } = bookingDetails;

    const formattedDate = format(bookingDate, 'PPPP'); // e.g., "Monday, October 14th, 2024"

    const mailOptions = {
        from: {
            name: 'Mehfil AI',
            address: process.env.EMAIL_USER!
        },
        to: email,
        subject: `Booking Confirmed for ${vendorName} - Mehfil AI`,
        html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { background: #10b981; padding: 30px; text-align: center; }
    .logo { width: 60px; height: 60px; background-color: #ffffff; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #10b981; }
    .content { padding: 30px; text-align: center; }
    .details-box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: left; }
    .details-box h3 { margin: 0 0 15px 0; color: #1f2937; font-size: 18px; }
    .details-box p { margin: 8px 0; color: #4b5563; }
    .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">✅</div>
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">Booking Confirmed!</h1>
    </div>
    <div class="content">
      <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px;">Hi ${name},</h2>
      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
        Your booking for your special day is confirmed! We're excited to be a part of your celebration.
      </p>
      <div class="details-box">
        <h3>Booking Summary</h3>
        <p><strong>Vendor:</strong> ${vendorName}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Total Price:</strong> PKR ${totalPrice.toLocaleString()}</p>
      </div>
      <p style="color: #4b5563; line-height: 1.6; margin: 20px 0 0 0;">
        You can view all your bookings on your dashboard.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 5px 0;">© 2025 Mehfil AI. All rights reserved.</p>
      <p style="margin: 0;">This is an automated email, please do not reply.</p>
    </div>
  </div>
</body>
</html>`
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending booking confirmation email:', error);
        return { success: false, error };
    }
};