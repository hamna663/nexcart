export const ForgotPasswordOTPEmail = ({
  otp,
  email,
}: {
  otp: string;
  email: string;
}): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .header h2 { color: #FF6B35; margin: 0 0 10px 0; font-size: 24px; }
          .header p { margin: 0; color: #666; }
          .content p { font-size: 16px; line-height: 1.5; margin: 20px 0; }
          .otp-box { background-color: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; border: 2px solid #FF6B35; }
          .otp-box p { margin: 0; }
          .otp-label { font-size: 12px; color: #666; }
          .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #FF6B35; font-family: monospace; margin-top: 10px; }
          .warning { background-color: #fff3cd; padding: 12px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #ffc107; }
          .warning p { margin: 0; font-size: 13px; color: #856404; }
          .footer { background-color: #fafafa; padding: 15px; border-radius: 5px; font-size: 12px; color: #999; margin-top: 20px; border-top: 1px solid #ddd; }
          .footer p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Password Reset Request</h2>
            <p>Secure your account</p>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p>We received a request to reset your password. Please use the one-time code below to proceed:</p>
            <div class="otp-box">
              <p class="otp-label">ONE-TIME CODE</p>
              <p class="otp-code">${otp}</p>
            </div>
            <p>This code will expire in <strong>30 minutes</strong>.</p>
            <div class="warning">
              <p><strong>⚠️ Security Notice:</strong> If you didn't request this reset, your account may be compromised. Please change your password immediately.</p>
            </div>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p><strong>Email:</strong> ${email}</p>
            <p>© 2026 NexCart. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
