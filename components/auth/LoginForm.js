// components/auth/LoginForm.js
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, LogIn, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import {
  ErrorMessage,
  FormFieldError,
  InlineLoadingSpinner,
} from "@/components/common";
import { VALIDATION_RULES } from "@/lib/constants";
import { handleValidationErrors } from "@/lib/formErrorUtils";
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
    searchParams?.get("redirect") ||
    (type === "admin" ? "/admin/dashboard" : "/");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFieldError,
    clearErrors,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    clearErrors();

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
        // Use utility function to handle validation errors
        handleValidationErrors(result, setFieldError, setError);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          {type === "admin" ? (
            <UserCheck className="w-8 h-8 text-primary" />
          ) : (
            <LogIn className="w-8 h-8 text-primary" />
          )}
        </div>
        <h1 className="text-2xl font-bold">
          {type === "admin" ? "Admin Login" : "Welcome Back"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {type === "admin"
            ? "Sign in to access the admin dashboard"
            : "Sign in to your TechMart account"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <ErrorMessage message={error} />}

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: VALIDATION_RULES.EMAIL,
                message: "Please enter a valid email address",
              },
            })}
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter your email"
            autoComplete="email"
          />
          <FormFieldError error={errors.email} />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
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
              className="w-full px-3 py-2 pr-10 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          <FormFieldError error={errors.password} />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading} size="lg">
          {loading ? (
            <>
              <InlineLoadingSpinner size="sm" />
              Signing In...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </>
          )}
        </Button>
      </form>

      {/* Additional Links */}
      {type === "customer" && (
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-medium"
              onClick={() => router.push("/register")}
            >
              Sign up here
            </Button>
          </p>

          <div className="border-t pt-3">
            <p className="text-xs text-muted-foreground">
              Are you an admin or staff member?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-xs font-medium"
                onClick={() => router.push("/admin-login")}
              >
                Admin Login
              </Button>
            </p>
          </div>
        </div>
      )}

      {type === "admin" && (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Customer login?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-medium"
              onClick={() => router.push("/login")}
            >
              Sign in here
            </Button>
          </p>
        </div>
      )}

      {/* Development Quick Login - Remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2 font-medium">
            Development Mode - Quick Test Accounts:
          </p>
          <div className="space-y-1 text-xs text-yellow-700 dark:text-yellow-300">
            {type === "admin" ? (
              <>
                <p>Admin: admin@example.com / password123</p>
                <p>User: user@example.com / password123</p>
              </>
            ) : (
              <p>Customer: customer@example.com / password123</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
