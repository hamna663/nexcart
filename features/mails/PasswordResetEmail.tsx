import { User } from "better-auth";

export const PasswordResetEmail = ({
  url,
  user,
}: {
  url: string;
  user: User;
}): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>
    </head>
    <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #FF6B35; margin-bottom: 20px;">Password Reset Request</h2>
        <p style="font-size: 16px; line-height: 1.6;">Hi ${user.name || "there"},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          We received a request to reset your password. Click the button below to reset it:
        </p>
        <div style="margin: 30px 0;">
          <a
            href="${url}"
            style="
              display: inline-block;
              padding: 12px 30px;
              background-color: #FF6B35;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            "
          >
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #666;">
          <strong>Or copy and paste this link in your browser:</strong><br>
          <a href="${url}" style="color: #FF6B35; text-decoration: none; word-break: break-all;">${url}</a>
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; line-height: 1.6; color: #666;">
            <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email and ensure your account is secure. If you believe your account has been compromised, contact us immediately.
          </p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; margin-top: 30px;">
          Thanks,<br>
          <strong>The NexCart Team</strong>
        </p>
      </div>
    </body>
    </html>
  `.trim();
};
