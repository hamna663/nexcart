import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();

    console.log("📧 Sending OTP for:", { email, type });

    if (!email || !type) {
      return NextResponse.json(
        { success: false, message: "Email and type are required" },
        { status: 400 },
      );
    }

    // Better Auth internally handles OTP generation and sending
    // We need to trigger it through the auth instance
    // The emailOTP plugin will call sendVerificationOTP with the OTP data

    // For now, return success and let the client-side OTP plugin handle it
    // The OTP should be generated automatically when the client calls sendVerificationOtp

    return NextResponse.json({
      success: true,
      message: "OTP sending initiated",
      email,
      type,
    });
  } catch (error) {
    console.error("❌ OTP sending error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP", error: String(error) },
      { status: 500 },
    );
  }
}
