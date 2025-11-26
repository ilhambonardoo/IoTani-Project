"use server";

import nodemailer from "nodemailer";

type EmailConfig = {
  to: string;
  subject: string;
  html: string;
};

// Create transporter for email
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD,
    },
  });
};

// Send email function
export async function sendEmail({ to, subject, html }: EmailConfig) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("Email service is not configured");
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"IoTani" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    throw error;
  }
}

// Send reset password email
export async function sendResetPasswordEmail(email: string, resetToken: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password - IoTani</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">
                      IoTani<span style="color: #86efac;">.</span>
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">
                      Reset Password
                    </h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                      Anda telah meminta untuk mereset password akun Anda.
                    </p>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                      Klik tombol di bawah ini untuk mereset password Anda:
                    </p>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${resetUrl}" 
                             style="display: inline-block; padding: 14px 32px; background-color: #16a34a; 
                                    color: #ffffff; text-decoration: none; border-radius: 6px; 
                                    font-weight: 600; font-size: 16px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                      Atau copy dan paste link berikut di browser Anda:
                    </p>
                    <p style="color: #16a34a; font-size: 14px; word-break: break-all; 
                              background-color: #f0fdf4; padding: 12px; border-radius: 4px; 
                              border-left: 3px solid #16a34a;">
                      ${resetUrl}
                    </p>
                    
                    <p style="color: #9ca3af; font-size: 12px; line-height: 1.6; margin-top: 30px;">
                      <strong>Penting:</strong> Link ini akan kedaluwarsa dalam <strong>1 jam</strong> untuk keamanan akun Anda.
                    </p>
                    
                    <p style="color: #9ca3af; font-size: 12px; line-height: 1.6;">
                      Jika Anda tidak meminta reset password, abaikan email ini. Password Anda tidak akan berubah.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} IoTani. All rights reserved.
                    </p>
                    <p style="color: #9ca3af; font-size: 11px; margin: 5px 0 0 0;">
                      Email ini dikirim secara otomatis, mohon jangan membalas email ini.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Reset Password - IoTani",
    html,
  });
}

