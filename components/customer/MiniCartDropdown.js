// components/customer/MiniCartDropdown.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItemCompact } from "./CartItem";
import { MiniCartSummary } from "./CartSummary";
import { useCart } from "@/hooks";
import { cn } from "@/lib/utils";

export const MiniCartDropdown = ({ isOpen, onClose, className = "" }) => {
  const { cartItems, getCartWithProducts, getCartStats } = useCart();
  const cartWithProducts = getCartWithProducts();
  const stats = getCartStats();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose} />

      {/* Dropdown */}
      <div
        className={cn(
          "absolute right-0 mt-2 w-80 bg-background border rounded-lg shadow-lg z-50",
          "max-h-[80vh] flex flex-col",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Shopping Cart ({stats.itemCount})
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        {cartWithProducts.length === 0 ? (
          /* Empty Cart */
          <div className="p-6 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <h4 className="font-medium mb-2">Your cart is empty</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Add some products to get started!
            </p>
            <Link href="/products" onClick={onClose}>
              <Button size="sm" className="w-full">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          /* Cart Items */
          <div className="flex flex-col min-h-0">
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-64">
              {cartWithProducts.slice(0, 5).map((cartItem) => (
                <CartItemCompact
                  key={cartItem.product_id}
                  cartItem={cartItem}
                />
              ))}

              {cartWithProducts.length > 5 && (
                <div className="text-center py-2 text-sm text-muted-foreground">
                  + {cartWithProducts.length - 5} more items
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="border-t">
              <MiniCartSummary />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Hook to manage mini cart state
export const useMiniCart = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(!isOpen);

  return {
    isOpen,
    openCart,
    closeCart,
    toggleCart,
  };
};
