"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconLogout,
  IconLock,
  IconMailCheck,
  IconUser,
  IconMail,
  IconShield,
} from "@tabler/icons-react";

const passwordResetSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordResetForm = z.infer<typeof passwordResetSchema>;

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
}

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const form = useForm<PasswordResetForm>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await authClient.getSession();
        if (!session.data?.user) {
          router.push("/sign-in");
          return;
        }
        setUser(session.data.user as User);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/sign-in");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.push("/sign-in");
    } catch (error) {
      toast.error("Failed to logout");
      console.error(error);
    }
  };

  const handleChangePassword = async (data: PasswordResetForm) => {
    setIsChangingPassword(true);
    try {
      // Note: Better-auth might have a specific method for changing password
      // This is a placeholder - adjust based on your auth setup
      await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success("Password changed successfully");
      form.reset();
      setIsChangingPassword(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
      console.error(error);
      setIsChangingPassword(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!user?.email) return;

    setIsSendingVerification(true);
    try {
      // The email verification is handled by Better Auth automatically
      // If user wants to resend verification, they can sign up again
      // Or implement a custom resend endpoint
      toast.info(
        "Check your email for verification link. It was sent during signup."
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification email");
      console.error(error);
    } finally {
      setIsSendingVerification(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account settings</p>
          </div>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUser size={24} />
              Account Information
            </CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-lg font-semibold">{user.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <IconMail size={16} />
                  Email
                </p>
                <p className="text-lg font-semibold">{user.email}</p>
              </div>
              <div>
                {user.emailVerified ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center gap-1">
                    <IconMailCheck size={16} />
                    Verified
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                    Unverified
                  </span>
                )}
              </div>
            </div>

            {/* Account Created Date */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Account Created</p>
                <p className="text-lg font-semibold">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconShield size={24} />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Change Password Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled={isChangingPassword}
                >
                  <IconLock className="mr-2" size={18} />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your current password and choose a new one
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleChangePassword)}>
                  <FieldGroup className="gap-y-3">
                    <Controller
                      name="currentPassword"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Current Password</FieldLabel>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter current password"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="newPassword"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>New Password</FieldLabel>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter new password"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="confirmPassword"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Confirm Password</FieldLabel>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Confirm new password"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={isChangingPassword}
                      className="w-full mt-4"
                    >
                      {isChangingPassword ? "Changing..." : "Change Password"}
                    </Button>
                  </FieldGroup>
                </form>
              </DialogContent>
            </Dialog>

            {/* Verify Email Button */}
            {!user.emailVerified && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleVerifyEmail}
                disabled={isSendingVerification}
              >
                <IconMailCheck className="mr-2" size={18} />
                {isSendingVerification ? "Sending..." : "Verify Email"}
              </Button>
            )}

            {/* Logout Button */}
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <IconLogout className="mr-2" size={18} />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
