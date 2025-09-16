// app/admin/layout.js
"use client";

import { AdminGuard } from "@/components/auth/AuthGuard";

export default function AdminLayout({ children }) {
  return <AdminGuard requireAdmin={true}>{children}</AdminGuard>;
}
