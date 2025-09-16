// app/(admin)/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Clock,
  Calendar,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/admin/AdminLayout";
import { DashboardCards } from "@/components/admin/DashboardCards";
import { LoadingSpinner } from "@/components/common";
import { useAuth } from "@/hooks";
import { getDashboardStats } from "@/lib/mockData";
import { cn } from "@/lib/utils";

function DashboardContent() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard stats
    const loadStats = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        const dashboardStats = getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const recentActivities = [
    {
      id: 1,
      type: "product",
      title: "New product added",
      description: "iPhone 15 Pro Max was added to inventory",
      time: "2 hours ago",
      icon: Package,
    },
    {
      id: 2,
      type: "customer",
      title: "New customer registration",
      description: "Alice Anderson joined as a customer",
      time: "4 hours ago",
      icon: Users,
    },
    {
      id: 3,
      type: "sale",
      title: "Low stock alert",
      description: "Dell XPS 13 Laptop is running low on stock",
      time: "6 hours ago",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.first_name}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your store today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/admin/products/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
          {isAdmin() && (
            <Link href="/admin/users/create">
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Add User
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Dashboard Statistics */}
      <DashboardCards stats={stats} />

      {/* Additional Dashboard Sections */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-background border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </h3>
              <Link href="/activity">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-3 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <activity.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {recentActivities.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats & Today's Summary */}
        <div className="space-y-6">
          {/* Today's Summary */}
          <div className="bg-background border rounded-lg p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5" />
              Today's Summary
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Products Added
                </span>
                <span className="text-sm font-medium">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  New Customers
                </span>
                <span className="text-sm font-medium">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Stock Alerts
                </span>
                <span className="text-sm font-medium text-orange-600">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  User Updates
                </span>
                <span className="text-sm font-medium">1</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-background border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">System Status</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  File Storage
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Email Service
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-600">Degraded</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-background border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>

            <div className="space-y-2">
              <Link href="/admin/products">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Manage Products
                </Button>
              </Link>

              <Link href="/customers">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Customers
                </Button>
              </Link>

              {isAdmin() && (
                <Link href="/admin/users">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
              )}

              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Storefront
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout pageTitle="">
      <DashboardContent />
    </DashboardLayout>
  );
}
