import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ShoppingBag, 
  ExternalLink,
  Truck
} from 'lucide-react';
import { STORE_DETAILS, STORE_CONFIG } from '../utils/constants';
import productsData from '../data/products.json';
import { GoogleMapEmbed } from '../components/GoogleMapEmbed';
import { FacebookIcon, InstagramIcon } from '../components/SocialIcons';
import { generateGeneralWhatsAppUrl, openWhatsApp } from '../utils/whatsapp';
import { updateMetaTags, BASE_CANONICAL_DOMAIN } from '../utils/seo';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    updateMetaTags({
      title: 'About Us | DESIGNS SHOPEE — Premier Toy & Gift Showroom in Vellore',
      description: "Learn about DESIGNS SHOPEE, Vellore's trusted retail toy and gift showroom at 9 Katpadi Road beside Pachaiyappas Silks, Thottapalayam. Explore novelty toys, return gifts, clocks and kids essentials.",
      canonicalUrl: `${BASE_CANONICAL_DOMAIN}/about`,
      ogImage: `${BASE_CANONICAL_DOMAIN}/assets/logo.png`,
      ogType: 'website'
    });

    return () => {
      updateMetaTags({
        title: 'DESIGNS SHOPEE | Toys, Gifts & Unique Lifestyle Products in Vellore',
        description: 'Discover toys, kids essentials, unique birthday return gifts, clocks and lifestyle novelties at DESIGNS SHOPEE, 9 Katpadi Road showroom beside Pachaiyappas Silks, Thottapalayam, Vellore. Browse our online catalogue with instant WhatsApp assistance.',
        canonicalUrl: `${BASE_CANONICAL_DOMAIN}/`,
        ogImage: `${BASE_CANONICAL_DOMAIN}/assets/logo.png`,
        ogType: 'website'
      });
    };
  }, []);
  return (
    <div className="min-h-screen bg-white text-brand-dark">
      {/* 1. Header Banner (Forest Green & Warm Cream) */}
      <section className="bg-brand-green py-12 sm:py-16 relative overflow-hidden text-brand-cream">
        <div className="absolute top-4 left-6 w-20 h-20 rounded-full bg-brand-yellow/10 pointer-events-none blur-xl" />
        <div className="absolute bottom-6 right-8 w-36 h-36 rounded-full bg-brand-orange/15 pointer-events-none blur-2xl" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-cream text-brand-green text-xs font-black uppercase tracking-wider mb-3.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>Showroom Story & Location</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-cream tracking-tight leading-tight">
            About <span className="text-brand-yellow">DESIGNS SHOPEE</span>
          </h1>
          <p className="text-sm sm:text-base text-brand-cream/85 mt-3 max-w-2xl mx-auto leading-relaxed font-medium">
            A premier retail destination in Katpadi Road, Vellore offering carefully curated gifts, novelties, toys, home accents, and lifestyle accessories.
          </p>
        </div>
      </section>

      {/* 2. Main Story & Showroom Background */}
      <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="space-y-10 leading-relaxed text-sm sm:text-base">
          
          {/* Welcome Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-brand-cream-soft border border-brand-green/15 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-black text-brand-green mb-3">
              Welcome to DESIGNS SHOPEE, Vellore
            </h2>
            <p className="mb-3 text-brand-dark/85 leading-relaxed">
              Located on Katpadi Road in Thottapalayam, right beside the prominent <strong>Pachaiyappas Silks</strong>, <strong>DESIGNS SHOPEE</strong> was established to provide retail customers, families, and gift shoppers in Vellore with a delightful, diverse, and reliable shopping experience.
            </p>
            <p className="text-brand-dark/85 leading-relaxed">
              Whether you are looking for meaningful gift articles for personal celebrations, unique toys and RC cars for children, decorative showpieces and clocks for home spaces, or personal accessories, our showroom brings together quality, style, and accessible retail value under one roof.
            </p>
          </div>

          {/* Why Choose Us Grid */}
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green mb-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
              <span>Core Commitments</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-brand-dark mb-4">
              Why Customers Choose DESIGNS SHOPEE
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-brand-green/15 bg-white shadow-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-dark text-sm sm:text-base">100% Genuine Showroom Stock</h4>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">Every product featured online is an authentic item photographed directly from our Vellore showroom floor.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-brand-green/15 bg-white shadow-xs flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#25D366] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-dark text-sm sm:text-base">Direct WhatsApp Assistance</h4>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">Connect with our staff on WhatsApp for live item video demonstrations, color variant checks, and quick billing.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-brand-green/15 bg-white shadow-xs flex items-start gap-3">
                <Truck className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-dark text-sm sm:text-base">Prompt Pickup & Delivery</h4>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">Pick up your order directly from our showroom or request domestic shipping and courier dispatch across India.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-brand-green/15 bg-white shadow-xs flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-dark text-sm sm:text-base">Safe & Protective Packaging</h4>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">Careful packaging for fragile novelties, decor pieces, and gifting items to ensure safe transit.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Showroom Location & Google Map */}
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green mb-1">
              <MapPin className="w-3.5 h-3.5 text-brand-orange" />
              <span>Showroom Landmark</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-brand-dark mb-4">
              Visit Our Vellore Showroom
            </h3>
            
            <div className="mb-6 p-6 rounded-3xl bg-brand-green text-brand-cream space-y-4 shadow-subtle">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-brand-yellow rounded-xl flex-shrink-0 text-brand-green">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-brand-yellow">Showroom Address</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    9, Katpadi Rd, beside Pachaiyappas Silks, Thottapalayam, Vellore, Tamil Nadu 632004, India.
                  </div>
                  <div className="text-xs text-brand-cream/80 mt-1">
                    Direct Contact / WhatsApp: <strong className="text-brand-yellow">{STORE_DETAILS.whatsappDisplay}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => openWhatsApp(generateGeneralWhatsAppUrl())}
                  className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#25D366] hover:bg-[#20be5b] text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat on WhatsApp</span>
                </button>

                <a
                  href={STORE_DETAILS.googleMaps.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-3 px-6 bg-brand-cream text-brand-green hover:bg-brand-yellow rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <MapPin className="w-4 h-4 text-brand-green" />
                  <span>Google Maps Directions</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="rounded-3xl overflow-hidden border border-brand-green/20 shadow-subtle">
              <GoogleMapEmbed />
            </div>
          </div>

          {/* Social Media Channels */}
          <div className="pt-4 border-t border-brand-green/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-brand-dark">Follow DESIGNS SHOPEE Online</h4>
              <p className="text-xs text-brand-muted">See our latest toy arrivals and novelty unboxings.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <a
                href={STORE_CONFIG.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#0d65d9] transition-all"
              >
                <FacebookIcon className="w-4 h-4 fill-current" />
                <span>Facebook</span>
              </a>

              <a
                href={STORE_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-95 transition-all"
              >
                <InstagramIcon className="w-4 h-4 fill-current" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Browse Catalog CTA */}
          <div className="pt-6 text-center">
            <Link
              to="/#catalogue"
              className="inline-flex items-center gap-2 py-3.5 px-8 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse All {productsData.length} Products</span>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
};

export default AboutPage;
