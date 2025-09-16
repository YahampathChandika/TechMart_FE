// app/(admin)/users/create/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserManagementLayout } from "@/components/admin/AdminLayout";
import { UserForm } from "@/components/admin/UserForm";
import { useAuth } from "@/hooks";
import { mockUsers, mockUserPrivileges } from "@/lib/mockData";
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
      // Check if email already exists
      const existingUser = mockUsers.find(
        (user) => user.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (existingUser) {
        throw new Error("A user with this email already exists.");
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real app, this would be an API call
      // For now, add to mock data
      const newUser = {
        id: Math.max(...mockUsers.map((u) => u.id)) + 1,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to mock data (in real app, this would be handled by API)
      mockUsers.push(newUser);

      // Create default privileges for regular users
      if (newUser.role === "user") {
        const newPrivileges = {
          id: Math.max(...mockUserPrivileges.map((p) => p.id)) + 1,
          user_id: newUser.id,
          can_add_products: false,
          can_update_products: false,
          can_delete_products: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockUserPrivileges.push(newPrivileges);
      }

      console.log(SUCCESS_MESSAGES.USER_CREATED, newUser);

      // Redirect will be handled by UserForm component
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
            You don't have permission to add users. Only administrators can
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
