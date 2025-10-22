import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FilterState } from '@/types';

interface FilterContextType {
  filters: FilterState;
  setCategory: (category: string) => void;
  setSearch: (search: string) => void;
  setSortBy: (sortBy: 'newest' | 'price-low' | 'price-high') => void;
  setPriceRange: (range: [number, number]) => void;
  toggleSize: (size: string) => void;
  toggleColor: (color: string) => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
}

const defaultFilters: FilterState = {
  category: 'All',
  search: '',
  sortBy: 'newest',
  priceRange: [0, 15000],
  sizes: [],
  colors: [],
  tags: []
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setCategory = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const setSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const setSortBy = (sortBy: 'newest' | 'price-low' | 'price-high') => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const setPriceRange = (range: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  };

  const toggleSize = (size: string) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const toggleColor = (color: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <FilterContext.Provider value={{
      filters,
      setCategory,
      setSearch,
      setSortBy,
      setPriceRange,
      toggleSize,
      toggleColor,
      toggleTag,
      clearFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error('useFilter must be used within FilterProvider');
  return context;
};
