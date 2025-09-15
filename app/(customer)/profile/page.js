// app/(customer)/profile/page.js
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerGuard } from "@/components/auth/AuthGuard";
import {
  ErrorMessage,
  FormFieldError,
  InlineLoadingSpinner,
} from "@/components/common";
import { useAuth, useCart } from "@/hooks";
import { validation } from "@/lib/auth";
import { cn } from "@/lib/utils";

function CustomerProfileContent() {
  const { customer, updateCustomerProfile } = useAuth();
  const { getCartStats } = useCart();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const cartStats = getCartStats();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      first_name: customer?.first_name || "",
      last_name: customer?.last_name || "",
      email: customer?.email || "",
      contact: customer?.contact || "",
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const newPassword = watch("new_password");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, this would validate current password and update on server
      const updatedData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        contact: data.contact,
      };

      // If new password is provided, include it (in real app, hash it first)
      if (data.new_password) {
        updatedData.password = data.new_password;
      }

      updateCustomerProfile(updatedData);

      setSuccess("Profile updated successfully!");

      // Reset password fields
      reset({
        ...data,
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="h-8 w-8" />
            My Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        {/* Account Overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-medium">Cart Items</h3>
            <p className="text-2xl font-bold text-primary">
              {cartStats.itemCount}
            </p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-medium">Member Since</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(customer?.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <User className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-medium">Account Status</h3>
            <p className="text-sm text-green-600 font-medium">Active</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-background border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Account Information</h2>

          {error && (
            <ErrorMessage
              title="Update Failed"
              message={error}
              className="mb-6"
              onDismiss={() => setError("")}
            />
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-300">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Personal Information</h3>

              <div className="grid md:grid-cols-2 gap-4">
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
                    })}
                    type="text"
                    id="first_name"
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
                    })}
                    type="text"
                    id="last_name"
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

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    validate: (value) =>
                      validation.isValidEmail(value) ||
                      "Please enter a valid email",
                  })}
                  type="email"
                  id="email"
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
            </div>

            {/* Password Change */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-medium text-lg">Change Password</h3>
              <p className="text-sm text-muted-foreground">
                Leave password fields empty if you don't want to change your
                password.
              </p>

              <div className="space-y-2">
                <label
                  htmlFor="current_password"
                  className="text-sm font-medium"
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    {...register("current_password", {
                      validate: (value) => {
                        if (newPassword && !value) {
                          return "Current password is required to set new password";
                        }
                        return true;
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    id="current_password"
                    placeholder="Enter current password"
                    className={cn(
                      "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                      "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                      "disabled:cursor-not-allowed disabled:opacity-50 pr-10",
                      errors.current_password &&
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
                <FormFieldError message={errors.current_password?.message} />
              </div>

              <div className="space-y-2">
                <label htmlFor="new_password" className="text-sm font-medium">
                  New Password
                </label>
                <input
                  {...register("new_password", {
                    validate: (value) => {
                      if (value && value.length < 6) {
                        return "New password must be at least 6 characters";
                      }
                      return true;
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  id="new_password"
                  placeholder="Enter new password (optional)"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    errors.new_password &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                  disabled={loading}
                />
                <FormFieldError message={errors.new_password?.message} />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm_password"
                  className="text-sm font-medium"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    {...register("confirm_password", {
                      validate: (value) => {
                        if (newPassword && value !== newPassword) {
                          return "Passwords do not match";
                        }
                        return true;
                      },
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    placeholder="Confirm new password"
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
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading || !isDirty}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <InlineLoadingSpinner />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Account Actions */}
        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-medium text-lg mb-4">Account Actions</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Download My Data
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerProfilePage() {
  return (
    <CustomerGuard>
      <CustomerProfileContent />
    </CustomerGuard>
  );
}
