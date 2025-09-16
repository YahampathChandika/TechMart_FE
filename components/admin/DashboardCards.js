// components/admin/DashboardCards.js
"use client";

import Link from "next/link";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const DashboardCards = ({ stats, className = "" }) => {
  const cards = [
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      description: "Active products in store",
      icon: Package,
      color: "blue",
      href: "/admin/products",
      action: {
        label: "Add Product",
        href: "/admin/products/create",
        icon: Plus,
      },
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers || 0,
      description: "Registered customers",
      icon: Users,
      color: "green",
      href: "/admin/customers",
      action: {
        label: "View All",
        href: "/admin/customers",
        icon: Eye,
      },
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      description: "Admin & staff users",
      icon: ShoppingCart,
      color: "purple",
      href: "/admin/users",
      action: {
        label: "Add User",
        href: "/admin/users/create",
        icon: Plus,
      },
    },
    {
      title: "Inventory Value",
      value: `$${(stats?.totalProductValue || 0).toLocaleString()}`,
      description: "Total value of products",
      icon: DollarSign,
      color: "orange",
      href: "/admin/products",
      action: {
        label: "View Products",
        href: "/admin/products",
        icon: Package,
      },
    },
  ];

  const alertCards = [
    {
      title: "Low Stock Products",
      value: stats?.lowStockProducts || 0,
      description: "Products with < 20 items",
      icon: AlertTriangle,
      color: "yellow",
      href: "/admin/products?filter=low-stock",
      urgent: (stats?.lowStockProducts || 0) > 0,
    },
    {
      title: "Out of Stock",
      value: stats?.outOfStockProducts || 0,
      description: "Products completely sold out",
      icon: AlertTriangle,
      color: "red",
      href: "/admin/products?filter=out-of-stock",
      urgent: (stats?.outOfStockProducts || 0) > 0,
    },
  ];

  const getColorClasses = (color, variant = "default") => {
    const colors = {
      blue: {
        default: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
        urgent: "text-blue-700 bg-blue-50 border-blue-200",
      },
      green: {
        default: "text-green-600 bg-green-100 dark:bg-green-900/20",
        urgent: "text-green-700 bg-green-50 border-green-200",
      },
      purple: {
        default: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
        urgent: "text-purple-700 bg-purple-50 border-purple-200",
      },
      orange: {
        default: "text-orange-600 bg-orange-100 dark:bg-orange-900/20",
        urgent: "text-orange-700 bg-orange-50 border-orange-200",
      },
      yellow: {
        default: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20",
        urgent: "text-yellow-700 bg-yellow-50 border-yellow-200",
      },
      red: {
        default: "text-red-600 bg-red-100 dark:bg-red-900/20",
        urgent: "text-red-700 bg-red-50 border-red-200",
      },
    };
    return colors[color]?.[variant] || colors.blue[variant];
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-background border rounded-lg p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  getColorClasses(card.color)
                )}
              >
                <card.icon className="h-6 w-6" />
              </div>
              {card.action && (
                <Link href={card.action.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <card.action.icon className="h-4 w-4 mr-1" />
                    {card.action.label}
                  </Button>
                </Link>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold">{card.value}</h3>
              <p className="text-sm font-medium text-foreground">
                {card.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </div>

            <div className="mt-4">
              <Link href={card.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                >
                  View Details
                  <Eye className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alertCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <div
              className={cn(
                "bg-background border rounded-lg p-6 hover:shadow-md transition-all cursor-pointer",
                card.urgent && "border-2",
                card.urgent && getColorClasses(card.color, "urgent")
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      getColorClasses(card.color)
                    )}
                  >
                    <card.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{card.value}</h3>
                    <p className="text-sm font-medium">{card.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </div>

                {card.urgent && (
                  <div className="text-right">
                    <div className="text-xs font-medium text-red-600 mb-1">
                      Needs Attention
                    </div>
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/products/create">
            <Button
              variant="outline"
              className="w-full h-20 flex flex-col items-center gap-2 hover:bg-background"
            >
              <Package className="h-6 w-6" />
              <span className="text-sm">Add Product</span>
            </Button>
          </Link>

          <Link href="/admin/users/create">
            <Button
              variant="outline"
              className="w-full h-20 flex flex-col items-center gap-2 hover:bg-background"
            >
              <Users className="h-6 w-6" />
              <span className="text-sm">Add User</span>
            </Button>
          </Link>

          <Link href="/admin/products">
            <Button
              variant="outline"
              className="w-full h-20 flex flex-col items-center gap-2 hover:bg-background"
            >
              <Eye className="h-6 w-6" />
              <span className="text-sm">View Products</span>
            </Button>
          </Link>

          <Link href="/admin/customers">
            <Button
              variant="outline"
              className="w-full h-20 flex flex-col items-center gap-2 hover:bg-background"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="text-sm">View Customers</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
