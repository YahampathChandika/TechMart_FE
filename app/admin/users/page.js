// app/(admin)/users/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Users, Crown, User, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserManagementLayout } from "@/components/admin/AdminLayout";
import { UserTable } from "@/components/admin/UserTable";
import { LoadingSpinner, ErrorMessage } from "@/components/common";
import { useAuth } from "@/hooks";
import { mockUsers, mockUserPrivileges } from "@/lib/mockData";
import { SUCCESS_MESSAGES } from "@/lib/constants";

function UsersPageContent() {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [userPrivileges, setUserPrivileges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Only admins can access this page
  const hasPermission = isAdmin();

  // Load users and privileges
  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In real app, these would be API calls
      setUsers([...mockUsers]);
      setUserPrivileges([...mockUserPrivileges]);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDelete = async (userId) => {
    setActionLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, this would be an API call
      // For now, remove from local state
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setUserPrivileges((prev) => prev.filter((p) => p.user_id !== userId));

      console.log(SUCCESS_MESSAGES.USER_DELETED);
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError("Failed to delete user. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle user status toggle
  const handleToggleActive = async (userId, newStatus) => {
    setActionLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, this would be an API call
      // For now, update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                is_active: newStatus,
                updated_at: new Date().toISOString(),
              }
            : u
        )
      );

      console.log(
        `User ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      console.error("Failed to update user status:", err);
      setError("Failed to update user status. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    if (hasPermission) {
      loadUsers();
    }
  }, [hasPermission]);

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    regularUsers: users.filter((u) => u.role === "user").length,
    active: users.filter((u) => u.is_active).length,
    inactive: users.filter((u) => !u.is_active).length,
  };

  if (!hasPermission) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <ErrorMessage
          title="Access Denied"
          message="You don't have permission to manage users. Only administrators can access this section."
          variant="destructive"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage admin users and their permissions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Export/Import Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Total Users</span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </div>

        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Crown className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Admins</span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.admins}</p>
        </div>

        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Regular Users</span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.regularUsers}</p>
        </div>

        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium">Active</span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.active}</p>
        </div>

        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-sm font-medium">Inactive</span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.inactive}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          title="Error"
          message={error}
          onRetry={loadUsers}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Users Table */}
      <UserTable
        users={users}
        userPrivileges={userPrivileges}
        loading={loading}
        error={null}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        onRefresh={loadUsers}
      />
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <UserManagementLayout pageTitle="">
      <UsersPageContent />
    </UserManagementLayout>
  );
}
