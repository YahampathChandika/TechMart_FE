// components/admin/UserTable.js
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Edit,
  Trash2,
  Power,
  Eye,
  Shield,
  Search,
  Plus,
  User,
  Settings,
  MoreHorizontal,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LoadingSpinner,
  InlineLoadingSpinner,
  ErrorMessage,
} from "@/components/common";
import {
  DeleteConfirmDialog,
  DeactivateConfirmDialog,
  useConfirmDialog,
} from "@/components/common";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

export const UserTable = ({
  users = [],
  userPrivileges = [],
  loading = false,
  error = null,
  onEdit = null,
  onDelete = null,
  onToggleActive = null,
  onRefresh = null,
  className = "",
}) => {
  const { user: currentUser, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Confirmation dialogs
  const {
    isOpen: showDeleteConfirm,
    loading: deleting,
    openDialog: openDeleteDialog,
    closeDialog: closeDeleteDialog,
    confirmAction: confirmDelete,
  } = useConfirmDialog();

  const {
    isOpen: showStatusConfirm,
    loading: togglingStatus,
    openDialog: openStatusDialog,
    closeDialog: closeStatusDialog,
    confirmAction: confirmStatusChange,
  } = useConfirmDialog();

  const [actionTarget, setActionTarget] = useState(null);

  // Helper function to get user privileges
  const getUserPrivileges = (userId) => {
    return userPrivileges.find((priv) => priv.user_id === userId);
  };

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      // Don't show current user in the list to prevent self-modification
      if (user.id === currentUser?.id) return false;

      const matchesSearch =
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.contact.includes(searchQuery);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.is_active) ||
        (statusFilter === "inactive" && !user.is_active);

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = `${a.first_name} ${a.last_name}`.localeCompare(
            `${b.first_name} ${b.last_name}`
          );
          break;
        case "email":
          comparison = a.email.localeCompare(b.email);
          break;
        case "role":
          comparison = a.role.localeCompare(b.role);
          break;
        case "created":
          comparison = new Date(b.created_at) - new Date(a.created_at);
          break;
        default:
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = async (user) => {
    try {
      if (onDelete) {
        await onDelete(user.id);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      if (onToggleActive) {
        await onToggleActive(user.id, !user.is_active);
      }
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };

  const handleDeleteClick = (user) => {
    setActionTarget(user);
    openDeleteDialog(() => handleDelete(user));
  };

  const handleStatusClick = (user) => {
    setActionTarget(user);
    openStatusDialog(() => handleToggleStatus(user));
  };

  const handleSelectAll = (checked) => {
    setSelectedUsers(checked ? filteredUsers.map((u) => u.id) : []);
  };

  const handleSelectUser = (userId, checked) => {
    setSelectedUsers((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  const canDeleteUser = (user) => {
    // Only admins can delete users, and cannot delete themselves
    return isAdmin() && user.id !== currentUser?.id;
  };

  const canEditUser = (user) => {
    // Admins can edit anyone except themselves, regular users can't edit
    return isAdmin() && user.id !== currentUser?.id;
  };

  const canManagePrivileges = (user) => {
    // Only admins can manage privileges for regular users
    return isAdmin() && user.role === "user";
  };

  const renderPrivilegesSummary = (user) => {
    const privileges = getUserPrivileges(user.id);
    if (!privileges || user.role === "admin") {
      return user.role === "admin" ? (
        <span className="text-xs text-green-600">Full Access</span>
      ) : (
        <span className="text-xs text-muted-foreground">No privileges set</span>
      );
    }

    const activePrivileges = [
      privileges.can_add_products && "Add",
      privileges.can_update_products && "Edit",
      privileges.can_delete_products && "Delete",
    ].filter(Boolean);

    return (
      <span className="text-xs text-muted-foreground">
        {activePrivileges.length > 0
          ? activePrivileges.join(", ")
          : "Read-only"}
      </span>
    );
  };

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load users"
        message={error}
        onRetry={onRefresh}
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 space-y-2 sm:space-y-0 sm:space-x-2 sm:flex sm:items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full sm:w-64 pl-10 pr-4 text-sm border border-input rounded-md bg-background"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 px-3 text-sm border border-input rounded-md bg-background"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 text-sm border border-input rounded-md bg-background"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh} disabled={loading}>
              {loading ? <InlineLoadingSpinner /> : "Refresh"}
            </Button>
          )}

          {isAdmin() && (
            <Link href="/admin/users/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredUsers.length} of {users.length} users
        </span>
        {selectedUsers.length > 0 && (
          <span>{selectedUsers.length} selected</span>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      filteredUsers.length > 0 &&
                      selectedUsers.length === filteredUsers.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded"
                  />
                </th>
                <th
                  className="p-3 text-left cursor-pointer hover:bg-muted/20"
                  onClick={() => handleSort("name")}
                >
                  User
                </th>
                <th
                  className="p-3 text-left cursor-pointer hover:bg-muted/20"
                  onClick={() => handleSort("email")}
                >
                  Email
                </th>
                <th
                  className="p-3 text-left cursor-pointer hover:bg-muted/20"
                  onClick={() => handleSort("role")}
                >
                  Role
                </th>
                <th className="p-3 text-left">Privileges</th>
                <th className="p-3 text-left">Status</th>
                <th
                  className="p-3 text-left cursor-pointer hover:bg-muted/20"
                  onClick={() => handleSort("created")}
                >
                  Created
                </th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center">
                    <LoadingSpinner text="Loading users..." />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <User className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">No users found</h3>
                        <p className="text-sm text-muted-foreground">
                          {searchQuery ||
                          roleFilter !== "all" ||
                          statusFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "Get started by adding your first user"}
                        </p>
                      </div>
                      {isAdmin() && (
                        <Link href="/admin/users/create">
                          <Button size="sm">Add User</Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) =>
                          handleSelectUser(user.id, e.target.checked)
                        }
                        className="rounded"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {user.role === "admin" ? (
                            <Crown className="h-5 w-5 text-primary" />
                          ) : (
                            <User className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">
                            {user.first_name} {user.last_name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {user.contact}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{user.email}</td>
                    <td className="p-3">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                        )}
                      >
                        {user.role === "admin" ? "Administrator" : "User"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        {renderPrivilegesSummary(user)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            user.is_active ? "bg-green-500" : "bg-red-500"
                          )}
                        />
                        <span className="text-sm">
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        {canEditUser(user) && (
                          <Link href={`/admin/users/${user.id}/edit`}>
                            <Button variant="ghost" size="sm" className="p-2">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}

                        {canManagePrivileges(user) && (
                          <Link href={`/admin/users/${user.id}/privileges`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2"
                              title="Manage Privileges"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}

                        {canEditUser(user) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusClick(user)}
                            disabled={togglingStatus}
                            className="p-2"
                            title={user.is_active ? "Deactivate" : "Activate"}
                          >
                            {togglingStatus && actionTarget?.id === user.id ? (
                              <InlineLoadingSpinner />
                            ) : (
                              <Power className="h-4 w-4" />
                            )}
                          </Button>
                        )}

                        {canDeleteUser(user) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            disabled={deleting}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete User"
                          >
                            {deleting && actionTarget?.id === user.id ? (
                              <InlineLoadingSpinner />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        loading={deleting}
        itemName={
          actionTarget
            ? `${actionTarget.first_name} ${actionTarget.last_name}`
            : ""
        }
        itemType="user"
      />

      <DeactivateConfirmDialog
        isOpen={showStatusConfirm}
        onClose={closeStatusDialog}
        onConfirm={confirmStatusChange}
        loading={togglingStatus}
        itemName={
          actionTarget
            ? `${actionTarget.first_name} ${actionTarget.last_name}`
            : ""
        }
        itemType="user"
        isActive={actionTarget?.is_active}
      />
    </div>
  );
};
