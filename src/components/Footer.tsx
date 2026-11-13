import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Navigation, ExternalLink, ShieldCheck } from 'lucide-react';
import { STORE_CONFIG, STORE_DETAILS } from '../utils/constants';
import { FacebookIcon, InstagramIcon } from './SocialIcons';
import { generateGeneralWhatsAppUrl, openWhatsApp } from '../utils/whatsapp';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-neutral-800">
          {/* Brand Info & Social Links */}
          <div className="space-y-4">
            <Link to="/" className="inline-block bg-white p-3 rounded-2xl">
              <img 
                src="/assets/logo.png" 
                alt="DESIGNS SHOPEE Logo" 
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your premier retail destination in Vellore for fine gifts, novelties, toys, home accents, and lifestyle accessories. Discover over 200+ showroom items directly on our digital showcase.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-brand-yellow font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Showroom: Katpadi Road, Vellore</span>
            </div>

            {/* Official Social Media Channels */}
            <div className="pt-3">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                Follow Us On Social Media
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={STORE_CONFIG.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[44px] min-h-[44px] rounded-xl bg-neutral-800 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm group"
                  aria-label="DESIGNS SHOPEE on Facebook"
                  title="Follow DESIGNS SHOPEE on Facebook"
                >
                  <FacebookIcon className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
                </a>

                <a
                  href={STORE_CONFIG.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[44px] min-h-[44px] rounded-xl bg-neutral-800 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm group"
                  aria-label="DESIGNS SHOPEE on Instagram"
                  title="Follow DESIGNS SHOPEE on Instagram"
                >
                  <InstagramIcon className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-orange mb-4">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-white transition-colors">
                  Full Product Catalog
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-white transition-colors">
                  Shop By Category
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About DESIGNS SHOPEE
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Showroom & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-yellow mb-4">
              Store Collections
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop?category=Toys%2C+Costumes+%26+Games" className="text-gray-300 hover:text-white transition-colors">
                  Toys, Costumes & Games
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Baby+%26+Kids+Essentials" className="text-gray-300 hover:text-white transition-colors">
                  Baby & Kids Essentials
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Home+Living+%26+Decor" className="text-gray-300 hover:text-white transition-colors">
                  Home Living & Decor
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Party%2C+Gifts+%26+Novelties" className="text-gray-300 hover:text-white transition-colors">
                  Party, Gifts & Novelties
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Kitchen+%26+Dining" className="text-gray-300 hover:text-white transition-colors">
                  Kitchen & Dining
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Fashion%2C+Sports+%26+Travel" className="text-gray-300 hover:text-white transition-colors">
                  Fashion, Sports & Travel
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-orange mb-4">
              Showroom Location
            </h3>
            <div className="text-sm text-gray-300 space-y-2 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                <span>
                  <strong>DESIGNS SHOPEE</strong><br />
                  9, Katpadi Rd, beside Pachaiyappas Silks,<br />
                  Thottapalayam, Vellore,<br />
                  Tamil Nadu 632004, India.
                </span>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <Phone className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                <a href={`tel:${STORE_CONFIG.phone}`} className="hover:text-white transition-colors font-medium">
                  {STORE_DETAILS.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => openWhatsApp(generateGeneralWhatsAppUrl())}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] bg-[#25D366] hover:bg-[#20be5b] text-white rounded-xl text-xs font-bold transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </button>

              <a
                href={STORE_DETAILS.googleMaps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[44px] bg-neutral-800 hover:bg-neutral-700 text-gray-200 rounded-xl text-xs font-semibold transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-brand-yellow" />
                <span>Google Maps Directions</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>
            © {new Date().getFullYear()} DESIGNS SHOPEE. All rights reserved. 9, Katpadi Rd, Thottapalayam, Vellore.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-gray-400">Connect:</span>
            <a 
              href={STORE_CONFIG.facebook} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-[#1877F2] transition-colors inline-flex items-center gap-1.5"
            >
              <FacebookIcon className="w-3.5 h-3.5 fill-current" />
              <span>Facebook</span>
            </a>
            <span className="text-gray-600">•</span>
            <a 
              href={STORE_CONFIG.instagram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-[#E4405F] transition-colors inline-flex items-center gap-1.5"
            >
              <InstagramIcon className="w-3.5 h-3.5 fill-current" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
