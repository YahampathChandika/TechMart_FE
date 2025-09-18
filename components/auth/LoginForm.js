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
import {
  handleValidationErrors,
  getValidationErrorSummary,
} from "@/lib/formErrorUtils";
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

      console.log("Login result:", result); // Debug log

      if (result.success) {
        if (onSuccess) {
          onSuccess(result);
        } else {
          router.push(redirectTo);
        }
      } else {
        // ENHANCED: Use utility function to handle validation errors
        const errorsHandled = handleValidationErrors(
          result,
          setFieldError,
          setError
        );

        if (!errorsHandled) {
          // Fallback error handling
          setError(
            result.error || result.message || "Login failed. Please try again."
          );
        }
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
            ? "Sign in to access admin dashboard"
            : "Sign in to your account to continue"}
        </p>
      </div>

      {/* ENHANCED: Show appropriate error messages */}
      {error && Object.keys(errors).length === 0 && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* Show helpful message when there are field errors */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-700 dark:text-red-300">
            {getValidationErrorSummary(errors)}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Email Address
          </label>
          <input
            {...register("email", VALIDATION_RULES.email)}
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter your email"
            autoComplete="email"
          />
          <FormFieldError message={errors.email?.message} />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              {...register("password", VALIDATION_RULES.password)}
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-3 py-2 pr-10 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
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
          <FormFieldError message={errors.password?.message} />
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
              {type === "admin" ? (
                <UserCheck className="w-4 h-4 mr-2" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              Sign In
            </>
          )}
        </Button>
      </form>

      {/* Registration Link (only for customer) */}
      {type === "customer" && (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-medium"
              onClick={() => router.push("/register")}
            >
              Create one here
            </Button>
          </p>
        </div>
      )}

      {/* DEBUG: Development error info */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 text-xs text-muted-foreground">
          <details>
            <summary>Debug Info (Dev Only)</summary>
            <div className="mt-2 p-2 bg-muted rounded text-xs space-y-1">
              <div>
                <strong>Form Errors:</strong>
              </div>
              {Object.entries(errors).map(([field, error]) => (
                <div key={field}>
                  • {field}: {error?.message || "No message"}
                </div>
              ))}
              {Object.keys(errors).length === 0 && (
                <div className="text-muted-foreground">No form errors</div>
              )}
              {error && (
                <div className="mt-2">
                  <strong>General Error:</strong> {error}
                </div>
              )}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};
