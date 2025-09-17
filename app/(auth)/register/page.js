// app/register/page.js
"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { GuestGuard } from "@/components/auth/AuthGuard";

function RegisterPageContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-card border shadow-lg rounded-lg p-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <GuestGuard redirectTo="/">
      <RegisterPageContent />
    </GuestGuard>
  );
}
