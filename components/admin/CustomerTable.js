// components/admin/CustomerTable.js
"use client";

import { useState } from "react";
import {
  Trash2,
  Power,
  Eye,
  Search,
  User,
  ShoppingCart,
  Mail,
  Phone,
  Calendar,
  Filter,
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

export const CustomerTable = ({
  customers = [],
  loading = false,
  error = null,
  onDelete = null,
  onToggleActive = null,
  onRefresh = null,
  className = "",
}) => {
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedCustomers, setSelectedCustomers] = useState([]);

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

  // Safe data access helpers
  const safeCustomers = Array.isArray(customers) ? customers : [];

  // Filter and sort customers
  const filteredCustomers = safeCustomers
    .filter((customer) => {
      // Ensure customer has required fields
      if (!customer || typeof customer !== "object") return false;

      const firstName = customer.first_name || "";
      const lastName = customer.last_name || "";
      const email = customer.email || "";
      const contact = customer.contact || "";

      const matchesSearch =
        firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && customer.is_active === true) ||
        (statusFilter === "inactive" && customer.is_active === false);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          const nameA = `${a.first_name || ""} ${a.last_name || ""}`;
          const nameB = `${b.first_name || ""} ${b.last_name || ""}`;
          comparison = nameA.localeCompare(nameB);
          break;
        case "email":
          comparison = (a.email || "").localeCompare(b.email || "");
          break;
        case "created":
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          comparison = dateB - dateA;
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

  const handleDelete = async (customer) => {
    try {
      if (onDelete && customer?.id) {
        await onDelete(customer.id);
      }
    } catch (error) {
      console.error("Failed to delete customer:", error);
      // Error handling is managed by parent component
    }
  };

  const handleToggleStatus = async (customer) => {
    try {
      if (onToggleActive && customer?.id !== undefined) {
        await onToggleActive(customer.id, !customer.is_active);
      }
    } catch (error) {
      console.error("Failed to toggle customer status:", error);
      // Error handling is managed by parent component
    }
  };

  const handleDeleteClick = (customer) => {
    setActionTarget(customer);
    openDeleteDialog(() => handleDelete(customer));
  };

  const handleStatusClick = (customer) => {
    setActionTarget(customer);
    openStatusDialog(() => handleToggleStatus(customer));
  };

  const handleSelectAll = (checked) => {
    setSelectedCustomers(
      checked ? filteredCustomers.map((c) => c.id).filter(Boolean) : []
    );
  };

  const handleSelectCustomer = (customerId, checked) => {
    if (!customerId) return;
    setSelectedCustomers((prev) =>
      checked ? [...prev, customerId] : prev.filter((id) => id !== customerId)
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  const getCustomerAge = (createdAt) => {
    if (!createdAt) return "Unknown";

    try {
      const now = new Date();
      const created = new Date(createdAt);
      const diffInDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));

      if (diffInDays < 1) return "Today";
      if (diffInDays === 1) return "1 day";
      if (diffInDays < 30) return `${diffInDays} days`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months`;
      return `${Math.floor(diffInDays / 365)} years`;
    } catch {
      return "Unknown";
    }
  };

  // Calculate stats with safe data access
  const activeCustomers = safeCustomers.filter(
    (c) => c?.is_active === true
  ).length;
  const inactiveCustomers = safeCustomers.filter(
    (c) => c?.is_active === false
  ).length;
  const thisMonthCustomers = safeCustomers.filter((c) => {
    if (!c?.created_at) return false;
    try {
      const created = new Date(c.created_at);
      const now = new Date();
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    } catch {
      return false;
    }
  }).length;

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load customers"
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
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full sm:w-64 pl-10 pr-4 text-sm border border-input rounded-md bg-background"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 text-sm border border-input rounded-md bg-background"
          >
            <option value="all">All Customers</option>
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
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredCustomers.length} of {safeCustomers.length} customers
        </span>
        {selectedCustomers.length > 0 && (
          <span>{selectedCustomers.length} selected</span>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold mt-1">{safeCustomers.length}</p>
        </div>

        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium">Active</span>
          </div>
          <p className="text-2xl font-bold mt-1">{activeCustomers}</p>
        </div>

        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-sm font-medium">Inactive</span>
          </div>
          <p className="text-2xl font-bold mt-1">{inactiveCustomers}</p>
        </div>

        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">This Month</span>
          </div>
          <p className="text-2xl font-bold mt-1">{thisMonthCustomers}</p>
        </div>
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
                      filteredCustomers.length > 0 &&
                      selectedCustomers.length === filteredCustomers.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded"
                  />
                </th>
                <th
                  className="p-3 text-left cursor-pointer hover:bg-muted/20"
                  onClick={() => handleSort("name")}
                >
                  Customer
                </th>
                <th
                  className="p-3 text-left cursor-pointer hover:bg-muted/20"
                  onClick={() => handleSort("email")}
                >
                  Contact Information
                </th>
                <th className="p-3 text-left">Status</th>
                <th
                  className="p-3 text-left cursor-pointer hover:bg-muted/20"
                  onClick={() => handleSort("created")}
                >
                  Member Since
                </th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <LoadingSpinner text="Loading customers..." />
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <User className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">No customers found</h3>
                        <p className="text-sm text-muted-foreground">
                          {searchQuery || statusFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "No customers have registered yet"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={(e) =>
                          handleSelectCustomer(customer.id, e.target.checked)
                        }
                        className="rounded"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">
                            {customer.first_name || ""}{" "}
                            {customer.last_name || ""}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Customer #{customer.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span>{customer.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{customer.contact || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            customer.is_active ? "bg-green-500" : "bg-red-500"
                          )}
                        />
                        <span className="text-sm">
                          {customer.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <p className="text-sm">
                          {formatDate(customer.created_at)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getCustomerAge(customer.created_at)} ago
                        </p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2"
                          title="View Customer Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {isAdmin() && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusClick(customer)}
                              disabled={togglingStatus}
                              className="p-2"
                              title={
                                customer.is_active ? "Deactivate" : "Activate"
                              }
                            >
                              {togglingStatus &&
                              actionTarget?.id === customer.id ? (
                                <InlineLoadingSpinner />
                              ) : (
                                <Power className="h-4 w-4" />
                              )}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(customer)}
                              disabled={deleting}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete Customer"
                            >
                              {deleting && actionTarget?.id === customer.id ? (
                                <InlineLoadingSpinner />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </>
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
            ? `${actionTarget.first_name || ""} ${actionTarget.last_name || ""}`
            : ""
        }
        itemType="customer"
      />

      <DeactivateConfirmDialog
        isOpen={showStatusConfirm}
        onClose={closeStatusDialog}
        onConfirm={confirmStatusChange}
        loading={togglingStatus}
        itemName={
          actionTarget
            ? `${actionTarget.first_name || ""} ${actionTarget.last_name || ""}`
            : ""
        }
        itemType="customer"
        isActive={actionTarget?.is_active}
      />
    </div>
  );
};
