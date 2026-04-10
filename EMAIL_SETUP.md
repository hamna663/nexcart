# Better Auth Email Service Setup Guide

## Overview

This project uses Better Auth's managed email service with pre-built templates for authentication flows. No SMTP configuration or email infrastructure is needed.

## What's Configured

### 1. **Email Verification on Sign Up**
- Automatically sends a verification email when users sign up
- Uses the `verify-email` template
- Users must verify their email before accessing protected features

### 2. **Password Reset Emails**
- Sends a password reset link when users request to reset their password
- Uses the `reset-password` template
- Email includes a secure reset link valid for 60 minutes

### 3. **OTP (One-Time Password) Emails**
The emailOTP plugin handles three types of OTPs:

#### Sign-in OTP (`sign-in-otp` template)
- 6-digit code valid for 10 minutes
- Used for passwordless sign-in

#### Email Verification OTP (`verify-email-otp` template)
- 6-digit code valid for 30 minutes
- Used to verify email addresses

#### Password Reset OTP (`reset-password-otp` template)
- 6-digit code valid for 30 minutes
- Used in OTP-based password reset flow

## Environment Variables

Add these to your `.env.local` file:

```bash
# Required for Better Auth Email Service
BETTER_AUTH_API_KEY=your_api_key_from_better_auth
BETTER_AUTH_API_URL=https://api.betterauth.com  # Optional, uses default if not set

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (for social login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

## Getting Your Better Auth API Key

1. Go to [Better Auth Console](https://console.betterauth.com)
2. Create a project or select an existing one
3. Navigate to Settings > API Keys
4. Copy your `BETTER_AUTH_API_KEY`
5. Add it to your `.env.local` file

## Available Email Templates

The service provides these pre-built templates:

| Template | Purpose | Variables |
|----------|---------|-----------|
| `verify-email` | Email verification on signup | verificationUrl, userEmail, userName, appName, expirationMinutes |
| `reset-password` | Password reset request | resetLink, userEmail, userName, appName, expirationMinutes |
| `sign-in-otp` | Sign-in OTP code | otpCode, userEmail, appName, expirationMinutes |
| `verify-email-otp` | Email verification OTP | otpCode, userEmail, appName, expirationMinutes |
| `reset-password-otp` | Password reset OTP | otpCode, userEmail, appName, expirationMinutes |

## How It Works

### 1. Email Verification Flow
```
User Signs Up → Verification Email Sent → User Clicks Link → Email Verified ✓
```

### 2. Password Reset Flow
```
User Requests Reset → Reset Email Sent → User Clicks Link → Set New Password → Password Reset ✓
```

### 3. OTP Sign-In Flow
```
User Enter Email → OTP Email Sent → User Enters OTP → Signed In ✓
```

## Email Templates Customization

Templates are managed by Better Auth and include:
- Professional HTML styling
- Responsive design (mobile-friendly)
- Brand customization (app name, branding)
- Security notices and expiration times

All templates automatically include:
- Your app name (NexCart)
- User email
- Expiration information
- Security warnings for suspicious activity

## Troubleshooting

### Email Not Received
1. Check `BETTER_AUTH_API_KEY` is set correctly
2. Verify user email address is correct
3. Check spam/junk folder
4. Check Better Auth console for delivery status

### Configuration Issues
- Ensure `BETTER_AUTH_URL` matches your deployment
- API key should start with `better_auth_` prefix
- Check environment variables are loaded

### Testing
For development, you can:
1. Use a test email service (e.g., Mailtrap)
2. Enable Better Auth's sandbox mode
3. Use the Better Auth dashboard to simulate emails

## Rate Limiting

Better Auth applies rate limiting:
- Verification emails: 5 per hour per email
- Password reset: 3 per hour per email
- OTP: 10 per hour per email

## Security Notes

- Never commit your `BETTER_AUTH_API_KEY` to version control
- Links in emails are cryptographically signed
- OTP codes are single-use
- All emails include security warnings
- Better Auth handles sending without exposing credentials

## Implementation Details

### Current Configuration (lib/auth.ts)

```typescript
// Email verification on signup
emailVerification: {
  sendOnSignUp: true,
  async sendVerificationEmail({ user, url }) {
    await sendEmail({
      template: "verify-email",
      to: user.email,
      variables: { /* ... */ }
    });
  }
}

// Password reset emails
emailAndPassword: {
  async sendResetPassword({ user, url }) {
    await sendEmail({
      template: "reset-password",
      to: user.email,
      variables: { /* ... */ }
    });
  }
}

// OTP emails via emailOTP plugin
emailOTP({
  async sendVerificationOTP({ email, otp, type }) {
    // Handles sign-in, email-verification, and password-reset OTPs
  }
})
```

## Next Steps

1. Add `BETTER_AUTH_API_KEY` to `.env.local`
2. Test email verification by signing up
3. Test password reset flow
4. Monitor email delivery in Better Auth dashboard
5. Customize app name in email templates (currently "NexCart")

## Resources

- [Better Auth Email Service Docs](https://better-auth.com/docs/infrastructure/services/email)
- [Better Auth Console](https://console.betterauth.com)
- [Email Templates Reference](https://better-auth.com/docs/infrastructure/services/email#available-templates)
