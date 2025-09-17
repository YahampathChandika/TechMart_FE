// contexts/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@/lib/api";
import { tokenManager } from "@/lib/auth";
import { STORAGE_KEYS, USER_ROLES } from "@/lib/constants";

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
  const [userType, setUserType] = useState(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userToken = tokenManager.getUserToken();
        const customerToken = tokenManager.getCustomerToken();

        if (userToken) {
          // Verify user token and get profile
          const result = await authAPI.getUserProfile();
          if (result.success && result.data) {
            const userData = result.data.user;
            setUser(userData);
            setUserType(userData.role);

            // Store user data
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
            localStorage.setItem(STORAGE_KEYS.USER_TYPE, userData.role);
          } else {
            // Token is invalid, clear it
            tokenManager.clearAllTokens();
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
          }
        } else if (customerToken) {
          // Verify customer token and get profile
          const result = await authAPI.getCustomerProfile();
          if (result.success && result.data) {
            const customerData = result.data.customer;
            setCustomer(customerData);
            setUserType(USER_ROLES.CUSTOMER);

            // Store customer data
            localStorage.setItem(
              STORAGE_KEYS.CUSTOMER,
              JSON.stringify(customerData)
            );
            localStorage.setItem(STORAGE_KEYS.USER_TYPE, USER_ROLES.CUSTOMER);
          } else {
            // Token is invalid, clear it
            tokenManager.clearAllTokens();
            localStorage.removeItem(STORAGE_KEYS.CUSTOMER);
            localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear everything on error
        tokenManager.clearAllTokens();
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.CUSTOMER);
        localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Admin/User login
  const loginUser = async (email, password) => {
    try {
      const result = await authAPI.loginUser(email, password);

      if (result.success && result.data) {
        const { user: userData, token } = result.data;

        // Store user data and token
        setUser(userData);
        setUserType(userData.role);
        tokenManager.setUserToken(token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, userData.role);

        return {
          success: true,
          data: userData,
          message: "Login successful",
        };
      } else {
        return {
          success: false,
          message: result.error || "Login failed",
        };
      }
    } catch (error) {
      console.error("User login error:", error);
      return {
        success: false,
        message: "An unexpected error occurred",
      };
    }
  };

  // Customer login
  const loginCustomer = async (email, password) => {
    try {
      const result = await authAPI.loginCustomer(email, password);

      if (result.success && result.data) {
        const { customer: customerData, token } = result.data;

        // Store customer data and token
        setCustomer(customerData);
        setUserType(USER_ROLES.CUSTOMER);
        tokenManager.setCustomerToken(token);
        localStorage.setItem(
          STORAGE_KEYS.CUSTOMER,
          JSON.stringify(customerData)
        );
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, USER_ROLES.CUSTOMER);

        return {
          success: true,
          data: customerData,
          message: "Login successful",
        };
      } else {
        return {
          success: false,
          message: result.error || "Login failed",
        };
      }
    } catch (error) {
      console.error("Customer login error:", error);
      return {
        success: false,
        message: "An unexpected error occurred",
      };
    }
  };

  // Register customer
  const registerCustomer = async (customerData) => {
    try {
      const result = await authAPI.registerCustomer(customerData);

      if (result.success && result.data) {
        const { customer: newCustomer, token } = result.data;

        // Auto-login after registration
        setCustomer(newCustomer);
        setUserType(USER_ROLES.CUSTOMER);
        tokenManager.setCustomerToken(token);
        localStorage.setItem(
          STORAGE_KEYS.CUSTOMER,
          JSON.stringify(newCustomer)
        );
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, USER_ROLES.CUSTOMER);

        return {
          success: true,
          data: newCustomer,
          message: "Registration successful",
        };
      } else {
        return {
          success: false,
          message: result.error || "Registration failed",
        };
      }
    } catch (error) {
      console.error("Customer registration error:", error);
      return {
        success: false,
        message: "An unexpected error occurred",
      };
    }
  };

  // Register user (admin only)
  const registerUser = async (userData) => {
    try {
      const result = await authAPI.registerUser(userData);

      if (result.success && result.data) {
        return {
          success: true,
          data: result.data.user,
          message: "User registered successfully",
        };
      } else {
        return {
          success: false,
          message: result.error || "User registration failed",
        };
      }
    } catch (error) {
      console.error("User registration error:", error);
      return {
        success: false,
        message: "An unexpected error occurred",
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Call logout endpoint based on user type
      if (user) {
        await authAPI.logoutUser();
      } else if (customer) {
        await authAPI.logoutCustomer();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all state regardless of API call success
      setUser(null);
      setCustomer(null);
      setUserType(null);
      tokenManager.clearAllTokens();
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.CUSTOMER);
      localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
    }
  };

  // Check if any user is authenticated
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

  // Get current authenticated entity
  const getCurrentAuth = () => {
    if (user) return { ...user, type: user.role };
    if (customer) return { ...customer, type: "customer" };
    return null;
  };

  // Update user profile
  const updateUserProfile = async (updatedData) => {
    if (!user) return { success: false, message: "No user logged in" };

    try {
      const result = await authAPI.updateUserProfile(updatedData);

      if (result.success && result.data) {
        const updatedUser = result.data.user;
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

        return {
          success: true,
          data: updatedUser,
          message: "Profile updated successfully",
        };
      } else {
        return {
          success: false,
          message: result.error || "Failed to update profile",
        };
      }
    } catch (error) {
      console.error("Update user profile error:", error);
      return {
        success: false,
        message: "An unexpected error occurred",
      };
    }
  };

  // Update customer profile
  const updateCustomerProfile = async (updatedData) => {
    if (!customer) return { success: false, message: "No customer logged in" };

    try {
      const result = await authAPI.updateCustomerProfile(updatedData);

      if (result.success && result.data) {
        const updatedCustomer = result.data.customer;
        setCustomer(updatedCustomer);
        localStorage.setItem(
          STORAGE_KEYS.CUSTOMER,
          JSON.stringify(updatedCustomer)
        );

        return {
          success: true,
          data: updatedCustomer,
          message: "Profile updated successfully",
        };
      } else {
        return {
          success: false,
          message: result.error || "Failed to update profile",
        };
      }
    } catch (error) {
      console.error("Update customer profile error:", error);
      return {
        success: false,
        message: "An unexpected error occurred",
      };
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
    registerUser,
    registerCustomer,
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
