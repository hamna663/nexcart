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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground text-lg">
            Manage your account information and preferences
          </p>
        </div>

        {/* User Info Card */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="border-b border-border bg-card pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <IconUser size={24} className="text-primary" />
              </div>
              Account Information
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Your personal account details
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {/* Name */}
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/10 hover:border-primary/20 transition-colors">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-lg font-semibold text-foreground mt-1">
                  {user.name}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/10 hover:border-primary/20 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <IconMail size={16} className="text-primary" />
                  Email Address
                </p>
                <p className="text-lg font-semibold text-foreground mt-1">
                  {user.email}
                </p>
              </div>
              <div className="ml-4">
                {user.emailVerified ? (
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-full flex items-center gap-1 whitespace-nowrap">
                    <IconMailCheck size={16} />
                    Verified
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full whitespace-nowrap">
                    Unverified
                  </span>
                )}
              </div>
            </div>

            {/* Account Created Date */}
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/10 hover:border-primary/20 transition-colors">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Member Since
                </p>
                <p className="text-lg font-semibold text-foreground mt-1">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="border-b border-border bg-card pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <IconShield size={24} className="text-primary" />
              </div>
              Security Settings
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Protect and manage your account security
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {/* Change Password Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 px-4 border-border hover:bg-primary/5 hover:border-primary/20 transition-all"
                  disabled={isChangingPassword}
                >
                  <div className="p-1.5 rounded bg-primary/10 mr-3">
                    <IconLock className="text-primary" size={18} />
                  </div>
                  <span className="text-base font-medium">Change Password</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Change Password</DialogTitle>
                  <DialogDescription className="text-base">
                    Enter your current password and set a new one to keep your
                    account secure
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleChangePassword)}>
                  <FieldGroup className="gap-y-4">
                    <Controller
                      name="currentPassword"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className="text-base font-medium">
                            Current Password
                          </FieldLabel>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter current password"
                            aria-invalid={fieldState.invalid}
                            className="h-10"
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
                          <FieldLabel className="text-base font-medium">
                            New Password
                          </FieldLabel>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter new password"
                            aria-invalid={fieldState.invalid}
                            className="h-10"
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
                          <FieldLabel className="text-base font-medium">
                            Confirm Password
                          </FieldLabel>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Confirm new password"
                            aria-invalid={fieldState.invalid}
                            className="h-10"
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
                      className="w-full h-10 mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                      {isChangingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </FieldGroup>
                </form>
              </DialogContent>
            </Dialog>

            {/* Verify Email Button */}
            {!user.emailVerified && (
              <Button
                variant="outline"
                className="w-full justify-start h-12 px-4 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300 transition-all"
                onClick={handleVerifyEmail}
                disabled={isSendingVerification}
              >
                <div className="p-1.5 rounded bg-yellow-100 mr-3">
                  <IconMailCheck className="text-yellow-600" size={18} />
                </div>
                <span className="text-base font-medium text-yellow-900">
                  {isSendingVerification ? "Sending..." : "Verify Email"}
                </span>
              </Button>
            )}

            {/* Logout Button */}
            <Button
              className="w-full h-12 px-4 bg-destructive hover:bg-destructive/90 text-primary-foreground font-semibold transition-all justify-start"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <div className="p-1.5 rounded bg-red-600/20 mr-3">
                <IconLogout className="text-current" size={18} />
              </div>
              <span className="text-base font-medium">Logout</span>
            </Button>

            {/* Logout Confirmation Dialog */}
            <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to logout? You'll need to sign in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex gap-3 justify-end">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Logout
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
