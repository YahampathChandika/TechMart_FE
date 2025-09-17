// lib/api.js

// Base API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// API endpoints - Updated to match backend routes exactly
export const API_ENDPOINTS = {
  // Admin/User Authentication (prefix: auth)
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_PROFILE: "/auth/profile",

  // Customer Authentication (prefix: customer)
  CUSTOMER_LOGIN: "/customer/login",
  CUSTOMER_REGISTER: "/customer/register",
  CUSTOMER_LOGOUT: "/customer/logout",
  CUSTOMER_REFRESH: "/customer/refresh",
  CUSTOMER_PROFILE: "/customer/profile",
  CUSTOMER_CART_SUMMARY: "/customer/cart-summary",

  // Products (prefix: products)
  PRODUCTS: "/products",
  PRODUCTS_SEARCH: "/products/search",
  PRODUCTS_STATISTICS: "/products/statistics",
  PRODUCTS_EXPORT: "/products/export",
  PRODUCTS_BULK_UPDATE: "/products/bulk-update",
  PRODUCTS_BULK_DELETE: "/products/bulk-delete",

  // Users Management (prefix: users, admin only)
  USERS: "/users",
  USERS_STATISTICS: "/users/statistics",

  // Customers Management (prefix: customers)
  CUSTOMERS: "/customers",
  CUSTOMERS_STATISTICS: "/customers/statistics",
  CUSTOMERS_TOP: "/customers/top-customers",
  CUSTOMERS_EXPORT: "/customers/export",

  // Shopping Cart (prefix: cart, customer auth required)
  CART: "/cart",
  CART_SUMMARY: "/cart/summary",
  CART_COUNT: "/cart/count",
  CART_VALIDATE: "/cart/validate",
  CART_ADD: "/cart/add",
  CART_QUICK_ADD: "/cart/quick-add",
  CART_BULK_UPDATE: "/cart/bulk-update",
  CART_CLEAR: "/cart/clear",

  // Dashboard (admin/user access)
  DASHBOARD_STATS: "/dashboard/stats",
  DASHBOARD_RECENT_ACTIVITIES: "/dashboard/recent-activities",
};

// HTTP Methods
const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

// Default headers
const getDefaultHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Add auth token if available
  if (typeof window !== "undefined") {
    const userToken = localStorage.getItem("techmart_user_token");
    const customerToken = localStorage.getItem("techmart_customer_token");

    if (userToken) {
      headers.Authorization = `Bearer ${userToken}`;
    } else if (customerToken) {
      headers.Authorization = `Bearer ${customerToken}`;
    }
  }

  return headers;
};

// Base API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    method: HTTP_METHODS.GET,
    headers: getDefaultHeaders(),
    ...options,
  };

  // For FormData (file uploads), don't set Content-Type header
  if (config.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  try {
    const response = await fetch(url, config);

    // Handle different response types
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // For Laravel validation errors, preserve the original error structure
      if (response.status === 400 || response.status === 422) {
        return {
          success: false,
          error: typeof data === "object" ? JSON.stringify(data) : data,
          status: response.status,
          validationErrors: data.errors || null,
        };
      }

      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error("API call failed:", error);
    return {
      success: false,
      error: error.message,
      status: error.status || 500,
    };
  }
};

