// app/(admin)/products/[id]/edit/page.js
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
import { getProductById, mockProducts } from "@/lib/mockData";
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

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Get product from mock data
        const productData = getProductById(parseInt(productId));

        if (!productData) {
          notFound();
          return;
        }

        setProduct(productData);
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Failed to load product. Please try again.");
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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real app, this would be an API call
      // For now, update in mock data
      const updatedProduct = {
        ...product,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      // Update in mock data
      const index = mockProducts.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        mockProducts[index] = updatedProduct;
      }

      setProduct(updatedProduct);
      console.log(SUCCESS_MESSAGES.PRODUCT_UPDATED, updatedProduct);

      // Redirect will be handled by ProductForm component
    } catch (err) {
      console.error("Failed to update product:", err);
      throw err;
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
          message="You don't have permission to edit products. Contact your administrator to request access."
        />
        <div className="mt-4 text-center">
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading product..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <ErrorMessage
          title="Failed to Load Product"
          message={error}
          onRetry={() => window.location.reload()}
        />
        <div className="mt-4 text-center">
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

  if (!product) {
    notFound();
    return null;
  }

  return (
    <ProductForm
      product={product}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={submitting}
      error={null}
    />
  );
}

export default function EditProductPage({ params }) {
  const { id } = use(params);

  return (
    <ProductManagementLayout pageTitle="">
      <EditProductPageContent productId={id} />
    </ProductManagementLayout>
  );
}
