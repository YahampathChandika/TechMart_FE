// hooks/useProducts.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { authAPI } from "@/lib/api";

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.getProducts(params);

      if (response.success) {
        setProducts(response.data || []);
        setMeta(response.meta);
        setFilters(response.filters);
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
  }, [JSON.stringify(params)]);

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

export const useProduct = (id) => {
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

      const response = await authAPI.getProduct(id);

      if (response.success) {
        setProduct(response.data);
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
  }, [id]);

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

export const useProductSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);

  const searchProducts = useCallback(async (searchParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.searchProducts(searchParams);

      if (response.success) {
        setSearchResults(response.data || []);
        setMeta(response.meta);
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
  }, []);

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
