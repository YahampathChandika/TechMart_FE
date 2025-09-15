// app/page.js
"use client";

import Link from "next/link";
import { useAuth, useCart, useNextTheme } from "@/hooks";
import { Button } from "@/components/ui/button";
import { mockProducts, seedDatabase } from "@/lib/mockData";
import {
  ShoppingCart,
  User,
  LogIn,
  Package,
  BarChart3,
  Users,
} from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const { user, customer, isAuthenticated, isAdmin, isUser, isCustomer } =
    useAuth();
  const { getCartStats } = useCart();

  const cartStats = getCartStats();
  const currentAuth = user || customer;

  // Seed database on first load (development only)
  useEffect(() => {
    seedDatabase();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to <span className="text-primary">TechMart</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your trusted electronics store offering premium gadgets and technology
          at competitive prices. Quality products, fast delivery, excellent
          service.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isAuthenticated() ? (
            <div className="flex gap-4">
              {isCustomer() && (
                <>
                  <Link href="/products">
                    <Button size="lg" className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Browse Products
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <Button
                      variant="outline"
                      size="lg"
                      className="relative flex items-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      View Cart
                      {cartStats.itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartStats.itemCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                </>
              )}

              {(isAdmin() || isUser()) && (
                <>
                  <Link href="/dashboard">
                    <Button size="lg" className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <Package className="h-5 w-5" />
                      Manage Products
                    </Button>
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login">
                <Button size="lg" className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <User className="h-5 w-5" />
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* User Status */}
      {isAuthenticated() && (
        <section className="mb-12 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            👋 Welcome back, {currentAuth.first_name}!
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-background rounded border">
              <h4 className="font-medium">Account Type</h4>
              <p className="text-sm text-muted-foreground capitalize">
                {user ? user.role : "Customer"}
              </p>
            </div>

            {isCustomer() && (
              <div className="p-4 bg-background rounded border">
                <h4 className="font-medium">Shopping Cart</h4>
                <p className="text-sm text-muted-foreground">
                  {cartStats.itemCount} items - ${cartStats.total}
                </p>
              </div>
            )}

            <div className="p-4 bg-background rounded border">
              <h4 className="font-medium">Account Status</h4>
              <p className="text-sm text-green-600">Active</p>
            </div>
          </div>
        </section>
      )}

      {/* Development Section */}
      <section className="mb-12 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🚀 Development Progress</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Completed Features */}
          <div>
            <h3 className="font-medium mb-3 text-green-600">
              ✅ Phase 1 & 2 Complete
            </h3>
            <ul className="space-y-2 text-sm">
              <li>✅ Next.js 15 with App Router</li>
              <li>✅ Tailwind CSS v4 & shadcn/ui</li>
              <li>✅ Context Providers (Auth, Cart, Theme)</li>
              <li>✅ Foundation Components</li>
              <li>✅ Header/Footer Navigation</li>
              <li>✅ Authentication Forms</li>
              <li>✅ Route Guards & Protection</li>
              <li>✅ Light/Dark Mode Toggle</li>
              <li>✅ Responsive Design</li>
            </ul>
          </div>

          {/* Current Status */}
          <div>
            <h3 className="font-medium mb-3">🎯 Available Features</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Customer Registration</span>
                <Link href="/register">
                  <Button size="sm" variant="outline">
                    Try It
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Customer Login</span>
                <Link href="/login">
                  <Button size="sm" variant="outline">
                    Try It
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Admin/User Login</span>
                <Link href="/admin-login">
                  <Button size="sm" variant="outline">
                    Try It
                  </Button>
                </Link>
              </div>
              <div className="text-xs text-muted-foreground mt-4 p-3 bg-background rounded">
                <p className="font-medium mb-1">Test Credentials:</p>
                <p>Customer: alice@example.com / customer123</p>
                <p>Admin: admin@techmart.com / admin123</p>
                <p>User: sarah@techmart.com / user123</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Phase Preview */}
      <section className="p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🔮 Coming Next - Phase 3</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Product Display Components</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>🔲 Product Card Design</li>
              <li>🔲 Product Grid Layout</li>
              <li>🔲 Product Detail View</li>
              <li>🔲 Search & Filter System</li>
              <li>🔲 Rating Display</li>
              <li>🔲 Image Gallery</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">Customer Pages</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>🔲 Homepage Product Showcase</li>
              <li>🔲 Products Listing Page</li>
              <li>🔲 Advanced Search Page</li>
              <li>🔲 Product Detail Pages</li>
              <li>🔲 Category Navigation</li>
              <li>🔲 Price Range Filters</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Mock data ready:{" "}
            <span className="font-medium text-foreground">
              {mockProducts.length} products
            </span>{" "}
            across multiple electronics brands
          </p>
        </div>
      </section>
    </div>
  );
}
