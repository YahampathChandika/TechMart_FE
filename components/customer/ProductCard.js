// components/customer/ProductCard.js
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Eye, Heart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { InlineLoadingSpinner } from "@/components/common";

export const ProductCard = ({
  product,
  className = "",
  showAddToCart = true,
  size = "default", // "default", "compact", "large"
}) => {
  const { isCustomer } = useAuth();
  const {
    addToCart,
    isInCart,
    getProductQuantityInCart,
    loading: cartLoading,
  } = useCart();
  const [adding, setAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  console.log("ProductCard:", product);

  // Helper function to format image URL for Next.js Image component
  const formatImageUrl = (url) => {
    if (!url) return null;

    // If it's already an absolute URL, return as-is
    if (url.startsWith("http://") || url.startsWith("https://")) return url;

    // If it's a relative path from backend, convert to absolute URL
    if (url.startsWith("storage/")) {
      return `http://localhost:8000/${url}`;
    }

    // If it starts with a slash, it's already formatted for Next.js
    if (url.startsWith("/")) return url;

    // Default fallback - add leading slash
    return `/${url}`;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();

    if (!isCustomer()) {
      // Redirect to login page if not logged in
      window.location.href = "/login";
      return;
    }

    setAdding(true);
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAdding(false);
    }
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
        <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
      </div>
    );
  };

  const cardSizes = {
    compact: "w-full max-w-sm",
    default: "w-full max-w-sm",
    large: "w-full max-w-md",
  };

  const imageSizes = {
    compact: "h-40",
    default: "h-48",
    large: "h-64",
  };

  const inCart = isInCart(product.id);
  const cartQuantity = getProductQuantityInCart(product.id);
  const isOutOfStock = product.quantity === 0;

  // Get the properly formatted image URL
  const imageUrl = formatImageUrl(product.image_url || product.image_path);

  return (
    <div
      className={cn(
        "group relative rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
        cardSizes[size],
        className
      )}
    >
      <Link href={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div
          className={cn(
            "relative overflow-hidden rounded-t-lg bg-muted",
            imageSizes[size]
          )}
        >
          {!imageError && imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes={size === "large" ? "400px" : "300px"}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isOutOfStock && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
            {inCart && (
              <Badge variant="secondary" className="text-xs">
                In Cart ({cartQuantity})
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" className="p-2">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>

          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mb-2">{renderStars(product.rating)}</div>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-2xl font-bold text-primary">
                ${product.cost_price}
              </p>
              {product.sell_price && (
                <p className="text-sm text-muted-foreground line-through">
                  ${product.sell_price}
                </p>
              )}
            </div>
            <div className="text-right text-sm">
              <p
                className={cn(
                  "font-medium",
                  isOutOfStock ? "text-red-600" : "text-green-600"
                )}
              >
                {isOutOfStock ? "Out of Stock" : "In Stock"}
              </p>
              {!isOutOfStock && (
                <p className="text-muted-foreground">
                  {product.quantity} available
                </p>
              )}
            </div>
          </div>

          {/* Description Preview */}
          {size === "large" && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
      </Link>

      {/* Action Buttons */}
      {showAddToCart && (
        <div className="px-2 pb-4">
          {!isOutOfStock ? (
            <Button
              onClick={handleAddToCart}
              disabled={adding || cartLoading}
              size="sm"
              className="w-full"
              variant={inCart ? "outline" : "default"}
            >
              {adding ? (
                <>
                  <InlineLoadingSpinner className="mr-2" />
                  Adding...
                </>
              ) : inCart && isCustomer() ? (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  In Cart ({cartQuantity})
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          ) : (
            <Button disabled size="sm" className="w-full" variant="secondary">
              Out of Stock
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// Compact version for lists
export const ProductCardCompact = ({
  product,
  className = "",
  showAddToCart = true,
}) => (
  <ProductCard
    product={product}
    size="compact"
    className={className}
    showAddToCart={showAddToCart}
  />
);

// Large version for featured products
export const ProductCardLarge = ({
  product,
  className = "",
  showAddToCart = true,
}) => (
  <ProductCard
    product={product}
    size="large"
    className={className}
    showAddToCart={showAddToCart}
  />
);
