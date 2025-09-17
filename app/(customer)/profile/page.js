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
import { useAuth } from "@/hooks";
import { useCart } from "@/contexts/CartContext";
import { validation } from "@/lib/auth";
import { cn } from "@/lib/utils";

function CustomerProfileContent() {
  const { customer, updateCustomerProfile } = useAuth();
  const { cartTotals } = useCart();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

  if (!customer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <InlineLoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

            {error && <ErrorMessage message={error} className="mb-4" />}

            {success && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-md">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      className={cn(
                        "w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                        errors.first_name
                          ? "border-red-300 focus:ring-red-500"
                          : "border-input"
                      )}
                      placeholder="Enter first name"
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
                    />
                  </div>
                  <FormFieldError error={errors.first_name} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      className={cn(
                        "w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                        errors.last_name
                          ? "border-red-300 focus:ring-red-500"
                          : "border-input"
                      )}
                      placeholder="Enter last name"
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
                    />
                  </div>
                  <FormFieldError error={errors.last_name} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    className={cn(
                      "w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                      errors.email
                        ? "border-red-300 focus:ring-red-500"
                        : "border-input"
                    )}
                    placeholder="Enter email address"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: validation.email,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                </div>
                <FormFieldError error={errors.email} />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    className={cn(
                      "w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                      errors.contact
                        ? "border-red-300 focus:ring-red-500"
                        : "border-input"
                    )}
                    placeholder="Enter phone number"
                    {...register("contact", {
                      required: "Phone number is required",
                      pattern: {
                        value: validation.phone,
                        message: "Please enter a valid phone number",
                      },
                    })}
                  />
                </div>
                <FormFieldError error={errors.contact} />
              </div>

              {/* Password Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Leave blank to keep current password
                </p>

                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={cn(
                          "w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                          errors.current_password
                            ? "border-red-300 focus:ring-red-500"
                            : "border-input"
                        )}
                        placeholder="Enter current password"
                        {...register("current_password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FormFieldError error={errors.current_password} />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={cn(
                          "w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                          errors.new_password
                            ? "border-red-300 focus:ring-red-500"
                            : "border-input"
                        )}
                        placeholder="Enter new password"
                        {...register("new_password", {
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                    </div>
                    <FormFieldError error={errors.new_password} />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className={cn(
                          "w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                          errors.confirm_password
                            ? "border-red-300 focus:ring-red-500"
                            : "border-input"
                        )}
                        placeholder="Confirm new password"
                        {...register("confirm_password", {
                          validate: (value) =>
                            !newPassword ||
                            value === newPassword ||
                            "Passwords do not match",
                        })}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FormFieldError error={errors.confirm_password} />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={loading || !isDirty}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <InlineLoadingSpinner />
                      Saving...
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Overview */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {customer.first_name} {customer.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{customer.email}</p>
                  <p className="text-sm text-muted-foreground">Email</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shopping Summary */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Shopping Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Items in Cart</span>
                <span className="font-medium">{cartTotals.itemCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Cart Total</span>
                <span className="font-medium">${cartTotals.total}</span>
              </div>

              <div className="pt-2 border-t">
                <Button className="w-full" asChild>
                  <a href="/cart">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    View Cart
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Order History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Download Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
              >
                Delete Account
              </Button>
            </div>
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
