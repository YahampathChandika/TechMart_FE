// app/(admin)/customers/page.js
"use client";

import { useState, useEffect } from "react";
import { Download, Upload, Users, User, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserManagementLayout } from "@/components/admin/AdminLayout";
import { CustomerTable } from "@/components/admin/CustomerTable";
import { LoadingSpinner, ErrorMessage } from "@/components/common";
import { useAuth } from "@/hooks";
import { mockCustomers } from "@/lib/mockData";
import { SUCCESS_MESSAGES } from "@/lib/constants";

function CustomersPageContent() {
  const { user: currentUser, isAdmin } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Both admins and regular users can view customers
  const canView = isAdmin() || currentUser?.role === "user";
  const canDelete = isAdmin(); // Only admins can delete customers

  // Load customers
  const loadCustomers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In real app, this would be an API call
      setCustomers([...mockCustomers]);
    } catch (err) {
      console.error("Failed to load customers:", err);
      setError("Failed to load customers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle customer deletion (admin only)
  const handleDelete = async (customerId) => {
    if (!canDelete) {
      throw new Error("You don't have permission to delete customers.");
    }

    setActionLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, this would be an API call
      // For now, remove from local state
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));

      console.log("Customer deleted successfully");
    } catch (err) {
      console.error("Failed to delete customer:", err);
      setError("Failed to delete customer. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle customer status toggle
  const handleToggleActive = async (customerId, newStatus) => {
    if (!canDelete) {
      throw new Error("You don't have permission to modify customer status.");
    }

    setActionLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, this would be an API call
      // For now, update local state
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customerId
            ? {
                ...c,
                is_active: newStatus,
                updated_at: new Date().toISOString(),
              }
            : c
        )
      );

      console.log(
        `Customer ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      console.error("Failed to update customer status:", err);
      setError("Failed to update customer status. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Load customers on component mount
  useEffect(() => {
    if (canView) {
      loadCustomers();
    }
  }, [canView]);

  // Calculate statistics
  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.is_active).length,
    inactive: customers.filter((c) => !c.is_active).length,
    thisMonth: customers.filter((c) => {
      const created = new Date(c.created_at);
      const now = new Date();
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    }).length,
    thisWeek: customers.filter((c) => {
      const created = new Date(c.created_at);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return created >= weekAgo;
    }).length,
  };

  if (!canView) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <ErrorMessage
          title="Access Denied"
          message="You don't have permission to view customer information."
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
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">
            View and manage customer accounts and information
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
              <Mail className="h-4 w-4" />
              Email Report
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
          <p className="text-xs text-muted-foreground">All customers</p>
        </div>

        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium">Active</span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.active}</p>
          <p className="text-xs text-muted-foreground">Can make purchases</p>
        </div>

        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-sm font-medium">Inactive</span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.inactive}</p>
          <p className="text-xs text-muted-foreground">Deactivated accounts</p>
        </div>

        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">This Month</span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.thisMonth}</p>
          <p className="text-xs text-muted-foreground">New registrations</p>
        </div>

        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">This Week</span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.thisWeek}</p>
          <p className="text-xs text-muted-foreground">Recent signups</p>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-background border rounded-lg p-4">
          <h3 className="font-medium mb-3">Registration Trend</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>This month</span>
              <span className="font-medium text-green-600">
                +{stats.thisMonth}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>This week</span>
              <span className="font-medium text-blue-600">
                +{stats.thisWeek}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Average per month</span>
              <span className="font-medium">
                {Math.round(stats.total / 12)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-background border rounded-lg p-4">
          <h3 className="font-medium mb-3">Account Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Active Rate</span>
              <span className="font-medium text-green-600">
                {((stats.active / stats.total) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Inactive Rate</span>
              <span className="font-medium text-red-600">
                {((stats.inactive / stats.total) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-background border rounded-lg p-4">
          <h3 className="font-medium mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Newsletter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Download className="h-4 w-4 mr-2" />
              Export List
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          title="Error"
          message={error}
          onRetry={loadCustomers}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Access Level Notice */}
      {!isAdmin() && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <User className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">
                Read-Only Access
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                You have view-only access to customer information. Contact an
                administrator if you need to modify customer accounts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="bg-background border rounded-lg">
        <CustomerTable
          customers={customers}
          loading={loading}
          error={null}
          onDelete={canDelete ? handleDelete : null}
          onToggleActive={canDelete ? handleToggleActive : null}
          onRefresh={loadCustomers}
        />
      </div>

      {/* Customer Management Guidelines */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-medium mb-2">Customer Management Guidelines</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>
            • Customer accounts are created through the public registration
            process
          </p>
          <p>• Deactivated customers cannot log in or make purchases</p>
          <p>
            • Customer data is protected and should only be accessed when
            necessary
          </p>
          <p>
            • Deleted customers cannot be recovered - deactivate instead when
            possible
          </p>
          {!isAdmin() && (
            <p>• Only administrators can modify or delete customer accounts</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminCustomersPage() {
  return (
    <UserManagementLayout pageTitle="">
      <CustomersPageContent />
    </UserManagementLayout>
  );
}
