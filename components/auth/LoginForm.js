// components/auth/LoginForm.js
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import {
  ErrorMessage,
  FormFieldError,
  InlineLoadingSpinner,
} from "@/components/common";
import { validation } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const LoginForm = ({
  type = "customer", // "customer" or "admin"
  className = "",
  onSuccess = null,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser, loginCustomer } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo =
    searchParams?.get("redirect") || (type === "admin" ? "/dashboard" : "/");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFieldError,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      let result;

      if (type === "admin") {
        result = await loginUser(data.email, data.password);
      } else {
        result = await loginCustomer(data.email, data.password);
      }

      if (result.success) {
        if (onSuccess) {
          onSuccess(result);
        } else {
          router.push(redirectTo);
        }
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Quick login for development (you can remove this in production)
  const quickLogin = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      let result;
      if (type === "admin") {
        result = await loginUser(email, password);
      } else {
        result = await loginCustomer(email, password);
      }

      if (result.success) {
        router.push(redirectTo);
      }
    } catch (err) {
      setError("Quick login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">
          {type === "admin" ? "Admin Login" : "Welcome Back"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {type === "admin"
            ? "Sign in to access the admin dashboard"
            : "Sign in to your account to continue shopping"}
        </p>
      </div>

      {error && (
        <ErrorMessage
          title="Login Failed"
          message={error}
          className="mb-6"
          onDismiss={() => setError("")}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <input
            {...register("email", {
              required: "Email is required",
              validate: (value) =>
                validation.isValidEmail(value) || "Please enter a valid email",
            })}
            type="email"
            id="email"
            placeholder="Enter your email"
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              errors.email &&
                "border-destructive focus-visible:ring-destructive"
            )}
            disabled={loading}
          />
          <FormFieldError message={errors.email?.message} />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50 pr-10",
                errors.password &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <FormFieldError message={errors.password?.message} />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <InlineLoadingSpinner className="mr-2" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </>
          )}
        </Button>
      </form>

      {/* Development Quick Login Buttons */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-3 text-center">
            Quick Login (Development)
          </p>
          <div className="space-y-2">
            {type === "admin" ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin("admin@techmart.com", "admin123")}
                  disabled={loading}
                  className="w-full"
                >
                  Login as Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin("sarah@techmart.com", "user123")}
                  disabled={loading}
                  className="w-full"
                >
                  Login as User
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin("alice@example.com", "customer123")}
                disabled={loading}
                className="w-full"
              >
                Login as Customer
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Additional Links */}
      <div className="mt-6 text-center text-sm">
        {type === "customer" ? (
          <>
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/register")}
                className="text-primary hover:underline font-medium"
                disabled={loading}
              >
                Sign up here
              </button>
            </p>
            <p className="mt-2 text-muted-foreground">
              Are you an admin?{" "}
              <button
                onClick={() => router.push("/admin-login")}
                className="text-primary hover:underline font-medium"
                disabled={loading}
              >
                Admin Login
              </button>
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">
            Customer login?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-primary hover:underline font-medium"
              disabled={loading}
            >
              Customer Login
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
