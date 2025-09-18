// components/customer/ProductDetails.js
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  Package,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useCart } from "@/hooks";
import { cn } from "@/lib/utils";
import { InlineLoadingSpinner } from "@/components/common";

export const ProductDetails = ({ product, className = "" }) => {
  const { isCustomer } = useAuth();
  const { addToCart, updateQuantity, isInCart, getProductQuantityInCart } =
    useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const cartQuantity = getProductQuantityInCart(product.id);
  const inCart = isInCart(product.id);

  // Helper function to format image URL for Next.js Image component
  const formatImageUrl = (url) => {
    if (!url) return null;

    // If it's already an absolute URL, return as-is
    if (url.startsWith("http://") || url.startsWith("https://")) return url;

    // If it's a relative path from backend, convert to absolute URL
    if (url.startsWith("storage/")) {
      return `http://localhost:8000/${url}`;
    }

    // If it starts with a slash, it's already formatted for Next.js
    if (url.startsWith("/")) return url;

    // Default fallback - add leading slash
    return `/${url}`;
  };

  const handleAddToCart = async () => {
    if (!isCustomer()) {
      // Redirect to login page if not logged in
      window.location.href = "/login";
      return;
    }

    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      setQuantity(1); // Reset quantity after adding
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAdding(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-5 w-5",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
          />
        ))}
        <span className="ml-2 text-lg">({rating})</span>
      </div>
    );
  };

  const features = [
    {
      icon: Package,
      title: "Free Shipping",
      description: "On orders over $50",
    },
    {
      icon: RotateCcw,
      title: "30-Day Returns",
      description: "Easy return policy",
    },
    {
      icon: Shield,
      title: "Warranty",
      description: "1 year manufacturer warranty",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "2-3 business days",
    },
  ];

  // Get properly formatted image URL
  const mainImageUrl = formatImageUrl(product.image_url || product.image_path);

  // Placeholder for multiple images (in real app, product would have image array)
  const images = mainImageUrl ? [mainImageUrl] : [];

  return (
    <div className={cn("", className)}>
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      {/* Back Button */}
      <div className="mb-6">
        <Link href="/products">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square relative overflow-hidden rounded-lg bg-muted border">
            {!imageError && mainImageUrl ? (
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Image not available</p>
                </div>
              </div>
            )}

            {/* Stock Badge */}
            {product.quantity === 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                Out of Stock
              </div>
            )}

            {/* Low Stock Badge */}
            {product.quantity > 0 && product.quantity <= 5 && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                Only {product.quantity} left
              </div>
            )}
          </div>

          {/* Thumbnail Images (placeholder for future enhancement) */}
          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative w-20 h-20 rounded-md overflow-hidden border-2 transition-colors",
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          {/* Brand and Name */}
          <div>
            <p className="text-lg text-muted-foreground font-medium mb-2">
              {product.brand}
            </p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-4 mb-4">
              {renderStars(product.rating)}
              <button className="text-sm text-primary hover:underline">
                Read reviews
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold text-primary">
              ${product.sell_price}
            </span>
            {product.cost_price !== product.sell_price && (
              <span className="text-xl text-muted-foreground line-through">
                ${product.cost_price}
              </span>
            )}
            {product.cost_price !== product.sell_price && (
              <span className="bg-red-100 dark:bg-red-900/20 text-red-600 px-2 py-1 rounded text-sm font-medium">
                {Math.round(
                  ((product.cost_price - product.sell_price) /
                    product.cost_price) *
                    100
                )}
                % OFF
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                product.quantity > 5
                  ? "bg-green-500"
                  : product.quantity > 0
                  ? "bg-orange-500"
                  : "bg-red-500"
              )}
            />
            <span
              className={cn(
                "font-medium",
                product.quantity > 5
                  ? "text-green-600"
                  : product.quantity > 0
                  ? "text-orange-600"
                  : "text-red-600"
              )}
            >
              {product.quantity > 5
                ? "In Stock"
                : product.quantity > 0
                ? `Only ${product.quantity} left`
                : "Out of Stock"}
            </span>
            {product.quantity > 5 && (
              <span className="text-muted-foreground">
                ({product.quantity} available)
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Purchase Section */}
          {product.quantity > 0 && (
            <div className="space-y-4 p-4 border rounded-lg">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.quantity}
                    className="p-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={adding}
                  size="lg"
                  className="flex-1"
                >
                  {adding ? (
                    <>
                      <InlineLoadingSpinner className="mr-2" />
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Heart className="h-5 w-5" />
                  Wishlist
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-5 w-5" />
                  Share
                </Button>
              </div>

              {/* Current Cart Status */}
              {inCart && isCustomer() && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">
                    <strong>{cartQuantity}</strong> of this item already in your
                    cart.
                    <Link
                      href="/cart"
                      className="text-primary hover:underline ml-2"
                    >
                      View Cart
                    </Link>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 border rounded-lg"
              >
                <feature.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">SKU:</span>
              <span>PROD-{product.id.toString().padStart(6, "0")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span>Electronics</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Added:</span>
              <span>{new Date(product.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
