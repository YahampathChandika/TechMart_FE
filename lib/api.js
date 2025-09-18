// lib/api.js
// Base API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// API endpoints
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

  // PUBLIC Products (for customers/public) - GET only
  PRODUCTS: "/products",
  PRODUCTS_BRANDS: "/products/brands",
  PRODUCTS_FILTERS: "/products/filters",
  PRODUCTS_SEARCH: "/products/search",

  // ADMIN Products (for admin/users) - CRUD operations
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_PRODUCTS_STATISTICS: "/admin/products/statistics",
  ADMIN_PRODUCTS_ANALYTICS: "/admin/products/analytics",
  ADMIN_PRODUCTS_EXPORT: "/admin/products/export",
  ADMIN_PRODUCTS_BULK_UPDATE: "/admin/products/bulk-update",
  ADMIN_PRODUCTS_BULK_DELETE: "/admin/products/bulk-delete",

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

// Default headers for JSON requests
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

// Headers for FormData requests (don't set Content-Type, let browser handle it)
const getFormDataHeaders = () => {
  const headers = {
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

// Generic API call function with FormData support
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    // Determine if this is a FormData request
    const isFormData = options.body instanceof FormData;

    const config = {
      headers: isFormData ? getFormDataHeaders() : getDefaultHeaders(),
      ...options,
    };

    // Don't override Content-Type for FormData - let browser set it with boundary
    if (!isFormData && options.body && typeof options.body === "string") {
      // JSON request - Content-Type already set in getDefaultHeaders
    }

    const response = await fetch(url, config);

    // Handle non-JSON responses or empty responses
    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      data = {};
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP error! status: ${response.status}`,
        errors: data.errors || null, // Laravel validation errors
        status: response.status,
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
      status: response.status,
    };
  } catch (error) {
    console.error("API call failed:", error);
    return {
      success: false,
      error: error.message || "Network error occurred",
      status: 500,
    };
  }
};

// Authentication API calls
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

  // Dashboard
  getDashboardStats: () => apiCall(API_ENDPOINTS.DASHBOARD_STATS),

  getDashboardActivities: () =>
    apiCall(API_ENDPOINTS.DASHBOARD_RECENT_ACTIVITIES),

  // PUBLIC Products (for customer/public pages) - GET only
  getPublicProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`${API_ENDPOINTS.PRODUCTS}${query ? `?${query}` : ""}`);
  },

  getPublicProduct: (id) => apiCall(`${API_ENDPOINTS.PRODUCTS}/${id}`),

  getBrands: () => apiCall(API_ENDPOINTS.PRODUCTS_BRANDS),

  getFilterOptions: () => apiCall(API_ENDPOINTS.PRODUCTS_FILTERS),

  searchPublicProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(
      `${API_ENDPOINTS.PRODUCTS_SEARCH}${query ? `?${query}` : ""}`
    );
  },

  // ADMIN Products (for admin/user pages) - CRUD operations
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(
      `${API_ENDPOINTS.ADMIN_PRODUCTS}${query ? `?${query}` : ""}`
    );
  },

  getProduct: (id) => apiCall(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${id}`),

  // Enhanced createProduct with FormData support
  createProduct: (productData) => {
    if (productData instanceof FormData) {
      // Handle FormData (file uploads)
      return apiCall(API_ENDPOINTS.ADMIN_PRODUCTS, {
        method: HTTP_METHODS.POST,
        body: productData, // FormData
      });
    } else {
      // Handle JSON data (no files)
      return apiCall(API_ENDPOINTS.ADMIN_PRODUCTS, {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(productData),
      });
    }
  },

  // Enhanced updateProduct with FormData support
  updateProduct: (id, productData) => {
    if (productData instanceof FormData) {
      // Handle FormData (file uploads) - use POST with _method=PUT for Laravel
      productData.append("_method", "PUT");
      return apiCall(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${id}`, {
        method: HTTP_METHODS.POST, // Laravel FormData workaround
        body: productData, // FormData
      });
    } else {
      // Handle JSON data (no files) - use standard PUT
      return apiCall(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${id}`, {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify(productData),
      });
    }
  },

  deleteProduct: (id) =>
    apiCall(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${id}`, {
      method: HTTP_METHODS.DELETE,
    }),

  getProductStatistics: () => apiCall(API_ENDPOINTS.ADMIN_PRODUCTS_STATISTICS),

  exportProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(
      `${API_ENDPOINTS.ADMIN_PRODUCTS_EXPORT}${query ? `?${query}` : ""}`
    );
  },

  bulkUpdateProducts: (productData) =>
    apiCall(API_ENDPOINTS.ADMIN_PRODUCTS_BULK_UPDATE, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(productData),
    }),

  bulkDeleteProducts: (productIds) =>
    apiCall(API_ENDPOINTS.ADMIN_PRODUCTS_BULK_DELETE, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ ids: productIds }),
    }),

  // Users
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`${API_ENDPOINTS.USERS}${query ? `?${query}` : ""}`);
  },

  getUser: (id) => apiCall(`${API_ENDPOINTS.USERS}/${id}`),

  createUser: (userData) =>
    apiCall(API_ENDPOINTS.USERS, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(userData),
    }),

  updateUser: (id, userData) =>
    apiCall(`${API_ENDPOINTS.USERS}/${id}`, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(userData),
    }),

  deleteUser: (id) =>
    apiCall(`${API_ENDPOINTS.USERS}/${id}`, {
      method: HTTP_METHODS.DELETE,
    }),

  // Customers
  getCustomers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`${API_ENDPOINTS.CUSTOMERS}${query ? `?${query}` : ""}`);
  },

  getCustomer: (id) => apiCall(`${API_ENDPOINTS.CUSTOMERS}/${id}`),

  updateCustomer: (id, customerData) =>
    apiCall(`${API_ENDPOINTS.CUSTOMERS}/${id}`, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(customerData),
    }),

  deleteCustomer: (id) =>
    apiCall(`${API_ENDPOINTS.CUSTOMERS}/${id}`, {
      method: HTTP_METHODS.DELETE,
    }),

  // Shopping Cart
  getCart: () => apiCall(API_ENDPOINTS.CART),

  getCartSummary: () => apiCall(API_ENDPOINTS.CART_SUMMARY),

  getCartCount: () => apiCall(API_ENDPOINTS.CART_COUNT),

  addToCart: (productData) =>
    apiCall(API_ENDPOINTS.CART_ADD, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(productData),
    }),

  updateCartItem: (itemId, cartData) =>
    apiCall(`${API_ENDPOINTS.CART}/items/${itemId}`, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(cartData),
    }),

  removeFromCart: (itemId) =>
    apiCall(`${API_ENDPOINTS.CART}/items/${itemId}`, {
      method: HTTP_METHODS.DELETE,
    }),

  clearCart: () =>
    apiCall(API_ENDPOINTS.CART_CLEAR, {
      method: HTTP_METHODS.DELETE,
    }),
};
