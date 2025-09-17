// app/(customer)/cart/page.js
"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft, Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/customer/CartItem";
import { CartSummary } from "@/components/customer/CartSummary";
import { CustomerGuard } from "@/components/auth/AuthGuard";
import { SimpleProductGrid } from "@/components/customer/ProductGrid";
import { useCart } from "@/contexts/CartContext";
import { useConfirmDialog, DeleteConfirmDialog } from "@/components/common";
import { useProducts } from "@/hooks/useProducts";

function CartPageContent() {
  const { cartItems, clearCart, cartTotals } = useCart();

  const {
    isOpen: showClearConfirm,
    loading: clearing,
    openDialog,
    closeDialog,
    confirmAction,
  } = useConfirmDialog();

  // Get recommended products
  const { products: recommendedProducts } = useProducts({
    rating: 4,
    in_stock: true,
    per_page: 4,
  });

  const items = Array.isArray(cartItems) ? cartItems : [];

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const handleClearCartClick = () => {
    openDialog(handleClearCart);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Empty Cart */}
        <div className="max-w-md mx-auto text-center py-16">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/products">
              <Button className="w-full flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Recommended Products for Empty Cart */}
        {recommendedProducts.length > 0 && (
          <section className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">You Might Like</h2>
              <p className="text-muted-foreground">
                Popular products from our customers
              </p>
            </div>
            <SimpleProductGrid products={recommendedProducts} />
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/products">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShoppingCart className="h-8 w-8" />
              Shopping Cart
            </h1>
            <p className="text-muted-foreground">
              {cartTotals.itemCount}{" "}
              {cartTotals.itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCartClick}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Clear Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-3">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-6 bg-muted/30 rounded-lg">
            <h3 className="font-semibold mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Shipping Information</h4>
                <p className="text-sm text-muted-foreground">
                  Free shipping on orders over $50. Standard delivery takes 2-3
                  business days.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Returns & Exchanges</h4>
                <p className="text-sm text-muted-foreground">
                  30-day return policy. Items must be in original condition.
                  Contact our support team.
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
              <Button variant="outline" size="sm">
                Live Chat
              </Button>
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <CartSummary showCheckoutButton={true} showBenefits={true} />
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <section className="mt-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">You might also like</h2>
            <p className="text-muted-foreground">
              Based on what&apos;s in your cart
            </p>
          </div>
          <SimpleProductGrid products={recommendedProducts} />
        </section>
      )}

      {/* Clear Cart Confirmation */}
      <DeleteConfirmDialog
        isOpen={showClearConfirm}
        onClose={closeDialog}
        onConfirm={confirmAction}
        loading={clearing}
        itemName="all items"
        itemType="from your cart"
      />
    </div>
  );
}

export default function CartPage() {
  return (
    <CustomerGuard>
      <CartPageContent />
    </CustomerGuard>
  );
}
