// lib/mockData/users.js

export const mockUsers = [
  {
    id: 1,
    first_name: "John",
    last_name: "Smith",
    email: "admin@techmart.com",
    contact: "+1-555-0101",
    password: "admin123", // In real app, this would be hashed
    role: "admin",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah@techmart.com",
    contact: "+1-555-0102",
    password: "user123",
    role: "user",
    is_active: true,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    first_name: "Mike",
    last_name: "Davis",
    email: "mike@techmart.com",
    contact: "+1-555-0103",
    password: "user123",
    role: "user",
    is_active: true,
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
  },
  {
    id: 4,
    first_name: "Emily",
    last_name: "Wilson",
    email: "emily@techmart.com",
    contact: "+1-555-0104",
    password: "user123",
    role: "user",
    is_active: false, // Inactive user for testing
    created_at: "2024-01-04T00:00:00Z",
    updated_at: "2024-01-04T00:00:00Z",
  },
  {
    id: 5,
    first_name: "David",
    last_name: "Brown",
    email: "david@techmart.com",
    contact: "+1-555-0105",
    password: "user123",
    role: "user",
    is_active: true,
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
  },
];

// User privileges mapping
export const mockUserPrivileges = [
  {
    id: 1,
    user_id: 1, // Admin - has all privileges
    can_add_products: true,
    can_update_products: true,
    can_delete_products: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    user_id: 2, // Sarah - full product privileges
    can_add_products: true,
    can_update_products: true,
    can_delete_products: true,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    user_id: 3, // Mike - can add and update only
    can_add_products: true,
    can_update_products: true,
    can_delete_products: false,
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
  },
  {
    id: 4,
    user_id: 4, // Emily - read only (inactive anyway)
    can_add_products: false,
    can_update_products: false,
    can_delete_products: false,
    created_at: "2024-01-04T00:00:00Z",
    updated_at: "2024-01-04T00:00:00Z",
  },
  {
    id: 5,
    user_id: 5, // David - can only add products
    can_add_products: true,
    can_update_products: false,
    can_delete_products: false,
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
  },
];

// Helper functions
export const getActiveUsers = () => mockUsers.filter((user) => user.is_active);

export const getUserById = (id) =>
  mockUsers.find((user) => user.id === parseInt(id));

export const getUserByEmail = (email) =>
  mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());

export const getUserPrivileges = (userId) =>
  mockUserPrivileges.find(
    (privilege) => privilege.user_id === parseInt(userId)
  );

export const getAdminUsers = () =>
  mockUsers.filter((user) => user.role === "admin");

export const getRegularUsers = () =>
  mockUsers.filter((user) => user.role === "user");

export const searchUsers = (query) => {
  const searchTerm = query.toLowerCase();
  return mockUsers.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchTerm) ||
      user.last_name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.contact.includes(searchTerm)
  );
};

// Authentication helper
export const authenticateUser = (email, password) => {
  const user = getUserByEmail(email);
  if (user && user.password === password && user.is_active) {
    // In real app, you'd compare hashed passwords
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};
