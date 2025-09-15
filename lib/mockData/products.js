// lib/mockData/products.js

export const mockProducts = [
  {
    id: 1,
    brand: "Apple",
    name: "iPhone 15 Pro Max",
    image_path: "/images/products/iphone-15-pro.jpg",
    quantity: 25,
    cost_price: 999.99,
    sell_price: 1199.99,
    description:
      "The most advanced iPhone yet with titanium design, A17 Pro chip, and professional camera system. Features ProMotion display and advanced computational photography.",
    rating: 5,
    is_active: true,
    created_by: 1, // admin user
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    brand: "Samsung",
    name: "Galaxy S24 Ultra",
    image_path: "/images/products/galaxy-s24-ultra.jpg",
    quantity: 18,
    cost_price: 899.99,
    sell_price: 1099.99,
    description:
      "Premium Android flagship with S Pen, 200MP camera, and AI-powered features. 6.8-inch Dynamic AMOLED display with 120Hz refresh rate.",
    rating: 5,
    is_active: true,
    created_by: 1,
    created_at: "2024-01-16T09:15:00Z",
    updated_at: "2024-01-16T09:15:00Z",
  },
  {
    id: 3,
    brand: "Sony",
    name: "WH-1000XM5 Headphones",
    image_path: "/images/products/sony-wh1000xm5.jpg",
    quantity: 45,
    cost_price: 299.99,
    sell_price: 399.99,
    description:
      "Industry-leading noise canceling wireless headphones with 30-hour battery life. Crystal clear hands-free calling and Alexa voice control.",
    rating: 4,
    is_active: true,
    created_by: 2, // regular user
    created_at: "2024-01-17T14:20:00Z",
    updated_at: "2024-01-17T14:20:00Z",
  },
  {
    id: 4,
    brand: "Dell",
    name: "XPS 13 Laptop",
    image_path: "/images/products/dell-xps-13.jpg",
    quantity: 12,
    cost_price: 1199.99,
    sell_price: 1499.99,
    description:
      "Ultra-thin and light laptop with 13.4-inch InfinityEdge display. Intel Core i7 processor, 16GB RAM, and 512GB SSD for powerful performance.",
    rating: 4,
    is_active: true,
    created_by: 1,
    created_at: "2024-01-18T11:45:00Z",
    updated_at: "2024-01-18T11:45:00Z",
  },
  {
    id: 5,
    brand: "Nintendo",
    name: "Switch OLED Console",
    image_path: "/images/products/nintendo-switch-oled.jpg",
    quantity: 32,
    cost_price: 279.99,
    sell_price: 349.99,
    description:
      "Enhanced Nintendo Switch with vibrant 7-inch OLED screen, enhanced audio, and improved kickstand. Perfect for gaming on-the-go or docked.",
    rating: 5,
    is_active: true,
    created_by: 2,
    created_at: "2024-01-19T16:30:00Z",
    updated_at: "2024-01-19T16:30:00Z",
  },
  {
    id: 6,
    brand: "Amazon",
    name: "Echo Dot (5th Gen)",
    image_path: "/images/products/echo-dot-5th.jpg",
    quantity: 67,
    cost_price: 29.99,
    sell_price: 49.99,
    description:
      "Smart speaker with Alexa, improved audio quality, and temperature sensor. Control smart home devices with voice commands.",
    rating: 4,
    is_active: true,
    created_by: 1,
    created_at: "2024-01-20T08:00:00Z",
    updated_at: "2024-01-20T08:00:00Z",
  },
  {
    id: 7,
    brand: "Apple",
    name: "iPad Air 11-inch",
    image_path: "/images/products/ipad-air-11.jpg",
    quantity: 22,
    cost_price: 499.99,
    sell_price: 599.99,
    description:
      "Powerful and portable iPad with M2 chip, 11-inch Liquid Retina display, and all-day battery life. Compatible with Apple Pencil and Magic Keyboard.",
    rating: 5,
    is_active: true,
    created_by: 2,
    created_at: "2024-01-21T13:15:00Z",
    updated_at: "2024-01-21T13:15:00Z",
  },
  {
    id: 8,
    brand: "Google",
    name: "Pixel 8 Pro",
    image_path: "/images/products/google-pixel-8-pro.jpg",
    quantity: 15,
    cost_price: 799.99,
    sell_price: 999.99,
    description:
      "Google's flagship phone with AI-powered camera features, pure Android experience, and 7 years of security updates. Enhanced Magic Eraser and Best Take.",
    rating: 4,
    is_active: true,
    created_by: 1,
    created_at: "2024-01-22T10:45:00Z",
    updated_at: "2024-01-22T10:45:00Z",
  },
  {
    id: 9,
    brand: "Razer",
    name: "DeathAdder V3 Gaming Mouse",
    image_path: "/images/products/razer-deathadder-v3.jpg",
    quantity: 38,
    cost_price: 59.99,
    sell_price: 89.99,
    description:
      "Ergonomic gaming mouse with Focus Pro 30K sensor, 90-hour battery life, and hyperspeed wireless connectivity. Perfect for competitive gaming.",
    rating: 4,
    is_active: true,
    created_by: 2,
    created_at: "2024-01-23T15:20:00Z",
    updated_at: "2024-01-23T15:20:00Z",
  },
  {
    id: 10,
    brand: "Logitech",
    name: "MX Master 3S Wireless Mouse",
    image_path: "/images/products/logitech-mx-master-3s.jpg",
    quantity: 28,
    cost_price: 79.99,
    sell_price: 109.99,
    description:
      "Advanced wireless mouse for productivity with ultra-precise scrolling, customizable buttons, and multi-device connectivity. Works on any surface.",
    rating: 5,
    is_active: true,
    created_by: 1,
    created_at: "2024-01-24T12:00:00Z",
    updated_at: "2024-01-24T12:00:00Z",
  },
];

// Helper functions for filtering products
export const getActiveProducts = () =>
  mockProducts.filter((product) => product.is_active);

export const getProductsByBrand = (brand) =>
  mockProducts.filter(
    (product) =>
      product.brand.toLowerCase().includes(brand.toLowerCase()) &&
      product.is_active
  );

export const getProductsByPriceRange = (minPrice, maxPrice) =>
  mockProducts.filter(
    (product) =>
      product.sell_price >= minPrice &&
      product.sell_price <= maxPrice &&
      product.is_active
  );

export const getProductsByRating = (minRating) =>
  mockProducts.filter(
    (product) => product.rating >= minRating && product.is_active
  );

export const searchProducts = (query) =>
  mockProducts.filter(
    (product) =>
      (product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())) &&
      product.is_active
  );

export const getProductById = (id) =>
  mockProducts.find((product) => product.id === parseInt(id));

// Get unique brands for filter dropdown
export const getUniqueBrands = () =>
  [...new Set(mockProducts.map((product) => product.brand))].sort();
