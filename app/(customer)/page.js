// app/(customer)/page.js
"use client";

import Link from "next/link";
import { ArrowRight, Star, Package, Truck, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturedProductGrid } from "@/components/customer/ProductGrid";
import { LoadingSpinner, ErrorMessage } from "@/components/common";
import { useAuth } from "@/hooks";
import { useProducts } from "@/hooks/useProducts";

export default function CustomerHomepage() {
  const { isCustomer, customer } = useAuth();

  // Get featured products (highest rated and in stock)
  const {
    products: featuredProducts,
    loading: featuredLoading,
    error: featuredError,
  } = useProducts({
    rating: 4,
    in_stock: true,
    per_page: 6,
  });

  // Get new arrivals
  const {
    products: newArrivals,
    loading: newLoading,
    error: newError,
  } = useProducts({
    sort: "newest",
    per_page: 3,
  });

  const benefits = [
    {
      icon: Package,
      title: "Free Shipping",
      description: "On orders over $50",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "2-3 business days",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "100% secure checkout",
    },
    {
      icon: Star,
      title: "Quality Products",
      description: "Premium electronics only",
    },
  ];

  return (
    <div className="space-y-16 pb-10">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing
            <span className="text-primary"> Electronics</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From smartphones to laptops, find the latest technology at
            unbeatable prices. Quality products, fast shipping, and excellent
            customer service.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Shop Now
              </Button>
            </Link>
            {!isCustomer() && (
              <Link href="/register">
                <Button variant="outline" size="lg">
                  Create Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <benefit.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground">
            High ratings, quality guarantee, and customer favorites.
          </p>
        </div>

        {featuredLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : featuredError ? (
          <ErrorMessage
            title="Failed to load featured products"
            message={featuredError}
            variant="default"
          />
        ) : featuredProducts.length > 0 ? (
          <>
            <FeaturedProductGrid products={featuredProducts} />
            <div className="text-center mt-8">
              <Link href="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2 mx-auto"
                >
                  View All Products
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Featured Products</h3>
            <p className="text-muted-foreground">
              Check back later for featured products.
            </p>
          </div>
        )}
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">New Arrivals</h2>
            <p className="text-muted-foreground">
              Latest products added to our store
            </p>
          </div>
          <Link href="/products?sort=newest">
            <Button variant="outline" className="flex items-center gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {newLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : newError ? (
          <ErrorMessage
            title="Failed to load new arrivals"
            message={newError}
            variant="default"
          />
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newArrivals.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted border">
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      New
                    </div>
                    {product.image_path ? (
                      <img
                        src={product.image_path}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div className="flex h-full items-center justify-center group-hover:scale-105 transition-transform">
                      <Package className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {product.brand}
                    </p>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-primary">
                      ${product.sell_price}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No new arrivals at the moment.
            </p>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground">
            Browse our wide selection of electronics
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              name: "Smartphones",
              href: "/products?brand=Apple,Samsung",
              icon: "📱",
            },
            { name: "Laptops", href: "/products?category=laptop", icon: "💻" },
            { name: "Audio", href: "/products?category=audio", icon: "🎧" },
            { name: "Gaming", href: "/products?category=gaming", icon: "🎮" },
          ].map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group p-6 bg-background border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
