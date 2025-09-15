// components/customer/CartItem.js
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks";
import { cn } from "@/lib/utils";
import { InlineLoadingSpinner } from "@/components/common";
import { useConfirmDialog, DeleteConfirmDialog } from "@/components/common";

export const CartItem = ({
  cartItem,
  className = "",
  showRemoveButton = true,
  showMoveToWishlist = true,
}) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [updating, setUpdating] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    isOpen: showDeleteConfirm,
    loading: removing,
    openDialog,
    closeDialog,
    confirmAction,
  } = useConfirmDialog();

  const { product, quantity } = cartItem;

  if (!product) {
    return null; // Product not found or deleted
  }

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity === quantity || updating) return;

    setUpdating(true);
    try {
      if (newQuantity <= 0) {
        await handleRemove();
      } else {
        await updateQuantity(product.id, newQuantity);
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      removeFromCart(product.id);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleRemoveClick = () => {
    openDialog(handleRemove);
  };

  const itemTotal = product.sell_price * quantity;
  const isOutOfStock = product.quantity === 0;
  const exceedsStock = quantity > product.quantity;

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-3 w-3",
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
      <div
        className={cn(
          "flex flex-col sm:flex-row gap-4 p-4 border rounded-lg",
          (isOutOfStock || exceedsStock) &&
            "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800",
          className
        )}
      >
        {/* Product Image */}
        <div className="w-full sm:w-24 h-24 flex-shrink-0">
          <Link href={`/products/${product.id}`}>
            <div className="relative w-full h-full overflow-hidden rounded-md bg-muted border">
              {!imageError ? (
                <Image
                  src={product.image_path}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                  onError={() => setImageError(true)}
                  sizes="96px"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-1 h-6 w-6 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                      <Star className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">No Image</p>
                  </div>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <Link href={`/products/${product.id}`}>
                <p className="text-sm text-muted-foreground">{product.brand}</p>
                <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center gap-2 mt-1">
                {renderStars(product.rating)}
                <span className="text-xs text-muted-foreground">
                  ({product.rating})
                </span>
              </div>

              {/* Stock Status */}
              <div className="mt-2">
                {isOutOfStock ? (
                  <p className="text-sm text-red-600 font-medium">
                    Out of Stock
                  </p>
                ) : exceedsStock ? (
                  <p className="text-sm text-red-600 font-medium">
                    Only {product.quantity} available
                  </p>
                ) : product.quantity <= 5 ? (
                  <p className="text-sm text-orange-600">
                    Only {product.quantity} left in stock
                  </p>
                ) : (
                  <p className="text-sm text-green-600">In Stock</p>
                )}
              </div>
            </div>

            {/* Price and Controls */}
            <div className="flex flex-col sm:items-end gap-3">
              {/* Price */}
              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  ${itemTotal.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  ${product.sell_price} each
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={updating || quantity <= 1}
                    className="p-2 h-8 w-8"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <div className="flex items-center justify-center min-w-[2.5rem] px-2 text-sm font-medium">
                    {updating ? <InlineLoadingSpinner /> : quantity}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={updating || quantity >= product.quantity}
                    className="p-2 h-8 w-8"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1">
                  {showMoveToWishlist && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-8 w-8"
                      title="Move to Wishlist"
                    >
                      <Heart className="h-3 w-3" />
                    </Button>
                  )}

                  {showRemoveButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveClick}
                      disabled={removing}
                      className="p-2 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Remove from Cart"
                    >
                      {removing ? (
                        <InlineLoadingSpinner />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Warning Messages */}
          {exceedsStock && (
            <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-300">
              <p>
                <strong>Stock limit exceeded:</strong> Only {product.quantity}{" "}
                available. Quantity will be adjusted during checkout.
              </p>
            </div>
          )}

          {isOutOfStock && (
            <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-300">
              <p>
                <strong>Item unavailable:</strong> This product is currently out
                of stock. Remove from cart or check back later.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={closeDialog}
        onConfirm={confirmAction}
        loading={removing}
        itemName={product.name}
        itemType="item from cart"
      />
    </>
  );
};

// Compact version for mini cart or checkout summary
export const CartItemCompact = ({ cartItem, className = "" }) => {
  const { product, quantity } = cartItem;

  if (!product) return null;

  const itemTotal = product.sell_price * quantity;

  return (
    <div className={cn("flex items-center gap-3 py-2", className)}>
      <div className="w-12 h-12 flex-shrink-0">
        <div className="relative w-full h-full overflow-hidden rounded bg-muted border">
          <Image
            src={product.image_path}
            alt={product.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
        <p className="text-xs text-muted-foreground">{product.brand}</p>
        <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
      </div>

      <div className="text-right">
        <p className="font-medium text-sm">${itemTotal.toFixed(2)}</p>
      </div>
    </div>
  );
};
