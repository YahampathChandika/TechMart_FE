// components/auth/RegisterForm.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ErrorMessage,
  FormFieldError,
  InlineLoadingSpinner,
} from "@/components/common";
import { validation } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { mockCustomers } from "@/lib/mockData";

export const RegisterForm = ({ className = "", onSuccess = null }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError: setFieldError,
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

    try {
      // Check if email already exists in mock data
      const existingCustomer = mockCustomers.find(
        (customer) => customer.email.toLowerCase() === data.email.toLowerCase()
      );

      if (existingCustomer) {
        setError("An account with this email already exists.");
        setLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, this would be an API call
      const newCustomer = {
        id: mockCustomers.length + 1,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        contact: data.contact,
        password: data.password, // In real app, this would be hashed
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to mock data (in real app, this would be handled by the API)
      mockCustomers.push(newCustomer);

      setSuccess(true);

      if (onSuccess) {
        onSuccess(newCustomer);
      } else {
        // Redirect to login after short delay
        setTimeout(() => {
          router.push(
            "/login?message=Registration successful! Please sign in."
          );
        }, 2000);
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
        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
            Registration Successful!
          </h2>
          <p className="text-sm text-green-700 dark:text-green-300 mb-4">
            Your account has been created successfully. Redirecting to login
            page...
          </p>
          <div className="flex justify-center">
            <InlineLoadingSpinner className="text-green-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground mt-2">
          Join TechMart to start shopping for amazing electronics
        </p>
      </div>

      {error && (
        <ErrorMessage
          title="Registration Failed"
          message={error}
          className="mb-6"
          onDismiss={() => setError("")}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="first_name" className="text-sm font-medium">
              First Name
            </label>
            <input
              {...register("first_name", {
                required: "First name is required",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "First name cannot exceed 50 characters",
                },
              })}
              type="text"
              id="first_name"
              placeholder="John"
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50",
                errors.first_name &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              disabled={loading}
            />
            <FormFieldError message={errors.first_name?.message} />
          </div>

          <div className="space-y-2">
            <label htmlFor="last_name" className="text-sm font-medium">
              Last Name
            </label>
            <input
              {...register("last_name", {
                required: "Last name is required",
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Last name cannot exceed 50 characters",
                },
              })}
              type="text"
              id="last_name"
              placeholder="Doe"
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50",
                errors.last_name &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              disabled={loading}
            />
            <FormFieldError message={errors.last_name?.message} />
          </div>
        </div>

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
            placeholder="john.doe@example.com"
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              errors.email &&
                "border-destructive focus-visible:ring-destructive"
            )}
            disabled={loading}
          />
          <FormFieldError message={errors.email?.message} />
        </div>

        {/* Contact Field */}
        <div className="space-y-2">
          <label htmlFor="contact" className="text-sm font-medium">
            Phone Number
          </label>
          <input
            {...register("contact", {
              required: "Phone number is required",
              validate: (value) =>
                validation.isValidPhone(value) ||
                "Please enter a valid phone number",
            })}
            type="tel"
            id="contact"
            placeholder="+1-555-123-4567"
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              errors.contact &&
                "border-destructive focus-visible:ring-destructive"
            )}
            disabled={loading}
          />
          <FormFieldError message={errors.contact?.message} />
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
              placeholder="Create a secure password"
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
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

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label htmlFor="confirm_password" className="text-sm font-medium">
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
              placeholder="Confirm your password"
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50 pr-10",
                errors.confirm_password &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <FormFieldError message={errors.confirm_password?.message} />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <InlineLoadingSpinner className="mr-2" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Create Account
            </>
          )}
        </Button>
      </form>

      {/* Additional Links */}
      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-primary hover:underline font-medium"
            disabled={loading}
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};
