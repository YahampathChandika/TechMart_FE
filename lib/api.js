// lib/api.js

// Base API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",

  // Users (Admin/User)
  USERS: "/users",
  USER_PROFILE: "/user/profile",
  USER_PRIVILEGES: "/user/privileges",

  // Customers
  CUSTOMERS: "/customers",
  CUSTOMER_PROFILE: "/customer/profile",

  // Products
  PRODUCTS: "/products",
  PRODUCT_SEARCH: "/products/search",
  PRODUCT_UPLOAD: "/products/upload-image",

  // Cart
  CART: "/cart",
  CART_ADD: "/cart/add",
  CART_UPDATE: "/cart/update",
  CART_REMOVE: "/cart/remove",

  // Dashboard
  DASHBOARD_STATS: "/dashboard/stats",
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

// Specific API functions for different entities

// Auth API calls
export const authAPI = {
  loginUser: (email, password) =>
    apiCall(API_ENDPOINTS.LOGIN, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ email, password, type: "user" }),
    }),

  loginCustomer: (email, password) =>
    apiCall(API_ENDPOINTS.LOGIN, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ email, password, type: "customer" }),
    }),

  register: (userData, type = "customer") =>
    apiCall(API_ENDPOINTS.REGISTER, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ ...userData, type }),
    }),

  logout: () =>
    apiCall(API_ENDPOINTS.LOGOUT, {
      method: HTTP_METHODS.POST,
    }),
};

// Products API calls
export const productsAPI = {
  getAll: (page = 1, limit = 10) =>
    apiCall(`${API_ENDPOINTS.PRODUCTS}?page=${page}&limit=${limit}`),

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

  search: (query, filters = {}) =>
    apiCall(API_ENDPOINTS.PRODUCT_SEARCH, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ query, filters }),
    }),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);

    return apiCall(API_ENDPOINTS.PRODUCT_UPLOAD, {
      method: HTTP_METHODS.POST,
      body: formData,
    });
  },
};

// Users API calls
export const usersAPI = {
  getAll: (page = 1, limit = 10) =>
    apiCall(`${API_ENDPOINTS.USERS}?page=${page}&limit=${limit}`),

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

  updatePrivileges: (id, privileges) =>
    apiCall(`${API_ENDPOINTS.USERS}/${id}/privileges`, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(privileges),
    }),
};

// Customers API calls
export const customersAPI = {
  getAll: (page = 1, limit = 10) =>
    apiCall(`${API_ENDPOINTS.CUSTOMERS}?page=${page}&limit=${limit}`),

  getById: (id) => apiCall(`${API_ENDPOINTS.CUSTOMERS}/${id}`),

  update: (id, customerData) =>
    apiCall(`${API_ENDPOINTS.CUSTOMERS}/${id}`, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(customerData),
    }),

  delete: (id) =>
    apiCall(`${API_ENDPOINTS.CUSTOMERS}/${id}`, {
      method: HTTP_METHODS.DELETE,
    }),
};

// Cart API calls
export const cartAPI = {
  get: () => apiCall(API_ENDPOINTS.CART),

  add: (productId, quantity) =>
    apiCall(API_ENDPOINTS.CART_ADD, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ product_id: productId, quantity }),
    }),

  update: (productId, quantity) =>
    apiCall(API_ENDPOINTS.CART_UPDATE, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify({ product_id: productId, quantity }),
    }),

  remove: (productId) =>
    apiCall(API_ENDPOINTS.CART_REMOVE, {
      method: HTTP_METHODS.DELETE,
      body: JSON.stringify({ product_id: productId }),
    }),
};

// Dashboard API calls
export const dashboardAPI = {
  getStats: () => apiCall(API_ENDPOINTS.DASHBOARD_STATS),
};
