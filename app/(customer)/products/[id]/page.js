// app/(customer)/products/[id]/page.js
"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/customer/ProductDetails";
import { SimpleProductGrid } from "@/components/customer/ProductGrid";
import { getProductById, getActiveProducts } from "@/lib/mockData";

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const product = getProductById(parseInt(id));

  if (!product || !product.is_active) {
    notFound();
  }

  // Get related products (same brand, different product)
  const relatedProducts = getActiveProducts()
    .filter((p) => p.brand === product.brand && p.id !== product.id)
    .slice(0, 4);

  // Get you might also like (different brands, similar price range)
  const priceMin = product.sell_price * 0.8;
  const priceMax = product.sell_price * 1.2;
  const suggestedProducts = getActiveProducts()
    .filter(
      (p) =>
        p.id !== product.id &&
        p.sell_price >= priceMin &&
        p.sell_price <= priceMax &&
        !relatedProducts.some((rp) => rp.id === p.id)
    )
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Details */}
      <ProductDetails product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">More from {product.brand}</h2>
          <SimpleProductGrid products={relatedProducts} />
        </section>
      )}

      {/* You Might Also Like */}
      {suggestedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <SimpleProductGrid products={suggestedProducts} />
        </section>
      )}
    </div>
  );
}
