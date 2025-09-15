// lib/mockData/index.js

// Export all mock data and helper functions
export * from "./products.js";
export * from "./users.js";
export * from "./customers.js";

// Re-export for convenience
export { mockProducts } from "./products.js";
export { mockUsers, mockUserPrivileges } from "./users.js";
export { mockCustomers, mockShoppingCarts } from "./customers.js";

// Combined statistics for dashboard
export const getDashboardStats = () => {
  // Import here to avoid circular dependency
  const { mockProducts } = require("./products.js");
  const { mockUsers } = require("./users.js");
  const { mockCustomers } = require("./customers.js");

  return {
    totalProducts: mockProducts.filter((p) => p.is_active).length,
    totalCustomers: mockCustomers.filter((c) => c.is_active).length,
    totalUsers: mockUsers.filter((u) => u.is_active).length,
    totalProductValue: mockProducts
      .filter((p) => p.is_active)
      .reduce((sum, product) => sum + product.sell_price * product.quantity, 0),
    lowStockProducts: mockProducts.filter((p) => p.quantity < 20 && p.is_active)
      .length,
    outOfStockProducts: mockProducts.filter(
      (p) => p.quantity === 0 && p.is_active
    ).length,
  };
};

// Sample login credentials for testing
export const sampleCredentials = {
  admin: {
    email: "admin@techmart.com",
    password: "admin123",
    role: "admin",
  },
  user: {
    email: "sarah@techmart.com",
    password: "user123",
    role: "user",
  },
  customer: {
    email: "alice@example.com",
    password: "customer123",
    role: "customer",
  },
};

// Development helpers
export const seedDatabase = () => {
  // Import here to avoid circular dependency
  const { mockProducts } = require("./products.js");
  const { mockUsers } = require("./users.js");
  const { mockCustomers } = require("./customers.js");
  const { mockShoppingCarts } = require("./customers.js");

  console.log("🌱 Mock database seeded with:");
  console.log(`📦 ${mockProducts.length} products`);
  console.log(`👥 ${mockUsers.length} users/admins`);
  console.log(`🛒 ${mockCustomers.length} customers`);
  console.log(`🛍️ ${mockShoppingCarts.length} cart items`);
  console.log("\n🔐 Sample login credentials:");
  console.log(
    "Admin:",
    sampleCredentials.admin.email,
    "/",
    sampleCredentials.admin.password
  );
  console.log(
    "User:",
    sampleCredentials.user.email,
    "/",
    sampleCredentials.user.password
  );
  console.log(
    "Customer:",
    sampleCredentials.customer.email,
    "/",
    sampleCredentials.customer.password
  );
};
