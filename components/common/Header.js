// components/common/Header.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Package,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import { MiniCartDropdown } from "../customer/MiniCartDropdown";
import { useAuth } from "@/hooks";
import { useCart } from "@/contexts/CartContext";
import { APP_CONFIG, ROUTES } from "@/lib/constants";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, customer, logout, isCustomer, isAdmin, isUser } = useAuth();
  const { cartCount, loading: cartLoading } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartHovered, setCartHovered] = useState(false);

  const currentAuth = user || customer;

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={ROUTES.HOME}
            className="flex flex-col items-left space-x-2"
          >
            <h1 className="hidden sm:inline font-bold text-xl">
              🛒 {APP_CONFIG.name}
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm">
              Your Electronics Store
            </p>
          </Link>

          {/* Navigation - Hidden on admin routes */}
          {!isAdminRoute && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href={ROUTES.HOME}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === ROUTES.HOME
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Home
              </Link>
              <Link
                href={ROUTES.PRODUCTS}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === ROUTES.PRODUCTS
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Products
              </Link>
            </nav>
          )}

          {/* Admin Breadcrumb - Shown on admin routes */}
          {isAdminRoute && (
            <nav className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <Link
                href={ROUTES.ADMIN_DASHBOARD}
                className="hover:text-primary transition-colors"
              >
                Admin Panel
              </Link>
              <span>/</span>
              <span className="text-foreground capitalize">
                {pathname.split("/").pop() || "Dashboard"}
              </span>
            </nav>
          )}

          {/* Search Bar - Only on non-admin routes */}
          {!isAdminRoute && (
            <div className="hidden md:flex flex-1 max-w-sm mx-6">
              <form onSubmit={handleSearch} className="flex w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="ml-1"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart - Only for customers on non-admin routes */}
            {isCustomer() && !isAdminRoute && (
              <div
                className="relative"
                onMouseEnter={() => setCartHovered(true)}
                onMouseLeave={() => setCartHovered(false)}
              >
                <Link href={ROUTES.CART}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative"
                    disabled={cartLoading}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
                      >
                        {cartCount > 99 ? "99+" : cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* Mini Cart Dropdown on Hover */}
                {cartHovered && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <MiniCartDropdown onClose={() => setCartHovered(false)} />
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            {currentAuth ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden md:block">
                      {currentAuth.first_name} {currentAuth.last_name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    Signed in as
                  </div>
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {currentAuth.first_name} {currentAuth.last_name}
                  </div>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    {currentAuth.email}
                  </div>
                  <DropdownMenuSeparator />

                  {/* Customer Menu Items */}
                  {isCustomer() && !isAdminRoute && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href={ROUTES.CUSTOMER_PROFILE}
                          className="flex items-center"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={ROUTES.CART} className="flex items-center">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Shopping Cart
                          {cartCount > 0 && (
                            <Badge variant="secondary" className="ml-auto">
                              {cartCount}
                            </Badge>
                          )}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {/* Admin/User Menu Items */}
                  {(isAdmin() || isUser()) && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href={ROUTES.ADMIN_DASHBOARD}
                          className="flex items-center"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          {isAdminRoute ? "Dashboard" : "Admin Panel"}
                        </Link>
                      </DropdownMenuItem>
                      {isAdminRoute && (
                        <DropdownMenuItem asChild>
                          <Link
                            href={ROUTES.HOME}
                            className="flex items-center"
                          >
                            <Star className="mr-2 h-4 w-4" />
                            View Storefront
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                    </>
                  )}

                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={ROUTES.LOGIN}>Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={ROUTES.REGISTER}>Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            {/* Mobile Search - Only on non-admin routes */}
            {!isAdminRoute && (
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </form>
            )}

            {/* Mobile Navigation - Only on non-admin routes */}
            {!isAdminRoute && (
              <nav className="space-y-2">
                <Link
                  href={ROUTES.HOME}
                  className={`block py-2 text-sm font-medium transition-colors ${
                    pathname === ROUTES.HOME
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href={ROUTES.PRODUCTS}
                  className={`block py-2 text-sm font-medium transition-colors ${
                    pathname === ROUTES.PRODUCTS
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>

                {/* Customer Mobile Menu */}
                {isCustomer() && (
                  <>
                    <Link
                      href={ROUTES.CART}
                      className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Cart {cartCount > 0 && `(${cartCount})`}
                    </Link>
                    <Link
                      href={ROUTES.CUSTOMER_PROFILE}
                      className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </>
                )}
              </nav>
            )}

            {/* Mobile Auth */}
            {!currentAuth && (
              <div className="mt-4 space-y-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link
                    href={ROUTES.LOGIN}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" className="w-full" asChild>
                  <Link
                    href={ROUTES.REGISTER}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Logout */}
            {currentAuth && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
