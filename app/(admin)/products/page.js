// app/(admin)/products/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Package, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductManagementLayout } from "@/components/admin/AdminLayout";
import { ProductTable } from "@/components/admin/ProductTable";
import { LoadingSpinner, ErrorMessage } from "@/components/common";
import { useAuth } from "@/hooks";
import { permissions } from "@/lib/auth";
import { mockProducts } from "@/lib/mockData";
import { SUCCESS_MESSAGES } from "@/lib/constants";

function ProductsPageContent() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Permission checks
  const canAdd = permissions.canAddProducts(user, null);
  const canUpdate = permissions.canUpdateProducts(user, null);
  const canDelete = permissions.canDeleteProducts(user, null);

  // Load products
  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In real app, this would be an API call
      setProducts([...mockProducts]);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    setActionLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, this would be an API call
      // For now, remove from local state
      setProducts((prev) => prev.filter((p) => p.id !== productId));

      // Show success message
      console.log(SUCCESS_MESSAGES.PRODUCT_DELETED);
    } catch (err) {
      console.error("Failed to delete product:", err);
      setError("Failed to delete product. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle product status toggle
  const handleToggleActive = async (productId, newStatus) => {
    setActionLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, this would be an API call
      // For now, update local state
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                is_active: newStatus,
                updated_at: new Date().toISOString(),
              }
            : p
        )
      );

      console.log(
        `Product ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      console.error("Failed to update product status:", err);
      setError("Failed to update product status. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const stats = {
    total: products.length,
    active: products.filter((p) => p.is_active).length,
    inactive: products.filter((p) => !p.is_active).length,
    lowStock: products.filter((p) => p.quantity < 20 && p.is_active).length,
    outOfStock: products.filter((p) => p.quantity === 0).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">
            Manage your store's product inventory and information
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

          {/* Add Product Button */}
          {canAdd && (
            <Link href="/products/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </Link>
          )}
        </div>
      </div>

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
      <div className="bg-background border rounded-lg">
        <ProductTable
          products={products}
          loading={loading}
          error={null}
          onDelete={canDelete ? handleDelete : null}
          onToggleActive={canUpdate ? handleToggleActive : null}
          onRefresh={loadProducts}
        />
      </div>

      {/* No Permission Message */}
      {!canAdd && !canUpdate && !canDelete && (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">Limited Access</h3>
          <p className="text-muted-foreground">
            You have read-only access to products. Contact your administrator
            for additional permissions.
          </p>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <ProductManagementLayout pageTitle="">
      <ProductsPageContent />
    </ProductManagementLayout>
  );
}
