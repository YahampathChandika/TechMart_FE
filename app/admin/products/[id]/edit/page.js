// app/admin/products/[id]/edit/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { use } from "react";
import { ProductManagementLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { LoadingSpinner, ErrorMessage } from "@/components/common";
import { useAuth } from "@/hooks";
import { permissions } from "@/lib/auth";
import { authAPI } from "@/lib/api";
import { SUCCESS_MESSAGES } from "@/lib/constants";

function EditProductPageContent({ productId }) {
  const { user } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Permission check
  const canUpdate = permissions.canUpdateProducts(user, null);

  // Load product data from backend API
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await authAPI.getProduct(parseInt(productId));

        if (!result.success) {
          if (result.status === 404) {
            notFound();
            return;
          }
          throw new Error(result.error || "Failed to load product");
        }

        const productData = result.data?.product || result.data;
        if (!productData) {
          notFound();
          return;
        }

        setProduct(productData);
      } catch (err) {
        console.error("Failed to load product:", err);
        setError(err.message || "Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const handleSubmit = async (formData) => {
    if (!canUpdate) {
      throw new Error("You don't have permission to update products.");
    }

    setSubmitting(true);

    try {
      console.log(
        "Updating product with data:",
        formData instanceof FormData ? "FormData with image" : formData
      );

      // Pass data directly to API - it handles both FormData and JSON
      const result = await authAPI.updateProduct(parseInt(productId), formData);

      if (!result.success) {
        throw new Error(result.error || "Failed to update product");
      }

      const updatedProduct = result.data?.product || result.data;
      setProduct(updatedProduct);

      console.log(SUCCESS_MESSAGES.PRODUCT_UPDATED, updatedProduct);

      // Redirect to products list
      router.push("/admin/products");
    } catch (err) {
      console.error("Failed to update product:", err);
      throw err; // Re-throw so ProductForm can handle it
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  if (!canUpdate) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <ErrorMessage
          title="Access Denied"
          message="You don't have permission to edit products."
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading product..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">Update product information</p>
        </div>

        <ErrorMessage
          title="Failed to Load Product"
          message={error}
          onRetry={() => window.location.reload()}
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

  if (!product) {
    notFound();
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">
          Update information for "{product.name}"
        </p>
      </div>

      {/* Product Form */}
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={submitting}
        error={null}
      />
    </div>
  );
}

export default function EditProductPage({ params }) {
  const { id } = use(params);

  return (
    <ProductManagementLayout pageTitle="Edit Product">
      <EditProductPageContent productId={id} />
    </ProductManagementLayout>
  );
}
