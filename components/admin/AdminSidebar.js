// components/admin/AdminSidebar.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  User,
  ShoppingCart,
  FileText,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/constants";

export const AdminSidebar = ({ isCollapsed = false, onToggle }) => {
  const { user, isAdmin } = useAuth();
  const pathname = usePathname();

  const navigation = [
    {
      title: "Overview",
      items: [
        {
          name: "Dashboard",
          href: "/admin/dashboard",
          icon: BarChart3,
          description: "Analytics & overview",
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          name: "Products",
          href: "/admin/products",
          icon: Package,
          description: "Manage products",
          excludePaths: ["/admin/products/create"], // Don't highlight for create page
        },
        {
          name: "Customers",
          href: "/admin/customers",
          icon: Users,
          description: "Manage customers",
        },
        ...(isAdmin()
          ? [
              {
                name: "Users",
                href: "/admin/users",
                icon: Settings,
                description: "Manage admin users",
                excludePaths: ["/admin/users/create"], // Don't highlight for create page
              },
            ]
          : []),
      ],
    },
    {
      title: "Quick Actions",
      items: [
        {
          name: "Add Product",
          href: "/admin/products/create",
          icon: Package,
          variant: "create",
          description: "Create new product",
        },
        ...(isAdmin()
          ? [
              {
                name: "Add User",
                href: "/admin/users/create",
                icon: User,
                variant: "create",
                description: "Create new user",
              },
            ]
          : []),
      ],
    },
  ];

  const isActive = (item) => {
    const { href, excludePaths = [] } = item;

    // For exact matches (like dashboard)
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard";
    }

    // For create pages, only highlight if exact match
    if (href.includes("/create")) {
      return pathname === href;
    }

    // For regular pages, check if pathname starts with href but exclude specific paths
    if (pathname.startsWith(href)) {
      // Don't highlight if current path is in excludePaths
      return !excludePaths.some((excludePath) => pathname === excludePath);
    }

    return false;
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-background border-r transition-all duration-300 ease-in-out h-full", // Added h-full
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <Link
            href="/admin/dashboard"
            className="flex items-center space-x-2 w-full"
          >
            <div className="flex flex-col">
              <span className="hidden sm:inline font-bold text-xl">
                🛒 {APP_CONFIG.name}
              </span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </Link>
        )}

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn("p-2", isCollapsed && "mx-auto")}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "space-x-3"
          )}
        >
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navigation.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md text-sm font-medium transition-colors group relative",
                      isCollapsed
                        ? "justify-center p-3" // Center content when collapsed
                        : "px-3 py-2", // Normal padding when expanded
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      item.variant === "create" &&
                        !active &&
                        "border border-dashed border-muted-foreground/30 hover:border-primary/50"
                    )}
                    title={isCollapsed ? item.name : ""}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        !isCollapsed && "mr-3"
                      )}
                    />
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span>{item.name}</span>
                        </div>
                        {item.description && (
                          <p className="text-xs opacity-75 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Active indicator */}
                    {active && !isCollapsed && (
                      <div className="w-1 h-6 bg-primary-foreground rounded-full ml-auto flex-shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t space-y-2">
        {!isCollapsed ? (
          <>
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2 justify-start"
              >
                <Home className="h-4 w-4" />
                View Storefront
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2 justify-start mt-2"
              >
                <Settings className="h-4 w-4" />
                Profile Settings
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="w-full p-2 flex items-center justify-center"
                title="View Storefront"
              >
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="w-full p-2 flex items-center justify-center"
                title="Profile Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </>
        )}
      </div>
    </aside>
  );
};
