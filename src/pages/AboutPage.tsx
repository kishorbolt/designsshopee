import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ShoppingBag,
  ExternalLink 
} from 'lucide-react';
import { STORE_DETAILS } from '../utils/constants';
import { generateGeneralWhatsAppUrl, openWhatsApp } from '../utils/whatsapp';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-brand-soft py-14 sm:py-20 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-brand-orange text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Showroom Story</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-dark tracking-tight leading-tight">
            About DESIGNS SHOPEE
          </h1>
          <p className="text-base sm:text-lg text-brand-muted mt-3 max-w-2xl mx-auto">
            A premium retail destination in Vellore offering carefully curated gifts, novelties, toys, home accents, and lifestyle accessories.
          </p>
        </div>
      </section>

      {/* Main Story Content */}
      <section className="py-16 md:py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="space-y-8 text-gray-700 leading-relaxed text-base sm:text-lg">
          <div className="p-8 rounded-3xl bg-brand-soft border border-gray-100">
            <h2 className="text-2xl font-extrabold text-brand-dark mb-4">
              Welcome to DESIGNS SHOPEE
            </h2>
            <p className="mb-4">
              Located on Katpadi Road in Thottapalayam, right beside the prominent Pachaiyappas Silks, <strong>DESIGNS SHOPEE</strong> was established to provide retail customers, families, and gift shoppers in Vellore with a delightful and diverse shopping experience.
            </p>
            <p>
              Whether you are looking for meaningful gift articles for personal celebrations, unique toys and games for children, decorative showpieces for home spaces, or personal accessories, our showroom brings together quality, style, and accessible value under one roof.
            </p>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-brand-dark mb-4">
              Our Product Selection
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Every item in our showroom is selected with attention to visual appeal, build quality, and customer satisfaction:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-subtle flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-dark text-sm sm:text-base">Gifts & Novelties</h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Special occasion gifts, artistic mementos, and commemorative keepsakes.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-subtle flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-dark text-sm sm:text-base">Toys & Games</h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Engaging, safe, and fun toys, puzzles, and play items for all age groups.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-subtle flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-dark text-sm sm:text-base">Home Decor & Clocks</h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Accent clocks, decorative wall art, and ambient living room pieces.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-subtle flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-dark text-sm sm:text-base">Fashion & Accessories</h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Personal accessories, lifestyle essentials, and specialty retail goods.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Showroom Visit Box */}
          <div className="p-8 rounded-3xl bg-brand-dark text-white space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-orange rounded-2xl">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Visit Our Vellore Showroom</h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  Experience the full physical collection in person with personalized customer care.
                </p>
              </div>
            </div>

            <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 text-xs sm:text-sm space-y-1.5 text-gray-300">
              <p><strong className="text-white">Store Address:</strong> 9, Katpadi Rd, beside Pachaiyappas Silks, Thottapalayam, Vellore, Tamil Nadu 632004, India.</p>
              <p><strong className="text-white">WhatsApp & Phone:</strong> {STORE_DETAILS.whatsappDisplay}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => openWhatsApp(generateGeneralWhatsAppUrl())}
                className="btn-whatsapp text-xs sm:text-sm px-6 py-3"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Contact Us on WhatsApp</span>
              </button>

              <a
                href={STORE_DETAILS.googleMaps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs sm:text-sm px-6 py-3"
              >
                <MapPin className="w-4 h-4 text-brand-orange" />
                <span>Get Google Maps Directions</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

