// components/customer/CartSummary.js
"use client";

import { ShoppingBag, CreditCard, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks";
import { cn } from "@/lib/utils";

export const CartSummary = ({
  className = "",
  showCheckoutButton = true,
  showBenefits = true,
  compact = false,
}) => {
  const { getCartStats, cartItems } = useCart();
  const stats = getCartStats();

  // Calculate additional fees
  const shipping = stats.subtotal >= 50 ? 0 : 9.99;
  const finalTotal = stats.subtotal + stats.tax + shipping;

  const benefits = [
    {
      icon: Truck,
      title: "Free Shipping",
      description:
        stats.subtotal >= 50
          ? "Qualified!"
          : `Spend $${(50 - stats.subtotal).toFixed(2)} more`,
      active: stats.subtotal >= 50,
    },
    {
      icon: Shield,
      title: "Secure Checkout",
      description: "SSL encrypted payment",
      active: true,
    },
    {
      icon: CreditCard,
      title: "Easy Returns",
      description: "30-day return policy",
      active: true,
    },
  ];

  if (compact) {
    return (
      <div className={cn("p-4 bg-muted/50 rounded-lg", className)}>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Items ({stats.itemCount})</span>
            <span>${stats.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>${stats.tax.toFixed(2)}</span>
          </div>

          <div className="border-t pt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Order Summary */}
      <div className="p-6 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </h3>

        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span>
              Subtotal ({stats.itemCount}{" "}
              {stats.itemCount === 1 ? "item" : "items"})
            </span>
            <span>${stats.subtotal.toFixed(2)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span
              className={cn(shipping === 0 && "text-green-600 font-medium")}
            >
              {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            </span>
          </div>

          {/* Free shipping progress */}
          {stats.subtotal < 50 && (
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm">
              <p className="text-blue-700 dark:text-blue-300">
                🚚 Add <strong>${(50 - stats.subtotal).toFixed(2)}</strong> more
                for free shipping!
              </p>
              <div className="mt-1 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min((stats.subtotal / 50) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Tax */}
          <div className="flex justify-between text-sm">
            <span>Tax (10%)</span>
            <span>${stats.tax.toFixed(2)}</span>
          </div>

          {/* Divider */}
          <div className="border-t my-3" />

          {/* Total */}
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-primary">${finalTotal.toFixed(2)}</span>
          </div>

          {/* Estimated Delivery */}
          <div className="text-sm text-muted-foreground">
            <p>💫 Estimated delivery: 2-3 business days</p>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      {showCheckoutButton && cartItems.length > 0 && (
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full flex items-center gap-2"
            onClick={() => {
              // Future: Navigate to checkout
              alert("Checkout functionality will be implemented in Phase 5!");
            }}
          >
            <CreditCard className="h-5 w-5" />
            Proceed to Checkout
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => {
              // Continue shopping - go back to products
              window.location.href = "/products";
            }}
          >
            Continue Shopping
          </Button>
        </div>
      )}

      {/* Benefits */}
      {showBenefits && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Why shop with us?</h4>
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    benefit.active
                      ? "bg-green-100 dark:bg-green-900/20 text-green-600"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <benefit.icon className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-medium text-sm">{benefit.title}</h5>
                  <p
                    className={cn(
                      "text-xs",
                      benefit.active
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    )}
                  >
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promo Code */}
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium text-sm mb-3">Have a promo code?</h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter code"
            className="flex-1 h-9 px-3 py-1 text-sm border border-input rounded-md bg-background"
          />
          <Button variant="outline" size="sm">
            Apply
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="text-center text-xs text-muted-foreground">
        <p className="flex items-center justify-center gap-1">
          <Shield className="h-3 w-3" />
          Secure 256-bit SSL encryption
        </p>
      </div>
    </div>
  );
};

// Mini summary for header cart dropdown
export const MiniCartSummary = ({ className = "" }) => {
  const { getCartStats } = useCart();
  const stats = getCartStats();

  return (
    <div className={cn("p-3 border-t", className)}>
      <div className="flex justify-between text-sm mb-2">
        <span>Subtotal ({stats.itemCount} items)</span>
        <span className="font-medium">${stats.subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
};
