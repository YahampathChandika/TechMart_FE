// hooks/useBrands.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { authAPI } from "@/lib/api";

export const useBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching brands from API...");
      const response = await authAPI.getBrands();
      console.log("Brands API response:", response);

      if (response.success) {
        setBrands(response.data || []);
        console.log("Brands loaded:", response.data);
      } else {
        throw new Error(response.error || "Failed to fetch brands");
      }
    } catch (err) {
      console.error("Error fetching brands:", err);
      setError(err.message);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const refresh = useCallback(() => {
    fetchBrands();
  }, [fetchBrands]);

  return {
    brands,
    loading,
    error,
    refresh,
  };
};

export const useFilterOptions = () => {
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFilterOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching filter options from API...");
      const response = await authAPI.getFilterOptions();
      console.log("Filter options API response:", response);

      if (response.success) {
        setFilterOptions(response.data || {});
        console.log("Filter options loaded:", response.data);
      } else {
        throw new Error(response.error || "Failed to fetch filter options");
      }
    } catch (err) {
      console.error("Error fetching filter options:", err);
      setError(err.message);
      setFilterOptions({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  const refresh = useCallback(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  return {
    filterOptions,
    loading,
    error,
    refresh,
  };
};
