// app/(customer)/cart/page.js
"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft, Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/customer/CartItem";
import { CartSummary } from "@/components/customer/CartSummary";
import { CustomerGuard } from "@/components/auth/AuthGuard";
import { SimpleProductGrid } from "@/components/customer/ProductGrid";
import { useCart } from "@/hooks";
import { useConfirmDialog, DeleteConfirmDialog } from "@/components/common";
import { getActiveProducts } from "@/lib/mockData";

function CartPageContent() {
  const { cartItems, getCartWithProducts, clearCart } = useCart();
  const cartWithProducts = getCartWithProducts();

  const {
    isOpen: showClearConfirm,
    loading: clearing,
    openDialog,
    closeDialog,
    confirmAction,
  } = useConfirmDialog();

  // Get recommended products (highest rated available products not in cart)
  const recommendedProducts = getActiveProducts()
    .filter(
      (product) =>
        product.rating >= 4 &&
        product.quantity > 0 &&
        !cartItems.some((item) => item.product_id === product.id)
    )
    .slice(0, 4);

  const handleClearCart = async () => {
    try {
      clearCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const handleClearCartClick = () => {
    openDialog(handleClearCart);
  };

  if (cartWithProducts.length === 0) {
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
              Looks like you haven't added any items to your cart yet.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/products">
              <Button className="w-full flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Start Shopping
              </Button>
            </Link>

            <Link href="/search">
              <Button variant="outline" className="w-full">
                Browse Categories
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
              {cartWithProducts.length}{" "}
              {cartWithProducts.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          {cartWithProducts.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Heart className="h-4 w-4" />
                Save for Later
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCartClick}
                disabled={clearing}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartWithProducts.map((cartItem) => (
            <CartItem
              key={cartItem.product_id}
              cartItem={cartItem}
              showRemoveButton={true}
              showMoveToWishlist={true}
            />
          ))}

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium mb-1">Need help?</h3>
              <p className="text-sm text-muted-foreground">
                Have questions about your items? Contact our support team.
              </p>
            </div>
            <div className="flex gap-2">
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
              Based on what's in your cart
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
