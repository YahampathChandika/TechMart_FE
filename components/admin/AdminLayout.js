// components/admin/AdminLayout.js
"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import { AdminGuard } from "@/components/auth/AuthGuard";
import { cn } from "@/lib/utils";

export const AdminLayout = ({
  children,
  className = "",
  showSearch = true,
  pageTitle = "",
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest("aside")) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [mobileMenuOpen]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AdminGuard>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex">
          <AdminSidebar
            isCollapsed={sidebarCollapsed}
            onToggle={toggleSidebar}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" />
            <div className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
              <AdminSidebar isCollapsed={false} onToggle={toggleMobileMenu} />
            </div>
          </>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Navigation */}
          <AdminNavbar onMenuClick={toggleMobileMenu} showSearch={showSearch} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className={cn("p-6", className)}>
              {/* Page Header */}
              {pageTitle && (
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-foreground">
                    {pageTitle}
                  </h1>
                </div>
              )}

              {/* Page Content */}
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
};

// Specialized layouts for different admin sections
export const ProductManagementLayout = ({ children, ...props }) => (
  <AdminLayout showSearch={true} {...props}>
    {children}
  </AdminLayout>
);

export const UserManagementLayout = ({ children, ...props }) => (
  <AdminLayout showSearch={true} {...props}>
    {children}
  </AdminLayout>
);

export const DashboardLayout = ({ children, ...props }) => (
  <AdminLayout showSearch={false} {...props}>
    {children}
  </AdminLayout>
);
