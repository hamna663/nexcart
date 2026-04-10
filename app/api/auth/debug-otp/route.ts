import { connectToDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }

    const db = await connectToDB();

    // Check for OTPs in database
    const otps = await db.collection("emailOtp").find({ email }).toArray();

    console.log("🔍 OTPs in database for", email, ":", otps);

    // Also check user record
    const user = await db.collection("user").findOne({ email });
    console.log("👤 User record:", user);

    return NextResponse.json({
      success: true,
      email,
      otpsCount: otps.length,
      otps: otps.map((o) => ({
        ...o,
        otp: "***", // Hide the actual OTP for security
      })),
      user: {
        email: user?.email,
        emailVerified: user?.emailVerified,
      },
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { success: false, message: "Debug check failed", error: String(error) },
      { status: 500 },
    );
  }
}
