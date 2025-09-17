// hooks/useProducts.js - UPDATED VERSION
"use client";

import { useState, useEffect, useCallback } from "react";
import { authAPI } from "@/lib/api";

// Hook for admin product management (uses admin endpoints)
export const useProducts = (params = {}, isAdmin = true) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use admin or public endpoint based on context
      const response = isAdmin
        ? await authAPI.getProducts(params) // Admin endpoint: /api/admin/products
        : await authAPI.getPublicProducts(params); // Public endpoint: /api/products

      if (response.success) {
        // Handle different response structures
        const productsData = response.data?.data || response.data || [];
        setProducts(Array.isArray(productsData) ? productsData : []);
        setMeta(response.meta || response.data?.meta || null);
        setFilters(response.filters || response.data?.filters || null);
      } else {
        throw new Error(response.error || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params), isAdmin]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refresh = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    meta,
    filters,
    refresh,
  };
};

// Hook for getting a single product (context-aware)
export const useProduct = (id, isAdmin = true) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use admin or public endpoint based on context
      const response = isAdmin
        ? await authAPI.getProduct(id) // Admin endpoint: /api/admin/products/{id}
        : await authAPI.getPublicProduct(id); // Public endpoint: /api/products/{id}

      if (response.success) {
        const productData = response.data?.product || response.data;
        setProduct(productData);
      } else {
        throw new Error(response.error || "Product not found");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err.message);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id, isAdmin]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const refresh = useCallback(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refresh,
  };
};

// Hook specifically for admin product management
export const useAdminProducts = (params = {}) => {
  return useProducts(params, true);
};

// Hook specifically for public/customer product browsing
export const usePublicProducts = (params = {}) => {
  return useProducts(params, false);
};

// Hook for product search (context-aware)
export const useProductSearch = (isAdmin = false) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);

  const searchProducts = useCallback(
    async (searchParams) => {
      try {
        setLoading(true);
        setError(null);

        // Use appropriate search endpoint
        const response = isAdmin
          ? await authAPI.getProducts(searchParams) // Admin search with all filters
          : await authAPI.searchPublicProducts(searchParams); // Public search

        if (response.success) {
          const resultsData = response.data?.data || response.data || [];
          setSearchResults(Array.isArray(resultsData) ? resultsData : []);
          setMeta(response.meta || response.data?.meta || null);
        } else {
          throw new Error(response.error || "Search failed");
        }
      } catch (err) {
        console.error("Error searching products:", err);
        setError(err.message);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    },
    [isAdmin]
  );

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setMeta(null);
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    meta,
    searchProducts,
    clearSearch,
  };
};
