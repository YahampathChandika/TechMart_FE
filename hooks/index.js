// hooks/index.js

import { useState } from "react";

// Re-export all custom hooks for easy importing
export { useAuth } from "@/contexts/AuthContext";
export { useCart } from "@/contexts/CartContext";
export { useTheme, useNextTheme } from "@/contexts/ThemeContext";
export { useProducts, useProduct, useProductSearch } from "./useProducts";

// Custom hook for localStorage management
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
