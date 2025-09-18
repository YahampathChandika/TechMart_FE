// components/auth/RegisterForm.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, UserPlus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ErrorMessage,
  FormFieldError,
  InlineLoadingSpinner,
} from "@/components/common";
import { useAuth } from "@/hooks";
import { VALIDATION_RULES } from "@/lib/constants";
import {
  handleValidationErrors,
  getValidationErrorSummary,
} from "@/lib/formErrorUtils";
import { cn } from "@/lib/utils";

export const RegisterForm = ({ className = "", onSuccess = null }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { registerCustomer } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError: setFieldError,
    clearErrors,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      contact: "",
      password: "",
      confirm_password: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    clearErrors();

    try {
      const result = await registerCustomer({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        contact: data.contact,
        password: data.password,
      });

      console.log("Registration result:", result); // Debug log

      if (result.success) {
        setSuccess(true);

        if (onSuccess) {
          onSuccess(result.data);
        } else {
          // Auto-redirect after successful registration
          setTimeout(() => {
            router.push("/");
          }, 2000);
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
            result.error ||
              result.message ||
              "Registration failed. Please try again."
          );
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={cn("w-full max-w-md mx-auto text-center", className)}>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
            Registration Successful!
          </h2>
          <p className="text-green-700 dark:text-green-300 mb-4">
            Your account has been created and you&apos;re now logged in.
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Redirecting to homepage...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground mt-2">
          Join us today and start shopping
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
        {/* Name Fields Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-foreground mb-2"
            >
              First Name
            </label>
            <input
              {...register("first_name", VALIDATION_RULES.required)}
              type="text"
              id="first_name"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="John"
              autoComplete="given-name"
            />
            <FormFieldError message={errors.first_name?.message} />
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Last Name
            </label>
            <input
              {...register("last_name", VALIDATION_RULES.required)}
              type="text"
              id="last_name"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Doe"
              autoComplete="family-name"
            />
            <FormFieldError message={errors.last_name?.message} />
          </div>
        </div>

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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.email
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-input"
            }`}
            placeholder="john@example.com"
            autoComplete="email"
          />
          <FormFieldError message={errors.email?.message} />
        </div>

        {/* Contact Field */}
        <div>
          <label
            htmlFor="contact"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Contact Number
          </label>
          <input
            {...register("contact", VALIDATION_RULES.phone)}
            type="tel"
            id="contact"
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="+1234567890"
            autoComplete="tel"
          />
          <FormFieldError message={errors.contact?.message} />
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
              autoComplete="new-password"
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

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirm_password"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              {...register("confirm_password", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              type={showConfirmPassword ? "text" : "password"}
              id="confirm_password"
              className="w-full px-3 py-2 pr-10 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          <FormFieldError message={errors.confirm_password?.message} />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading} size="lg">
          {loading ? (
            <>
              <InlineLoadingSpinner size="sm" />
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Create Account
            </>
          )}
        </Button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-medium"
            onClick={() => router.push("/login")}
          >
            Sign in here
          </Button>
        </p>
      </div>
    </div>
  );
};
