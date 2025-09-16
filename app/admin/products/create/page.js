// app/(admin)/products/create/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductManagementLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { useAuth } from "@/hooks";
import { permissions } from "@/lib/auth";
import { mockProducts } from "@/lib/mockData";
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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real app, this would be an API call
      // For now, add to mock data
      const newProduct = {
        id: Math.max(...mockProducts.map((p) => p.id)) + 1,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to mock data (in real app, this would be handled by API)
      mockProducts.push(newProduct);

      console.log(SUCCESS_MESSAGES.PRODUCT_CREATED, newProduct);

      // Redirect will be handled by ProductForm component
    } catch (err) {
      console.error("Failed to create product:", err);
      throw err;
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
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don&apos;t have permission to add products. Contact your
            administrator to request access.
          </p>
          <button
            onClick={() => router.push("/admin/products")}
            className="text-primary hover:underline"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductForm
      product={null}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={loading}
      error={error}
    />
  );
}

export default function CreateProductPage() {
  return (
    <ProductManagementLayout pageTitle="">
      <CreateProductPageContent />
    </ProductManagementLayout>
  );
}
