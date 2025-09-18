// app/admin/layout.js - FIXED TO ALLOW ALL AUTHENTICATED USERS
"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AdminLayout({ children }) {
  // CHANGED: Remove requireAdmin=true, only require authentication
  // This allows both admin and regular users to access admin area
  return (
    <AuthGuard requireAuth={true} requireAdmin={false}>
      {children}
    </AuthGuard>
  );
}
