// app/admin/dashboard/page.js
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
import { LoadingSpinner, ErrorMessage } from "@/components/common";
import { useAuth } from "@/hooks";
import { authAPI } from "@/lib/api";
import { cn } from "@/lib/utils";

function DashboardContent() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transform backend data to frontend format
  const transformDashboardData = (backendData) => {
    const transformed = {
      totalProducts: backendData.products?.active || 0,
      totalCustomers: backendData.customers?.active || 0,
      totalUsers: backendData.users?.active_users || 0,
      lowStockProducts: backendData.products?.low_stock || 0,
      outOfStockProducts: backendData.products?.out_of_stock || 0,
    };

    // Calculate total product value from sales data (admin only)
    if (backendData.sales?.total_cart_value) {
      transformed.totalProductValue = backendData.sales.total_cart_value;
    } else {
      // Fallback for non-admin users
      transformed.totalProductValue = 0;
    }

    return transformed;
  };

  // Transform backend activities to frontend format
  const transformActivitiesData = (activitiesData) => {
    const activities = [];

    // Add recent products as activities
    if (activitiesData.recent_products) {
      activitiesData.recent_products.slice(0, 3).forEach((product, index) => {
        activities.push({
          id: `product_${product.id}`,
          type: "product",
          title: "New product added",
          description: `${product.brand} ${product.name} was added to inventory`,
          time: formatTimeAgo(product.created_at),
          icon: Package,
        });
      });
    }

    // Add recent customers as activities (admin only)
    if (activitiesData.recent_customers) {
      activitiesData.recent_customers.slice(0, 2).forEach((customer, index) => {
        activities.push({
          id: `customer_${customer.id}`,
          type: "customer",
          title: "New customer registration",
          description: `${customer.first_name} ${customer.last_name} joined as a customer`,
          time: formatTimeAgo(customer.created_at),
          icon: Users,
        });
      });
    }

    return activities.slice(0, 5); // Limit to 5 activities
  };

  // Format time ago helper
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load dashboard stats
        const statsResult = await authAPI.getDashboardStats();

        if (!statsResult.success) {
          throw new Error(
            statsResult.error || "Failed to load dashboard statistics"
          );
        }

        const transformedStats = transformDashboardData(statsResult.data);
        setStats(transformedStats);

        // Load recent activities (optional - don't fail if it doesn't work)
        try {
          const activitiesResult = await authAPI.getDashboardActivities();
          if (activitiesResult.success && activitiesResult.data) {
            const transformedActivities = transformActivitiesData(
              activitiesResult.data
            );
            setRecentActivities(transformedActivities);
          }
        } catch (activitiesError) {
          console.warn("Failed to load recent activities:", activitiesError);
          // Use fallback activities if API fails
          setRecentActivities([
            {
              id: 1,
              type: "system",
              title: "Dashboard loaded",
              description: "Dashboard statistics updated successfully",
              time: "Just now",
              icon: BarChart3,
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.first_name}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s what&apos;s happening with your store today.
            </p>
          </div>
        </div>

        <ErrorMessage
          title="Failed to Load Dashboard"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.first_name}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your store today.
          </p>
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
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-3 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <activity.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activities to show</p>
                </div>
              )}
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

            <Link href="/admin/customers">
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
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout pageTitle="">
      <DashboardContent />
    </DashboardLayout>
  );
}
