// components/customer/ProductGrid.js
"use client";

import { useState } from "react";
import { Grid, List, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard, ProductCardCompact } from "./ProductCard";
import { LoadingSpinner, ErrorMessage } from "@/components/common";
import { cn } from "@/lib/utils";

export const ProductGrid = ({
  products = [],
  loading = false,
  error = null,
  className = "",
  showFilters = true,
  showSorting = true,
  showViewToggle = true,
  onFilterToggle = null,
  onSortChange = null, // New prop for handling sort changes
  currentSort = null, // Current sort value from parent
  defaultView = "grid",
  useLocalSorting = false, // Flag to enable local sorting for some use cases
}) => {
  const [viewMode, setViewMode] = useState(defaultView);

  // Local sorting state (only used when useLocalSorting is true)
  const [localSortBy, setLocalSortBy] = useState("name");
  const [localSortOrder, setLocalSortOrder] = useState("asc");

  // Determine which products to display
  const displayProducts = useLocalSorting ? getLocalSortedProducts() : products;

  // Local sorting function (only used when useLocalSorting is true)
  function getLocalSortedProducts() {
    return [...products].sort((a, b) => {
      let comparison = 0;

      switch (localSortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.sell_price - b.sell_price;
          break;
        case "rating":
          comparison = b.rating - a.rating;
          break;
        case "brand":
          comparison = a.brand.localeCompare(b.brand);
          break;
        case "newest":
          comparison = new Date(b.created_at) - new Date(a.created_at);
          break;
        default:
          comparison = 0;
      }

      return localSortOrder === "asc" ? comparison : -comparison;
    });
  }

  // Handle sort changes
  const handleSortChange = (sortKey) => {
    if (useLocalSorting) {
      // Handle local sorting
      if (localSortBy === sortKey) {
        setLocalSortOrder(localSortOrder === "asc" ? "desc" : "asc");
      } else {
        setLocalSortBy(sortKey);
        setLocalSortOrder("asc");
      }
    } else if (onSortChange) {
      // Handle API sorting - map to API sort values
      const sortMapping = {
        name: "name",
        price: "price_low", // Default to low to high, could be toggled
        rating: "rating",
        newest: "newest",
      };

      let apiSortValue = sortMapping[sortKey];

      // Toggle price sorting between low and high
      if (sortKey === "price") {
        if (currentSort === "price_low") {
          apiSortValue = "price_high";
        } else {
          apiSortValue = "price_low";
        }
      }

      onSortChange({ sort: apiSortValue });
    }
  };

  // Get current sort state for display
  const getCurrentSortState = () => {
    if (useLocalSorting) {
      return { sortBy: localSortBy, sortOrder: localSortOrder };
    } else {
      // Map API sort values back to local keys for display
      const apiToLocal = {
        name: { sortBy: "name", sortOrder: "asc" },
        price_low: { sortBy: "price", sortOrder: "asc" },
        price_high: { sortBy: "price", sortOrder: "desc" },
        rating: { sortBy: "rating", sortOrder: "desc" },
        newest: { sortBy: "newest", sortOrder: "desc" },
      };
      return apiToLocal[currentSort] || { sortBy: null, sortOrder: "asc" };
    }
  };

  const { sortBy, sortOrder } = getCurrentSortState();

  if (loading) {
    return (
      <div className={cn("", className)}>
        <LoadingSpinner size="lg" text="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("", className)}>
        <ErrorMessage
          title="Failed to load products"
          message={error}
          variant="destructive"
        />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="mx-auto max-w-md">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Grid className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or browse all products.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Toolbar */}
      {(showFilters || showSorting || showViewToggle) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-muted/50 rounded-lg">
          {/* Left side - Filters */}
          <div className="flex items-center gap-2">
            {showFilters && onFilterToggle && (
              <Button
                variant="outline"
                size="sm"
                onClick={onFilterToggle}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            )}

            <div className="text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? "product" : "products"}{" "}
              found
            </div>
          </div>

          {/* Right side - Sorting and View Toggle */}
          <div className="flex items-center gap-2">
            {/* Sorting */}
            {/* {showSorting && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Sort by:
                </span>
                <div className="flex gap-1">
                  {[
                    { key: "name", label: "Name" },
                    { key: "price", label: "Price" },
                    { key: "rating", label: "Rating" },
                    { key: "newest", label: "Newest" },
                  ].map(({ key, label }) => (
                    <Button
                      key={key}
                      variant={sortBy === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSortChange(key)}
                      className="flex items-center gap-1"
                      disabled={!useLocalSorting && !onSortChange}
                    >
                      {label}
                      {sortBy === key && (
                        <ArrowUpDown
                          className={cn(
                            "h-3 w-3 transition-transform",
                            sortOrder === "desc" && "rotate-180"
                          )}
                        />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )} */}

            {/* View Toggle */}
            {showViewToggle && (
              <div className="flex gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="p-2"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="p-2"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="mx-auto"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="sm:w-48 flex-shrink-0">
                <ProductCardCompact product={product} showAddToCart={false} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-muted-foreground">{product.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${product.cost_price}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Simplified version without toolbar (uses local sorting)
export const SimpleProductGrid = ({ products, className = "" }) => (
  <div
    className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      className
    )}
  >
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);

// Featured products grid (uses local sorting)
export const FeaturedProductGrid = ({ products, className = "" }) => (
  <div
    className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
      className
    )}
  >
    {products.map((product) => (
      <ProductCard key={product.id} product={product} size="large" />
    ))}
  </div>
);
