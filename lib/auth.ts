import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { connectToDB } from "./db";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { transporter } from "./email";
import { EmailVerificationOTPEmail } from "@/features/mails/EmailVerificationOTPEmail";
import { ForgotPasswordOTPEmail } from "@/features/mails/ForgotPasswordOTPEmail";
import { PasswordResetEmail } from "@/features/mails/PasswordResetEmail";
import type { User } from "better-auth";

const db = await connectToDB();

export const auth = betterAuth({
  // database configuration
  database: mongodbAdapter(db.getClient().db(), { client: db.getClient() }),
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    async sendResetPassword({ user, url }: { user: User; url: string }) {
      const html = PasswordResetEmail({ url, user });

      await transporter.sendMail({
        to: user.email,
        subject: "Password Reset Request",
        html,
      });

      console.log("📧 Password reset email sent to", user.email);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    emailOTP({
      // Store OTP in database - better-auth will automatically use the configured database
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`📧 Processing ${type} OTP for ${email}:`, otp);

        // Handle email-verification and password-reset OTP types
        const emailTypeMap = {
          "email-verification": {
            generator: EmailVerificationOTPEmail,
            subject: "Email Verification Code",
          },
          "password-reset": {
            generator: ForgotPasswordOTPEmail,
            subject: "Password Reset Code",
          },
        } as const;

        // Skip sign-in OTP
        if (type === "sign-in") {
          console.log("⏭️ Skipping sign-in OTP");
          return;
        }

        const config = emailTypeMap[type as keyof typeof emailTypeMap];

        if (!config) {
          console.warn(`⚠️ No config found for OTP type: ${type}`);
          return;
        }

        try {
          // Manually store OTP in database since plugin might not do it automatically
          const dbInstance = await connectToDB();
          await dbInstance.collection("emailOtp").insertOne({
            email,
            otp,
            type,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
          });
          console.log(`💾 OTP stored in database for ${email}`);

          // Generate email HTML
          const html = config.generator({
            otp,
            email,
          });

          // Send email
          await transporter.sendMail({
            to: email,
            subject: config.subject,
            html,
          });

          console.log(
            `✅ Successfully sent ${type} OTP to ${email}. Code: ${otp}`
          );
        } catch (error) {
          console.error(
            `❌ Failed to send ${type} OTP to ${email}:`,
            error
          );
          throw error;
        }
      },
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
});
