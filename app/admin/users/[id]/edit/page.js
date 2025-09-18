// app/(admin)/users/[id]/edit/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { use } from "react";
import { UserManagementLayout } from "@/components/admin/AdminLayout";
import { UserForm } from "@/components/admin/UserForm";
import { LoadingSpinner, ErrorMessage } from "@/components/common";
import { useAuth } from "@/hooks";
import { authAPI } from "@/lib/api";
import { SUCCESS_MESSAGES } from "@/lib/constants";

function EditUserPageContent({ userId }) {
  const { user: currentUser, isAdmin } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Permission check
  const hasPermission = isAdmin();

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await authAPI.getUser(userId);

        if (response.success) {
          const userData = response.data;

          if (!userData) {
            notFound();
            return;
          }

          // Prevent editing current user
          if (userData.id === currentUser?.id) {
            setError(
              "You cannot edit your own account through this interface."
            );
            return;
          }

          setUser(userData);
        } else {
          throw new Error(response.error || "Failed to load user");
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        setError("Failed to load user. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userId && hasPermission) {
      loadUser();
    }
  }, [userId, hasPermission, currentUser]);

  const handleSubmit = async (formData) => {
    if (!hasPermission) {
      throw new Error("You don't have permission to update users.");
    }

    if (user.id === currentUser?.id) {
      throw new Error("You cannot edit your own account.");
    }

    setSubmitting(true);

    try {
      const response = await authAPI.updateUser(user.id, formData);

      if (response.success) {
        const updatedUser = response.data;
        setUser(updatedUser);
        console.log("User updated successfully:", updatedUser);
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
          throw new Error(response.error || "Failed to update user");
        }
      }
    } catch (err) {
      console.error("Failed to update user:", err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/users");
  };

  if (!hasPermission) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <ErrorMessage
          title="Access Denied"
          message="You don't have permission to edit users. Only administrators can modify user accounts."
        />
        <div className="mt-4 text-center">
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading user..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <ErrorMessage
          title="Failed to Load User"
          message={error}
          onRetry={() => window.location.reload()}
        />
        <div className="mt-4 text-center">
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

  if (!user) {
    notFound();
    return null;
  }

  return (
    <UserForm
      user={user}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={submitting}
      error={null}
    />
  );
}

export default function EditUserPage({ params }) {
  const { id } = use(params);

  return (
    <UserManagementLayout pageTitle="">
      <EditUserPageContent userId={id} />
    </UserManagementLayout>
  );
}
