import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";

interface FilterState {
  searchText: string;
  filterRating: number;
  filterIngredients: string;
  filterTime: string;
}

const FILTER_STORAGE_KEY = "favorites_filter_state";

export const useFilterState = () => {
  const [searchText, setSearchText] = useState("");
  const [filterRating, setFilterRating] = useState(0);
  const [filterIngredients, setFilterIngredients] = useState("all");
  const [filterTime, setFilterTime] = useState("all");

  // Load filter state from AsyncStorage
  const loadFilterState = React.useCallback(async () => {
    try {
      const json = await AsyncStorage.getItem(FILTER_STORAGE_KEY);
      if (json) {
        const savedState: FilterState = JSON.parse(json);
        setSearchText(savedState.searchText || "");
        setFilterRating(savedState.filterRating || 0);
        setFilterIngredients(savedState.filterIngredients || "all");
        setFilterTime(savedState.filterTime || "all");
      }
    } catch (error) {
      console.error("Error loading filter state:", error);
    }
  }, []);

  // Save filter state to AsyncStorage
  const saveFilterState = React.useCallback(async () => {
    try {
      const state: FilterState = {
        searchText,
        filterRating,
        filterIngredients,
        filterTime,
      };
      await AsyncStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving filter state:", error);
    }
  }, [searchText, filterRating, filterIngredients, filterTime]);

  // Reset all filters
  const resetFilters = React.useCallback(() => {
    setSearchText("");
    setFilterRating(0);
    setFilterIngredients("all");
    setFilterTime("all");
  }, []);

  // Load filter state on mount
  useEffect(() => {
    loadFilterState();
  }, [loadFilterState]);

  // Save filter state whenever any filter changes
  useEffect(() => {
    saveFilterState();
  }, [saveFilterState]);

  return {
    searchText,
    setSearchText,
    filterRating,
    setFilterRating,
    filterIngredients,
    setFilterIngredients,
    filterTime,
    setFilterTime,
    resetFilters,
  };
};
