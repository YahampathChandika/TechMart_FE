// app/admin/products/page.js - UPDATED FOR PRIVILEGE SYSTEM
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Package, Download, Upload, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductManagementLayout } from "@/components/admin/AdminLayout";
import { ProductTable } from "@/components/admin/ProductTable";
import { LoadingSpinner, ErrorMessage } from "@/components/common";
import { useAuth } from "@/hooks";
import { authAPI } from "@/lib/api";
import { SUCCESS_MESSAGES } from "@/lib/constants";

function ProductsPageContent() {
  const {
    user,
    isAdmin,
    isUser,
    canAddProducts,
    canUpdateProducts,
    canDeleteProducts,
  } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  // Permission checks using auth hook methods
  const canView = isAdmin() || isUser(); // All authenticated admin/users can view
  const canAdd = canAddProducts();
  const canUpdate = canUpdateProducts();
  const canDelete = canDeleteProducts();

  // Check if user can access this page at all
  if (!canView) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <ErrorMessage
          title="Access Denied"
          message="You don't have permission to access the admin area. Please contact your administrator."
        />
      </div>
    );
  }

  // Load products from backend API
  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authAPI.getProducts();

      if (!result.success) {
        throw new Error(result.error || "Failed to load products");
      }

      const productsData = result.data?.data || result.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);

      // Calculate stats from the loaded products
      calculateStats(productsData);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError(err.message || "Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from products data
  const calculateStats = (productsData) => {
    if (!Array.isArray(productsData)) {
      setStats({
        total: 0,
        active: 0,
        inactive: 0,
        lowStock: 0,
        outOfStock: 0,
      });
      return;
    }

    const total = productsData.length;
    const active = productsData.filter((p) => p.is_active).length;
    const inactive = total - active;
    const lowStock = productsData.filter(
      (p) => p.quantity > 0 && p.quantity <= 10
    ).length;
    const outOfStock = productsData.filter((p) => p.quantity === 0).length;

    setStats({ total, active, inactive, lowStock, outOfStock });
  };

  // Handle product deletion - only if user has delete permission
  const handleDelete = async (productId) => {
    if (!canDelete) {
      console.error("No permission to delete products");
      return;
    }

    setActionLoading(true);

    try {
      const result = await authAPI.deleteProduct(productId);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete product");
      }

      // Remove product from local state
      setProducts((prev) => {
        const updated = prev.filter((p) => p.id !== productId);
        calculateStats(updated);
        return updated;
      });

      console.log(SUCCESS_MESSAGES.PRODUCT_DELETED);
    } catch (err) {
      console.error("Failed to delete product:", err);
      setError(err.message || "Failed to delete product. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle product status toggle - only if user has update permission
  const handleToggleActive = async (productId, newStatus) => {
    if (!canUpdate) {
      console.error("No permission to update products");
      return;
    }

    setActionLoading(true);

    try {
      // Find the product to update
      const product = products.find((p) => p.id === productId);
      if (!product) {
        throw new Error("Product not found");
      }

      // Update product with new status
      const updateData = {
        ...product,
        is_active: newStatus,
      };

      const result = await authAPI.updateProduct(productId, updateData);

      if (!result.success) {
        throw new Error(result.error || "Failed to update product status");
      }

      // Update product in local state
      setProducts((prev) => {
        const updated = prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                is_active: newStatus,
                updated_at: new Date().toISOString(),
              }
            : p
        );
        calculateStats(updated);
        return updated;
      });

      console.log(
        `Product ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      console.error("Failed to toggle product status:", err);
      setError(
        err.message || "Failed to update product status. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    loadProducts();
  };

  // Handle export (placeholder for now)
  const handleExport = async () => {
    try {
      console.log("Exporting products...");
      // Implementation for export would go here
    } catch (err) {
      console.error("Failed to export products:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading products..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory and listings
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>

            {canView && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            )}

            <Button variant="outline" size="sm" disabled>
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>
        </div>
      </div>

      {/* Access Level Notice for Users with Limited Permissions */}
      {!canAdd && !canUpdate && !canDelete && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Package className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">
                Read-Only Access
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                You have view-only access to the product catalog. Contact your
                administrator if you need product management permissions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Partial Access Notice */}
      {(canAdd || canUpdate || canDelete) &&
        (!canAdd || !canUpdate || !canDelete) && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Package className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Limited Product Access
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  You have permissions for:{" "}
                  {[
                    canAdd && "Adding products",
                    canUpdate && "Editing products",
                    canDelete && "Deleting products",
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  .
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
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

        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span className="text-sm font-medium">Low Stock</span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.lowStock}</p>
        </div>

        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-600 rounded-full" />
            <span className="text-sm font-medium">Out of Stock</span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.outOfStock}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          title="Error"
          message={error}
          onRetry={loadProducts}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Products Table */}
      <ProductTable
        products={products}
        loading={actionLoading}
        error={null}
        onDelete={canDelete ? handleDelete : null}
        onToggleActive={canUpdate ? handleToggleActive : null}
        onRefresh={handleRefresh}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ProductManagementLayout pageTitle="">
      <ProductsPageContent />
    </ProductManagementLayout>
  );
}
