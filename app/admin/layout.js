// app/(admin)/layout.js
"use client";

import { AdminGuard } from "@/components/auth/AuthGuard";

export default function AdminRootLayout({ children }) {
  return (
    <AdminGuard>
      {/* 
        Admin pages will use their own layout system with AdminLayout component
        This root layout just provides the auth guard wrapper
      */}
      <div className="min-h-screen bg-background">{children}</div>
    </AdminGuard>
  );
}
