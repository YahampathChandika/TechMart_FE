// components/customer/CartSummary.js
"use client";

import Link from "next/link";
import { ShoppingCart, Truck, Shield, RotateCcw, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export const CartSummary = ({
  showCheckoutButton = true,
  showBenefits = false,
  className = "",
}) => {
  const { cartTotals } = useCart();

  const benefits = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $50",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "SSL encrypted checkout",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day return policy",
    },
  ];

  return (
    <div className={`bg-card border rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

      {/* Order Details */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Subtotal ({cartTotals.itemCount} items)
          </span>
          <span>${cartTotals.subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span
            className={
              parseFloat(cartTotals.shipping) === 0 ? "text-green-600" : ""
            }
          >
            {parseFloat(cartTotals.shipping) === 0
              ? "Free"
              : `$${cartTotals.shipping}`}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>${cartTotals.tax}</span>
        </div>

        <div className="border-t my-3"></div>

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="text-primary">${cartTotals.total}</span>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mt-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Promo code"
            className="flex-1 px-3 py-2 border rounded-md text-sm"
          />
          <Button variant="outline" size="sm">
            Apply
          </Button>
        </div>
      </div>

      {/* Checkout Button */}
      {showCheckoutButton && (
        <div className="mt-6 space-y-3">
          <Button className="w-full" size="lg">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Proceed to Checkout
          </Button>

          <Link href="/products">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      )}

      {/* Benefits */}
      {showBenefits && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-4">Why shop with us?</h4>
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <benefit.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{benefit.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Mini version for dropdown
export const MiniCartSummary = ({ onCheckout, className = "" }) => {
  const { cartTotals } = useCart();

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm">
        <span>Items ({cartTotals.itemCount}):</span>
        <span>${cartTotals.subtotal}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Shipping:</span>
        <span
          className={
            parseFloat(cartTotals.shipping) === 0 ? "text-green-600" : ""
          }
        >
          {parseFloat(cartTotals.shipping) === 0
            ? "Free"
            : `$${cartTotals.shipping}`}
        </span>
      </div>

      <div className="border-t my-2"></div>

      <div className="flex justify-between font-semibold">
        <span>Total:</span>
        <span className="text-primary">${cartTotals.total}</span>
      </div>

      {onCheckout && (
        <Button onClick={onCheckout} className="w-full mt-4">
          Checkout
        </Button>
      )}
    </div>
  );
};
