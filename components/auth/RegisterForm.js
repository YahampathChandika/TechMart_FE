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
import { handleValidationErrors } from "@/lib/formErrorUtils";
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
        // Use utility function to handle validation errors
        handleValidationErrors(result, setFieldError, setError);
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
            Your account has been created and you're now logged in.
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Create Your Account</h1>
        <p className="text-muted-foreground mt-2">
          Join TechMart and start shopping for the latest tech products
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <ErrorMessage message={error} />}

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium mb-2"
            >
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
                  message: "First name must not exceed 50 characters",
                },
              })}
              type="text"
              id="first_name"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="John"
            />
            <FormFieldError error={errors.first_name} />
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium mb-2"
            >
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
                  message: "Last name must not exceed 50 characters",
                },
              })}
              type="text"
              id="last_name"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Doe"
            />
            <FormFieldError error={errors.last_name} />
          </div>
        </div>

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
            placeholder="john@example.com"
          />
          <FormFieldError error={errors.email} />
        </div>

        {/* Contact Field */}
        <div>
          <label htmlFor="contact" className="block text-sm font-medium mb-2">
            Contact Number
          </label>
          <input
            {...register("contact", {
              required: "Contact number is required",
              minLength: {
                value: 10,
                message: "Contact number must be at least 10 digits",
              },
              maxLength: {
                value: 15,
                message: "Contact number must not exceed 15 digits",
              },
            })}
            type="tel"
            id="contact"
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="+1234567890"
          />
          <FormFieldError error={errors.contact} />
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
              placeholder="••••••••"
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

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirm_password"
            className="block text-sm font-medium mb-2"
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
          <FormFieldError error={errors.confirm_password} />
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