// Authentication API calls - Updated to match backend routes
export const authAPI = {
  // Admin/User Authentication
  loginUser: (email, password) =>
    apiCall(API_ENDPOINTS.AUTH_LOGIN, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ email, password }),
    }),

  registerUser: (userData) =>
    apiCall(API_ENDPOINTS.AUTH_REGISTER, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(userData),
    }),

  logoutUser: () =>
    apiCall(API_ENDPOINTS.AUTH_LOGOUT, {
      method: HTTP_METHODS.POST,
    }),

  refreshUserToken: () =>
    apiCall(API_ENDPOINTS.AUTH_REFRESH, {
      method: HTTP_METHODS.POST,
    }),

  getUserProfile: () => apiCall(API_ENDPOINTS.AUTH_PROFILE),

  updateUserProfile: (userData) =>
    apiCall(API_ENDPOINTS.AUTH_PROFILE, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(userData),
    }),

  // Customer Authentication
  loginCustomer: (email, password) =>
    apiCall(API_ENDPOINTS.CUSTOMER_LOGIN, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ email, password }),
    }),

  registerCustomer: (customerData) =>
    apiCall(API_ENDPOINTS.CUSTOMER_REGISTER, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(customerData),
    }),

  logoutCustomer: () =>
    apiCall(API_ENDPOINTS.CUSTOMER_LOGOUT, {
      method: HTTP_METHODS.POST,
    }),

  refreshCustomerToken: () =>
    apiCall(API_ENDPOINTS.CUSTOMER_REFRESH, {
      method: HTTP_METHODS.POST,
    }),

  getCustomerProfile: () => apiCall(API_ENDPOINTS.CUSTOMER_PROFILE),

  updateCustomerProfile: (customerData) =>
    apiCall(API_ENDPOINTS.CUSTOMER_PROFILE, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(customerData),
    }),

  getCustomerCartSummary: () => apiCall(API_ENDPOINTS.CUSTOMER_CART_SUMMARY),

  // Unified methods for backward compatibility
  login: (email, password, userType = "customer") => {
    if (userType === "user" || userType === "admin") {
      return authAPI.loginUser(email, password);
    } else {
      return authAPI.loginCustomer(email, password);
    }
  },

  register: (userData, userType = "customer") => {
    if (userType === "user" || userType === "admin") {
      return authAPI.registerUser(userData);
    } else {
      return authAPI.registerCustomer(userData);
    }
  },

  logout: (userType = "customer") => {
    if (userType === "user" || userType === "admin") {
      return authAPI.logoutUser();
    } else {
      return authAPI.logoutCustomer();
    }
  },
};

// Products API calls - Updated to match backend routes
export const productsAPI = {
  getAll: (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page, limit, ...filters });
    return apiCall(`${API_ENDPOINTS.PRODUCTS}?${params}`);
  },

  getById: (id) => apiCall(`${API_ENDPOINTS.PRODUCTS}/${id}`),

  create: (productData) =>
    apiCall(API_ENDPOINTS.PRODUCTS, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(productData),
    }),

  update: (id, productData) =>
    apiCall(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(productData),
    }),

  delete: (id) =>
    apiCall(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: HTTP_METHODS.DELETE,
    }),

  toggleStatus: (id) =>
    apiCall(`${API_ENDPOINTS.PRODUCTS}/${id}/toggle-status`, {
      method: HTTP_METHODS.PATCH,
    }),

  deleteImage: (id) =>
    apiCall(`${API_ENDPOINTS.PRODUCTS}/${id}/image`, {
      method: HTTP_METHODS.DELETE,
    }),

  search: (query, filters = {}) =>
    apiCall(API_ENDPOINTS.PRODUCTS_SEARCH, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ query, ...filters }),
    }),

  getStatistics: () => apiCall(API_ENDPOINTS.PRODUCTS_STATISTICS),

  export: () => apiCall(API_ENDPOINTS.PRODUCTS_EXPORT),

  bulkUpdate: (updates) =>
    apiCall(API_ENDPOINTS.PRODUCTS_BULK_UPDATE, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(updates),
    }),

  bulkDelete: (ids) =>
    apiCall(API_ENDPOINTS.PRODUCTS_BULK_DELETE, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ ids }),
    }),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);

    return apiCall(`${API_ENDPOINTS.PRODUCTS}/upload-image`, {
      method: HTTP_METHODS.POST,
      body: formData,
    });
  },
};

// Users Management API calls - Updated to match backend routes
export const usersAPI = {
  getAll: (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page, limit, ...filters });
    return apiCall(`${API_ENDPOINTS.USERS}?${params}`);
  },

  getById: (id) => apiCall(`${API_ENDPOINTS.USERS}/${id}`),

  create: (userData) =>
    apiCall(API_ENDPOINTS.USERS, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(userData),
    }),

  update: (id, userData) =>
    apiCall(`${API_ENDPOINTS.USERS}/${id}`, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(userData),
    }),

  delete: (id) =>
    apiCall(`${API_ENDPOINTS.USERS}/${id}`, {
      method: HTTP_METHODS.DELETE,
    }),

  toggleStatus: (id) =>
    apiCall(`${API_ENDPOINTS.USERS}/${id}/toggle-status`, {
      method: HTTP_METHODS.PATCH,
    }),

  getStatistics: () => apiCall(API_ENDPOINTS.USERS_STATISTICS),

  // User Privileges
  getPrivileges: (id) => apiCall(`${API_ENDPOINTS.USERS}/${id}/privileges`),

  updatePrivileges: (id, privileges) =>
    apiCall(`${API_ENDPOINTS.USERS}/${id}/privileges`, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(privileges),
    }),
};

