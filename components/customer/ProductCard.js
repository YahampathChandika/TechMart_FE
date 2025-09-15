// components/customer/ProductCard.js
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useCart } from "@/hooks";
import { cn } from "@/lib/utils";
import { InlineLoadingSpinner } from "@/components/common";

export const ProductCard = ({
  product,
  className = "",
  showAddToCart = true,
  size = "default", // "default", "compact", "large"
}) => {
  const { isCustomer } = useAuth();
  const { addToCart, isInCart, getProductQuantityInCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();

    if (!isCustomer()) return;

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
          {!imageError ? (
            <Image
              src={product.image_path}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <div className="text-center">
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No Image</p>
              </div>
            </div>
          )}

          {/* Stock Badge */}
          {product.quantity === 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              Out of Stock
            </div>
          )}

          {/* Low Stock Badge */}
          {product.quantity > 0 && product.quantity <= 5 && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
              Low Stock
            </div>
          )}

          {/* Wishlist Button (Future feature) */}
          <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-sm text-muted-foreground font-medium mb-1">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mb-3">{renderStars(product.rating)}</div>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">
                ${product.sell_price}
              </span>
              {product.cost_price !== product.sell_price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.cost_price}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {product.quantity > 0 ? (
                  <>
                    <span className="text-green-600 font-medium">In Stock</span>
                    <br />
                    <span className="text-xs">
                      ({product.quantity} available)
                    </span>
                  </>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </p>
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
      {showAddToCart && isCustomer() && (
        <div className="absolute bottom-4 left-4 right-4">
          {product.quantity > 0 ? (
            <Button
              onClick={handleAddToCart}
              disabled={adding}
              size="sm"
              className="w-full"
              variant={inCart ? "outline" : "default"}
            >
              {adding ? (
                <>
                  <InlineLoadingSpinner className="mr-2" />
                  Adding...
                </>
              ) : inCart ? (
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

      {/* Quick View Button (Future feature) */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="outline" className="p-2">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Compact version for lists
export const ProductCardCompact = ({ product, className = "" }) => (
  <ProductCard product={product} size="compact" className={className} />
);

// Large version for featured products
export const ProductCardLarge = ({ product, className = "" }) => (
  <ProductCard product={product} size="large" className={className} />
);
