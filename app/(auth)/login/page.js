// app/login/page.js
"use client";

import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { GuestGuard } from "@/components/auth/AuthGuard";
import { PageLoadingSpinner } from "@/components/common";

function LoginPageContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border shadow-lg rounded-lg p-6">
          <Suspense fallback={<PageLoadingSpinner />}>
            <LoginForm type="customer" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <GuestGuard redirectTo="/">
      <LoginPageContent />
    </GuestGuard>
  );
}
