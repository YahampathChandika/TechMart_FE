// app/(customer)/products/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/customer/ProductGrid";
import { SearchFilters } from "@/components/customer/SearchFilters";
import { LoadingSpinner, ErrorMessage } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { useProducts, useProductSearch } from "@/hooks/useProducts";

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
    in_stock: searchParams.get("in_stock") === "true",
    sort: searchParams.get("sort") || "name",
    per_page: 12,
  });

  // Use products hook with current filters
  const {
    products,
    loading,
    error,
    meta,
    filters: availableFilters,
    refresh,
  } = useProducts(filters);

  // Handle search
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      setFilters((prev) => ({ ...prev, search: searchQuery }));
    },
    [searchQuery]
  );

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

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
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Filter panel */}
          <div
            className={`${showFilters ? "block" : "hidden"} lg:block space-y-6`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>

            <SearchFilters
              filters={filters}
              availableFilters={availableFilters}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Products Content */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              {loading ? (
                <p className="text-muted-foreground">Loading products...</p>
              ) : meta ? (
                <p className="text-muted-foreground">
                  Showing {meta.from}-{meta.to} of {meta.total} products
                </p>
              ) : null}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Sort by:</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
                className="px-3 py-1 border rounded-md text-sm"
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
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Search className="mx-auto h-16 w-16 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters
                  ? "Try adjusting your filters to see more results."
                  : "No products are currently available."}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <ProductGrid
                products={products}
                showToolbar={true}
                showSorting={false} // We have our own sorting above
              />

              {/* Pagination */}
              {meta && meta.last_page > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(meta.current_page - 1)}
                      disabled={meta.current_page === 1}
                    >
                      Previous
                    </Button>

                    {[...Array(meta.last_page)].map((_, index) => {
                      const page = index + 1;
                      const isCurrentPage = page === meta.current_page;
                      const shouldShow =
                        page === 1 ||
                        page === meta.last_page ||
                        (page >= meta.current_page - 2 &&
                          page <= meta.current_page + 2);

                      if (!shouldShow) {
                        if (
                          page === meta.current_page - 3 ||
                          page === meta.current_page + 3
                        ) {
                          return (
                            <span key={page} className="px-2">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <Button
                          key={page}
                          variant={isCurrentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(meta.current_page + 1)}
                      disabled={meta.current_page === meta.last_page}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
