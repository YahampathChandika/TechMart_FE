// components/admin/AdminNavbar.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  Settings,
  Bell,
  Search,
  Menu,
  Home,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

export const AdminNavbar = ({
  onMenuClick,
  className = "",
  showSearch = true,
}) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/admin-login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden p-2"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        {showSearch && (
          <div className="flex-1 max-w-lg">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, customers, users..."
                  className="w-full h-9 pl-10 pr-4 text-sm border border-input rounded-md bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </form>
          </div>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                title="View Storefront"
              >
                <Home className="h-4 w-4" />
                <span className="hidden lg:inline">Store</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              title="Help & Documentation"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden lg:inline">Help</span>
            </Button>
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
          </Button>

          {/* Theme toggle */}
          <ThemeToggle variant="ghost" size="sm" />

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 h-9"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium leading-none">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
            </Button>

            {/* User dropdown menu */}
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-background border rounded-md shadow-lg z-50">
                  <div className="py-1">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-foreground">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize mt-1">
                        {user?.role} Account
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link href="/profile">
                        <button
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"
                        >
                          <User className="h-4 w-4" />
                          Profile Settings
                        </button>
                      </Link>

                      <Link href="/admin/dashboard">
                        <button
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Dashboard
                        </button>
                      </Link>

                      {/* Mobile-only quick actions */}
                      <div className="md:hidden border-t my-1">
                        <Link href="/">
                          <button
                            onClick={() => setUserMenuOpen(false)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"
                          >
                            <Home className="h-4 w-4" />
                            View Storefront
                          </button>
                        </Link>

                        <button
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"
                        >
                          <HelpCircle className="h-4 w-4" />
                          Help & Support
                        </button>
                      </div>

                      <div className="border-t my-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
