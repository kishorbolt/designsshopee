import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '../types';
import { OptimizedImage } from './OptimizedImage';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/?category=${encodeURIComponent(category.name)}`}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-subtle hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Category Image Box */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-soft">
        <OptimizedImage
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/20 to-transparent" />
        
        {/* Count Badge */}
        <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-white/90 backdrop-blur-md text-brand-dark font-bold text-xs rounded-full shadow-sm">
          {category.count} Products
        </div>

        {/* Text inside bottom overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
          <h3 className="text-base sm:text-lg font-extrabold group-hover:text-brand-yellow transition-colors leading-tight">
            {category.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-200 mt-1 opacity-90 group-hover:opacity-100">
            <span>Explore Collection</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

