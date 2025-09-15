// components/customer/SearchFilters.js
"use client";

import { useState, useEffect } from "react";
import { Search, X, Star, DollarSign, Package, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getUniqueBrands } from "@/lib/mockData";
import { PRICE_RANGES, RATING_OPTIONS } from "@/lib/constants";

export const SearchFilters = ({
  onFiltersChange,
  initialFilters = {},
  className = "",
  isOpen = false,
  onToggle = null,
}) => {
  const [filters, setFilters] = useState({
    search: "",
    brands: [],
    priceRange: null,
    minRating: null,
    inStock: false,
    ...initialFilters,
  });

  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const brands = getUniqueBrands();

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleBrand = (brand) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      brands: [],
      priceRange: null,
      minRating: null,
      inStock: false,
    };
    setFilters(clearedFilters);
    setSearchTerm("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter("search", searchTerm);
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.brands.length > 0 ||
      filters.priceRange ||
      filters.minRating ||
      filters.inStock
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {onToggle && (
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters() && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                {[
                  filters.search && 1,
                  filters.brands.length,
                  filters.priceRange && 1,
                  filters.minRating && 1,
                  filters.inStock && 1,
                ]
                  .filter(Boolean)
                  .reduce((sum, val) => sum + val, 0)}
              </span>
            )}
          </Button>
        </div>
      )}

      {/* Filters Panel */}
      <div
        className={cn(
          "space-y-6 p-6 bg-background border rounded-lg",
          "lg:block",
          !isOpen && "hidden lg:block",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </h3>
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Products
          </label>
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description..."
                className="w-full h-9 px-3 py-1 pr-10 text-sm border border-input rounded-md bg-background"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    updateFilter("search", "");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" size="sm" className="w-full">
              Search
            </Button>
          </form>
        </div>

        {/* Brands */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Package className="h-4 w-4" />
            Brands
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="h-4 w-4 rounded border-input"
                />
                <span className="text-sm">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Price Range
          </label>
          <div className="space-y-2">
            {PRICE_RANGES.map((range, index) => (
              <label
                key={index}
                className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-1 rounded"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.priceRange === range}
                  onChange={() => updateFilter("priceRange", range)}
                  className="h-4 w-4"
                />
                <span className="text-sm">{range.label}</span>
              </label>
            ))}
            {filters.priceRange && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilter("priceRange", null)}
                className="text-xs text-muted-foreground"
              >
                Clear price filter
              </Button>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4" />
            Minimum Rating
          </label>
          <div className="space-y-2">
            {RATING_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-1 rounded"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === option.value}
                  onChange={() => updateFilter("minRating", option.value)}
                  className="h-4 w-4"
                />
                <div className="flex items-center space-x-2">
                  {renderStars(option.value)}
                  <span className="text-sm ml-2">& up</span>
                </div>
              </label>
            ))}
            {filters.minRating && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilter("minRating", null)}
                className="text-xs text-muted-foreground"
              >
                Clear rating filter
              </Button>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Availability</label>
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-1 rounded">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => updateFilter("inStock", e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <span className="text-sm">In Stock Only</span>
          </label>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters() && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  Search: "{filters.search}"
                  <button
                    onClick={() => updateFilter("search", "")}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {filters.brands.map((brand) => (
                <span
                  key={brand}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                >
                  {brand}
                  <button
                    onClick={() => toggleBrand(brand)}
                    className="hover:bg-blue-200 dark:hover:bg-blue-800/40 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}

              {filters.priceRange && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full">
                  {filters.priceRange.label}
                  <button
                    onClick={() => updateFilter("priceRange", null)}
                    className="hover:bg-green-200 dark:hover:bg-green-800/40 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {filters.minRating && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">
                  {filters.minRating}+ Stars
                  <button
                    onClick={() => updateFilter("minRating", null)}
                    className="hover:bg-yellow-200 dark:hover:bg-yellow-800/40 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {filters.inStock && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                  In Stock
                  <button
                    onClick={() => updateFilter("inStock", false)}
                    className="hover:bg-purple-200 dark:hover:bg-purple-800/40 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
