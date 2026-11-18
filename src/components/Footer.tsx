import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Navigation, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { STORE_CONFIG, STORE_DETAILS } from '../utils/constants';
import productsData from '../data/products.json';
import { FacebookIcon, InstagramIcon } from './SocialIcons';
import { generateGeneralWhatsAppUrl, openWhatsApp } from '../utils/whatsapp';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-green text-[#FFFDF5] pt-14 sm:pt-16 pb-12 border-t-2 border-[#C6A15B]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 pb-12 border-b border-white/15">
          
          {/* Brand Info & Social Links */}
          <div className="space-y-4">
            <Link to="/" className="inline-block bg-white p-2.5 rounded-2xl shadow-sm">
              <img 
                src="/assets/logo.png" 
                alt="DESIGNS SHOPEE Logo" 
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </Link>
            
            <p className="text-brand-cream/85 text-xs sm:text-sm leading-relaxed">
              Your premier retail destination in Vellore for fine gifts, novelties, toys, home accents, and lifestyle accessories. Browse our showroom items directly online.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-brand-yellow font-bold">
              <ShieldCheck className="w-4 h-4 text-brand-yellow flex-shrink-0" />
              <span>Verified Showroom: Katpadi Road, Vellore</span>
            </div>

            {/* Official Social Media Channels */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-brand-yellow uppercase tracking-wider mb-2">
                Follow Us Online
              </div>
              <div className="flex items-center gap-2.5">
                <a
                  href={STORE_CONFIG.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[40px] min-h-[40px] rounded-xl bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm group"
                  aria-label="DESIGNS SHOPEE on Facebook"
                  title="Follow DESIGNS SHOPEE on Facebook"
                >
                  <FacebookIcon className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
                </a>

                <a
                  href={STORE_CONFIG.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[40px] min-h-[40px] rounded-xl bg-white/10 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm group"
                  aria-label="DESIGNS SHOPEE on Instagram"
                  title="Follow DESIGNS SHOPEE on Instagram"
                >
                  <InstagramIcon className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-brand-yellow mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Quick Navigation</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="/#catalogue" className="text-brand-cream/80 hover:text-white transition-colors">
                  Shop Catalogue ({productsData.length})
                </a>
              </li>
              <li>
                <a href="/#location" className="text-brand-cream/80 hover:text-white transition-colors">
                  Showroom Location & Directions
                </a>
              </li>
              <li>
                <Link to="/about" className="text-brand-cream/80 hover:text-white transition-colors">
                  About DESIGNS SHOPEE
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-brand-cream/80 hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="text-brand-cream/80 hover:text-white transition-colors">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Collections */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-brand-yellow mb-4">
              Store Collections
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="/?search=toy#catalogue" className="text-brand-cream/80 hover:text-white transition-colors">
                  Toys & RC Cars
                </a>
              </li>
              <li>
                <a href="/?search=gift#catalogue" className="text-brand-cream/80 hover:text-white transition-colors">
                  Birthday Return Gifts
                </a>
              </li>
              <li>
                <a href="/?search=bottle#catalogue" className="text-brand-cream/80 hover:text-white transition-colors">
                  Kids Essentials & Bottles
                </a>
              </li>
              <li>
                <a href="/?search=clock#catalogue" className="text-brand-cream/80 hover:text-white transition-colors">
                  Clocks & Wall Decor
                </a>
              </li>
              <li>
                <a href="/?search=lamp#catalogue" className="text-brand-cream/80 hover:text-white transition-colors">
                  Novelty Lamps & Lighting
                </a>
              </li>
              <li>
                <a href="/#catalogue" className="text-brand-cream/80 hover:text-white transition-colors">
                  All {productsData.length} Showroom Items
                </a>
              </li>
            </ul>
          </div>

          {/* Showroom Location & Contacts */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-brand-yellow mb-4">
              Showroom Location
            </h3>
            <div className="text-xs sm:text-sm text-brand-cream/85 space-y-2 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-yellow flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">DESIGNS SHOPEE</strong><br />
                  9, Katpadi Rd, beside Pachaiyappas Silks,<br />
                  Thottapalayam, Vellore, Tamil Nadu 632004
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                <a href={`tel:${STORE_CONFIG.phone}`} className="hover:text-white transition-colors font-bold text-white">
                  {STORE_DETAILS.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => openWhatsApp(generateGeneralWhatsAppUrl())}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 min-h-[42px] bg-[#F28B62] hover:bg-[#e4764b] text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current text-white" />
                <span>Chat on WhatsApp</span>
              </button>

              <a
                href={STORE_DETAILS.googleMaps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 min-h-[40px] bg-white/10 hover:bg-white/20 text-brand-cream rounded-xl text-xs font-semibold transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-brand-yellow" />
                <span>Google Maps Directions</span>
                <ExternalLink className="w-3 h-3 text-brand-cream/60" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-cream/70 gap-3">
          <p>
            © {new Date().getFullYear()} DESIGNS SHOPEE. All rights reserved. 9, Katpadi Rd, Thottapalayam, Vellore.
          </p>
          <div className="flex items-center gap-2 text-brand-cream/70">
            <span>Vellore's Favorite Toy, Gift & Novelty Destination</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
