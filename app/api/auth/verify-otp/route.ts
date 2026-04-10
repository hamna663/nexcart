import { connectToDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, otp, type } = await request.json();

    console.log("📝 Verifying OTP:", { email, otp, type });

    if (!email || !otp || !type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await connectToDB();

    // Check if OTP exists in database
    const otpRecord = await db.collection("emailOtp").findOne({
      email: email.toLowerCase(),
      otp,
      type,
    });

    console.log("🔍 OTP Record found:", !!otpRecord);

    if (!otpRecord) {
      console.log("❌ OTP not found in database");
      // Try to find any OTP for this email to debug
      const anyOtp = await db.collection("emailOtp").findOne({ email: email.toLowerCase() });
      console.log("📋 Any OTP for this email:", anyOtp ? "Yes" : "No");
      
      if (anyOtp) {
        console.log("🔎 DEBUG - Expected OTP query:", { email: email.toLowerCase(), otp, type });
        console.log("🔎 DEBUG - Found OTP in DB:", {
          email: anyOtp.email,
          storedOtp: anyOtp.otp,
          type: anyOtp.type,
          createdAt: anyOtp.createdAt,
          expiresAt: anyOtp.expiresAt,
        });
      }

      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    const expiryTime = otpRecord.expiresAt
      ? new Date(otpRecord.expiresAt).getTime()
      : new Date(otpRecord.createdAt).getTime() + 10 * 60 * 1000; // 10 minutes default

    if (Date.now() > expiryTime) {
      console.log("⏰ OTP expired");
      // Delete expired OTP
      await db.collection("emailOtp").deleteOne({
        email: email.toLowerCase(),
        otp,
        type,
      });

      return NextResponse.json(
        {
          success: false,
          message: "OTP has expired",
        },
        { status: 400 }
      );
    }

    // Mark email as verified in user document
    const result = await db.collection("user").updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      }
    );

    console.log("✅ User email verified, modified count:", result.modifiedCount);

    if (result.modifiedCount === 0) {
      console.warn("⚠️ User not found or already verified:", email);
    }

    // Delete the used OTP
    await db.collection("emailOtp").deleteOne({
      email: email.toLowerCase(),
      otp,
      type,
    });

    console.log("✅ Email verified successfully for:", email);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      email,
    });
  } catch (error) {
    console.error("❌ OTP verification error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify OTP", error: String(error) },
      { status: 500 }
    );
  }
}
