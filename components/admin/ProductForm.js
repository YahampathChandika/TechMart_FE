// components/admin/ProductForm.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Save, ArrowLeft, Star, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "./ImageUpload";
import {
  ErrorMessage,
  FormFieldError,
  InlineLoadingSpinner,
} from "@/components/common";
import { useAuth } from "@/hooks";
import { permissions } from "@/lib/auth";
import { validation } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  PRODUCT_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PRODUCT_BRANDS,
} from "@/lib/constants";

export const ProductForm = ({
  product = null, // null for create, product object for edit
  onSubmit,
  onCancel = null,
  loading = false,
  error = null,
  className = "",
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const isEdit = !!product;
  const pageTitle = isEdit ? "Edit Product" : "Create New Product";

  // Permission checks
  const canAdd = permissions.canAddProducts(user, null);
  const canUpdate = permissions.canUpdateProducts(user, null);
  const hasPermission = isEdit ? canUpdate : canAdd;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty, isSubmitting },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      brand: product?.brand || "",
      name: product?.name || "",
      image_path: product?.image_path || "",
      quantity: product?.quantity || 0,
      cost_price: product?.cost_price || 0,
      sell_price: product?.sell_price || 0,
      description: product?.description || "",
      rating: product?.rating || 1,
      is_active: product?.is_active ?? true,
    },
  });

  const watchedFields = watch();

  const handleImageChange = (fileOrUrl) => {
    if (typeof fileOrUrl === "string") {
      // It's a URL (for removing images or existing images)
      setValue("image_path", fileOrUrl);
      setSelectedImage(null);
    } else if (fileOrUrl instanceof File) {
      // It's a new file
      setSelectedImage(fileOrUrl);
      setValue("image_path", fileOrUrl.name); // Set a preview value
    } else {
      // It's empty/null
      setValue("image_path", "");
      setSelectedImage(null);
    }
  };

  const handleFormSubmit = async (data) => {
    if (!hasPermission) {
      setSubmitError("You don't have permission to perform this action.");
      return;
    }

    setSubmitError("");
    setSubmitSuccess("");

    try {
      // Determine if we need to send FormData (for file uploads) or JSON
      if (selectedImage instanceof File) {
        // Create FormData for file upload
        const formData = new FormData();

        // Add all form fields
        formData.append("name", data.name);
        formData.append("description", data.description || "");
        formData.append("brand", data.brand);
        formData.append("cost_price", parseFloat(data.cost_price) || 0);
        formData.append("sell_price", parseFloat(data.sell_price) || 0);
        formData.append("quantity", parseInt(data.quantity, 10) || 0);
        formData.append("rating", parseInt(data.rating, 10) || 1);
        formData.append("is_active", data.is_active ? "1" : "0");

        // Add image file
        formData.append("image", selectedImage);

        if (onSubmit) {
          await onSubmit(formData);
        }
      } else {
        // Send as JSON (no new image file)
        const formattedData = {
          ...data,
          quantity: parseInt(data.quantity, 10),
          cost_price: parseFloat(data.cost_price),
          sell_price: parseFloat(data.sell_price),
          rating: parseInt(data.rating, 10),
          created_by: user?.id,
        };

        if (onSubmit) {
          await onSubmit(formattedData);
        }
      }

      setSubmitSuccess(
        isEdit
          ? SUCCESS_MESSAGES.PRODUCT_UPDATED
          : SUCCESS_MESSAGES.PRODUCT_CREATED
      );

      // Redirect after success
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    } catch (err) {
      console.error("Form submission error:", err);
      setSubmitError(
        err.message || "Failed to save product. Please try again."
      );
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const renderRatingStars = () => {
    const rating = watchedFields.rating || 1;
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue("rating", star, { shouldDirty: true })}
            className={cn(
              "p-1 rounded transition-colors",
              star <= rating
                ? "text-yellow-400"
                : "text-gray-300 hover:text-yellow-300"
            )}
          >
            <Star
              className={cn("h-6 w-6", star <= rating ? "fill-current" : "")}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          ({rating} star{rating !== 1 ? "s" : ""})
        </span>
      </div>
    );
  };

  if (!hasPermission) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <ErrorMessage
          title="Access Denied"
          message="You don't have permission to manage products."
          variant="destructive"
        />
      </div>
    );
  }

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
            <p className="text-muted-foreground">
              {isEdit
                ? "Update product information and settings"
                : "Add a new product to your store inventory"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {(error || submitError) && (
        <ErrorMessage
          title="Error"
          message={error || submitError}
          className="mb-6"
          onDismiss={() => {
            setSubmitError("");
          }}
        />
      )}

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-300">{submitSuccess}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Product Image</label>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a high-quality image of your product
                </p>
              </div>

              <Controller
                name="image_path"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={product?.image_path || ""} // Show existing image if editing
                    onChange={handleImageChange}
                    disabled={loading || isSubmitting}
                    aspectRatio="square"
                  />
                )}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="md:col-span-2 space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Product Name *
                  </label>
                  <input
                    {...register("name", {
                      required: ERROR_MESSAGES.REQUIRED_FIELD,
                      minLength: {
                        value: 2,
                        message: "Product name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 100,
                        message: "Product name cannot exceed 100 characters",
                      },
                    })}
                    type="text"
                    id="name"
                    placeholder="Enter product name"
                    disabled={loading || isSubmitting}
                    className={cn(
                      "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                      "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      errors.name && "border-destructive"
                    )}
                  />
                  <FormFieldError message={errors.name?.message} />
                </div>

                {/* Brand */}
                <div className="space-y-2">
                  <label htmlFor="brand" className="text-sm font-medium">
                    Brand *
                  </label>
                  <select
                    {...register("brand", {
                      required: ERROR_MESSAGES.REQUIRED_FIELD,
                    })}
                    id="brand"
                    disabled={loading || isSubmitting}
                    className={cn(
                      "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      errors.brand && "border-destructive"
                    )}
                  >
                    <option value="">Select a brand</option>
                    {PRODUCT_BRANDS.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  <FormFieldError message={errors.brand?.message} />
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Quantity *
                  </label>
                  <input
                    {...register("quantity", {
                      required: ERROR_MESSAGES.REQUIRED_FIELD,
                      min: {
                        value: 0,
                        message: "Quantity cannot be negative",
                      },
                      max: {
                        value: 9999,
                        message: "Quantity cannot exceed 9999",
                      },
                    })}
                    type="number"
                    id="quantity"
                    min="0"
                    max="9999"
                    placeholder="0"
                    disabled={loading || isSubmitting}
                    className={cn(
                      "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                      "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      errors.quantity && "border-destructive"
                    )}
                  />
                  <FormFieldError message={errors.quantity?.message} />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description *
                </label>
                <textarea
                  {...register("description", {
                    required: ERROR_MESSAGES.REQUIRED_FIELD,
                    maxLength: {
                      value: 1000,
                      message: ERROR_MESSAGES.DESCRIPTION_TOO_LONG,
                    },
                  })}
                  id="description"
                  rows={4}
                  placeholder="Describe the product features, specifications, and benefits..."
                  disabled={loading || isSubmitting}
                  className={cn(
                    "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors",
                    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
                    errors.description && "border-destructive"
                  )}
                />
                <div className="flex justify-between items-center">
                  <FormFieldError message={errors.description?.message} />
                  <span className="text-xs text-muted-foreground">
                    {watchedFields.description?.length || 0}/1000
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing</h3>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Cost Price */}
                <div className="space-y-2">
                  <label htmlFor="cost_price" className="text-sm font-medium">
                    Cost Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <input
                      {...register("cost_price", {
                        required: ERROR_MESSAGES.REQUIRED_FIELD,
                        min: {
                          value: 0.01,
                          message: "Cost price must be greater than 0",
                        },
                        max: {
                          value: 99999.99,
                          message: "Cost price cannot exceed $99,999.99",
                        },
                      })}
                      type="number"
                      id="cost_price"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      disabled={loading || isSubmitting}
                      className={cn(
                        "flex h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 py-1 text-sm shadow-sm transition-colors",
                        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        errors.cost_price && "border-destructive"
                      )}
                    />
                  </div>
                  <FormFieldError message={errors.cost_price?.message} />
                </div>

                {/* Sell Price */}
                <div className="space-y-2">
                  <label htmlFor="sell_price" className="text-sm font-medium">
                    Sell Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <input
                      {...register("sell_price", {
                        required: ERROR_MESSAGES.REQUIRED_FIELD,
                        min: {
                          value: 0.01,
                          message: "Sell price must be greater than 0",
                        },
                        max: {
                          value: 99999.99,
                          message: "Sell price cannot exceed $99,999.99",
                        },
                        validate: (value) => {
                          const costPrice = parseFloat(
                            watchedFields.cost_price
                          );
                          const sellPrice = parseFloat(value);
                          if (costPrice && sellPrice < costPrice) {
                            return "Sell price should be greater than cost price";
                          }
                          return true;
                        },
                      })}
                      type="number"
                      id="sell_price"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      disabled={loading || isSubmitting}
                      className={cn(
                        "flex h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 py-1 text-sm shadow-sm transition-colors",
                        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        errors.sell_price && "border-destructive"
                      )}
                    />
                  </div>
                  <FormFieldError message={errors.sell_price?.message} />
                </div>
              </div>

              {/* Profit Margin Display */}
              {watchedFields.cost_price && watchedFields.sell_price && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Profit Margin:
                    </span>
                    <span className="font-medium">
                      $
                      {(
                        parseFloat(watchedFields.sell_price) -
                        parseFloat(watchedFields.cost_price)
                      ).toFixed(2)}
                      (
                      {(
                        ((parseFloat(watchedFields.sell_price) -
                          parseFloat(watchedFields.cost_price)) /
                          parseFloat(watchedFields.cost_price)) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Settings</h3>

              {/* Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Rating *</label>
                <div className="space-y-2">
                  {renderRatingStars()}
                  <p className="text-xs text-muted-foreground">
                    Set the initial rating for this product (1-5 stars)
                  </p>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <input
                  {...register("is_active")}
                  type="checkbox"
                  id="is_active"
                  disabled={loading || isSubmitting}
                  className="h-4 w-4 rounded border-input"
                />
                <label htmlFor="is_active" className="text-sm font-medium">
                  Active Product
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Inactive products won&apos;t be visible to customers
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button
            type="submit"
            disabled={loading || isSubmitting || !isDirty}
            className="flex items-center gap-2"
          >
            {loading || isSubmitting ? (
              <>
                <InlineLoadingSpinner />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEdit ? "Update Product" : "Create Product"}
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading || isSubmitting}
          >
            Cancel
          </Button>

          {isEdit && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => reset()}
              disabled={loading || isSubmitting || !isDirty}
              className="sm:ml-auto"
            >
              Reset Changes
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
