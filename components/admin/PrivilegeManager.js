// components/admin/PrivilegeManager.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Save,
  ArrowLeft,
  Shield,
  User,
  Package,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ErrorMessage,
  FormFieldError,
  InlineLoadingSpinner,
} from "@/components/common";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";
import { SUCCESS_MESSAGES, USER_PRIVILEGES } from "@/lib/constants";

export const PrivilegeManager = ({
  user = null,
  userPrivileges = null,
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

  // Only admins can manage privileges
  const hasPermission = isAdmin();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      can_add_products: userPrivileges?.can_add_products || false,
      can_update_products: userPrivileges?.can_update_products || false,
      can_delete_products: userPrivileges?.can_delete_products || false,
    },
  });

  const watchedFields = watch();

  const handleFormSubmit = async (data) => {
    if (!hasPermission) {
      setSubmitError("You don't have permission to perform this action.");
      return;
    }

    if (!user || user.role === "admin") {
      setSubmitError("Cannot modify privileges for admin users.");
      return;
    }

    setSubmitError("");
    setSubmitSuccess("");

    try {
      if (onSubmit) {
        await onSubmit(data);
        setSubmitSuccess(SUCCESS_MESSAGES.PRIVILEGES_UPDATED);

        // Redirect after success
        setTimeout(() => {
          router.push("/admin/users");
        }, 1500);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setSubmitError(
        err.message || "Failed to update privileges. Please try again."
      );
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const privilegeDescriptions = {
    can_add_products: {
      title: "Add Products",
      description: "Create new products in the inventory",
      icon: Plus,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    can_update_products: {
      title: "Edit Products",
      description: "Modify existing product information",
      icon: Edit,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    can_delete_products: {
      title: "Delete Products",
      description: "Remove products from the inventory",
      icon: Trash2,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
  };

  const getActivePrivilegesCount = () => {
    return Object.values(watchedFields).filter(Boolean).length;
  };

  if (!hasPermission) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <ErrorMessage
          title="Access Denied"
          message="You don't have permission to manage user privileges."
          variant="destructive"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <ErrorMessage
          title="User Not Found"
          message="The user you're trying to manage doesn't exist."
          variant="destructive"
        />
      </div>
    );
  }

  if (user.role === "admin") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <ErrorMessage
          title="Cannot Modify Admin Privileges"
          message="Administrator accounts have full access by default and cannot be modified."
          variant="warning"
        />
        <div className="mt-4 text-center">
          <Button onClick={handleCancel} variant="outline">
            Back to Users
          </Button>
        </div>
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
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Manage User Privileges</h1>
            <p className="text-muted-foreground">
              Configure permissions for {user.first_name} {user.last_name}
            </p>
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 rounded text-xs font-medium">
                User Account
              </span>
              <span
                className={cn(
                  "text-xs",
                  user.is_active ? "text-green-600" : "text-red-600"
                )}
              >
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </div>
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

      {/* Privileges Form */}
      <div className="bg-background border rounded-lg p-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Privileges Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Product Management Privileges
              </h3>
              <div className="text-sm text-muted-foreground">
                {getActivePrivilegesCount()} of 3 privileges enabled
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Select the product management permissions for this user. Users
              with no privileges will have read-only access to the product
              catalog.
            </p>
          </div>

          {/* Privilege Options */}
          <div className="space-y-4">
            {Object.entries(privilegeDescriptions).map(([key, privilege]) => {
              const isEnabled = watchedFields[key];
              const IconComponent = privilege.icon;

              return (
                <div
                  key={key}
                  className={cn(
                    "border rounded-lg p-4 transition-all",
                    isEnabled
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                >
                  <label
                    htmlFor={key}
                    className="flex items-start space-x-4 cursor-pointer"
                  >
                    <input
                      {...register(key)}
                      type="checkbox"
                      id={key}
                      disabled={loading || isSubmitting}
                      className="mt-1 h-4 w-4 rounded border-input"
                    />

                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        isEnabled ? privilege.bgColor : "bg-muted"
                      )}
                    >
                      <IconComponent
                        className={cn(
                          "h-5 w-5",
                          isEnabled ? privilege.color : "text-muted-foreground"
                        )}
                      />
                    </div>

                    <div className="flex-1">
                      <h4
                        className={cn(
                          "font-medium",
                          isEnabled
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {privilege.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {privilege.description}
                      </p>

                      {isEnabled && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                            Enabled
                          </span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              );
            })}
          </div>

          {/* Privilege Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Access Summary</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              {getActivePrivilegesCount() === 0 ? (
                <p>• Read-only access to product catalog</p>
              ) : (
                <>
                  <p>• View and search products</p>
                  {watchedFields.can_add_products && (
                    <p>• Create new products</p>
                  )}
                  {watchedFields.can_update_products && (
                    <p>• Edit existing products</p>
                  )}
                  {watchedFields.can_delete_products && (
                    <p>• Delete products</p>
                  )}
                </>
              )}
              <p>• View customer information</p>
              <p>• Access to admin dashboard</p>
            </div>
          </div>

          {/* Warning for no privileges */}
          {getActivePrivilegesCount() === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Limited Access
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    This user will have read-only access to products. They can
                    view and search the catalog but cannot make any changes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              type="submit"
              disabled={loading || isSubmitting || !isDirty}
              className="flex items-center gap-2"
            >
              {loading || isSubmitting ? (
                <>
                  <InlineLoadingSpinner />
                  Updating Privileges...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Privileges
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

            <Button
              type="button"
              variant="ghost"
              onClick={() => reset()}
              disabled={loading || isSubmitting || !isDirty}
              className="sm:ml-auto"
            >
              Reset Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
