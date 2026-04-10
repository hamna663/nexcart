import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { connectToDB } from "./db";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { sendEmail,dash } from "@better-auth/infra";

const db = await connectToDB();

export const auth = betterAuth({
  // database configuration
  database: mongodbAdapter(db.getClient().db(), { client: db.getClient() }),
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        template: "reset-password",
        to: user.email,
        variables: {
          resetLink: url,
          userEmail: user.email,
          userName: user.name || "User",
          appName: "NexCart",
          expirationMinutes: "60",
        },
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    async sendVerificationEmail({ user, url }) {
      await sendEmail({
        template: "verify-email",
        to: user.email,
        variables: {
          verificationUrl: url,
          userEmail: user.email,
          userName: user.name || "User",
          appName: "NexCart",
          expirationMinutes: "60",
        },
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
     dash(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const templates: Record<string, { template: string; subject: string }> = {
          "sign-in": { template: "sign-in-otp", subject: "Your Sign In Code" },
          "email-verification": {
            template: "verify-email-otp",
            subject: "Email Verification Code",
          },
          "password-reset": {
            template: "reset-password-otp",
            subject: "Password Reset Code",
          },
        };

        const config = templates[type] || templates["sign-in"];

        try {
          await sendEmail({
            template: config.template as any,
            to: email,
            variables: {
              otpCode: otp,
              userEmail: email,
              appName: "NexCart",
              expirationMinutes: type === "sign-in" ? "10" : "30",
            },
          });
        } catch (error) {
          console.error(`Failed to send ${type} OTP to ${email}:`, error);
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
