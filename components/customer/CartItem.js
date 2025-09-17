// components/customer/CartItem.js
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, Heart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { InlineLoadingSpinner } from "@/components/common";

export const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart, loading } = useCart();
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [imageError, setImageError] = useState(false);

  const product = item.product;
  const isOutOfStock = product?.quantity === 0;
  const exceedsStock = item.quantity > (product?.quantity || 0);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(true);
    try {
      await updateCartItem(item.id, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await removeFromCart(item.id);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setRemoving(false);
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted">
        <p className="text-muted-foreground">Product not found</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={removing}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-card">
      {/* Product Image */}
      <div className="w-full sm:w-32 h-32 flex-shrink-0">
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-muted">
          {!imageError && product.image_path ? (
            <Image
              src={product.image_path}
              alt={product.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div className="flex-1">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-muted-foreground mb-2">{product.brand}</p>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-primary">
                ${parseFloat(product.sell_price).toFixed(2)}
              </span>
              {product.cost_price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${parseFloat(product.cost_price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-4">
              {isOutOfStock ? (
                <Badge variant="destructive">Out of Stock</Badge>
              ) : exceedsStock ? (
                <Badge variant="destructive">Exceeds Available Stock</Badge>
              ) : product.quantity <= 10 ? (
                <Badge variant="secondary">
                  Low Stock ({product.quantity} left)
                </Badge>
              ) : (
                <Badge variant="outline" className="text-green-600">
                  In Stock ({product.quantity} available)
                </Badge>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1 || updating || loading}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <div className="px-3 py-1 min-w-[3rem] text-center">
                  {updating ? (
                    <InlineLoadingSpinner className="h-4 w-4" />
                  ) : (
                    item.quantity
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={
                    item.quantity >= (product.quantity || 0) ||
                    updating ||
                    loading
                  }
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={removing || loading}
                  className="text-red-600 hover:text-red-700"
                >
                  {removing ? (
                    <InlineLoadingSpinner className="h-4 w-4" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Item Total */}
          <div className="text-right">
            <p className="text-lg font-semibold">
              ${(parseFloat(product.sell_price) * item.quantity).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              ${parseFloat(product.sell_price).toFixed(2)} each
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact version for mini cart
export const CartItemCompact = ({ item, onClose }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const product = item.product;

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(item.id);
    } else {
      await updateCartItem(item.id, newQuantity);
    }
    onClose?.();
  };

  if (!product) return null;

  return (
    <div className="flex items-center gap-3 p-3 border-b">
      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
        <Package className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate text-sm">{product.name}</h4>
        <p className="text-xs text-muted-foreground">{product.brand}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-medium">
            ${parseFloat(product.sell_price).toFixed(2)}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="h-5 w-5 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-xs w-6 text-center">{item.quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="h-5 w-5 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
