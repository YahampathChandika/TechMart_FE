// components/customer/SearchFilters.js
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Package } from "lucide-react";

export const SearchFilters = ({
  filters = {},
  availableFilters = {},
  onChange,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  // Handle price range changes
  const handlePriceChange = (values) => {
    const newFilters = {
      ...localFilters,
      min_price: values[0],
      max_price: values[1],
    };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  // Get price range bounds
  const minPrice = availableFilters?.price_range?.min || 0;
  const maxPrice = availableFilters?.price_range?.max || 1000;
  const currentMinPrice = localFilters.min_price || minPrice;
  const currentMaxPrice = localFilters.max_price || maxPrice;

  return (
    <div className="space-y-6">
      {/* Brand Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Brand</Label>
        <Select
          value={localFilters.brand || ""}
          onValueChange={(value) => handleFilterChange("brand", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem>All Brands</SelectItem>
            {availableFilters?.brands?.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Price Range</Label>
        <div className="px-2">
          <Slider
            value={[currentMinPrice, currentMaxPrice]}
            onValueChange={handlePriceChange}
            min={minPrice}
            max={maxPrice}
            step={10}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${currentMinPrice}</span>
            <span>${currentMaxPrice}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Min Price</Label>
            <Input
              type="number"
              value={currentMinPrice}
              onChange={(e) =>
                handleFilterChange(
                  "min_price",
                  parseFloat(e.target.value) || minPrice
                )
              }
              min={minPrice}
              max={maxPrice}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Max Price</Label>
            <Input
              type="number"
              value={currentMaxPrice}
              onChange={(e) =>
                handleFilterChange(
                  "max_price",
                  parseFloat(e.target.value) || maxPrice
                )
              }
              min={minPrice}
              max={maxPrice}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Minimum Rating</Label>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`rating-${rating}`}
                name="rating"
                value={rating}
                checked={localFilters.rating == rating}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
                className="w-4 h-4"
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="flex items-center space-x-1 cursor-pointer"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm">& Up</span>
              </Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="rating-all"
              name="rating"
              value=""
              checked={!localFilters.rating}
              onChange={() => handleFilterChange("rating", "")}
              className="w-4 h-4"
            />
            <Label htmlFor="rating-all" className="cursor-pointer text-sm">
              All Ratings
            </Label>
          </div>
        </div>
      </div>

      {/* Stock Status Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Availability</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={localFilters.in_stock || false}
              onCheckedChange={(checked) =>
                handleFilterChange("in_stock", checked)
              }
            />
            <Label
              htmlFor="in-stock"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4 text-green-600" />
              <span className="text-sm">In Stock Only</span>
            </Label>
          </div>
        </div>
      </div>

      {/* Category Filter (if available) */}
      {availableFilters?.categories &&
        availableFilters.categories.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Category</Label>
            <Select
              value={localFilters.category || ""}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem>All Categories</SelectItem>
                {availableFilters.categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

      {/* Clear Filters Button */}
      <Button variant="outline" onClick={() => onChange({})} className="w-full">
        Clear All Filters
      </Button>
    </div>
  );
};
