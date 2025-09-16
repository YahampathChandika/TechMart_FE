// lib/auth.js

import { STORAGE_KEYS, USER_ROLES, ROUTES } from "./constants";

// Token management
export const tokenManager = {
  // Get stored tokens
  getUserToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    }
    return null;
  },

  getCustomerToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.CUSTOMER_TOKEN);
    }
    return null;
  },

  // Set tokens
  setUserToken: (token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    }
  },

  setCustomerToken: (token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.CUSTOMER_TOKEN, token);
    }
  },

  // Clear tokens
  clearAllTokens: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CUSTOMER_TOKEN);
    }
  },
};

// Route protection helpers - UPDATED FOR NEW ADMIN ROUTES
export const routeGuards = {
  // Check if route requires authentication
  requiresAuth: (pathname) => {
    const publicRoutes = [
      ROUTES.HOME,
      ROUTES.LOGIN,
      ROUTES.REGISTER,
      ROUTES.ADMIN_LOGIN,
      ROUTES.PRODUCTS,
    ];

    // Check if it's a product detail page (dynamic route)
    if (pathname.startsWith("/products/") && pathname.split("/").length === 3) {
      return false; // Product detail pages are public
    }

    return !publicRoutes.includes(pathname);
  },

  // Check if route requires admin access - UPDATED FOR NEW /admin STRUCTURE
  requiresAdmin: (pathname) => {
    // All routes under /admin require admin access
    return pathname.startsWith("/admin");
  },

  // Check if route requires customer access
  requiresCustomer: (pathname) => {
    const customerRoutes = ["/cart", "/profile"];
    return customerRoutes.some((route) => pathname.startsWith(route));
  },

  // Get redirect URL based on user type - UPDATED
  getRedirectUrl: (userType, intendedRoute = null) => {
    if (intendedRoute && !routeGuards.requiresAuth(intendedRoute)) {
      return intendedRoute;
    }

    switch (userType) {
      case USER_ROLES.ADMIN:
      case USER_ROLES.USER:
        return ROUTES.ADMIN_DASHBOARD; // Now points to /admin/dashboard
      case USER_ROLES.CUSTOMER:
        return ROUTES.HOME;
      default:
        return ROUTES.HOME;
    }
  },
};

// Permission helpers
export const permissions = {
  // Check if user has specific privilege
  hasPrivilege: (userPrivileges, privilege) => {
    if (!userPrivileges) return false;
    return userPrivileges[privilege] === true;
  },

  // Check if user can perform product actions
  canAddProducts: (user, userPrivileges) => {
    if (user?.role === USER_ROLES.ADMIN) return true;
    return permissions.hasPrivilege(userPrivileges, "can_add_products");
  },

  canUpdateProducts: (user, userPrivileges) => {
    if (user?.role === USER_ROLES.ADMIN) return true;
    return permissions.hasPrivilege(userPrivileges, "can_update_products");
  },

  canDeleteProducts: (user, userPrivileges) => {
    if (user?.role === USER_ROLES.ADMIN) return true;
    return permissions.hasPrivilege(userPrivileges, "can_delete_products");
  },

  // Check if user can manage other users
  canManageUsers: (user) => {
    return user?.role === USER_ROLES.ADMIN;
  },

  // Check if user can manage customers
  canManageCustomers: (user) => {
    return user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.USER;
  },
};

// Form validation helpers
export const validation = {
  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone format
  isValidPhone: (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone);
  },

  // Validate password strength
  isValidPassword: (password, minLength = 6) => {
    return password && password.length >= minLength;
  },

  // Validate name
  isValidName: (name, minLength = 2, maxLength = 50) => {
    return (
      name && name.trim().length >= minLength && name.trim().length <= maxLength
    );
  },

  // Validate required field
  isRequired: (value) => {
    return (
      value !== null && value !== undefined && value.toString().trim() !== ""
    );
  },
};

// Session management
export const sessionManager = {
  // Check if session is valid (basic check)
  isSessionValid: () => {
    const userToken = tokenManager.getUserToken();
    const customerToken = tokenManager.getCustomerToken();

    // In a real app, you'd verify token expiration
    return !!(userToken || customerToken);
  },

  // Get current session type
  getSessionType: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.USER_TYPE);
    }
    return null;
  },

  // Clear entire session
  clearSession: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.CUSTOMER);
      localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
      tokenManager.clearAllTokens();
    }
  },
};

// URL helpers
export const urlHelpers = {
  // Get login URL based on user type
  getLoginUrl: (userType = USER_ROLES.CUSTOMER) => {
    switch (userType) {
      case USER_ROLES.ADMIN:
      case USER_ROLES.USER:
        return ROUTES.ADMIN_LOGIN;
      case USER_ROLES.CUSTOMER:
        return ROUTES.LOGIN;
      default:
        return ROUTES.LOGIN;
    }
  },

  // Build URL with query parameters
  buildUrl: (baseUrl, params = {}) => {
    const url = new URL(baseUrl, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });
    return url.toString();
  },
};
