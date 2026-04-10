"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Send OTP on mount
  useEffect(() => {
    if (!email) {
      setError("Email not provided. Please sign up again.");
      setSending(false);
      return;
    }

    const sendOTP = async () => {
      try {
        setSending(true);
        setError(null);

        // Trigger OTP sending through the emailOtp plugin
        await authClient.emailOtp.sendVerificationOtp(
          {
            email,
            type: "email-verification",
          },
          {
            onSuccess: () => {
              console.log("✓ OTP sent successfully to", email);
              setSending(false);
            },
            onError: (error) => {
              console.error("✗ Failed to send OTP:", error);
              setError("Failed to send verification code. Please try again.");
              setSending(false);
            },
          },
        );
      } catch (err) {
        console.error("Error sending OTP:", err);
        setError("Failed to send verification code. Please try again.");
        setSending(false);
      }
    };

    sendOTP();
  }, [email]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;

    const timer = setTimeout(() => {
      setResendCountdown(resendCountdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleSubmitOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !otp) {
      setError("Please enter the verification code");
      return;
    }

    if (otp.length < 6) {
      setError("Verification code should be 6 digits");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Verify the OTP by making API call
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          type: "email-verification",
        }),
      });

      const data = await response.json();
      console.log("📋 Verification response:", data);

      if (response.ok && data.success) {
        setSuccess(true);
        // Redirect to profile after successful verification
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      } else {
        const errorMessage =
          data.message || "Invalid verification code. Please try again.";
        console.error("Verification failed:", errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Failed to verify code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setSending(true);
      setError(null);

      await authClient.emailOtp.sendVerificationOtp(
        {
          email: email!,
          type: "email-verification",
        },
        {
          onSuccess: () => {
            setSending(false);
            setResendCountdown(60);
          },
          onError: (error) => {
            console.error("Failed to resend OTP:", error);
            setError("Failed to resend code. Please try again.");
            setSending(false);
          },
        },
      );
    } catch (err) {
      console.error("Error resending OTP:", err);
      setError("Failed to resend code. Please try again.");
      setSending(false);
    }
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-linear-to-b from-background to-muted p-4">
        <Card className="w-full max-w-md p-8">
          <Alert className="bg-red-50 border-red-200 text-red-800">
            Email not provided. Please sign up again.
          </Alert>
          <Button
            onClick={() => router.push("/sign-up")}
            className="w-full mt-4"
          >
            Back to Sign Up
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-linear-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <div className="space-y-6 p-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Verify Your Email</h1>
            <p className="text-muted-foreground">
              We've sent a verification code to{" "}
              <span className="font-semibold">{email}</span>
            </p>
          </div>

          {sending && (
            <Alert className="bg-blue-50 border-blue-200 text-blue-800 flex items-center gap-2">
              <Spinner className="w-4 h-4" />
              Sending verification code...
            </Alert>
          )}

          {error && (
            <Alert className="bg-red-50 border-red-200 text-red-800">
              {error}
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              ✓ Email verified successfully! Redirecting...
            </Alert>
          )}

          <form onSubmit={handleSubmitOTP} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium">
                Verification Code
              </label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="text-center text-2xl tracking-widest font-mono"
                disabled={loading || sending}
              />
              <p className="text-xs text-muted-foreground">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={loading || sending || otp.length < 6}
            >
              {loading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>
          </form>

          <div className="space-y-3">
            <p className="text-center text-sm">Didn't receive the code?</p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResendOTP}
              disabled={resendCountdown > 0 || sending}
            >
              {resendCountdown > 0
                ? `Resend in ${resendCountdown}s`
                : "Resend Code"}
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              className="w-full text-orange-500 hover:text-orange-600"
              onClick={() => router.push("/sign-in")}
            >
              Back to Sign In
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
