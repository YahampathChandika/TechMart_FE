// contexts/Providers.js
"use client";

import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";

export const Providers = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
