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

// Routes
export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ADMIN_LOGIN: "/admin-login",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/[id]",

  // Customer routes
  CUSTOMER_PROFILE: "/profile",
  CART: "/cart",
  SEARCH: "/search",

  // Admin routes
  ADMIN_DASHBOARD: "/dashboard",
  ADMIN_PRODUCTS: "/products",
  ADMIN_PRODUCT_CREATE: "/products/create",
  ADMIN_PRODUCT_EDIT: "/products/[id]/edit",
  ADMIN_CUSTOMERS: "/customers",
  ADMIN_USERS: "/users",
  ADMIN_USER_CREATE: "/users/create",
  ADMIN_USER_EDIT: "/users/[id]/edit",
  ADMIN_USER_PRIVILEGES: "/users/[id]/privileges",
  ADMIN_PROFILE: "/profile",
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
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 1000,
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
  NAME_TOO_SHORT: `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters`,
  NAME_TOO_LONG: `Name cannot exceed ${VALIDATION_RULES.NAME_MAX_LENGTH} characters`,
  DESCRIPTION_TOO_LONG: `Description cannot exceed ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters`,
  INVALID_FILE_TYPE: "Please select a valid image file (JPEG, PNG, or WebP)",
  FILE_TOO_LARGE: `File size cannot exceed ${
    PRODUCT_CONFIG.MAX_IMAGE_SIZE / (1024 * 1024)
  }MB`,
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action",
  SERVER_ERROR: "Server error. Please try again later.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  REGISTER_SUCCESS: "Registration successful",
  PROFILE_UPDATED: "Profile updated successfully",
  PRODUCT_CREATED: "Product created successfully",
  PRODUCT_UPDATED: "Product updated successfully",
  PRODUCT_DELETED: "Product deleted successfully",
  USER_CREATED: "User created successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  PRIVILEGES_UPDATED: "User privileges updated successfully",
  CART_ITEM_ADDED: "Item added to cart",
  CART_ITEM_UPDATED: "Cart updated successfully",
  CART_ITEM_REMOVED: "Item removed from cart",
  CART_CLEARED: "Cart cleared successfully",
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
