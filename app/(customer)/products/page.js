// app/(customer)/products/page.js - Updated to work with new ProductGrid
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/customer/ProductGrid";
import { SearchFilters } from "@/components/customer/SearchFilters";
import { LoadingSpinner, ErrorMessage } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { usePublicProducts } from "@/hooks/useProducts";
import { useBrands, useFilterOptions } from "@/hooks/useBrands";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    brand: searchParams.get("brand") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    rating: searchParams.get("rating") || "",
    in_stock: searchParams.get("in_stock") === "true" || false,
    sort: searchParams.get("sort") || "name",
    per_page: 12,
  });

  // Fetch brands and filter options separately
  const { brands, loading: brandsLoading } = useBrands();
  const { filterOptions, loading: filtersLoading } = useFilterOptions();

  // Use products hook with current filters
  const { products, loading, error, meta, refresh } = usePublicProducts(filters);

  // Prepare available filters for SearchFilters component
  const availableFilters = {
    brands: brands || [],
    price_range: filterOptions?.price_range || { min: 0, max: 1000 },
    rating_range: filterOptions?.rating_range || { min: 1, max: 5 },
    categories: filterOptions?.categories || [],
  };

  // Handle search
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      setFilters((prev) => ({ ...prev, search: searchQuery }));
    },
    [searchQuery]
  );

  // Handle filter changes (from sidebar or ProductGrid)
  const handleFilterChange = useCallback((newFilters) => {
    console.log("Changing filters:", newFilters);
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      console.log("Updated filters:", updated);
      return updated;
    });
  }, []);

  // Handle sort changes specifically (for the main dropdown and ProductGrid toolbar)
  const handleSortChange = useCallback(
    (sortValue) => {
      handleFilterChange({ sort: sortValue });
    },
    [handleFilterChange]
  );

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      sort: "name",
      per_page: 12,
    });
    setSearchQuery("");
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  // Check if any filters are active
  const hasActiveFilters = Object.keys(filters).some(
    (key) =>
      key !== "sort" && key !== "per_page" && key !== "page" && filters[key]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        <p className="text-muted-foreground">
          Discover our wide range of electronics and gadgets
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={loading}>
            Search
          </Button>
        </form>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
            {brandsLoading || filtersLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <SearchFilters
                filters={filters}
                availableFilters={availableFilters}
                onChange={handleFilterChange}
              />
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile Filters Toggle & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              {/* Results count */}
              {loading ? (
                <p className="text-muted-foreground">Loading products...</p>
              ) : meta ? (
                <p className="text-muted-foreground">
                  Showing {meta.from}-{meta.to} of {meta.total} products
                </p>
              ) : null}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Sort by:</label>
              <select
                value={filters.sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm bg-background"
              >
                <option value="name">Name</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mb-6 p-4 border rounded-lg bg-background">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {brandsLoading || filtersLoading ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner />
                </div>
              ) : (
                <SearchFilters
                  filters={filters}
                  availableFilters={availableFilters}
                  onChange={handleFilterChange}
                />
              )}
            </div>
          )}

          {/* Products Display */}
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <ErrorMessage
              title="Failed to load products"
              message={error}
              variant="destructive"
              action={{
                label: "Try Again",
                onClick: refresh,
              }}
            />
          ) : (
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              showFilters={false} // Don't show filters button since we have sidebar
              showSorting={true} // Show sorting toolbar buttons
              showViewToggle={true}
              onSortChange={handleFilterChange} // Pass filter change handler
              currentSort={filters.sort} // Pass current sort for highlighting
              useLocalSorting={false} // Use API sorting, not local sorting
            />
          )}

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={
                        page === meta.current_page ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
