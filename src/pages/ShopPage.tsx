import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, Sparkles, Award, RotateCcw, ChevronDown } from 'lucide-react';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';
import { ProductCard } from '../components/ProductCard';
import { Product, Category } from '../types';

export const ShopPage: React.FC = () => {
  const products = productsData as Product[];
  const categories = categoriesData as Category[];

  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'newArrivals'>('all');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'featured');
  const [itemsToShow, setItemsToShow] = useState<number>(16);

  // Sync state with URL params
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    const categoryFromUrl = searchParams.get('category');
    const sortFromUrl = searchParams.get('sort');

    if (searchFromUrl !== null) setSearchTerm(searchFromUrl);
    if (categoryFromUrl !== null) setSelectedCategory(categoryFromUrl);
    if (sortFromUrl !== null) {
      if (sortFromUrl === 'newest') setActiveTab('newArrivals');
      setSortBy(sortFromUrl);
    }
  }, [searchParams]);

  // Update URL params when filters change
  const updateUrlParams = (newSearch: string, newCat: string, newSort: string) => {
    const params: Record<string, string> = {};
    if (newSearch) params.search = newSearch;
    if (newCat && newCat !== 'All') params.category = newCat;
    if (newSort && newSort !== 'featured') params.sort = newSort;
    setSearchParams(params, { replace: true });
  };

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    setItemsToShow(16);
    updateUrlParams(searchTerm, catName, sortBy);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setItemsToShow(16);
    updateUrlParams(val, selectedCategory, sortBy);
  };

  const handleSortChange = (sortVal: string) => {
    setSortBy(sortVal);
    updateUrlParams(searchTerm, selectedCategory, sortVal);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setActiveTab('all');
    setSortBy('featured');
    setItemsToShow(16);
    setSearchParams({}, { replace: true });
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) ||
             p.category.toLowerCase().includes(q) ||
             (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Tab filter (Featured / New Arrivals)
    if (activeTab === 'featured') {
      result = result.filter(p => p.featured);
    } else if (activeTab === 'newArrivals') {
      result = result.filter(p => p.newArrival);
    }

    // Sorting
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => {
        if (a.price === null) return 1;
        if (b.price === null) return -1;
        return a.price - b.price;
      });
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => {
        if (a.price === null) return 1;
        if (b.price === null) return -1;
        return b.price - a.price;
      });
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    } else {
      // 'featured'
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, searchTerm, selectedCategory, activeTab, sortBy]);

  const visibleProducts = filteredProducts.slice(0, itemsToShow);
  const hasMore = itemsToShow < filteredProducts.length;

  const isFiltered = searchTerm !== '' || selectedCategory !== 'All' || activeTab !== 'all' || sortBy !== 'featured';

  return (
    <div className="min-h-screen bg-brand-soft py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-brand-muted mb-2 font-medium">
            <span>Home</span>
            <span>/</span>
            <span className="text-brand-orange font-bold">Catalog</span>
            {selectedCategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-brand-dark font-bold">{selectedCategory}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
            Store Collection
          </h1>
          <p className="text-sm text-brand-muted mt-1.5">
            Browse our comprehensive inventory of gifts, novelties, toys, and lifestyle items.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-subtle mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search products by title, keyword..."
                className="w-full pl-10 pr-9 py-2.5 bg-brand-soft border border-gray-200 rounded-2xl text-xs sm:text-sm text-brand-dark placeholder-gray-400 focus:outline-none focus:border-brand-orange focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-brand-dark text-white shadow-sm'
                    : 'bg-brand-soft text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setActiveTab('featured')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'featured'
                    ? 'bg-brand-orange text-white shadow-sm'
                    : 'bg-brand-soft text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Featured</span>
              </button>
              <button
                onClick={() => setActiveTab('newArrivals')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'newArrivals'
                    ? 'bg-brand-yellow text-brand-dark shadow-sm'
                    : 'bg-brand-soft text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Arrivals</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-brand-soft border border-gray-200 text-brand-dark text-xs sm:text-sm font-semibold rounded-2xl py-2.5 pl-3.5 pr-8 focus:outline-none focus:border-brand-orange cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="newest">New Arrivals First</option>
                  <option value="name-asc">Name (A to Z)</option>
                  <option value="name-desc">Name (Z to A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-2 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => handleCategorySelect('All')}
              className={`px-3.5 py-2 min-h-[38px] sm:min-h-[40px] rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-brand-orange text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories ({products.length})
            </button>
            
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`px-3.5 py-2 min-h-[38px] sm:min-h-[40px] rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-brand-orange text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              );
            })}
          </div>

          {/* Active Filter Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-brand-muted">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-brand-dark">
                Showing {visibleProducts.length} of {filteredProducts.length} items
              </span>
              {selectedCategory !== 'All' && (
                <span className="bg-orange-50 text-brand-orange px-2 py-0.5 rounded-md font-medium">
                  Category: {selectedCategory}
                </span>
              )}
              {searchTerm && (
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium">
                  Keyword: "{searchTerm}"
                </span>
              )}
            </div>

            {isFiltered && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {visibleProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More Button for Mobile & Incremental Performance */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setItemsToShow(prev => prev + 16)}
                  className="btn-primary px-8 py-3.5 text-sm"
                >
                  <span>Load More Products ({filteredProducts.length - visibleProducts.length} remaining)</span>
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-subtle max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-brand-dark">No Products Found</h3>
            <p className="text-sm text-brand-muted mt-2 leading-relaxed">
              We couldn't find any items matching your current filters or search terms. Try searching with different keywords or clear your filters to view the full showroom catalog.
            </p>
            <div className="mt-6">
              <button
                onClick={clearAllFilters}
                className="btn-primary text-xs sm:text-sm px-6 py-2.5"
              >
                Clear All Filters & Show All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

