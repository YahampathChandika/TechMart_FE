// components/admin/ImageUpload.js
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRODUCT_CONFIG, ERROR_MESSAGES } from "@/lib/constants";

export const ImageUpload = ({
  value = "",
  onChange,
  onError = null,
  disabled = false,
  className = "",
  aspectRatio = "square", // "square", "landscape", "portrait"
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const aspectRatioClasses = {
    square: "aspect-square",
    landscape: "aspect-video",
    portrait: "aspect-[3/4]",
  };

  // Helper function to format image URL for Next.js Image component
  const formatImageUrl = (url) => {
    if (!url) return "";

    // If it's already a blob URL (for previews), return as-is
    if (url.startsWith("blob:")) return url;

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

  const validateFile = (file) => {
    // Check file type
    if (!PRODUCT_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return ERROR_MESSAGES.INVALID_FILE_TYPE;
    }

    // Check file size
    if (file.size > PRODUCT_CONFIG.MAX_IMAGE_SIZE) {
      return ERROR_MESSAGES.FILE_TOO_LARGE;
    }

    return null;
  };

  const handleFileSelect = async (file) => {
    setError("");

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      if (onError) onError(validationError);
      return;
    }

    setUploading(true);

    try {
      // Create preview immediately
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Store the file for later upload
      setSelectedFile(file);

      // Pass the actual File object to parent component
      if (onChange) {
        onChange(file);
      }
    } catch (err) {
      console.error("File selection failed:", err);
      setError("Failed to select file. Please try again.");
      if (onError) onError("Failed to select file. Please try again.");
      setPreview("");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (disabled) return;

    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    if (disabled) return;

    setPreview("");
    setError("");
    setSelectedFile(null);

    if (onChange) {
      onChange("");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  // Get the properly formatted image URL
  const imageUrl = formatImageUrl(preview);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors",
          aspectRatioClasses[aspectRatio],
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-300 bg-red-50",
          "min-h-[200px]"
        )}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={PRODUCT_CONFIG.ALLOWED_IMAGE_TYPES.join(",")}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        {imageUrl ? (
          /* Preview Image */
          <div className="relative w-full h-full group">
            <Image
              src={imageUrl}
              alt="Product preview"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={imageUrl.startsWith("blob:")} // Disable optimization for blob URLs
            />

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={openFileDialog}
                  disabled={disabled || uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Replace
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRemove}
                  disabled={disabled || uploading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>

            {/* Loading overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-2" />
                  <p className="text-sm">Processing...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Upload Prompt */
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 cursor-pointer"
            onClick={openFileDialog}
          >
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                {uploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted-foreground border-t-transparent" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-1">
                  {uploading ? "Processing..." : "Upload Product Image"}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop an image here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: JPEG, PNG, WebP (max{" "}
                  {PRODUCT_CONFIG.MAX_IMAGE_SIZE / (1024 * 1024)}MB)
                </p>
              </div>

              {!uploading && (
                <Button variant="outline" size="sm" disabled={disabled}>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Use high-quality images for best results</p>
        <p>• Square images (1:1 ratio) work best for product listings</p>
        <p>• Ensure good lighting and clear product visibility</p>
        <p>• Avoid images with watermarks or text overlays</p>
      </div>
    </div>
  );
};
