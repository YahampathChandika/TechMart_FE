// app/page.js
"use client";

import { useAuth, useCart, useNextTheme } from "@/hooks";
import { Button } from "@/components/ui/button";
import { mockProducts, sampleCredentials, seedDatabase } from "@/lib/mockData";
import { Moon, Sun, ShoppingCart, User, LogIn } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const { user, customer, isAuthenticated, loginUser, loginCustomer, logout } =
    useAuth();
  const { getCartStats } = useCart();
  const { theme, setTheme } = useNextTheme();

  const cartStats = getCartStats();
  const currentAuth = user || customer;

  // Seed database on first load (development only)
  useEffect(() => {
    seedDatabase();
  }, []);

  // Quick login functions for development
  const quickLoginAdmin = async () => {
    await loginUser(
      sampleCredentials.admin.email,
      sampleCredentials.admin.password
    );
  };

  const quickLoginCustomer = async () => {
    await loginCustomer(
      sampleCredentials.customer.email,
      sampleCredentials.customer.password
    );
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 p-4 border rounded-lg">
        <div>
          <h1 className="text-3xl font-bold">🛒 TechMart</h1>
          <p className="text-muted-foreground">Your Electronics Store</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Cart Icon (for customers) */}
          {customer && (
            <Button variant="outline" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {cartStats.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartStats.itemCount}
                </span>
              )}
            </Button>
          )}

          {/* User Info */}
          {isAuthenticated() ? (
            <div className="flex items-center gap-2">
              <div className="text-sm">
                <p className="font-medium">
                  {currentAuth.first_name} {currentAuth.last_name}
                </p>
                <p className="text-muted-foreground">
                  {user ? user.role : "customer"}
                </p>
              </div>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="outline">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </header>

      {/* Development Section */}
      <section className="mb-8 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🚀 Development Status</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Project Setup Status */}
          <div>
            <h3 className="font-medium mb-3">✅ Completed Setup</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ Next.js 15 with App Router</li>
              <li>✅ Tailwind CSS v4</li>
              <li>✅ shadcn/ui Components</li>
              <li>✅ Mock Data ({mockProducts.length} products)</li>
              <li>✅ Context Providers (Auth, Cart, Theme)</li>
              <li>✅ API Utilities & Constants</li>
              <li>✅ Light/Dark Mode Toggle</li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-medium mb-3">🔧 Quick Actions (Development)</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={quickLoginAdmin}
                className="w-full justify-start"
              >
                <User className="h-4 w-4 mr-2" />
                Quick Login as Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={quickLoginCustomer}
                className="w-full justify-start"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Quick Login as Customer
              </Button>
              <div className="text-xs text-muted-foreground mt-2">
                <p>Admin: admin@techmart.com / admin123</p>
                <p>Customer: alice@example.com / customer123</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current State */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📊 Current State</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded">
            <h4 className="font-medium">Authentication</h4>
            <p className="text-sm text-muted-foreground">
              {isAuthenticated()
                ? `Logged in as ${currentAuth.first_name} (${
                    user ? user.role : "customer"
                  })`
                : "Not logged in"}
            </p>
          </div>

          <div className="p-4 bg-muted rounded">
            <h4 className="font-medium">Cart</h4>
            <p className="text-sm text-muted-foreground">
              {customer
                ? `${cartStats.itemCount} items - $${cartStats.total}`
                : "Login as customer to see cart"}
            </p>
          </div>

          <div className="p-4 bg-muted rounded">
            <h4 className="font-medium">Theme</h4>
            <p className="text-sm text-muted-foreground">
              Current: {theme || "system"}
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🎯 Next Steps</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Frontend Components to Build</h3>
            <ul className="space-y-1 text-sm">
              <li>🔲 Login/Register Forms</li>
              <li>🔲 Product Grid & Cards</li>
              <li>🔲 Shopping Cart UI</li>
              <li>🔲 Admin Dashboard</li>
              <li>🔲 Product Management</li>
              <li>🔲 User Management</li>
              <li>🔲 Customer Management</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">Backend (Laravel) Setup</h3>
            <ul className="space-y-1 text-sm">
              <li>🔲 Laravel Project Setup</li>
              <li>🔲 Database Migrations</li>
              <li>🔲 API Controllers</li>
              <li>🔲 Authentication System</li>
              <li>🔲 Image Upload</li>
              <li>🔲 API Integration</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
