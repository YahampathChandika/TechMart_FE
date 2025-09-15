// contexts/ThemeContext.js
"use client";

import { createContext, useContext } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children, ...props }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>
    </NextThemesProvider>
  );
};

// Simple hook to use next-themes directly (alternative approach)
export { useTheme as useNextTheme } from "next-themes";
