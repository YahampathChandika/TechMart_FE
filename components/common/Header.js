// components/common/Header.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Star,
  ChevronDown,
  Home,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [cartHovered, setCartHovered] = useState(false);

  const currentAuth = user || customer;

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={ROUTES.HOME}
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  🛒
                </span>
              </div>
              <div className="flex flex-col">
                <h1 className="font-semibold text-lg tracking-tight text-foreground">
                  {APP_CONFIG.name}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Premium Electronics
                </p>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {!isAdminRoute ? (
              <>
                <Link
                  href={ROUTES.HOME}
                  className={`text-sm font-medium transition-colors hover:text-primary relative py-2 flex items-center space-x-1 ${
                    pathname === ROUTES.HOME
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                      : "text-foreground/80"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                <Link
                  href={ROUTES.PRODUCTS}
                  className={`text-sm font-medium transition-colors hover:text-primary relative py-2 flex items-center space-x-1 ${
                    pathname === ROUTES.PRODUCTS
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                      : "text-foreground/80"
                  }`}
                >
                  <Package className="h-4 w-4" />
                  <span>Products</span>
                </Link>
                {/* Admin Dashboard Link for Admins/Staff */}
                {(isAdmin() || isUser()) && (
                  <Link
                    href={ROUTES.ADMIN_DASHBOARD}
                    className="text-sm font-medium transition-colors hover:text-primary text-foreground/80 flex items-center space-x-1"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.HOME}
                  className="text-sm font-medium transition-colors hover:text-primary text-foreground/80 flex items-center space-x-1"
                >
                  <Star className="h-4 w-4" />
                  <span>Storefront</span>
                </Link>
                <Link
                  href={ROUTES.ADMIN_DASHBOARD}
                  className={`text-sm font-medium transition-colors hover:text-primary relative py-2 flex items-center space-x-1 ${
                    pathname === ROUTES.ADMIN_DASHBOARD
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                      : "text-foreground/80"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </>
            )}
          </nav>

          {/* Admin Breadcrumb - Shown on admin routes */}
          {isAdminRoute && (
            <nav className="hidden lg:flex items-center space-x-2 text-sm">
              <Link
                href={ROUTES.ADMIN_DASHBOARD}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Admin Panel
              </Link>
              <ChevronDown className="h-3 w-3 rotate-[-90deg] text-muted-foreground" />
              <span className="text-foreground font-medium capitalize">
                {pathname.split("/").pop() || "Dashboard"}
              </span>
            </nav>
          )}

          <div className="flex items-center space-x-3">
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
                    className="relative hover:bg-accent/50 transition-colors"
                    disabled={cartLoading}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-xs font-semibold"
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
                    className="flex items-center space-x-2 hover:bg-accent/50 transition-colors px-3"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium leading-none">
                        {currentAuth.first_name} {currentAuth.last_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isAdmin() ? "Admin" : isUser() ? "Staff" : "Customer"}
                      </span>
                    </div>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2 border-b">
                    <div className="text-sm font-medium text-foreground">
                      {currentAuth.first_name} {currentAuth.last_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {currentAuth.email}
                    </div>
                  </div>

                  {/* Customer Menu Items */}
                  {isCustomer() && !isAdminRoute && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href={ROUTES.CUSTOMER_PROFILE}
                          className="flex items-center cursor-pointer"
                        >
                          <User className="mr-3 h-4 w-4" />
                          <span>Profile Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={ROUTES.CART}
                          className="flex items-center cursor-pointer"
                        >
                          <ShoppingCart className="mr-3 h-4 w-4" />
                          <span>Shopping Cart</span>
                          {cartCount > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-auto text-xs"
                            >
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
                          className="flex items-center cursor-pointer"
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          <span>
                            {isAdminRoute ? "Dashboard" : "Admin Panel"}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      {isAdminRoute && (
                        <DropdownMenuItem asChild>
                          <Link
                            href={ROUTES.HOME}
                            className="flex items-center cursor-pointer"
                          >
                            <Star className="mr-3 h-4 w-4" />
                            <span>View Storefront</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                    </>
                  )}

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="font-medium"
                  asChild
                >
                  <Link href={ROUTES.LOGIN}>Sign In</Link>
                </Button>
                {/* <Button size="sm" className="font-medium" asChild>
                  <Link href={ROUTES.REGISTER}>Get Started</Link>
                </Button> */}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
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

        {/* Mobile Menu - Fixed z-index issue */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-full z-[100] border-b bg-background shadow-lg">
            <div className="px-4 py-4 space-y-3">
              {/* Mobile Navigation */}
              <nav className="space-y-1">
                {!isAdminRoute ? (
                  <>
                    <Link
                      href={ROUTES.HOME}
                      className={`flex items-center py-3 px-2 text-sm font-medium rounded-lg transition-colors ${
                        pathname === ROUTES.HOME
                          ? "text-primary bg-primary/5"
                          : "text-foreground/80 hover:text-primary hover:bg-accent/50"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Home className="mr-3 h-4 w-4" />
                      Home
                    </Link>
                    <Link
                      href={ROUTES.PRODUCTS}
                      className={`flex items-center py-3 px-2 text-sm font-medium rounded-lg transition-colors ${
                        pathname === ROUTES.PRODUCTS
                          ? "text-primary bg-primary/5"
                          : "text-foreground/80 hover:text-primary hover:bg-accent/50"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Package className="mr-3 h-4 w-4" />
                      Products
                    </Link>
                    {/* Admin Dashboard Link for Mobile */}
                    {(isAdmin() || isUser()) && (
                      <Link
                        href={ROUTES.ADMIN_DASHBOARD}
                        className="flex items-center py-3 px-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent/50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      href={ROUTES.HOME}
                      className="flex items-center py-3 px-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent/50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Star className="mr-3 h-4 w-4" />
                      Storefront
                    </Link>
                    <Link
                      href={ROUTES.ADMIN_DASHBOARD}
                      className={`flex items-center py-3 px-2 text-sm font-medium rounded-lg transition-colors ${
                        pathname === ROUTES.ADMIN_DASHBOARD
                          ? "text-primary bg-primary/5"
                          : "text-foreground/80 hover:text-primary hover:bg-accent/50"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Dashboard
                    </Link>
                  </>
                )}

                {/* Customer Mobile Menu */}
                {isCustomer() && !isAdminRoute && (
                  <>
                    <Link
                      href={ROUTES.CART}
                      className="flex items-center justify-between py-3 px-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent/50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <ShoppingCart className="mr-3 h-4 w-4" />
                        <span>Shopping Cart</span>
                      </div>
                      {cartCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {cartCount}
                        </Badge>
                      )}
                    </Link>
                    <Link
                      href={ROUTES.CUSTOMER_PROFILE}
                      className="flex items-center py-3 px-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent/50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </>
                )}
              </nav>

              {/* Mobile Auth */}
              <div className="pt-3 border-t">
                {!currentAuth ? (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full font-medium"
                      asChild
                    >
                      <Link
                        href={ROUTES.LOGIN}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </Button>
                    {/* <Button size="sm" className="hiddenw-full font-medium" asChild>
                      <Link
                        href={ROUTES.REGISTER}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </Button> */}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full font-medium text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
