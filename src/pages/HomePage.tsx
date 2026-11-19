import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  MessageCircle, 
  ChevronDown, 
  Search, 
  RotateCcw, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  X,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import productsData from '../data/products.json';
import { ProductCard } from '../components/ProductCard';
import { OptimizedImage } from '../components/OptimizedImage';
import { GoogleReviewsSection } from '../components/GoogleReviewsSection';
import { GoogleMapEmbed } from '../components/GoogleMapEmbed';
import { FacebookIcon, InstagramIcon } from '../components/SocialIcons';
import { Product } from '../types';
import { STORE_DETAILS, STORE_CONFIG } from '../utils/constants';
import { generateGeneralWhatsAppUrl, openWhatsApp } from '../utils/whatsapp';
import { updateMetaTags, BASE_CANONICAL_DOMAIN } from '../utils/seo';

export const HomePage: React.FC = () => {
  const products = productsData as Product[];

  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Sort state (ONE unified product catalogue, no category filtering)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'featured');
  const [itemsToShow, setItemsToShow] = useState<number>(30);

  // Sync state with URL search params and maintain Homepage SEO
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    const sortFromUrl = searchParams.get('sort');

    if (searchFromUrl !== null) setSearchTerm(searchFromUrl);
    if (sortFromUrl !== null) setSortBy(sortFromUrl);

    if (searchFromUrl && searchFromUrl.trim()) {
      document.title = `Search: "${searchFromUrl.trim()}" | DESIGNS SHOPEE Vellore`;
    } else {
      updateMetaTags({
        title: 'DESIGNS SHOPEE | Toys, Gifts & Unique Lifestyle Products in Vellore',
        description: 'Discover toys, kids essentials, unique birthday return gifts, clocks and lifestyle novelties at DESIGNS SHOPEE, 9 Katpadi Road showroom beside Pachaiyappas Silks, Thottapalayam, Vellore. Browse our online catalogue with instant WhatsApp assistance.',
        canonicalUrl: `${BASE_CANONICAL_DOMAIN}/`,
        ogImage: `${BASE_CANONICAL_DOMAIN}/assets/logo.png`,
        ogType: 'website'
      });
    }
  }, [searchParams]);

  // Update URL params when user searches or sorts
  const updateUrlParams = (newSearch: string, newSort: string) => {
    const params: Record<string, string> = {};
    if (newSearch.trim()) params.search = newSearch.trim();
    if (newSort && newSort !== 'featured') params.sort = newSort;
    setSearchParams(params, { replace: true });
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setItemsToShow(30);
    updateUrlParams(val, sortBy);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setItemsToShow(30);
    updateUrlParams('', sortBy);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    updateUrlParams(searchTerm, newSort);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSortBy('featured');
    setItemsToShow(30);
    setSearchParams({}, { replace: true });
  };

  // Instant Search & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter (instant match on name, keyword, or description)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) ||
             (p.description && p.description.toLowerCase().includes(q)) ||
             p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
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
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    } else {
      // 'featured'
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, searchTerm, sortBy]);

  const visibleProducts = filteredProducts.slice(0, itemsToShow);
  const hasMore = itemsToShow < filteredProducts.length;

  // Selected actual showroom products for hero collage
  const collageItems = useMemo(() => {
    return [
      products.find(p => p.id === 'product-211') || products[0], // AI Printer
      products.find(p => p.id === 'product-214') || products[3] || products[0], // Starry Sky Lamp
      products.find(p => p.id === 'product-213') || products[2] || products[0], // Santosh Subramaniam Horse
    ];
  }, [products]);

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#262626]">
      
      {/* 1. HERO SECTION (Warm Ivory Background with Meaningful H1 Heading for Local SEO) */}
      <section className="relative overflow-hidden bg-[#FFFDF5] text-[#262626] py-10 sm:py-14 lg:py-16 border-b border-[#F5EEDC]">
        {/* Subtle Decorative Warm Lighting */}
        <div className="absolute top-4 left-6 w-72 h-72 rounded-full bg-[#F5EEDC]/50 pointer-events-none blur-3xl" />
        <div className="absolute bottom-6 right-8 w-80 h-80 rounded-full bg-[#F5EEDC]/60 pointer-events-none blur-3xl" />
        
        {/* Muted Gold Accent Starburst */}
        <div className="absolute top-10 right-12 hidden md:block text-[#C6A15B]/25 pointer-events-none">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Local Business Identity & Action CTAs */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              {/* Local Showroom Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5EEDC] text-brand-green text-xs font-bold uppercase tracking-wider border border-[#E8DEC8] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#C6A15B]" />
                <span>Premier Toy Shop & Gift Showroom in Vellore</span>
              </div>

              {/* Meaningful H1 Heading for Organic Local Search */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-[#262626] tracking-tight leading-[1.14]">
                Toy Shop & Unique Gifts in Vellore — <span className="text-brand-green">DESIGNS SHOPEE</span>
              </h1>

              {/* Natural Descriptive Content Covering Collections & Location */}
              <p className="text-sm sm:text-base text-[#262626]/85 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Welcome to <strong className="text-[#262626] font-bold">DESIGNS SHOPEE</strong> — Vellore's trusted retail destination on Katpadi Road, beside Pachaiyappas Silks, Thottapalayam. Explore novelty toys, RC cars, STEM games, unique birthday return gifts, decorative wall clocks, and kids essentials across our complete {products.length} showroom collection with instant WhatsApp assistance.
              </p>

              {/* Action Buttons: Forest Green Primary CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <a
                  href="#catalogue"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-brand-green hover:bg-brand-green-dark shadow-xs hover:shadow-sm transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse All {products.length} Products</span>
                </a>

                <button
                  type="button"
                  onClick={() => openWhatsApp(generateGeneralWhatsAppUrl())}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm sm:text-base text-brand-green bg-[#F5EEDC] hover:bg-[#ebd9bd] border border-[#E8DEC8] shadow-xs hover:shadow-sm transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current text-brand-green" />
                  <span>WhatsApp Enquiries (+91 94877 03591)</span>
                </button>
              </div>

              {/* Showroom Landmark Hint */}
              <div className="pt-2 text-xs text-[#262626]/75 flex items-center justify-center lg:justify-start gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#C6A15B] flex-shrink-0" />
                <span>Showroom located at 9, Katpadi Rd, beside Pachaiyappas Silks, Thottapalayam, Vellore</span>
              </div>
            </div>

            {/* Right Column: Layered Genuine Product Image Collage */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
                
                {/* Visual Collage Grid in Light Beige Container */}
                <div className="relative bg-[#F5EEDC] p-3.5 sm:p-4 rounded-3xl border border-[#E8DEC8] shadow-xs">
                  <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                    
                    {/* Item 1: Large Featured Card */}
                    <div className="col-span-2 relative aspect-[16/10] bg-[#FFFDF5] rounded-2xl p-2.5 overflow-hidden border border-[#E8DEC8] shadow-xs group">
                      <OptimizedImage
                        src={collageItems[0].thumbnail || collageItems[0].image}
                        fallbackSrc={collageItems[0].image}
                        alt={collageItems[0].name}
                        className="w-full h-full"
                        fit="contain"
                        imageClassName="hover:scale-105 transition-transform duration-500"
                        priority={true}
                      />
                      <div className="absolute bottom-2 left-2 right-2 bg-[#262626]/90 backdrop-blur-xs text-[#FFFDF5] px-3 py-1.5 rounded-xl text-[11px] font-bold truncate flex items-center justify-between">
                        <span className="truncate">{collageItems[0].name}</span>
                        <div className="flex items-baseline gap-1.5 ml-1">
                          <span className="text-white">₹{collageItems[0].price}</span>
                          {collageItems[0].mrp && (
                            <span className="text-neutral-400 line-through text-[10px]">₹{collageItems[0].mrp}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Item 2: Compact Card */}
                    <div className="relative aspect-square bg-[#FFFDF5] rounded-2xl p-2 overflow-hidden border border-[#E8DEC8] shadow-xs">
                      <OptimizedImage
                        src={collageItems[1].thumbnail || collageItems[1].image}
                        fallbackSrc={collageItems[1].image}
                        alt={collageItems[1].name}
                        className="w-full h-full"
                        fit="contain"
                        imageClassName="hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-brand-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg shadow-xs">
                        ₹{collageItems[1].price}
                      </span>
                    </div>

                    {/* Item 3: Compact Card */}
                    <div className="relative aspect-square bg-[#FFFDF5] rounded-2xl p-2 overflow-hidden border border-[#E8DEC8] shadow-xs">
                      <OptimizedImage
                        src={collageItems[2].thumbnail || collageItems[2].image}
                        fallbackSrc={collageItems[2].image}
                        alt={collageItems[2].name}
                        className="w-full h-full"
                        fit="contain"
                        imageClassName="hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-brand-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg shadow-xs">
                        ₹{collageItems[2].price}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Floating Verified Badge */}
                <div className="absolute -bottom-3 -left-3 sm:left-2 bg-[#262626] text-[#FFFDF5] px-3.5 py-2 rounded-2xl shadow-xs flex items-center gap-2 border border-neutral-700">
                  <div className="p-1.5 bg-[#C6A15B] rounded-xl text-white">
                    <Sparkles className="w-4 h-4 fill-current" />
                  </div>
                  <div className="text-left text-xs font-bold leading-tight">
                    <span className="text-[#C6A15B] block text-[10px] uppercase tracking-wider font-extrabold">100% Genuine</span>
                    <span className="text-[#FFFDF5]">Showroom Stock</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATISTICS / HIGHLIGHTS BAR (Light Beige Background & Charcoal Text) */}
      <section className="bg-[#F5EEDC] border-b border-[#E8DEC8] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            
            {/* Stat 1: 5 Products */}
            <div className="p-4 bg-[#FFFDF5] rounded-2xl border border-[#E8DEC8] shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-brand-green">
                {products.length}
              </div>
              <div className="text-xs font-bold text-[#262626] mt-0.5">
                Unique Showroom Products
              </div>
              <p className="text-[11px] text-[#262626]/65 hidden sm:block mt-0.5">
                Toys, novelties, clocks & gifts
              </p>
            </div>

            {/* Stat 2: Complete Store Range */}
            <div className="p-4 bg-[#FFFDF5] rounded-2xl border border-[#E8DEC8] shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-brand-green">
                100%
              </div>
              <div className="text-xs font-bold text-[#262626] mt-0.5">
                Genuine In-Store Stock
              </div>
              <p className="text-[11px] text-[#262626]/65 hidden sm:block mt-0.5">
                Direct physical inspection
              </p>
            </div>

            {/* Stat 3: Vellore Landmark */}
            <div className="p-4 bg-[#FFFDF5] rounded-2xl border border-[#E8DEC8] shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-brand-green flex items-center justify-center gap-1">
                <MapPin className="w-5 h-5 text-brand-green inline" />
                <span>Katpadi Rd</span>
              </div>
              <div className="text-xs font-bold text-[#262626] mt-0.5">
                Beside Pachaiyappas Silks
              </div>
              <p className="text-[11px] text-[#262626]/65 hidden sm:block mt-0.5">
                Thottapalayam, Vellore 632004
              </p>
            </div>

            {/* Stat 4: Direct WhatsApp */}
            <div className="p-4 bg-[#FFFDF5] rounded-2xl border border-[#E8DEC8] shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-brand-green flex items-center justify-center gap-1">
                <MessageCircle className="w-5 h-5 fill-current inline" />
                <span>Instant</span>
              </div>
              <div className="text-xs font-bold text-[#262626] mt-0.5">
                WhatsApp Assistance
              </div>
              <p className="text-[11px] text-[#262626]/65 hidden sm:block mt-0.5">
                +91 94877 03591
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. ONE COMPLETE PRODUCT CATALOGUE (With Prominent Search Bar & No Category Browsing) */}
      <section id="catalogue" className="py-10 sm:py-16 bg-[#FFFDF5]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EEDC] text-brand-green text-xs font-bold uppercase tracking-wider border border-[#E8DEC8] mb-2">
              <ShoppingBag className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Complete Retail Catalogue</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#262626] tracking-tight">
              All Showroom Products ({products.length} Unique Items)
            </h2>
            <p className="text-xs sm:text-sm text-[#262626]/70 mt-2">
              Search any toy, gift, clock, bottle, or decor item instantly below. Each item links to verified original photographs and direct WhatsApp order assistance.
            </p>
          </div>

          {/* Prominent Instant Product Search Bar */}
          <div className="mb-6 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-brand-green pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search products by name or keyword (e.g. AI printer, bottle, lamp, horse, clock, car, tent)..."
                className="w-full pl-12 pr-28 py-3.5 bg-white border-2 border-[#E8DEC8] focus:border-brand-green rounded-full text-xs sm:text-sm text-[#262626] placeholder-[#262626]/45 focus:outline-none shadow-xs transition-all"
                aria-label="Search all products"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-[#262626] bg-[#F5EEDC] hover:bg-[#ebd9bd] rounded-full transition-colors flex items-center gap-1 shadow-xs"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub-bar: Result Count & Sort Selector */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#E8DEC8] gap-2 mb-6">
            {/* Title & Count */}
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-[#262626] tracking-tight truncate">
                {searchTerm.trim() ? (
                  <span>Results for <strong className="text-brand-green">"{searchTerm}"</strong></span>
                ) : (
                  <span>All Store Products</span>
                )}
              </h3>
              <p className="text-xs text-[#262626]/65 font-medium">
                {filteredProducts.length} of {products.length} unique products displayed
              </p>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-xs text-[#262626]/65 font-semibold hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-[#FFFDF5] hover:bg-white border border-[#E8DEC8] text-[#262626] text-xs font-bold rounded-xl py-2 pl-3 pr-7 focus:outline-none focus:border-brand-green cursor-pointer"
                  aria-label="Sort products"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">New Arrivals</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-green pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Search Banner Notification */}
          {searchTerm && (
            <div className="mb-4 p-3 bg-[#F5EEDC] border border-[#E8DEC8] rounded-2xl flex items-center justify-between text-xs text-[#262626]">
              <div className="flex items-center gap-1.5 truncate">
                <Search className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                <span>Found <strong>{filteredProducts.length}</strong> matching products for <strong>"{searchTerm}"</strong></span>
              </div>
              <button
                type="button"
                onClick={clearSearch}
                className="text-xs font-bold text-brand-green hover:underline ml-2 flex-shrink-0"
              >
                Reset search
              </button>
            </div>
          )}

          {/* 2-Column Mobile & 4-5 Column Desktop Product Grid */}
          {visibleProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5 md:gap-4">
                {visibleProducts.map((product, idx) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    priority={idx < 5}
                  />
                ))}
              </div>

              {/* Load More Products Button: Forest Green */}
              {hasMore && (
                <div className="mt-8 sm:mt-12 text-center">
                  <button
                    type="button"
                    onClick={() => setItemsToShow(prev => prev + 30)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-brand-green hover:bg-brand-green-dark text-white rounded-full font-bold text-xs sm:text-sm shadow-xs hover:shadow-sm transition-all active:scale-95 min-h-[44px]"
                  >
                    <span>Load More Products ({filteredProducts.length - visibleProducts.length} remaining)</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty Search State */
            <div className="py-16 text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#F5EEDC] text-brand-green flex items-center justify-center mx-auto mb-3 border border-[#E8DEC8]">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#262626]">No products found</h3>
              <p className="text-xs text-[#262626]/70 mt-1 mb-4 leading-relaxed">
                We couldn't find items matching "{searchTerm}". Try searching for popular items like "printer", "bottle", "lamp", "car", "clock", or "tent".
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Show All {products.length} Products</span>
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 4. LOCAL CONTENT: ABOUT DESIGNS SHOPEE SHOWROOM & SERVICE (Natural Local SEO) */}
      <section className="py-14 sm:py-20 bg-[#F5EEDC] border-t border-[#E8DEC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF5] text-brand-green text-xs font-bold uppercase tracking-wider border border-[#E8DEC8] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>About DESIGNS SHOPEE • Vellore</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-[#262626] tracking-tight leading-tight">
                Vellore's Trusted Destination for Novelty Toys, Fine Gifts & Kids Essentials
              </h2>

              <p className="text-sm sm:text-base text-[#262626]/85 leading-relaxed font-normal">
                Conveniently established on <strong className="text-[#262626]">Katpadi Road</strong> right beside the iconic <strong className="text-[#262626]">Pachaiyappas Silks</strong> in <strong className="text-[#262626]">Thottapalayam, Vellore</strong>, <strong className="text-[#262626]">DESIGNS SHOPEE</strong> is dedicated to bringing families, children, and gift seekers delightful products under one welcoming roof.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3.5 bg-[#FFFDF5] rounded-xl border border-[#E8DEC8] shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-[#262626] block">Toy Collections</span>
                    <span className="text-[11px] text-[#262626]/70">RC cars, musical toys, STEM kits & plushies</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3.5 bg-[#FFFDF5] rounded-xl border border-[#E8DEC8] shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-[#262626] block">Birthday Return Gifts</span>
                    <span className="text-[11px] text-[#262626]/70">Bulk party return gifts, stationery & hampers</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3.5 bg-[#FFFDF5] rounded-xl border border-[#E8DEC8] shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-[#262626] block">Kids & Baby Essentials</span>
                    <span className="text-[11px] text-[#262626]/70">Water bottles, play mats & infant accessories</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3.5 bg-[#FFFDF5] rounded-xl border border-[#E8DEC8] shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-[#262626] block">Home & Lifestyle Accents</span>
                    <span className="text-[11px] text-[#262626]/70">Decorative wall clocks, bean bags & lamps</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green hover:bg-brand-green-dark text-white rounded-full font-bold text-xs sm:text-sm shadow-xs hover:shadow-sm transition-all"
                >
                  <span>Learn More About Our Showroom</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#catalogue"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFFDF5] hover:bg-white text-brand-green border border-[#E8DEC8] rounded-full font-bold text-xs sm:text-sm shadow-xs transition-all"
                >
                  <span>Explore All {products.length} Products</span>
                </a>
              </div>
            </div>

            {/* Right: Showroom Landmark Card */}
            <div className="lg:col-span-5">
              <div className="p-6 bg-[#FFFDF5] rounded-3xl border border-[#E8DEC8] shadow-xs space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F5EEDC] text-brand-green flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-brand-green uppercase tracking-wider block">
                      Vellore Physical Showroom
                    </span>
                    <h3 className="text-base font-extrabold text-[#262626]">
                      DESIGNS SHOPEE
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#262626]/85 leading-relaxed bg-[#F5EEDC] p-3 rounded-xl border border-[#E8DEC8]">
                  9, Katpadi Rd, beside Pachaiyappas Silks, Thottapalayam, Vellore, Tamil Nadu 632004, India.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openWhatsApp(generateGeneralWhatsAppUrl())}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-brand-green hover:bg-brand-green-dark text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>WhatsApp Us</span>
                  </button>

                  <a
                    href={STORE_DETAILS.googleMaps.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1 py-2.5 px-4 bg-[#F5EEDC] hover:bg-[#ebd9bd] text-brand-green border border-[#E8DEC8] rounded-xl text-xs font-bold transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-brand-green" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. SHOWROOM LOCATION & GOOGLE MAPS (Warm Ivory Background) */}
      <section id="location" className="py-14 sm:py-20 bg-[#FFFDF5] border-t border-[#F5EEDC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EEDC] text-brand-green text-xs font-bold uppercase tracking-wider border border-[#E8DEC8] mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Visit Us In Person</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#262626] tracking-tight">
              Showroom Location & Directions in Vellore
            </h2>
            <p className="text-xs sm:text-sm text-[#262626]/65 mt-2">
              Serving customers across Katpadi, Thottapalayam, Vellore Fort, Bagayam, Sathuvachari, and surrounding areas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Interactive Google Map Embed with subtle border */}
            <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-[#E8DEC8] shadow-xs">
              <GoogleMapEmbed />
            </div>

            {/* Right: Contact Information Box */}
            <div className="lg:col-span-4 bg-[#F5EEDC] rounded-3xl p-6 border border-[#E8DEC8] shadow-xs space-y-5">
              <div>
                <span className="text-[11px] font-bold text-brand-green uppercase tracking-wider block mb-1">
                  Physical Store Landmark
                </span>
                <h3 className="text-base font-black text-[#262626]">
                  DESIGNS SHOPEE
                </h3>
                <p className="text-xs text-[#262626]/85 mt-1 leading-relaxed">
                  9, Katpadi Rd, beside Pachaiyappas Silks, Thottapalayam, Vellore, Tamil Nadu 632004
                </p>
              </div>

              <div className="p-3.5 bg-[#FFFDF5] rounded-2xl border border-[#E8DEC8] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#262626]/65 font-medium">WhatsApp / Phone:</span>
                  <a href={`tel:${STORE_CONFIG.phone}`} className="font-bold text-brand-green hover:underline">
                    {STORE_DETAILS.whatsappDisplay}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#262626]/65 font-medium">Customer Support:</span>
                  <span className="font-bold text-brand-green">Fast Response</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#262626]/65 font-medium">Showroom Timings:</span>
                  <span className="font-bold text-[#262626]">All 7 Days: 10:00 AM – 9:30 PM</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => openWhatsApp(generateGeneralWhatsAppUrl())}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-brand-green hover:bg-brand-green-dark text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Start WhatsApp Chat</span>
                </button>

                <a
                  href={STORE_DETAILS.googleMaps.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#FFFDF5] hover:bg-white text-brand-green border border-[#E8DEC8] rounded-xl text-xs font-bold transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand-green" />
                  <span>Open in Google Maps</span>
                </a>
              </div>

              {/* Social Channels */}
              <div className="pt-3 border-t border-[#E8DEC8]">
                <div className="text-[11px] font-bold text-[#262626] mb-2">Follow Us Online</div>
                <div className="flex items-center gap-2">
                  <a
                    href={STORE_CONFIG.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#1877F2] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#0d65d9] transition-all"
                  >
                    <FacebookIcon className="w-3.5 h-3.5 fill-current" />
                    <span>Facebook</span>
                  </a>

                  <a
                    href={STORE_CONFIG.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-95 transition-all"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 fill-current" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS (Light Beige Background & Verified Google Review Cards) */}
      <GoogleReviewsSection />

    </div>
  );
};

export default HomePage;
