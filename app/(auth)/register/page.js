// app/(auth)/register/page.js
"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { GuestGuard } from "@/components/auth/AuthGuard";

export default function RegisterPage() {
  return (
    <GuestGuard>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </GuestGuard>
  );
}
