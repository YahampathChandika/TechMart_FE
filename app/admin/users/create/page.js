// app/(admin)/users/create/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserManagementLayout } from "@/components/admin/AdminLayout";
import { UserForm } from "@/components/admin/UserForm";
import { useAuth } from "@/hooks";
import { authAPI } from "@/lib/api";
import { SUCCESS_MESSAGES } from "@/lib/constants";

function CreateUserPageContent() {
  const { user: currentUser, isAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Permission check
  const hasPermission = isAdmin();

  const handleSubmit = async (formData) => {
    if (!hasPermission) {
      throw new Error("You don't have permission to add users.");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.createUser(formData);

      if (response.success) {
        console.log("User created successfully:", response.data);
        // Redirect will be handled by UserForm component
      } else {
        // Handle validation errors or other API errors
        if (response.errors) {
          // Laravel validation errors
          const errorMessages = Object.values(response.errors)
            .flat()
            .join(", ");
          throw new Error(errorMessages);
        } else {
          throw new Error(response.error || "Failed to create user");
        }
      }
    } catch (err) {
      console.error("Failed to create user:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/users");
  };

  if (!hasPermission) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don&apos;t have permission to add users. Only administrators can
            create new user accounts.
          </p>
          <button
            onClick={() => router.push("/admin/users")}
            className="text-primary hover:underline"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <UserForm
      user={null}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={loading}
      error={error}
    />
  );
}

export default function CreateUserPage() {
  return (
    <UserManagementLayout pageTitle="">
      <CreateUserPageContent />
    </UserManagementLayout>
  );
}
