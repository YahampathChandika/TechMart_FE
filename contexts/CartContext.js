// contexts/CartContext.js
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { authAPI } from "@/lib/api";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { customer, isCustomer } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart items when customer changes
  useEffect(() => {
    if (isCustomer() && customer) {
      loadCartItems();
      loadCartCount();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  }, [customer]);

  // Load cart items from API
  const loadCartItems = useCallback(async () => {
    if (!customer) return;

    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.getCart();

      if (response.success) {
        // API returns { data: { items: [...] } }
        const items = response.data?.items || [];
        setCartItems(Array.isArray(items) ? items : []);
      } else {
        console.error("Failed to load cart:", response.error);
        setError(response.error);
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error loading cart:", err);
      setError("Failed to load cart");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [customer]);

  // Load cart count from API
  const loadCartCount = useCallback(async () => {
    if (!customer) return;

    try {
      const response = await authAPI.getCartCount();

      if (response.success) {
        // API returns { data: { count: "4" } }
        const count = parseInt(response.data?.count || 0, 10);
        setCartCount(count);
      }
    } catch (err) {
      console.error("Error loading cart count:", err);
    }
  }, [customer]);

  // Add item to cart
  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!customer) {
        throw new Error("Please login to add items to cart");
      }

      try {
        setLoading(true);
        setError(null);

        const response = await authAPI.addToCart({
          product_id: productId,
          quantity: quantity,
        });

        if (response.success) {
          // Reload cart data
          await loadCartItems();
          await loadCartCount();
          return response.data;
        } else {
          throw new Error(response.error || "Failed to add item to cart");
        }
      } catch (err) {
        console.error("Error adding to cart:", err);
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [customer, loadCartItems, loadCartCount]
  );

  // Update cart item quantity
  const updateCartItem = useCallback(
    async (itemId, quantity) => {
      if (!customer) return;

      try {
        setLoading(true);
        setError(null);

        const response = await authAPI.updateCartItem(itemId, { quantity });

        if (response.success) {
          // Update local state immediately for better UX
          setCartItems((prev) => {
            const items = Array.isArray(prev) ? prev : [];
            return items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            );
          });

          // Reload cart count
          await loadCartCount();
          return response.data;
        } else {
          throw new Error(response.error || "Failed to update cart item");
        }
      } catch (err) {
        console.error("Error updating cart item:", err);
        setError(err.message);
        // Reload cart to sync with server
        await loadCartItems();
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [customer, loadCartItems, loadCartCount]
  );

  // Remove item from cart
  const removeFromCart = useCallback(
    async (itemId) => {
      if (!customer) return;

      try {
        setLoading(true);
        setError(null);

        const response = await authAPI.removeFromCart(itemId);

        if (response.success) {
          // Update local state immediately
          setCartItems((prev) => {
            const items = Array.isArray(prev) ? prev : [];
            return items.filter((item) => item.id !== itemId);
          });

          // Reload cart count
          await loadCartCount();
        } else {
          throw new Error(response.error || "Failed to remove item from cart");
        }
      } catch (err) {
        console.error("Error removing from cart:", err);
        setError(err.message);
        // Reload cart to sync with server
        await loadCartItems();
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [customer, loadCartItems, loadCartCount]
  );

  // Clear entire cart
  const clearCart = useCallback(async () => {
    if (!customer) return;

    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.clearCart();

      if (response.success) {
        setCartItems([]);
        setCartCount(0);
      } else {
        throw new Error(response.error || "Failed to clear cart");
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [customer]);

  // Get cart summary
  const getCartSummary = useCallback(async () => {
    if (!customer) return null;

    try {
      const response = await authAPI.getCartSummary();

      if (response.success) {
        return response.data;
      } else {
        console.error("Failed to get cart summary:", response.error);
        return null;
      }
    } catch (err) {
      console.error("Error getting cart summary:", err);
      return null;
    }
  }, [customer]);

  // Check if product is in cart
  const isInCart = useCallback(
    (productId) => {
      const items = Array.isArray(cartItems) ? cartItems : [];
      return items.some((item) => item.product_id === parseInt(productId));
    },
    [cartItems]
  );

  // Get cart item by product ID
  const getCartItem = useCallback(
    (productId) => {
      const items = Array.isArray(cartItems) ? cartItems : [];
      return items.find((item) => item.product_id === parseInt(productId));
    },
    [cartItems]
  );

  // Get product quantity in cart - ADDED THIS MISSING FUNCTION
  const getProductQuantityInCart = useCallback(
    (productId) => {
      const items = Array.isArray(cartItems) ? cartItems : [];
      const cartItem = items.find(
        (item) => item.product_id === parseInt(productId)
      );
      return cartItem ? cartItem.quantity : 0;
    },
    [cartItems]
  );

  // Calculate cart totals (local calculation for immediate display)
  const cartTotals = useCallback(() => {
    // Ensure cartItems is an array
    const items = Array.isArray(cartItems) ? cartItems : [];

    const subtotal = items.reduce((total, item) => {
      // API response has product nested in each cart item
      const price = parseFloat(item.product?.sell_price || 0);
      return total + price * item.quantity;
    }, 0);

    // You can add tax calculation, shipping, etc. here
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
    const total = subtotal + tax + shipping;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
    };
  }, [cartItems]);

  // Refresh cart data
  const refreshCart = useCallback(async () => {
    if (isCustomer() && customer) {
      await Promise.all([loadCartItems(), loadCartCount()]);
    }
  }, [isCustomer, customer, loadCartItems, loadCartCount]);

  const value = {
    // State
    cartItems,
    cartCount,
    loading,
    error,

    // Actions
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,

    // Utilities
    isInCart,
    getCartItem,
    getProductQuantityInCart, // ADDED THIS
    getCartSummary,
    cartTotals: cartTotals(),

    // Auth state
    isAuthenticated: isCustomer(),
    customer,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
