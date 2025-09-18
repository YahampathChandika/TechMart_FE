// components/customer/MiniCartDropdown.js
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

export const MiniCartDropdown = ({ onClose, className = "" }) => {
  const { cartItems, cartTotals, updateCartItem, removeFromCart } = useCart();
  const [imageErrors, setImageErrors] = useState({});

  const items = Array.isArray(cartItems) ? cartItems : [];

  // Helper function to format image URL
  const formatImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("storage/")) {
      return `http://localhost:8000/${url}`;
    }
    if (url.startsWith("/")) return url;
    return `/${url}`;
  };

  const handleImageError = (itemId) => {
    setImageErrors((prev) => ({
      ...prev,
      [itemId]: true,
    }));
  };

  if (items.length === 0) {
    return (
      <div
        className={cn(
          "p-4 w-60 text-center bg-background backdrop-blur rounded-lg",
          className
        )}
      >
        <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div
      className={cn("w-80 bg-background backdrop-blur rounded-lg", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Shopping Cart</h3>
        <Badge variant="secondary">{cartTotals.itemCount} items</Badge>
      </div>

      {/* Cart Items */}
      <div className="max-h-64 overflow-y-auto">
        {items.map((item) => {
          const imageUrl = formatImageUrl(
            item.product?.image_url || item.product?.image_path
          );
          const hasImageError = imageErrors[item.id];

          return (
            <div key={item.id} className="p-4 border-b">
              <div className="flex items-start space-x-3">
                {/* Product Image */}
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {!hasImageError && imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.product?.name || "Product"}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                      onError={() => handleImageError(item.id)}
                    />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium truncate flex justify-between gap-2">
                    {item.product?.name || `Product ${item.product_id}`}
                    <Badge variant="secondary">{item.quantity}</Badge>
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {item.product?.brand || "Unknown Brand"}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    ${parseFloat(item.product?.sell_price || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        {/* Totals */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${cartTotals.subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping:</span>
            <span>${cartTotals.shipping}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span className="text-primary">${cartTotals.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const useMiniCart = () => {
  const { cartItems, cartTotals } = useCart();

  return {
    items: Array.isArray(cartItems) ? cartItems : [],
    itemCount: cartTotals.itemCount,
    total: cartTotals.total,
    hasItems: Array.isArray(cartItems) && cartItems.length > 0,
  };
};
