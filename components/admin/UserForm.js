// components/admin/UserForm.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Save, ArrowLeft, User, Crown, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ErrorMessage,
  FormFieldError,
  InlineLoadingSpinner,
} from "@/components/common";
import { useAuth } from "@/hooks";
import { validation } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { ERROR_MESSAGES, SUCCESS_MESSAGES, USER_ROLES } from "@/lib/constants";

export const UserForm = ({
  user = null, // null for create, user object for edit
  onSubmit,
  onCancel = null,
  loading = false,
  error = null,
  className = "",
}) => {
  const { user: currentUser, isAdmin } = useAuth();
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isEdit = !!user;
  const pageTitle = isEdit ? "Edit User" : "Create New User";

  // Only admins can manage users
  const hasPermission = isAdmin();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      contact: user?.contact || "",
      role: user?.role || "user",
      password: "",
      confirm_password: "",
      is_active: user?.is_active ?? true,
    },
  });

  const watchedFields = watch();
  const password = watch("password");

  const handleFormSubmit = async (data) => {
    if (!hasPermission) {
      setSubmitError("You don't have permission to perform this action.");
      return;
    }

    setSubmitError("");
    setSubmitSuccess("");

    try {
      // Format data for submission
      const formattedData = {
        ...data,
      };

      // Only include password if it's provided (for edit mode)
      if (!data.password && isEdit) {
        delete formattedData.password;
        delete formattedData.confirm_password;
      }

      // Remove confirm_password before sending to API
      delete formattedData.confirm_password;

      if (onSubmit) {
        await onSubmit(formattedData);
        setSubmitSuccess(
          isEdit ? "User updated successfully!" : "User created successfully!"
        );

        // Redirect after success
        setTimeout(() => {
          router.push("/admin/users");
        }, 1500);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setSubmitError(err.message || "Failed to save user. Please try again.");
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  // Validation helpers
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  };

  if (!hasPermission) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <ErrorMessage
          title="Access Denied"
          message="You don't have permission to manage users."
          variant="destructive"
        />
      </div>
    );
  }

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
            <p className="text-muted-foreground">
              {isEdit
                ? "Update user information and settings"
                : "Add a new user to your admin team"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {(error || submitError) && (
        <ErrorMessage
          title="Error"
          message={error || submitError}
          className="mb-6"
          onDismiss={() => {
            setSubmitError("");
          }}
        />
      )}

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-300">{submitSuccess}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-background border rounded-lg p-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>

            <div className="grid md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <label htmlFor="first_name" className="text-sm font-medium">
                  First Name *
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
                      message: "First name must be less than 50 characters",
                    },
                  })}
                  type="text"
                  id="first_name"
                  placeholder="Enter first name"
                  disabled={loading || isSubmitting}
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    errors.first_name && "border-destructive"
                  )}
                />
                <FormFieldError message={errors.first_name?.message} />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label htmlFor="last_name" className="text-sm font-medium">
                  Last Name *
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
                      message: "Last name must be less than 50 characters",
                    },
                  })}
                  type="text"
                  id="last_name"
                  placeholder="Enter last name"
                  disabled={loading || isSubmitting}
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    errors.last_name && "border-destructive"
                  )}
                />
                <FormFieldError message={errors.last_name?.message} />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  validate: (value) =>
                    isValidEmail(value) || "Please enter a valid email address",
                })}
                type="email"
                id="email"
                placeholder="user@example.com"
                disabled={loading || isSubmitting}
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  errors.email && "border-destructive"
                )}
              />
              <FormFieldError message={errors.email?.message} />
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <label htmlFor="contact" className="text-sm font-medium">
                Phone Number *
              </label>
              <input
                {...register("contact", {
                  required: "Phone number is required",
                  validate: (value) =>
                    isValidPhone(value) || "Please enter a valid phone number",
                })}
                type="tel"
                id="contact"
                placeholder="+1-555-123-4567"
                disabled={loading || isSubmitting}
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  errors.contact && "border-destructive"
                )}
              />
              <FormFieldError message={errors.contact?.message} />
            </div>
          </div>

          {/* Account Settings */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Account Settings</h3>

            {/* Role */}
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role *
              </label>
              <select
                {...register("role", {
                  required: "Role is required",
                })}
                id="role"
                disabled={loading || isSubmitting}
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  errors.role && "border-destructive"
                )}
              >
                <option value="user">User</option>
                <option value="admin">Administrator</option>
              </select>
              <FormFieldError message={errors.role?.message} />
              <p className="text-xs text-muted-foreground">
                {watchedFields.role === "admin"
                  ? "Administrators have full access to all features"
                  : "Users have limited access based on assigned privileges"}
              </p>
            </div>

            {/* Role Icon Display */}
            <div className="flex items-center space-x-2 text-sm">
              {watchedFields.role === "admin" ? (
                <>
                  <Crown className="h-4 w-4 text-purple-600" />
                  <span className="text-purple-600 font-medium">
                    Administrator Account
                  </span>
                </>
              ) : (
                <>
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-600 font-medium">
                    User Account
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">
              {isEdit ? "Change Password" : "Set Password"}
            </h3>
            {isEdit && (
              <p className="text-sm text-muted-foreground">
                Leave password fields empty to keep the current password.
              </p>
            )}

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {isEdit ? "New Password" : "Password *"}
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: isEdit ? false : "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder={
                    isEdit ? "Enter new password (optional)" : "Enter password"
                  }
                  disabled={loading || isSubmitting}
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50 pr-10",
                    errors.password && "border-destructive"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={loading || isSubmitting}
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirm_password" className="text-sm font-medium">
                {isEdit ? "Confirm New Password" : "Confirm Password *"}
              </label>
              <div className="relative">
                <input
                  {...register("confirm_password", {
                    required:
                      isEdit && !password
                        ? false
                        : "Please confirm your password",
                    validate: (value) => {
                      if (password && value !== password) {
                        return "Passwords do not match";
                      }
                      return true;
                    },
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm_password"
                  placeholder="Confirm password"
                  disabled={loading || isSubmitting}
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50 pr-10",
                    errors.confirm_password && "border-destructive"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={loading || isSubmitting}
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
          </div>

          {/* Status */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Status</h3>

            <div className="flex items-center space-x-2">
              <input
                {...register("is_active")}
                type="checkbox"
                id="is_active"
                disabled={loading || isSubmitting}
                className="h-4 w-4 rounded border-input"
              />
              <label htmlFor="is_active" className="text-sm font-medium">
                Active Account
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Inactive accounts cannot log in to the system
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              type="submit"
              disabled={loading || isSubmitting || (!isDirty && isEdit)}
              className="flex items-center gap-2"
            >
              {loading || isSubmitting ? (
                <>
                  <InlineLoadingSpinner />
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEdit ? "Update User" : "Create User"}
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading || isSubmitting}
            >
              Cancel
            </Button>

            {isEdit && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset()}
                disabled={loading || isSubmitting || !isDirty}
                className="sm:ml-auto"
              >
                Reset Changes
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
