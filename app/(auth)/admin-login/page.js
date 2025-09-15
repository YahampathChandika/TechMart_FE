// app/(auth)/admin-login/page.js
"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { GuestGuard } from "@/components/auth/AuthGuard";

export default function AdminLoginPage() {
  return (
    <GuestGuard>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm type="admin" />
        </div>
      </div>
    </GuestGuard>
  );
}
