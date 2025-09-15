// app/(customer)/products/page.js
"use client";

import { useState, useEffect, useMemo } from "react";
import { ProductGrid } from "@/components/customer/ProductGrid";
import { SearchFilters } from "@/components/customer/SearchFilters";
import {
  getActiveProducts,
  searchProducts,
  getProductsByBrand,
  getProductsByPriceRange,
  getProductsByRating,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    search: "",
    brands: [],
    priceRange: null,
    minRating: null,
    inStock: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    let products = getActiveProducts();

    // Apply search filter
    if (filters.search) {
      products = searchProducts(filters.search);
    }

    // Apply brand filter
    if (filters.brands.length > 0) {
      products = products.filter((product) =>
        filters.brands.includes(product.brand)
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      products = products.filter(
        (product) =>
          product.sell_price >= min &&
          (max === Infinity || product.sell_price <= max)
      );
    }

    // Apply rating filter
    if (filters.minRating) {
      products = products.filter(
        (product) => product.rating >= filters.minRating
      );
    }

    // Apply stock filter
    if (filters.inStock) {
      products = products.filter((product) => product.quantity > 0);
    }

    return products;
  }, [filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>
        <p className="text-muted-foreground">
          Discover our complete collection of premium electronics and gadgets
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-80 flex-shrink-0">
          <SearchFilters
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
            isOpen={showFilters}
            onToggle={toggleFilters}
            className="sticky top-4"
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <ProductGrid
            products={filteredProducts}
            loading={false}
            error={null}
            showFilters={true}
            showSorting={true}
            showViewToggle={true}
            onFilterToggle={toggleFilters}
          />
        </main>
      </div>
    </div>
  );
}
