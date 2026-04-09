import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { connectToDB } from "./db";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const db = await connectToDB();

export const auth = betterAuth({
  // database configuration
  database: mongodbAdapter(db.getClient().db(), { client: db.getClient() }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign in
        } else if (type === "email-verification") {
          // Send the OTP for email verification
        } else {
          // Send the OTP for password reset
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
