import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  MessageCircle, 
  Sparkles, 
  MapPin, 
  ShoppingBag, 
  Gift, 
  ChevronRight 
} from 'lucide-react';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';
import { CategoryCard } from '../components/CategoryCard';
import { OptimizedImage } from '../components/OptimizedImage';
import { HeroBackground } from '../components/HeroBackground';
import { GoogleMapEmbed } from '../components/GoogleMapEmbed';
import { GoogleReviewsSection } from '../components/GoogleReviewsSection';
import { STORE_CONFIG, STORE_DETAILS } from '../utils/constants';
import { FacebookIcon, InstagramIcon } from '../components/SocialIcons';
import { generateGeneralWhatsAppUrl, openWhatsApp } from '../utils/whatsapp';
import { Product, Category } from '../types';

export const HomePage: React.FC = () => {
  const products = productsData as Product[];
  const categories = categoriesData as Category[];

  // Hero showcase preview items (3 items for the visual collage)
  const heroItems = products.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. HERO SECTION WITH FLOWING WAVES BACKGROUND */}
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24 border-b border-orange-100/60 bg-[#FDFBF7]">
        {/* Layered Vector Abstract Waves Background */}
        <HeroBackground />

        {/* Hero Content Container (Elevated Above Background) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-orange-200/80 text-brand-orange text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>Premier Retail & Gifting Showroom in Vellore</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-brand-dark tracking-tight leading-[1.12]">
                Curated Gifts, Toys & <span className="text-brand-orange">Distinctive Lifestyle</span> Accents.
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Welcome to <strong>DESIGNS SHOPEE</strong> — your trusted destination in Vellore for fine gift articles, novelties, toys, home clocks, and lifestyle collections. Browse {products.length}+ catalog items online and connect directly with our showroom via WhatsApp.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto btn-primary text-sm sm:text-base px-7 py-3.5 shadow-lg hover:shadow-xl transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Catalog ({products.length} Products)</span>
                </Link>

                <button
                  onClick={() => openWhatsApp(generateGeneralWhatsAppUrl())}
                  className="w-full sm:w-auto btn-whatsapp text-sm sm:text-base px-6 py-3.5 shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Showroom</span>
                </button>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-orange-200/40 text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-brand-dark">{products.length}+</div>
                  <div className="text-xs text-brand-muted font-medium">Showroom Items</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-brand-orange">{categories.length}</div>
                  <div className="text-xs text-brand-muted font-medium">Departments</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-brand-dark">Instant</div>
                  <div className="text-xs text-brand-muted font-medium">WhatsApp Help</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Product Mosaic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-orange/20 to-brand-yellow/30 rounded-3xl blur-2xl opacity-70" />

                <div className="relative grid grid-cols-2 gap-3 sm:gap-4 p-3 bg-white/80 backdrop-blur-md rounded-3xl border border-orange-100 shadow-premium">
                  {heroItems.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className={`overflow-hidden rounded-2xl border border-gray-100 bg-[#fafafa] shadow-subtle ${
                        idx === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-square'
                      }`}
                    >
                      <OptimizedImage 
                        src={item.thumbnail || item.image}
                        fallbackSrc={item.image}
                        alt={item.name}
                        fallbackText={item.name}
                        className="w-full h-full"
                        fit="contain"
                        imageClassName="hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                        priority={idx === 0}
                      />
                    </div>
                  ))}
                </div>

                {/* Floating Showroom Badge */}
                <div className="absolute -bottom-4 -left-4 sm:left-4 bg-brand-dark text-white p-3.5 rounded-2xl shadow-floating flex items-center gap-3 border border-neutral-700">
                  <div className="p-2 bg-brand-orange rounded-xl">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left pr-2">
                    <div className="text-[11px] text-brand-yellow font-bold uppercase tracking-wider">Showroom Landmark</div>
                    <div className="text-xs font-bold text-white">Beside Pachaiyappas Silks, Katpadi Rd</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES OVERVIEW */}
      <section className="py-16 md:py-20 bg-brand-soft border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-brand-orange mb-2">
                <Gift className="w-3.5 h-3.5" />
                <span>Product Categories</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
                Explore By Category
              </h2>
            </div>
            
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:text-[#e04c14] transition-colors"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {categories.map((cat) => (
              <CategoryCard key={cat.name} category={cat} />
            ))}
          </div>

          {/* Quick CTA to Full Catalog */}
          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-orange hover:bg-[#e04c14] text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse All {products.length} Products in Shop Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="py-16 md:py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
              Why Shop with DESIGNS SHOPEE
            </h2>
            <p className="text-sm sm:text-base text-brand-muted mt-2">
              Combining a rich physical showroom experience in Vellore with instant digital convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STORE_DETAILS.features.map((feature, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-brand-soft border border-gray-100 hover:border-orange-200 transition-all duration-300 hover:shadow-subtle"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-brand-orange flex items-center justify-center font-bold text-lg mb-4">
                  0{idx + 1}
                </div>
                <h3 className="font-extrabold text-brand-dark text-base sm:text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT DESIGNS SHOPEE */}
      <section className="py-16 md:py-20 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-brand-yellow text-xs font-bold uppercase tracking-wider">
                <span>About Our Store</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Vellore's Destination for Gifting & Lifestyle Elegance
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Located on Katpadi Road right beside the prominent Pachaiyappas Silks landmark, <strong>DESIGNS SHOPEE</strong> has been catering to families, corporate shoppers, and gift seekers across Vellore and surrounding districts.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our curated collections encompass premium gift items, novelty toys, artistic clocks, decor accents, and lifestyle essentials. We invite you to visit our showroom in Thottapalayam or browse our online catalog with instant WhatsApp order assistance.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange hover:bg-[#e04c14] text-white rounded-full font-bold text-sm transition-colors"
                >
                  <span>Learn More About Us</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => openWhatsApp(generateGeneralWhatsAppUrl())}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full font-bold text-sm transition-colors border border-neutral-700"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] fill-current" />
                  <span>Chat With Owner</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-orange/20 text-brand-orange rounded-2xl">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">Physical Showroom</h3>
                    <p className="text-xs text-gray-400">9, Katpadi Rd, Thottapalayam, Vellore</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-gray-300 border-t border-neutral-800 pt-4">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Landmark</span>
                    <span className="font-semibold text-white">Beside Pachaiyappas Silks</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Location</span>
                    <span className="font-semibold text-white">Katpadi Road, Vellore 632004</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">WhatsApp Desk</span>
                    <span className="font-semibold text-brand-yellow">{STORE_DETAILS.whatsappDisplay}</span>
                  </div>
                </div>

                <a
                  href={STORE_DETAILS.googleMaps.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-brand-yellow text-brand-dark rounded-xl font-bold text-xs hover:bg-yellow-400 transition-colors"
                >
                  <span>Open Directions on Google Maps</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOLLOW US ONLINE */}
      <section className="py-16 md:py-20 bg-brand-soft border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-brand-orange mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Connect With DESIGNS SHOPEE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
              Follow Us Online
            </h2>
            <p className="text-sm sm:text-base text-brand-muted mt-2">
              Stay connected with our Vellore showroom for new product arrivals, festive gift showcases, and novelty unboxings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Facebook Card */}
            <div className="group bg-white rounded-3xl p-8 border border-gray-150 shadow-subtle hover:shadow-card-hover hover:border-[#1877F2]/40 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                    <FacebookIcon className="w-8 h-8 fill-current" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full">
                    Official Page
                  </span>
                </div>
                
                <h3 className="text-xl font-extrabold text-brand-dark group-hover:text-[#1877F2] transition-colors mb-2">
                  Facebook
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed mb-6">
                  Follow our official Facebook page for showroom announcements, seasonal collections, customer updates, and community highlights.
                </p>
              </div>

              <a
                href={STORE_CONFIG.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#1877F2] hover:bg-[#0d65d9] active:scale-[0.99] text-white font-bold text-sm shadow-sm transition-all duration-200"
              >
                <FacebookIcon className="w-4 h-4 fill-current" />
                <span>Visit Facebook Page</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Instagram Card */}
            <div className="group bg-white rounded-3xl p-8 border border-gray-150 shadow-subtle hover:shadow-card-hover hover:border-[#E4405F]/40 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f09433]/15 via-[#dc2743]/15 to-[#bc1888]/15 text-[#E4405F] flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                    <InstagramIcon className="w-8 h-8 fill-current" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full">
                    Official Profile
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-brand-dark group-hover:text-[#E4405F] transition-colors mb-2">
                  Instagram
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed mb-6">
                  Explore video reels, photo spotlights of novelty toys and decor items, gift unboxings, and new showroom arrivals.
                </p>
              </div>

              <a
                href={STORE_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 active:scale-[0.99] text-white font-bold text-sm shadow-sm transition-all duration-200"
              >
                <InstagramIcon className="w-4 h-4 fill-current" />
                <span>Follow on Instagram</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LOCATION & GOOGLE MAPS SECTION */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-brand-orange mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Visit Us In Person</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
              Showroom Location & Directions
            </h2>
            <p className="text-sm sm:text-base text-brand-muted mt-2">
              We look forward to welcoming you at our showroom in Thottapalayam, Vellore.
            </p>
          </div>

          <GoogleMapEmbed />
        </div>
      </section>

      {/* 7. GOOGLE CUSTOMER REVIEWS SECTION */}
      <GoogleReviewsSection />
    </div>
  );
};
