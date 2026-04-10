"use client";
import { useState } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { userSignInSchema } from "@/schemas/userSchema";
import z from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { IconEye, IconLogin2, IconMailFilled } from "@tabler/icons-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof userSignInSchema>>({
    resolver: zodResolver(userSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof userSignInSchema>) {
    setIsLoading(true);
    const res = await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => router.push("/"),
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );
    console.log(res);
    setIsLoading(false);
  }

  return (
    <>
      <CardContent className="gap-y-4">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-y-3">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-lg">Email</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="user@example.com"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-lg">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        setShowPassword((prev) => !prev);
                      }}
                      onFocus={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 text-gray-500 hover:text-gray-700 active:text-gray-900 rounded z-20 cursor-pointer pointer-events-auto"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <IconEye size="20" />
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              <IconLogin2 />
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <FieldSeparator />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/sign-in/otp")}
            >
              <IconMailFilled className="mr-3" />
              Sign in with OTP
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/sign-in/google")}
            >
              <Image
                src="/google.png"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign in with Google
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="text-center flex items-center justify-center">
        <p className="text-sm mt-2">
          New to NexCart?{" "}
          <a href="/sign-up" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </CardFooter>
    </>
  );
};

export default SignIn;
