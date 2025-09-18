// app/admin/products/create/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductManagementLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { ErrorMessage } from "@/components/common";
import { useAuth } from "@/hooks";
import { permissions } from "@/lib/auth";
import { authAPI } from "@/lib/api";
import { SUCCESS_MESSAGES } from "@/lib/constants";

function CreateProductPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Permission check
  const canAdd = permissions.canAddProducts(user, null);

  const handleSubmit = async (formData) => {
    if (!canAdd) {
      throw new Error("You don't have permission to add products.");
    }

    setLoading(true);
    setError(null);

    try {
      console.log(
        "Creating product with data:",
        formData instanceof FormData ? "FormData with image" : formData
      );

      // Pass data directly to API - it handles both FormData and JSON
      const result = await authAPI.createProduct(formData);

      if (!result.success) {
        throw new Error(result.error || "Failed to create product");
      }

      console.log(SUCCESS_MESSAGES.PRODUCT_CREATED, result.data);

      // Redirect to products list
      router.push("/admin/products");
    } catch (err) {
      console.error("Failed to create product:", err);
      setError(err.message || "Failed to create product. Please try again.");
      throw err; // Re-throw so ProductForm can handle it
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  if (!canAdd) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <ErrorMessage
          title="Access Denied"
          message="You don't have permission to add products. Contact your administrator to request access."
          extraActions={
            <button
              onClick={() => router.push("/admin/products")}
              className="text-primary hover:underline text-sm"
            >
              Back to Products
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Create Product</h1>
        <p className="text-muted-foreground">
          Add a new product to your inventory
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          title="Failed to Create Product"
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Product Form */}
      <ProductForm
        product={null}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        error={null} // We handle errors above
      />
    </div>
  );
}

export default function CreateProductPage() {
  return (
    <ProductManagementLayout pageTitle="Create Product">
      <CreateProductPageContent />
    </ProductManagementLayout>
  );
}
