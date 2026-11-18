import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, ChevronRight, ShoppingBag } from 'lucide-react';
import categoriesData from '../data/categories.json';
import { CategoryCard } from '../components/CategoryCard';
import { Category } from '../types';

export const CategoriesPage: React.FC = () => {
  const categories = categoriesData as Category[];
  const totalProducts = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="min-h-screen bg-brand-soft py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <nav className="inline-flex items-center gap-2 text-xs text-brand-muted mb-3 font-medium">
            <Link to="/" className="hover:text-brand-orange">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-dark font-bold">Categories</span>
          </nav>
          
          <h1 className="text-3xl sm:text-5xl font-black text-brand-dark tracking-tight">
            Store Categories
          </h1>
          <p className="text-sm sm:text-base text-brand-muted mt-2">
            Explore {totalProducts} items organized across {categories.length} specialty retail departments at DESIGNS SHOPEE.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <CategoryCard key={cat.name} category={cat} />
          ))}
        </div>

        {/* Quick CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/"
            className="btn-primary text-sm sm:text-base px-8 py-3.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse All {totalProducts} Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

