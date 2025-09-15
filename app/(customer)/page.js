// app/(customer)/page.js
"use client";

import Link from "next/link";
import { ArrowRight, Star, Package, Truck, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturedProductGrid } from "@/components/customer/ProductGrid";
import { useAuth } from "@/hooks";
import { getActiveProducts } from "@/lib/mockData";

export default function CustomerHomepage() {
  const { isCustomer, customer } = useAuth();

  // Get featured products (highest rated and in stock)
  const allProducts = getActiveProducts();
  const featuredProducts = allProducts
    .filter((product) => product.rating >= 4 && product.quantity > 0)
    .slice(0, 6);

  const newArrivals = allProducts
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

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
    <div className="space-y-16">
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
                <Package className="h-5 w-5" />
                Shop All Products
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/search">
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <Search className="h-5 w-5" />
                Advanced Search
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Message for Logged In Customers */}
      {isCustomer() && customer && (
        <section className="bg-muted/50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">
            Welcome back, {customer.first_name}! 👋
          </h2>
          <p className="text-muted-foreground mb-4">
            Ready to discover some amazing new tech products?
          </p>
          <div className="flex gap-4">
            <Link href="/cart">
              <Button variant="outline">View Cart</Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline">My Profile</Button>
            </Link>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <benefit.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold">{benefit.title}</h3>
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
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked electronics from top brands. High ratings, quality
            guarantee, and customer favorites.
          </p>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newArrivals.map((product) => (
            <div key={product.id} className="group">
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted border">
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                    New
                  </div>
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
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground">
            Find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Smartphones", "Laptops", "Gaming", "Audio"].map((category) => (
            <Link
              key={category}
              href={`/search?category=${category.toLowerCase()}`}
              className="group"
            >
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-3 group-hover:bg-muted/80 transition-colors">
                <Package className="h-12 w-12 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <h3 className="text-center font-medium group-hover:text-primary transition-colors">
                {category}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
        <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust TechMart for their
          electronics needs. Quality products, competitive prices, fast
          delivery.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isCustomer() ? (
            <>
              <Link href="/register">
                <Button variant="secondary" size="lg">
                  Create Account
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Sign In
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/products">
              <Button variant="secondary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
