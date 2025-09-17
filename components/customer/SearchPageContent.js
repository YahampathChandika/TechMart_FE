// components/customer/SearchPageContent.js
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/customer/ProductGrid";
import { SearchFilters } from "@/components/customer/SearchFilters";
import { LoadingSpinner, ErrorMessage } from "@/components/common";
import { useProducts } from "@/hooks/useProducts";
import { useBrands, useFilterOptions } from "@/hooks/useBrands";

export function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";
  const initialCategory = searchParams?.get("category") || "";

  const [filters, setFilters] = useState({
    search: initialQuery,
    brand: initialCategory || "",
    min_price: "",
    max_price: "",
    rating: "",
    in_stock: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Fetch brands and filter options
  const { brands, loading: brandsLoading } = useBrands();
  const { filterOptions, loading: filtersLoading } = useFilterOptions();

  // Fetch products with current filters
  const {
    products: filteredProducts,
    loading: productsLoading,
    error: productsError,
    meta,
    refresh,
  } = useProducts(filters);

  // Get trending products (highest rated products)
  const { products: trendingProducts, loading: trendingLoading } = useProducts({
    rating: 4,
    sort: "-rating",
    per_page: 3,
  });

  // Popular search terms
  const popularSearches = [
    "iPhone",
    "MacBook",
    "Samsung",
    "Gaming",
    "Headphones",
    "Laptop",
  ];

  // Prepare available filters for SearchFilters component
  const availableFilters = {
    brands: brands || [],
    price_range: filterOptions?.price_range || { min: 0, max: 1000 },
    rating_range: filterOptions?.rating_range || { min: 1, max: 5 },
    categories: filterOptions?.categories || [],
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      search: searchQuery,
    }));
  };

  const handlePopularSearch = (term) => {
    setSearchQuery(term);
    setFilters((prev) => ({
      ...prev,
      search: term,
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const hasSearchQuery =
    filters.search ||
    filters.brand ||
    filters.min_price ||
    filters.max_price ||
    filters.rating ||
    filters.in_stock;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Products</h1>
        <p className="text-muted-foreground">
          Find exactly what you&apos;re looking for with our advanced search and
          filtering options
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands, or categories..."
              className="w-full h-12 pl-10 pr-4 text-lg border border-input rounded-md bg-background"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="px-8"
            disabled={productsLoading}
          >
            Search
          </Button>
        </form>
      </div>

      {/* Show content based on whether there's a search */}
      {!hasSearchQuery ? (
        /* No Search - Show Discovery Content */
        <div className="space-y-12">
          {/* Popular Searches */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Popular Searches</h2>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePopularSearch(term)}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-3 w-3" />
                  {term}
                </Button>
              ))}
            </div>
          </section>

          {/* Browse by Brand */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Browse by Brand</h2>
            {brandsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : brands && brands.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {brands.map((brand) => (
                  <Button
                    key={brand}
                    variant="outline"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, brand: brand }))
                    }
                    className="h-16 text-sm"
                  >
                    {brand}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No brands available</p>
            )}
          </section>

          {/* Trending Products */}
          <section>
            <h2 className="text-xl font-semibold mb-6">Trending Now</h2>
            {trendingLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : trendingProducts && trendingProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trendingProducts.map((product) => (
                  <div key={product.id} className="group relative">
                    <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Trending
                      </div>
                      <div className="text-center p-4">
                        <h3 className="font-semibold mb-2">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.brand}
                        </p>
                        <p className="text-lg font-bold text-primary">
                          ${product.sell_price}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePopularSearch(product.name)}
                      className="w-full"
                    >
                      Search Similar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No trending products available
              </p>
            )}
          </section>
        </div>
      ) : (
        /* Search Results */
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-4">
              {brandsLoading || filtersLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <SearchFilters
                  filters={filters}
                  availableFilters={availableFilters}
                  onChange={handleFiltersChange}
                  className="sticky top-4"
                />
              )}
            </div>
          </aside>

          {/* Search Results */}
          <main className="flex-1">
            {/* Search Summary */}
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">
                Search Results
                {filters.search && (
                  <span className="ml-2 font-normal text-muted-foreground">
                    for &quot;{filters.search}&quot;
                  </span>
                )}
              </h2>
              <p className="text-sm text-muted-foreground">
                {productsLoading
                  ? "Loading products..."
                  : `${
                      meta?.total || filteredProducts?.length || 0
                    } products found`}
              </p>
            </div>

            {/* Products Display */}
            {productsError ? (
              <ErrorMessage
                title="Failed to load products"
                message={productsError}
                variant="destructive"
                action={{
                  label: "Try Again",
                  onClick: refresh,
                }}
              />
            ) : (
              <ProductGrid
                products={filteredProducts}
                loading={productsLoading}
                error={productsError}
                showFilters={true}
                showSorting={true}
                showViewToggle={true}
                onFilterToggle={toggleFilters}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}