// Customers Management API calls - Updated to match backend routes
export const customersAPI = {
  getAll: (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page, limit, ...filters });
    return apiCall(`${API_ENDPOINTS.CUSTOMERS}?${params}`);
  },

  getById: (id) => apiCall(`${API_ENDPOINTS.CUSTOMERS}/${id}`),

  create: (customerData) =>
    apiCall(API_ENDPOINTS.CUSTOMERS, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(customerData),
    }),

  update: (id, customerData) =>
    apiCall(`${API_ENDPOINTS.CUSTOMERS}/${id}`, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(customerData),
    }),

  delete: (id) =>
    apiCall(`${API_ENDPOINTS.CUSTOMERS}/${id}`, {
      method: HTTP_METHODS.DELETE,
    }),

  toggleStatus: (id) =>
    apiCall(`${API_ENDPOINTS.CUSTOMERS}/${id}/toggle-status`, {
      method: HTTP_METHODS.PATCH,
    }),

  getStatistics: () => apiCall(API_ENDPOINTS.CUSTOMERS_STATISTICS),

  getTopCustomers: () => apiCall(API_ENDPOINTS.CUSTOMERS_TOP),

  export: () => apiCall(API_ENDPOINTS.CUSTOMERS_EXPORT),

  // Customer's cart management (admin access)
  getCustomerCart: (id) => apiCall(`${API_ENDPOINTS.CUSTOMERS}/${id}/cart`),

  clearCustomerCart: (id) =>
    apiCall(`${API_ENDPOINTS.CUSTOMERS}/${id}/cart`, {
      method: HTTP_METHODS.DELETE,
    }),
};

// Shopping Cart API calls - Updated to match backend routes
export const cartAPI = {
  get: () => apiCall(API_ENDPOINTS.CART),

  getSummary: () => apiCall(API_ENDPOINTS.CART_SUMMARY),

  getCount: () => apiCall(API_ENDPOINTS.CART_COUNT),

  validate: () => apiCall(API_ENDPOINTS.CART_VALIDATE),

  add: (productId, quantity) =>
    apiCall(API_ENDPOINTS.CART_ADD, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ product_id: productId, quantity }),
    }),

  quickAdd: (productId) =>
    apiCall(API_ENDPOINTS.CART_QUICK_ADD, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ product_id: productId }),
    }),

  updateItem: (itemId, quantity) =>
    apiCall(`${API_ENDPOINTS.CART}/items/${itemId}`, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify({ quantity }),
    }),

  bulkUpdate: (updates) =>
    apiCall(API_ENDPOINTS.CART_BULK_UPDATE, {
      method: HTTP_METHODS.PATCH,
      body: JSON.stringify(updates),
    }),

  removeItem: (itemId) =>
    apiCall(`${API_ENDPOINTS.CART}/items/${itemId}`, {
      method: HTTP_METHODS.DELETE,
    }),

  clear: () =>
    apiCall(API_ENDPOINTS.CART_CLEAR, {
      method: HTTP_METHODS.DELETE,
    }),

  checkProduct: (productId) =>
    apiCall(`${API_ENDPOINTS.CART}/check-product/${productId}`),

  // Backward compatibility methods
  update: (productId, quantity) => {
    // This assumes you have a way to get the cart item ID by product ID
    // You might need to implement this differently based on your needs
    console.warn("cartAPI.update is deprecated, use updateItem instead");
    return cartAPI.add(productId, quantity);
  },

  remove: (productId) => {
    console.warn("cartAPI.remove is deprecated, use removeItem instead");
    // You would need to implement logic to find item ID by product ID
    return cartAPI.checkProduct(productId);
  },
};

// Dashboard API calls - Updated to match backend routes
export const dashboardAPI = {
  getStats: () => apiCall(API_ENDPOINTS.DASHBOARD_STATS),

  getRecentActivities: () => apiCall(API_ENDPOINTS.DASHBOARD_RECENT_ACTIVITIES),
};

// Export all API functions for easy access
export default {
  authAPI,
  productsAPI,
  usersAPI,
  customersAPI,
  cartAPI,
  dashboardAPI,
};
