
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
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #ec4899 0%, #f59e0b 100%); padding: 40px 20px; text-align: center; }
          .logo { width: 60px; height: 60px; background-color: white; border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
          .content { padding: 40px 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f59e0b 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #64748b; font-size: 14px; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">💍</div>
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Mehfil AI</h1>
          </div>
          <div class="content">
            <h2 style="color: #1e293b; margin-bottom: 20px;">Hi ${name},</h2>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining Mehfil AI – your smart wedding planning assistant.
            </p>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 30px;">
              Please verify your email to start exploring venues, vendors, and personalized wedding plans with AI recommendations.
            </p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email</a>
            </div>
            <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
              If you didn't create an account, please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 Mehfil AI. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
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
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #ec4899 0%, #f59e0b 100%); padding: 40px 20px; text-align: center; }
          .logo { width: 60px; height: 60px; background-color: white; border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
          .content { padding: 40px 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f59e0b 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #64748b; font-size: 14px; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">💍</div>
            <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
          </div>
          <div class="content">
            <h2 style="color: #1e293b; margin-bottom: 20px;">Hi ${name},</h2>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
              We received a request to reset your password for your Mehfil AI account.
            </p>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 30px;">
              Click the button below to set a new password and continue planning your Mehfil stress-free.
            </p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 Mehfil AI. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
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
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 20px; text-align: center; }
          .logo { width: 60px; height: 60px; background-color: white; border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
          .content { padding: 40px 20px; }
          .details-box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-top: 20px; }
          .details-box p { margin: 10px 0; }
          .footer { padding: 20px; text-align: center; color: #64748b; font-size: 14px; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">✅</div>
            <h1 style="color: white; margin: 0; font-size: 28px;">Booking Confirmed!</h1>
          </div>
          <div class="content">
            <h2 style="color: #1e293b; margin-bottom: 20px;">Hi ${name},</h2>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
              Your booking for your special day is confirmed! We're excited to be a part of your celebration.
            </p>
            <div class="details-box">
              <h3 style="margin-top: 0; color: #1e293b;">Booking Summary</h3>
              <p><strong>Vendor:</strong> ${vendorName}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Total Price:</strong> PKR ${totalPrice.toLocaleString()}</p>
            </div>
            <p style="color: #475569; line-height: 1.6; margin-top: 30px;">
              You can view all your bookings on your dashboard.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 Mehfil AI. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending booking confirmation email:', error);
        return { success: false, error };
    }
};
