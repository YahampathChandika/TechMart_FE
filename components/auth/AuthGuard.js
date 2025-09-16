// components/auth/AuthGuard.js
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks";
import { PageLoadingSpinner, UnauthorizedError } from "@/components/common";
import { routeGuards } from "@/lib/auth";

export const AuthGuard = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  requireCustomer = false,
  fallback = null,
}) => {
  const {
    user,
    customer,
    loading: authLoading,
    isAuthenticated,
    isAdmin,
    isUser,
    isCustomer,
  } = useAuth();

  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      setChecking(false);
    }
  }, [authLoading]);

  // Show loading while checking auth
  if (authLoading || checking) {
    return <PageLoadingSpinner text="Checking authentication..." />;
  }

  // If authentication is not required, show content
  if (!requireAuth) {
    return children;
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    const loginUrl =
      requireAdmin || requireCustomer === false
        ? `/admin-login?redirect=${encodeURIComponent(pathname)}`
        : `/login?redirect=${encodeURIComponent(pathname)}`;

    if (fallback) {
      return fallback;
    }

    router.push(loginUrl);
    return <PageLoadingSpinner text="Redirecting to login..." />;
  }

  // Check admin requirements
  if (requireAdmin && !isAdmin()) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <UnauthorizedError
          onLogin={() =>
            router.push(`/admin-login?redirect=${encodeURIComponent(pathname)}`)
          }
        />
      </div>
    );
  }

  // Check customer requirements
  if (requireCustomer && !isCustomer()) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <UnauthorizedError
          onLogin={() =>
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
          }
        />
      </div>
    );
  }

  // Check if admin/user is trying to access customer-only pages
  if (isCustomer() && (requireAdmin || pathname.startsWith("/admin/dashboard"))) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <UnauthorizedError />
      </div>
    );
  }

  // Check if customer is trying to access admin pages
  if ((isAdmin() || isUser()) && requireCustomer) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <UnauthorizedError />
      </div>
    );
  }

  // All checks passed, render children
  return children;
};

// Specialized guards for common use cases
export const AdminGuard = ({ children, fallback = null }) => (
  <AuthGuard requireAuth={true} requireAdmin={true} fallback={fallback}>
    {children}
  </AuthGuard>
);

export const CustomerGuard = ({ children, fallback = null }) => (
  <AuthGuard requireAuth={true} requireCustomer={true} fallback={fallback}>
    {children}
  </AuthGuard>
);

export const GuestGuard = ({ children, redirectTo = "/" }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated()) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, router, redirectTo]);

  if (loading) {
    return <PageLoadingSpinner text="Loading..." />;
  }

  if (isAuthenticated()) {
    return <PageLoadingSpinner text="Redirecting..." />;
  }

  return children;
};

// Hook for using auth guards in components
export const useAuthGuard = (options = {}) => {
  const {
    requireAuth = true,
    requireAdmin = false,
    requireCustomer = false,
    redirectTo = null,
  } = options;

  const {
    user,
    customer,
    loading,
    isAuthenticated,
    isAdmin,
    isUser,
    isCustomer,
  } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  const checkAccess = () => {
    if (loading) return { allowed: null, loading: true };

    if (!requireAuth) return { allowed: true, loading: false };

    if (!isAuthenticated()) {
      return {
        allowed: false,
        loading: false,
        reason: "not_authenticated",
        redirectUrl: redirectTo || (requireAdmin ? "/admin-login" : "/login"),
      };
    }

    if (requireAdmin && !isAdmin()) {
      return {
        allowed: false,
        loading: false,
        reason: "insufficient_permissions",
        redirectUrl: "/admin-login",
      };
    }

    if (requireCustomer && !isCustomer()) {
      return {
        allowed: false,
        loading: false,
        reason: "wrong_user_type",
        redirectUrl: "/login",
      };
    }

    return { allowed: true, loading: false };
  };

  const redirect = (url) => {
    const redirectUrl = url || (requireAdmin ? "/admin-login" : "/login");
    router.push(`${redirectUrl}?redirect=${encodeURIComponent(pathname)}`);
  };

  return {
    ...checkAccess(),
    redirect,
    user: user || customer,
    userType: user?.role || "customer",
  };
};
