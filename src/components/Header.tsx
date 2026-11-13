import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, MessageCircle, Menu, X, MapPin, ShoppingCart } from 'lucide-react';
import { STORE_DETAILS } from '../utils/constants';
import { useCart } from '../context/CartContext';
import { generateGeneralWhatsAppUrl, openWhatsApp } from '../utils/whatsapp';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop Catalog', path: '/shop' },
    { label: 'Categories', path: '/categories' },
    { label: 'About Us', path: '/about' },
    { label: 'Showroom & Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-brand-dark text-white text-xs py-2 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-orange animate-ping" />
            <span className="font-medium tracking-wide">
              Showroom Open: Katpadi Road, beside Pachaiyappas Silks, Vellore
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-300">
            <a 
              href={STORE_DETAILS.googleMaps.directionsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-orange" />
              <span className="hidden md:inline">Get Directions</span>
            </a>
            
            <button
              onClick={() => openWhatsApp(generateGeneralWhatsAppUrl())}
              className="text-brand-yellow hover:text-white flex items-center gap-1 font-semibold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-current" />
              <span>WhatsApp: {STORE_DETAILS.whatsappDisplay}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`transition-all duration-300 border-b ${
        isScrolled ? 'py-2.5 shadow-md border-gray-100 bg-white/95 backdrop-blur-md' : 'py-3.5 border-gray-100 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 group">
            <img 
              src="/assets/logo.png" 
              alt="DESIGNS SHOPEE" 
              className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              style={{ maxHeight: '56px' }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors py-1 relative ${
                    isActive ? 'text-brand-orange' : 'text-gray-700 hover:text-brand-orange'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-orange rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-gray-700 hover:text-brand-orange hover:bg-orange-50 transition-colors"
              aria-label="Search Catalog"
              title="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart Trigger with Live Counter Badge */}
            <Link
              to="/cart"
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-gray-700 hover:text-brand-orange hover:bg-orange-50 transition-colors"
              aria-label={`Shopping Cart (${totalItems} items)`}
              title="View Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute 1 top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-brand-orange text-white text-[10px] font-black rounded-full shadow-sm">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Direct WhatsApp Callout Button */}
            <button
              onClick={() => openWhatsApp(generateGeneralWhatsAppUrl())}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 min-h-[44px] text-xs md:text-sm font-bold text-white bg-[#25D366] hover:bg-[#20be5b] rounded-full shadow-sm hover:shadow transition-all duration-200 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Chat</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-gray-700 hover:text-brand-orange hover:bg-orange-50 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Search Overlay */}
      {searchOpen && (
        <div className="border-b border-gray-200 bg-brand-soft py-3 px-4 shadow-inner animate-fade-in">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across 200+ products (e.g. lamp, drone, clock, toys, bags)..."
                autoFocus
                className="w-full pl-12 pr-24 py-3 bg-white border border-gray-200 rounded-full text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-1.5 bg-brand-orange hover:bg-[#e04c14] text-white text-xs font-bold rounded-full transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 bg-white py-4 px-4 space-y-3 shadow-xl animate-fade-in">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive ? 'bg-orange-50 text-brand-orange' : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Shopping Cart Link with Counter */}
            <Link
              to="/cart"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm bg-orange-50/70 text-brand-orange border border-orange-100"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Shopping Cart</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-orange text-white text-xs font-black">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </Link>
          </nav>

          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <button
              onClick={() => openWhatsApp(generateGeneralWhatsAppUrl())}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] text-white rounded-xl font-bold text-sm shadow hover:bg-[#20be5b] transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Direct WhatsApp Enquiry ({STORE_DETAILS.whatsappDisplay})</span>
            </button>

            <a
              href={STORE_DETAILS.googleMaps.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 text-gray-800 rounded-xl font-semibold text-xs hover:bg-gray-200 transition-colors"
            >
              <MapPin className="w-4 h-4 text-brand-orange" />
              <span>Showroom Directions (Google Maps)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
