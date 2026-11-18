import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  MessageCircle, 
  Menu, 
  X, 
  ShoppingCart, 
  ChevronRight, 
  MapPin, 
  Phone,
  Info,
  Grid,
  Sparkles
} from 'lucide-react';
import { STORE_DETAILS } from '../utils/constants';
import { useCart } from '../context/CartContext';
import { generateGeneralWhatsAppUrl, openWhatsApp } from '../utils/whatsapp';
import categoriesData from '../data/categories.json';
import productsData from '../data/products.json';
import { Category } from '../types';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Sync search input with URL search param
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Close mobile menu and search on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}#catalogue`);
      setSearchOpen(false);
    } else {
      navigate('/#catalogue');
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR (Forest Green & Warm Cream) */}
      <div className="bg-brand-green text-brand-cream text-xs py-2 px-3 sm:px-4 border-b border-brand-green-dark">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-brand-yellow flex-shrink-0 animate-ping" />
            <span className="font-semibold truncate">
              Vellore Showroom: 9, Katpadi Rd, beside Pachaiyappas Silks
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 text-brand-cream font-medium">
            <a 
              href={STORE_DETAILS.googleMaps.directionsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-brand-yellow hidden md:inline-flex items-center gap-1 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Directions</span>
            </a>
            
            <button
              onClick={() => openWhatsApp(generateGeneralWhatsAppUrl())}
              className="text-brand-yellow hover:text-white inline-flex items-center gap-1 font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-current" />
              <span>WhatsApp: {STORE_DETAILS.whatsappDisplay}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFDF5] border-b border-[#F5EEDC] shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px] lg:h-[76px] gap-2 sm:gap-4">
            
            {/* Left: Mobile Menu Trigger & Store Logo */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden min-w-[38px] min-h-[38px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-xl text-brand-dark hover:text-brand-green hover:bg-[#F5EEDC] transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <Link to="/" className="flex items-center flex-shrink-0" aria-label="DESIGNS SHOPEE Home">
                <img 
                  src="/assets/logo.png" 
                  alt="DESIGNS SHOPEE" 
                  className="h-[44px] sm:h-[54px] lg:h-[62px] w-auto object-contain transition-all"
                  style={{ maxHeight: '64px' }}
                />
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <a
                href="/#catalogue"
                className="text-sm font-bold text-brand-dark hover:text-brand-green transition-colors py-1"
              >
                Shop Catalogue ({productsData.length})
              </a>

              <Link
                to="/about"
                className={`text-sm font-bold transition-colors py-1 ${
                  location.pathname === '/about'
                    ? 'text-brand-green'
                    : 'text-brand-dark hover:text-brand-green'
                }`}
              >
                About Us
              </Link>

              <a
                href="/#location"
                className="text-sm font-bold text-brand-dark hover:text-brand-green transition-colors py-1"
              >
                Showroom Location
              </a>
            </nav>

            {/* Right: Search, Cart, WhatsApp */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Search Toggle Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className={`min-w-[38px] min-h-[38px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-full transition-colors ${
                  searchOpen 
                    ? 'bg-[#F5EEDC] text-brand-green' 
                    : 'text-brand-dark hover:text-brand-green hover:bg-[#F5EEDC]'
                }`}
                aria-label="Search products"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Shopping Cart Button with Forest Green Live Counter */}
              <Link
                to="/cart"
                className="relative min-w-[38px] min-h-[38px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-full text-brand-dark hover:text-brand-green hover:bg-[#F5EEDC] transition-colors"
                aria-label={`Shopping Cart with ${totalItems} items`}
                title="View Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-brand-green text-white text-[10px] font-black rounded-full shadow-xs">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Desktop WhatsApp Action Button */}
              <button
                type="button"
                onClick={() => openWhatsApp(generateGeneralWhatsAppUrl())}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] text-xs font-bold text-white bg-brand-green hover:bg-brand-green-dark rounded-full shadow-xs transition-all active:scale-95"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-current text-[#F5EEDC]" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <div className="border-t border-[#F5EEDC] bg-[#FFFDF5] py-2.5 px-3 sm:px-6 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-brand-green" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 200+ products (e.g. rc car, toy, flask, clock, bag)..."
                  autoFocus
                  className="w-full pl-10 pr-20 py-2 bg-white border border-[#E8DEC8] rounded-full text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green shadow-xs"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3.5 py-1 bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold rounded-full transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-brand-dark/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Body */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-right">
            {/* Drawer Header */}
            <div className="p-4 bg-[#FFFDF5] border-b border-[#F5EEDC] flex items-center justify-between">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                <img 
                  src="/assets/logo.png" 
                  alt="DESIGNS SHOPEE" 
                  className="h-11 sm:h-12 w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-brand-dark hover:bg-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-1">
                <Link
                  to="/#catalogue"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-brand-dark hover:bg-[#F5EEDC] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Grid className="w-4 h-4 text-brand-green" />
                    <span>All Products ({productsData.length})</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    location.pathname === '/about'
                      ? 'bg-[#F5EEDC] text-brand-green'
                      : 'text-brand-dark hover:bg-[#F5EEDC]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Info className="w-4 h-4 text-brand-green" />
                    <span>About Us</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-brand-dark hover:bg-[#F5EEDC] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingCart className="w-4 h-4 text-brand-green" />
                    <span>Shopping Cart</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-brand-orange text-white text-[11px] font-black">
                    {totalItems}
                  </span>
                </Link>
              </div>

              {/* Showroom Landmark Info */}
              <div className="pt-2 border-t border-gray-150">
                <div className="p-3 bg-brand-cream/60 rounded-2xl border border-brand-cream text-xs text-brand-dark space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                    <span>Katpadi Rd, beside Pachaiyappas Silks, Vellore</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                    <span>{STORE_DETAILS.whatsappDisplay}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-gray-150 bg-white">
              <button
                type="button"
                onClick={() => {
                  openWhatsApp(generateGeneralWhatsAppUrl());
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-green hover:bg-brand-green-dark text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current text-brand-yellow" />
                <span>WhatsApp Enquiry</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
