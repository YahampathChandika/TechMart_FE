// components/admin/ProductTable.js
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Edit,
  Trash2,
  Power,
  Eye,
  Star,
  Package,
  Search,
  Filter,
  MoreHorizontal,
  Plus,
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
import { permissions } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const ProductTable = ({
  products = [],
  loading = false,
  error = null,
  onEdit = null,
  onDelete = null,
  onToggleActive = null,
  onRefresh = null,
  className = "",
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedProducts, setSelectedProducts] = useState([]);

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

  // Permission checks
  const canUpdate = permissions.canUpdateProducts(user, null); // Would get user privileges in real app
  const canDelete = permissions.canDeleteProducts(user, null);
  const canAdd = permissions.canAddProducts(user, null);

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && product.is_active) ||
        (statusFilter === "inactive" && !product.is_active) ||
        (statusFilter === "low-stock" && product.quantity < 20) ||
        (statusFilter === "out-of-stock" && product.quantity === 0);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "brand":
          comparison = a.brand.localeCompare(b.brand);
          break;
        case "price":
          comparison = a.sell_price - b.sell_price;
          break;
        case "quantity":
          comparison = a.quantity - b.quantity;
          break;
        case "rating":
          comparison = b.rating - a.rating;
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

  const handleDelete = async (product) => {
    try {
      if (onDelete) {
        await onDelete(product.id);
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      if (onToggleActive) {
        await onToggleActive(product.id, !product.is_active);
      }
    } catch (error) {
      console.error("Failed to toggle product status:", error);
    }
  };

  const handleDeleteClick = (product) => {
    setActionTarget(product);
    openDeleteDialog(() => handleDelete(product));
  };

  const handleStatusClick = (product) => {
    setActionTarget(product);
    openStatusDialog(() => handleToggleStatus(product));
  };

  const handleSelectAll = (checked) => {
    setSelectedProducts(checked ? filteredProducts.map((p) => p.id) : []);
  };

  const handleSelectProduct = (productId, checked) => {
    setSelectedProducts((prev) =>
      checked ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-3 w-3",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  const getStockStatus = (product) => {
    if (product.quantity === 0) {
      return { text: "Out of Stock", color: "text-red-600", bg: "bg-red-100" };
    }
    if (product.quantity < 20) {
      return {
        text: "Low Stock",
        color: "text-orange-600",
        bg: "bg-orange-100",
      };
    }
    return { text: "In Stock", color: "text-green-600", bg: "bg-green-100" };
  };

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load products"
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
              placeholder="Search products..."
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
            <option value="all">All Products</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh} disabled={loading}>
              {loading ? <InlineLoadingSpinner /> : "Refresh"}
            </Button>
          )}

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

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredProducts.length} of {products.length} products
        </span>
        {selectedProducts.length > 0 && (
          <span>{selectedProducts.length} selected</span>
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
                      filteredProducts.length > 0 &&
                      selectedProducts.length === filteredProducts.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded"
                  />
                </th>
                <th className="p-3 text-left">Product</th>
                <th
                  className="p-3 text-left cursor-pointer hover:bg-muted/20"
                  onClick={() => handleSort("brand")}
                >
                  Brand
                </th>
                <th
                  className="p-3 text-left cursor-pointer hover:bg-muted/20"
                  onClick={() => handleSort("price")}
                >
                  Price
                </th>
                <th
                  className="p-3 text-left cursor-pointer hover:bg-muted/20"
                  onClick={() => handleSort("quantity")}
                >
                  Stock
                </th>
                <th
                  className="p-3 text-left cursor-pointer hover:bg-muted/20"
                  onClick={() => handleSort("rating")}
                >
                  Rating
                </th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center">
                    <LoadingSpinner text="Loading products..." />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <Package className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">No products found</h3>
                        <p className="text-sm text-muted-foreground">
                          {searchQuery || statusFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "Get started by adding your first product"}
                        </p>
                      </div>
                      {canAdd && (
                        <Link href="/products/create">
                          <Button size="sm">Add Product</Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) =>
                            handleSelectProduct(product.id, e.target.checked)
                          }
                          className="rounded"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm line-clamp-1">
                              {product.name}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm">{product.brand}</td>
                      <td className="p-3 text-sm font-medium">
                        ${product.sell_price}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {product.quantity}
                          </span>
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              stockStatus.bg,
                              stockStatus.color
                            )}
                          >
                            {stockStatus.text}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">{renderStars(product.rating)}</td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              product.is_active ? "bg-green-500" : "bg-red-500"
                            )}
                          />
                          <span className="text-sm">
                            {product.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <Link href={`/products/${product.id}`}>
                            <Button variant="ghost" size="sm" className="p-2">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>

                          {canUpdate && (
                            <Link href={`/products/${product.id}/edit`}>
                              <Button variant="ghost" size="sm" className="p-2">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}

                          {canUpdate && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusClick(product)}
                              disabled={togglingStatus}
                              className="p-2"
                            >
                              {togglingStatus &&
                              actionTarget?.id === product.id ? (
                                <InlineLoadingSpinner />
                              ) : (
                                <Power className="h-4 w-4" />
                              )}
                            </Button>
                          )}

                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(product)}
                              disabled={deleting}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              {deleting && actionTarget?.id === product.id ? (
                                <InlineLoadingSpinner />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
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
        itemName={actionTarget?.name}
        itemType="product"
      />

      <DeactivateConfirmDialog
        isOpen={showStatusConfirm}
        onClose={closeStatusDialog}
        onConfirm={confirmStatusChange}
        loading={togglingStatus}
        itemName={actionTarget?.name}
        itemType="product"
        isActive={actionTarget?.is_active}
      />
    </div>
  );
};
