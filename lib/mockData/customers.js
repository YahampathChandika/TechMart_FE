// lib/mockData/customers.js

export const mockCustomers = [
  {
    id: 1,
    first_name: "Alice",
    last_name: "Anderson",
    email: "alice@example.com",
    contact: "+1-555-1001",
    password: "customer123", // In real app, this would be hashed
    is_active: true,
    created_at: "2024-01-10T09:00:00Z",
    updated_at: "2024-01-10T09:00:00Z",
  },
  {
    id: 2,
    first_name: "Bob",
    last_name: "Thompson",
    email: "bob@example.com",
    contact: "+1-555-1002",
    password: "customer123",
    is_active: true,
    created_at: "2024-01-11T10:30:00Z",
    updated_at: "2024-01-11T10:30:00Z",
  },
  {
    id: 3,
    first_name: "Carol",
    last_name: "Martinez",
    email: "carol@example.com",
    contact: "+1-555-1003",
    password: "customer123",
    is_active: true,
    created_at: "2024-01-12T14:15:00Z",
    updated_at: "2024-01-12T14:15:00Z",
  },
  {
    id: 4,
    first_name: "Daniel",
    last_name: "Garcia",
    email: "daniel@example.com",
    contact: "+1-555-1004",
    password: "customer123",
    is_active: false, // Inactive customer for testing
    created_at: "2024-01-13T11:45:00Z",
    updated_at: "2024-01-13T11:45:00Z",
  },
  {
    id: 5,
    first_name: "Eva",
    last_name: "Rodriguez",
    email: "eva@example.com",
    contact: "+1-555-1005",
    password: "customer123",
    is_active: true,
    created_at: "2024-01-14T16:20:00Z",
    updated_at: "2024-01-14T16:20:00Z",
  },
  {
    id: 6,
    first_name: "Frank",
    last_name: "Lee",
    email: "frank@example.com",
    contact: "+1-555-1006",
    password: "customer123",
    is_active: true,
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-01-15T08:30:00Z",
  },
  {
    id: 7,
    first_name: "Grace",
    last_name: "Kim",
    email: "grace@example.com",
    contact: "+1-555-1007",
    password: "customer123",
    is_active: true,
    created_at: "2024-01-16T13:00:00Z",
    updated_at: "2024-01-16T13:00:00Z",
  },
  {
    id: 8,
    first_name: "Henry",
    last_name: "Wang",
    email: "henry@example.com",
    contact: "+1-555-1008",
    password: "customer123",
    is_active: true,
    created_at: "2024-01-17T15:45:00Z",
    updated_at: "2024-01-17T15:45:00Z",
  },
];

// Mock shopping cart data
export const mockShoppingCarts = [
  {
    id: 1,
    customer_id: 1, // Alice
    product_id: 1, // iPhone 15 Pro Max
    quantity: 1,
    created_at: "2024-01-25T10:00:00Z",
    updated_at: "2024-01-25T10:00:00Z",
  },
  {
    id: 2,
    customer_id: 1, // Alice
    product_id: 3, // Sony Headphones
    quantity: 2,
    created_at: "2024-01-25T10:15:00Z",
    updated_at: "2024-01-25T10:15:00Z",
  },
  {
    id: 3,
    customer_id: 2, // Bob
    product_id: 5, // Nintendo Switch
    quantity: 1,
    created_at: "2024-01-25T11:30:00Z",
    updated_at: "2024-01-25T11:30:00Z",
  },
  {
    id: 4,
    customer_id: 3, // Carol
    product_id: 7, // iPad Air
    quantity: 1,
    created_at: "2024-01-25T14:20:00Z",
    updated_at: "2024-01-25T14:20:00Z",
  },
  {
    id: 5,
    customer_id: 3, // Carol
    product_id: 9, // Razer Mouse
    quantity: 3,
    created_at: "2024-01-25T14:25:00Z",
    updated_at: "2024-01-25T14:25:00Z",
  },
];

// Helper functions
export const getActiveCustomers = () =>
  mockCustomers.filter((customer) => customer.is_active);

export const getCustomerById = (id) =>
  mockCustomers.find((customer) => customer.id === parseInt(id));

export const getCustomerByEmail = (email) =>
  mockCustomers.find(
    (customer) => customer.email.toLowerCase() === email.toLowerCase()
  );

export const searchCustomers = (query) => {
  const searchTerm = query.toLowerCase();
  return mockCustomers.filter(
    (customer) =>
      customer.first_name.toLowerCase().includes(searchTerm) ||
      customer.last_name.toLowerCase().includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm) ||
      customer.contact.includes(searchTerm)
  );
};

// Cart helper functions
export const getCustomerCart = (customerId) =>
  mockShoppingCarts.filter((item) => item.customer_id === parseInt(customerId));

export const getCartItemCount = (customerId) => {
  const cartItems = getCustomerCart(customerId);
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

export const addToCart = (customerId, productId, quantity = 1) => {
  const existingItem = mockShoppingCarts.find(
    (item) => item.customer_id === customerId && item.product_id === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.updated_at = new Date().toISOString();
  } else {
    const newItem = {
      id: mockShoppingCarts.length + 1,
      customer_id: customerId,
      product_id: productId,
      quantity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockShoppingCarts.push(newItem);
  }
};

export const removeFromCart = (customerId, productId) => {
  const index = mockShoppingCarts.findIndex(
    (item) => item.customer_id === customerId && item.product_id === productId
  );
  if (index > -1) {
    mockShoppingCarts.splice(index, 1);
  }
};

export const updateCartQuantity = (customerId, productId, quantity) => {
  const item = mockShoppingCarts.find(
    (item) => item.customer_id === customerId && item.product_id === productId
  );
  if (item) {
    if (quantity <= 0) {
      removeFromCart(customerId, productId);
    } else {
      item.quantity = quantity;
      item.updated_at = new Date().toISOString();
    }
  }
};

// Authentication helper for customers
export const authenticateCustomer = (email, password) => {
  const customer = getCustomerByEmail(email);
  if (customer && customer.password === password && customer.is_active) {
    // In real app, you'd compare hashed passwords
    const { password: _, ...customerWithoutPassword } = customer;
    return customerWithoutPassword;
  }
  return null;
};
