// lib/constants.js

// App Configuration
export const APP_CONFIG = {
  name: "TechMart",
  description: "Your Electronics Store",
  version: "1.0.0",
  author: "TechMart Team",
};

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  CUSTOMER: "customer",
};

// User Privileges
export const USER_PRIVILEGES = {
  PRODUCT_ADD: "can_add_products",
  PRODUCT_UPDATE: "can_update_products",
  PRODUCT_DELETE: "can_delete_products",
};

// Product Configuration
export const PRODUCT_CONFIG = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  MIN_RATING: 1,
  MAX_RATING: 5,
  DEFAULT_RATING: 1,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: "techmart_user",
  CUSTOMER: "techmart_customer",
  USER_TYPE: "techmart_user_type",
  USER_TOKEN: "techmart_user_token",
  CUSTOMER_TOKEN: "techmart_customer_token",
  CART_PREFIX: "techmart_cart_",
  THEME: "techmart_theme",
};

// Routes - UPDATED TO FIX CONFLICTS
export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ADMIN_LOGIN: "/admin-login",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/[id]",

  // Customer routes (no conflicts with admin)
  CUSTOMER_PROFILE: "/profile",
  CART: "/cart",
  SEARCH: "/search",

  // Admin routes (prefixed with /admin to avoid conflicts)
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_PRODUCT_CREATE: "/admin/products/create",
  ADMIN_PRODUCT_EDIT: "/admin/products/[id]/edit",
  ADMIN_CUSTOMERS: "/admin/customers",
  ADMIN_USERS: "/admin/users",
  ADMIN_USER_CREATE: "/admin/users/create",
  ADMIN_USER_EDIT: "/admin/users/[id]/edit",
  ADMIN_USER_PRIVILEGES: "/admin/users/[id]/privileges",
  ADMIN_PROFILE: "/admin/profile",
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 100,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  CONTACT: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
};

// Status Options
export const STATUS_OPTIONS = {
  ACTIVE: true,
  INACTIVE: false,
};

// Theme Options
export const THEME_OPTIONS = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: "An unexpected error occurred. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION: "Please check your input and try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: "Login successful!",
  LOGOUT: "Logged out successfully!",
  REGISTER: "Registration successful!",
  UPDATE: "Updated successfully!",
  CREATE: "Created successfully!",
  DELETE: "Deleted successfully!",
};

// Product Brands (for filters)
export const PRODUCT_BRANDS = [
  "Apple",
  "Samsung",
  "Sony",
  "Dell",
  "HP",
  "Lenovo",
  "Microsoft",
  "Google",
  "Amazon",
  "Nintendo",
  "Razer",
  "Logitech",
  "ASUS",
  "Acer",
  "LG",
  "Other",
];

// Price Ranges (for filters)
export const PRICE_RANGES = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $300", min: 100, max: 300 },
  { label: "$300 - $500", min: 300, max: 500 },
  { label: "$500 - $1000", min: 500, max: 1000 },
  { label: "Over $1000", min: 1000, max: Infinity },
];

// Rating Options
export const RATING_OPTIONS = [
  { value: 1, label: "1 Star & Up" },
  { value: 2, label: "2 Stars & Up" },
  { value: 3, label: "3 Stars & Up" },
  { value: 4, label: "4 Stars & Up" },
  { value: 5, label: "5 Stars Only" },
];

// Table Configuration
export const TABLE_CONFIG = {
  ITEMS_PER_PAGE: 10,
  SORTABLE_COLUMNS: ["name", "brand", "price", "rating", "created_at"],
  DEFAULT_SORT: "created_at",
  DEFAULT_ORDER: "desc",
};

// Theme Configuration
export const THEME_CONFIG = {
  DEFAULT_THEME: "system",
  AVAILABLE_THEMES: ["light", "dark", "system"],
};
