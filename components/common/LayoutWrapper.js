// components/common/LayoutWrapper.js
"use client";

import { usePathname } from "next/navigation";
import { Header, Footer } from "@/components/common";

export const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();

  // Define routes that should not show the common header/footer
  const excludeHeaderFooter = [
    "/admin", // All admin routes
    "/auth", // All auth routes (if you want to exclude them too)
  ];

  // Check if current route should exclude header/footer
  const shouldExcludeHeaderFooter = excludeHeaderFooter.some((route) =>
    pathname.startsWith(route)
  );

  // If admin route, return content without header/footer
  if (shouldExcludeHeaderFooter) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  // For all other routes, return with header/footer
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
