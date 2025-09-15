// contexts/CartContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getProductById, mockShoppingCarts } from "@/lib/mockData";

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
  const [loading, setLoading] = useState(false);

  // Load cart items when customer changes
  useEffect(() => {
    if (isCustomer() && customer) {
      loadCartItems();
    } else {
      setCartItems([]);
    }
  }, [customer]);

  // Load cart items from mock data and localStorage
  const loadCartItems = () => {
    if (!customer) return;

    try {
      // First try to load from localStorage (persisted cart)
      const savedCart = localStorage.getItem(`techmart_cart_${customer.id}`);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } else {
        // Fallback to mock data (initial cart items)
        const mockCartItems = mockShoppingCarts
          .filter((item) => item.customer_id === customer.id)
          .map((item) => ({
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            created_at: item.created_at,
            updated_at: item.updated_at,
          }));

        setCartItems(mockCartItems);
        saveCartToStorage(mockCartItems);
      }
    } catch (error) {
      console.error("Error loading cart items:", error);
      setCartItems([]);
    }
  };

  // Save cart to localStorage
  const saveCartToStorage = (items) => {
    if (!customer) return;

    try {
      localStorage.setItem(
        `techmart_cart_${customer.id}`,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error("Error saving cart to storage:", error);
    }
  };

  // Get cart items with product details
  const getCartWithProducts = () => {
    return cartItems
      .map((cartItem) => {
        const product = getProductById(cartItem.product_id);
        return {
          ...cartItem,
          product: product || null,
        };
      })
      .filter((item) => item.product !== null); // Filter out items with deleted products
  };

  // Add item to cart
  const addToCart = (productId, quantity = 1) => {
    if (!isCustomer() || !customer) {
      throw new Error("Must be logged in as customer to add to cart");
    }

    setLoading(true);

    try {
      const product = getProductById(productId);
      if (!product || !product.is_active) {
        throw new Error("Product not found or inactive");
      }

      if (product.quantity < quantity) {
        throw new Error("Not enough stock available");
      }

      const existingItemIndex = cartItems.findIndex(
        (item) => item.product_id === productId
      );

      let updatedCartItems;

      if (existingItemIndex > -1) {
        // Update existing item
        const existingItem = cartItems[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > product.quantity) {
          throw new Error("Not enough stock available");
        }

        updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          updated_at: new Date().toISOString(),
        };
      } else {
        // Add new item
        const newItem = {
          id: Date.now(), // Simple ID generation for demo
          product_id: productId,
          quantity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        updatedCartItems = [...cartItems, newItem];
      }

      setCartItems(updatedCartItems);
      saveCartToStorage(updatedCartItems);

      return { success: true, message: "Item added to cart" };
    } catch (error) {
      console.error("Error adding to cart:", error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    if (!isCustomer() || !customer) return;

    const updatedCartItems = cartItems.filter(
      (item) => item.product_id !== productId
    );
    setCartItems(updatedCartItems);
    saveCartToStorage(updatedCartItems);
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (!isCustomer() || !customer) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = getProductById(productId);
    if (!product || quantity > product.quantity) {
      throw new Error("Not enough stock available");
    }

    const updatedCartItems = cartItems.map((item) =>
      item.product_id === productId
        ? { ...item, quantity, updated_at: new Date().toISOString() }
        : item
    );

    setCartItems(updatedCartItems);
    saveCartToStorage(updatedCartItems);
  };

  // Clear entire cart
  const clearCart = () => {
    if (!isCustomer() || !customer) return;

    setCartItems([]);
    saveCartToStorage([]);
  };

  // Get cart statistics
  const getCartStats = () => {
    const cartWithProducts = getCartWithProducts();

    const itemCount = cartWithProducts.reduce(
      (total, item) => total + item.quantity,
      0
    );

    const subtotal = cartWithProducts.reduce((total, item) => {
      return total + item.product.sell_price * item.quantity;
    }, 0);

    const tax = subtotal * 0.1; // 10% tax for demo
    const total = subtotal + tax;

    return {
      itemCount,
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cartItems.some((item) => item.product_id === productId);
  };

  // Get quantity of specific product in cart
  const getProductQuantityInCart = (productId) => {
    const cartItem = cartItems.find((item) => item.product_id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const value = {
    // State
    cartItems,
    loading,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // Getters
    getCartWithProducts,
    getCartStats,
    isInCart,
    getProductQuantityInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
