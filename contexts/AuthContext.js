// contexts/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  authenticateUser,
  authenticateCustomer,
  getUserById,
  getCustomerById,
} from "@/lib/mockData";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'admin', 'user', 'customer', or null

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("techmart_user");
      const savedCustomer = localStorage.getItem("techmart_customer");
      const savedUserType = localStorage.getItem("techmart_user_type");

      if (
        (savedUser && savedUserType === "admin") ||
        savedUserType === "user"
      ) {
        const userData = JSON.parse(savedUser);
        // Verify user still exists and is active
        const currentUser = getUserById(userData.id);
        if (currentUser && currentUser.is_active) {
          setUser(currentUser);
          setUserType(savedUserType);
        } else {
          // User no longer exists or is inactive, clear storage
          localStorage.removeItem("techmart_user");
          localStorage.removeItem("techmart_user_type");
        }
      }

      if (savedCustomer && savedUserType === "customer") {
        const customerData = JSON.parse(savedCustomer);
        // Verify customer still exists and is active
        const currentCustomer = getCustomerById(customerData.id);
        if (currentCustomer && currentCustomer.is_active) {
          setCustomer(currentCustomer);
          setUserType("customer");
        } else {
          // Customer no longer exists or is inactive, clear storage
          localStorage.removeItem("techmart_customer");
          localStorage.removeItem("techmart_user_type");
        }
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
      // Clear potentially corrupted data
      localStorage.removeItem("techmart_user");
      localStorage.removeItem("techmart_customer");
      localStorage.removeItem("techmart_user_type");
    }

    setLoading(false);
  }, []);

  // Login function for users (admin/user)
  const loginUser = async (email, password) => {
    try {
      const authenticatedUser = authenticateUser(email, password);

      if (authenticatedUser) {
        setUser(authenticatedUser);
        setCustomer(null); // Clear customer state
        setUserType(authenticatedUser.role); // 'admin' or 'user'

        // Save to localStorage
        localStorage.setItem(
          "techmart_user",
          JSON.stringify(authenticatedUser)
        );
        localStorage.setItem("techmart_user_type", authenticatedUser.role);
        localStorage.removeItem("techmart_customer"); // Clear customer data

        return { success: true, user: authenticatedUser };
      } else {
        return { success: false, message: "Invalid email or password" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An error occurred during login" };
    }
  };

  // Login function for customers
  const loginCustomer = async (email, password) => {
    try {
      const authenticatedCustomer = authenticateCustomer(email, password);

      if (authenticatedCustomer) {
        setCustomer(authenticatedCustomer);
        setUser(null); // Clear user state
        setUserType("customer");

        // Save to localStorage
        localStorage.setItem(
          "techmart_customer",
          JSON.stringify(authenticatedCustomer)
        );
        localStorage.setItem("techmart_user_type", "customer");
        localStorage.removeItem("techmart_user"); // Clear user data

        return { success: true, customer: authenticatedCustomer };
      } else {
        return { success: false, message: "Invalid email or password" };
      }
    } catch (error) {
      console.error("Customer login error:", error);
      return { success: false, message: "An error occurred during login" };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setCustomer(null);
    setUserType(null);

    // Clear localStorage
    localStorage.removeItem("techmart_user");
    localStorage.removeItem("techmart_customer");
    localStorage.removeItem("techmart_user_type");
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null || customer !== null;
  };

  // Check if current user is admin
  const isAdmin = () => {
    return user !== null && user.role === "admin";
  };

  // Check if current user is regular user
  const isUser = () => {
    return user !== null && user.role === "user";
  };

  // Check if current user is customer
  const isCustomer = () => {
    return customer !== null;
  };

  // Get current authenticated entity (user or customer)
  const getCurrentAuth = () => {
    if (user) return { ...user, type: user.role };
    if (customer) return { ...customer, type: "customer" };
    return null;
  };

  // Update user profile
  const updateUserProfile = (updatedData) => {
    if (user) {
      const updatedUser = {
        ...user,
        ...updatedData,
        updated_at: new Date().toISOString(),
      };
      setUser(updatedUser);
      localStorage.setItem("techmart_user", JSON.stringify(updatedUser));
    }
  };

  // Update customer profile
  const updateCustomerProfile = (updatedData) => {
    if (customer) {
      const updatedCustomer = {
        ...customer,
        ...updatedData,
        updated_at: new Date().toISOString(),
      };
      setCustomer(updatedCustomer);
      localStorage.setItem(
        "techmart_customer",
        JSON.stringify(updatedCustomer)
      );
    }
  };

  const value = {
    // State
    user,
    customer,
    loading,
    userType,

    // Actions
    loginUser,
    loginCustomer,
    logout,
    updateUserProfile,
    updateCustomerProfile,

    // Helpers
    isAuthenticated,
    isAdmin,
    isUser,
    isCustomer,
    getCurrentAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
