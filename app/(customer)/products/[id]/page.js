// app/(customer)/products/[id]/page.js
"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/customer/ProductDetails";
import { SimpleProductGrid } from "@/components/customer/ProductGrid";
import { LoadingSpinner, ErrorMessage } from "@/components/common";
import { useProduct, useProducts } from "@/hooks/useProducts";

export default function ProductDetailPage({ params }) {
  const { id } = use(params);

  // Get the main product
  const {
    product,
    loading: productLoading,
    error: productError,
  } = useProduct(id);

  // Get related products (same brand, different product)
  const { products: relatedProducts, loading: relatedLoading } = useProducts({
    brand: product?.brand,
    exclude: id,
    per_page: 4,
  });

  // Get suggested products (similar price range)
  const priceMin = product ? product.sell_price * 0.8 : 0;
  const priceMax = product ? product.sell_price * 1.2 : 0;

  const { products: suggestedProducts, loading: suggestedLoading } =
    useProducts({
      min_price: priceMin,
      max_price: priceMax,
      exclude: id,
      per_page: 4,
    });

  // Show loading state
  if (productLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  // Show error state
  if (productError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          title="Product Not Found"
          message="The product you're looking for doesn't exist or may have been removed."
          variant="destructive"
        />
      </div>
    );
  }

  // Show 404 if product not found or inactive
  if (!product || !product.is_active) {
    notFound();
  }

  // Filter out the current product from related and suggested
  const filteredRelatedProducts = relatedProducts.filter(
    (p) => p.id !== parseInt(id) && p.is_active
  );

  const filteredSuggestedProducts = suggestedProducts.filter(
    (p) =>
      p.id !== parseInt(id) &&
      p.is_active &&
      !filteredRelatedProducts.some((rp) => rp.id === p.id)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Details */}
      <ProductDetails product={product} />

      {/* Related Products */}
      {!relatedLoading && filteredRelatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">More from {product.brand}</h2>
          <SimpleProductGrid products={filteredRelatedProducts} />
        </section>
      )}

      {/* You Might Also Like */}
      {!suggestedLoading && filteredSuggestedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <SimpleProductGrid products={filteredSuggestedProducts} />
        </section>
      )}

      {/* Loading states for related products */}
      {(relatedLoading || suggestedLoading) && (
        <section className="mt-16">
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        </section>
      )}

      {/* Empty state if no related products */}
      {!relatedLoading &&
        !suggestedLoading &&
        filteredRelatedProducts.length === 0 &&
        filteredSuggestedProducts.length === 0 && (
          <section className="mt-16 text-center">
            <p className="text-muted-foreground">
              No related products found at the moment.
            </p>
          </section>
        )}
    </div>
  );
}
