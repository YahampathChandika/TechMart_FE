// components/common/Header.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  LogIn,
  Settings,
  LogOut,
  Home,
  Package,
  Users,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useCart } from "@/hooks";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { APP_CONFIG, USER_ROLES } from "@/lib/constants";

export const Header = ({ className = "" }) => {
  const {
    user,
    customer,
    isAuthenticated,
    isAdmin,
    isUser,
    isCustomer,
    logout,
  } = useAuth();
  const { getCartStats } = useCart();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const cartStats = getCartStats();
  const currentAuth = user || customer;

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  const navigateToProfile = () => {
    if (isCustomer()) {
      router.push("/profile");
    } else {
      router.push("/profile");
    }
    setUserMenuOpen(false);
  };

  const navigateToDashboard = () => {
    router.push("/dashboard");
    setUserMenuOpen(false);
  };

  const CustomerNavigation = () => (
    <>
      <Link
        href="/"
        className="text-foreground hover:text-primary transition-colors"
        onClick={() => setMobileMenuOpen(false)}
      >
        <Home className="w-4 h-4 md:hidden" />
        <span className="hidden md:inline">Home</span>
      </Link>
      <Link
        href="/products"
        className="text-foreground hover:text-primary transition-colors"
        onClick={() => setMobileMenuOpen(false)}
      >
        <Package className="w-4 h-4 md:hidden" />
        <span className="hidden md:inline">Products</span>
      </Link>
      <Link
        href="/search"
        className="text-foreground hover:text-primary transition-colors"
        onClick={() => setMobileMenuOpen(false)}
      >
        <Search className="w-4 h-4 md:hidden" />
        <span className="hidden md:inline">Search</span>
      </Link>
    </>
  );

  const AdminNavigation = () => (
    <>
      <Link
        href="/dashboard"
        className="text-foreground hover:text-primary transition-colors"
        onClick={() => setMobileMenuOpen(false)}
      >
        <BarChart3 className="w-4 h-4 md:hidden" />
        <span className="hidden md:inline">Dashboard</span>
      </Link>
      <Link
        href="/products"
        className="text-foreground hover:text-primary transition-colors"
        onClick={() => setMobileMenuOpen(false)}
      >
        <Package className="w-4 h-4 md:hidden" />
        <span className="hidden md:inline">Products</span>
      </Link>
      <Link
        href="/customers"
        className="text-foreground hover:text-primary transition-colors"
        onClick={() => setMobileMenuOpen(false)}
      >
        <Users className="w-4 h-4 md:hidden" />
        <span className="hidden md:inline">Customers</span>
      </Link>
      {isAdmin() && (
        <Link
          href="/users"
          className="text-foreground hover:text-primary transition-colors"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Settings className="w-4 h-4 md:hidden" />
          <span className="hidden md:inline">Users</span>
        </Link>
      )}
    </>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-left space-x-2">
            <h1 className="hidden sm:inline font-bold text-xl">
              🛒 {APP_CONFIG.name}
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm">
              Your Electronics Store
            </p>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isCustomer() && <CustomerNavigation />}
            {(isAdmin() || isUser()) && <AdminNavigation />}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Cart icon (customers only) */}
            {isCustomer() && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push("/cart")}
                className="relative"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartStats.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartStats.itemCount}
                  </span>
                )}
              </Button>
            )}

            {/* User menu or login */}
            {isAuthenticated() ? (
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden md:flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] truncate">
                    {currentAuth.first_name}
                  </span>
                </Button>

                {/* Mobile user button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="md:hidden"
                >
                  <User className="h-4 w-4" />
                </Button>

                {/* User dropdown menu */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-muted-foreground border-b">
                          <p className="font-medium text-foreground">
                            {currentAuth.first_name} {currentAuth.last_name}
                          </p>
                          <p className="capitalize">
                            {user ? user.role : "customer"}
                          </p>
                        </div>

                        {(isAdmin() || isUser()) && (
                          <button
                            onClick={navigateToDashboard}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center"
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Dashboard
                          </button>
                        )}

                        <button
                          onClick={navigateToProfile}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center text-red-600"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/login")}
                  className="hidden sm:flex"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push("/login")}
                  className="sm:hidden"
                >
                  <LogIn className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              {isCustomer() && <CustomerNavigation />}
              {(isAdmin() || isUser()) && <AdminNavigation />}

              {!isAuthenticated() && (
                <div className="pt-4 border-t">
                  <Link
                    href="/login"
                    className="flex items-center text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center text-foreground hover:text-primary transition-colors mt-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
