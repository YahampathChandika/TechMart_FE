// components/customer/AddToCartButton.js
"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useCart } from "@/hooks";
import { cn } from "@/lib/utils";
import { InlineLoadingSpinner } from "@/components/common";

export const AddToCartButton = ({
  product,
  quantity = 1,
  variant = "default",
  size = "default",
  className = "",
  showQuantityInCart = true,
  disabled = false,
  children = null,
  onSuccess = null,
  onError = null,
}) => {
  const { isCustomer } = useAuth();
  const { addToCart, isInCart, getProductQuantityInCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const inCart = isInCart(product.id);
  const cartQuantity = getProductQuantityInCart(product.id);
  const isOutOfStock = product.quantity === 0;
  const exceedsStock = quantity > product.quantity;

  const handleAddToCart = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!isCustomer() || disabled || adding || isOutOfStock || exceedsStock) {
      return;
    }

    setAdding(true);

    try {
      const result = await addToCart(product.id, quantity);

      if (result.success) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);

        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        if (onError) {
          onError(result);
        }
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      if (onError) {
        onError({ success: false, error: error.message });
      }
    } finally {
      setAdding(false);
    }
  };

  // If user is not a customer, don't show the button
  if (!isCustomer()) {
    return null;
  }

  // Custom content override
  if (children) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleAddToCart}
        disabled={disabled || adding || isOutOfStock || exceedsStock}
        className={className}
      >
        {children}
      </Button>
    );
  }

  // Out of stock state
  if (isOutOfStock) {
    return (
      <Button
        variant="secondary"
        size={size}
        disabled
        className={cn("cursor-not-allowed", className)}
      >
        Out of Stock
      </Button>
    );
  }

  // Exceeds stock state
  if (exceedsStock) {
    return (
      <Button
        variant="destructive"
        size={size}
        disabled
        className={cn("cursor-not-allowed", className)}
      >
        Not Enough Stock
      </Button>
    );
  }

  // Just added state
  if (justAdded) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        className={cn("border-green-500 text-green-600", className)}
      >
        <Check className="h-4 w-4 mr-2" />
        Added to Cart!
      </Button>
    );
  }

  // Adding state
  if (adding) {
    return (
      <Button variant={variant} size={size} disabled className={className}>
        <InlineLoadingSpinner className="mr-2" />
        Adding...
      </Button>
    );
  }

  // Already in cart state
  if (inCart && showQuantityInCart) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={handleAddToCart}
        className={cn(
          "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
          className
        )}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        In Cart ({cartQuantity})
      </Button>
    );
  }

  // Default add to cart state
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      disabled={disabled}
      className={className}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      Add to Cart
    </Button>
  );
};

// Quick add button with plus icon (for product grids)
export const QuickAddButton = ({ product, className = "" }) => (
  <AddToCartButton
    product={product}
    variant="outline"
    size="sm"
    className={cn("p-2 h-8 w-8", className)}
    showQuantityInCart={false}
  >
    <Plus className="h-4 w-4" />
  </AddToCartButton>
);

// Compact add button for lists
export const CompactAddButton = ({ product, className = "" }) => (
  <AddToCartButton
    product={product}
    variant="outline"
    size="sm"
    className={cn("h-8", className)}
    showQuantityInCart={false}
  />
);
