// app/admin-login/page.js
"use client";

import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { GuestGuard } from "@/components/auth/AuthGuard";
import { PageLoadingSpinner } from "@/components/common";

function AdminLoginPageContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border shadow-xl rounded-lg p-6">
          <Suspense fallback={<PageLoadingSpinner />}>
            <LoginForm type="admin" />
          </Suspense>
        </div>

        {/* Admin Login Info */}
        <div className="mt-6 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Admin & Staff Access
            </h3>
            <p className="text-xs text-blue-600 dark:text-blue-300">
              This portal is for administrators and authorized staff members
              only. Unauthorized access attempts are logged and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <GuestGuard redirectTo="/admin/dashboard">
      <AdminLoginPageContent />
    </GuestGuard>
  );
}
