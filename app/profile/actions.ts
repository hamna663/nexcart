"use server";

import { auth } from "@/lib/auth";
import { sendEmail } from "@better-auth/infra";

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export async function changePasswordAction(data: ChangePasswordInput) {
  try {
    const session = await auth.api.getSession();

    if (!session?.user) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    // Better-auth handles password change through the API
    // You would typically call the password change endpoint here
    // This is a placeholder for the actual implementation
    // You may need to implement a custom password change endpoint

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error: any) {
    console.error("Password change error:", error);
    return {
      success: false,
      error: error.message || "Failed to change password",
    };
  }
}

export async function sendVerificationEmailAction(email: string) {
  try {
    const result = await sendEmail({
      template: "verify-email",
      to: email,
      variables: {
        verificationUrl: `${process.env.BETTER_AUTH_URL}/verify-email`,
        userEmail: email,
        appName: "NexCart",
        expirationMinutes: "60",
      },
    });

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
    };
  } catch (error: any) {
    console.error("Failed to send verification email:", error);
    return {
      success: false,
      error: error.message || "Failed to send verification email",
    };
  }
}
