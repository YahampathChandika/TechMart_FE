// app/(admin)/users/[id]/privileges/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { use } from "react";
import { UserManagementLayout } from "@/components/admin/AdminLayout";
import { PrivilegeManager } from "@/components/admin/PrivilegeManager";
import { LoadingSpinner, ErrorMessage } from "@/components/common";
import { useAuth } from "@/hooks";
import { authAPI } from "@/lib/api";
import { SUCCESS_MESSAGES } from "@/lib/constants";

function UserPrivilegesPageContent({ userId }) {
  const { user: currentUser, isAdmin } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userPrivileges, setUserPrivileges] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Permission check
  const hasPermission = isAdmin();

  // Load user and privileges data
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load user data
        const userResponse = await authAPI.getUser(userId);

        if (!userResponse.success) {
          throw new Error(userResponse.error || "Failed to load user");
        }

        const userData = userResponse.data;

        if (!userData) {
          notFound();
          return;
        }

        // Check if it's an admin user
        if (userData.role === "admin") {
          setError(
            "Administrator accounts have full access by default and cannot be modified."
          );
          setUser(userData);
          return;
        }

        setUser(userData);

        // TODO: Load user privileges when API endpoint is available
        // For now, set empty privileges - this should be replaced when backend implements privileges API
        // const privilegesResponse = await authAPI.getUserPrivileges(userId);
        // setUserPrivileges(privilegesResponse.data);
        setUserPrivileges({
          can_add_products: false,
          can_update_products: false,
          can_delete_products: false,
        });
      } catch (err) {
        console.error("Failed to load user data:", err);
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userId && hasPermission) {
      loadUserData();
    }
  }, [userId, hasPermission]);

  const handleSubmit = async (formData) => {
    if (!hasPermission) {
      throw new Error("You don't have permission to update user privileges.");
    }

    if (!user || user.role === "admin") {
      throw new Error("Cannot modify privileges for admin users.");
    }

    setSubmitting(true);

    try {
      // TODO: Replace with real API call when privileges endpoint is implemented
      // const response = await authAPI.updateUserPrivileges(user.id, formData);

      // Temporary placeholder - simulate API success
      const updatedPrivileges = {
        ...userPrivileges,
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      setUserPrivileges(updatedPrivileges);
      console.log("User privileges updated successfully:", updatedPrivileges);

      // Redirect will be handled by PrivilegeManager component
    } catch (err) {
      console.error("Failed to update privileges:", err);
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
          message="You don't have permission to manage user privileges. Only administrators can modify user permissions."
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
        <LoadingSpinner size="lg" text="Loading user privileges..." />
      </div>
    );
  }

  if (error && !user) {
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
    <PrivilegeManager
      user={user}
      userPrivileges={userPrivileges}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={submitting}
      error={error}
    />
  );
}

export default function UserPrivilegesPage({ params }) {
  const { id } = use(params);

  return (
    <UserManagementLayout pageTitle="">
      <UserPrivilegesPageContent userId={id} />
    </UserManagementLayout>
  );
}
