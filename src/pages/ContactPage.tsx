import React from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Navigation, 
  ExternalLink,
  Share2
} from 'lucide-react';
import { STORE_CONFIG, STORE_DETAILS } from '../utils/constants';
import { GoogleMapEmbed } from '../components/GoogleMapEmbed';
import { FacebookIcon, InstagramIcon } from '../components/SocialIcons';
import { generateGeneralWhatsAppUrl, openWhatsApp } from '../utils/whatsapp';

export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-soft py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-brand-orange mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Showroom & Enquiries</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-dark tracking-tight">
            Contact DESIGNS SHOPEE
          </h1>
          <p className="text-sm sm:text-base text-brand-muted mt-2">
            Have questions about a product, custom gifting, or showroom visit? Reach us directly on WhatsApp or find us on Katpadi Road, Vellore.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* WhatsApp Direct Card */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-green-50 text-[#25D366] flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 fill-current" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark mb-2">
                Direct WhatsApp Support
              </h2>
              <p className="text-sm text-brand-muted leading-relaxed mb-6">
                Connect directly with our showroom team for immediate pricing quotes, product photos, video calls, or order confirmation.
              </p>

              <div className="p-4 rounded-2xl bg-brand-soft border border-gray-100 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Mobile / WhatsApp:</span>
                  <a 
                    href={`tel:${STORE_CONFIG.phone}`} 
                    className="text-brand-dark hover:text-brand-orange text-base font-bold transition-colors"
                  >
                    {STORE_DETAILS.whatsappDisplay}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Service:</span>
                  <span className="text-brand-orange font-bold text-xs uppercase tracking-wider">Fast Response</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => openWhatsApp(generateGeneralWhatsAppUrl())}
                className="w-full btn-whatsapp py-3.5 text-sm sm:text-base"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Start WhatsApp Chat Now</span>
              </button>
            </div>
          </div>

          {/* Showroom Address Card */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark mb-2">
                Showroom Address
              </h2>
              <p className="text-sm text-brand-muted leading-relaxed mb-6">
                Located centrally in Thottapalayam on Katpadi Road, easily accessible with convenient local parking.
              </p>

              <div className="p-4 rounded-2xl bg-brand-soft border border-gray-100 space-y-2 text-sm leading-relaxed">
                <strong className="text-brand-dark block text-base">{STORE_CONFIG.name}</strong>
                <p className="text-gray-600">
                  9, Katpadi Rd, beside Pachaiyappas Silks,<br />
                  Thottapalayam, Vellore,<br />
                  Tamil Nadu 632004, India.
                </p>
                <div className="pt-2 text-xs text-brand-orange font-bold">
                  Key Landmark: Right beside Pachaiyappas Silks
                </div>
              </div>
            </div>

            <div className="pt-6">
              <a
                href={STORE_DETAILS.googleMaps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-primary py-3.5 text-sm sm:text-base"
              >
                <Navigation className="w-4 h-4" />
                <span>Open in Google Maps & Get Directions</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Social Media Connections Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-subtle mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-brand-orange">
                <Share2 className="w-3.5 h-3.5" />
                <span>Connect Online</span>
              </div>
              <h3 className="text-2xl font-black text-brand-dark">Official Social Channels</h3>
              <p className="text-sm text-brand-muted">
                Follow DESIGNS SHOPEE on Facebook and Instagram for new arrivals, festival gifting ideas, and product highlights.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={STORE_CONFIG.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#1877F2] hover:bg-[#0d65d9] text-white font-bold text-sm shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.99]"
              >
                <FacebookIcon className="w-5 h-5 fill-current" />
                <span>Follow on Facebook</span>
                <ExternalLink className="w-4 h-4 opacity-75 ml-0.5" />
              </a>

              <a
                href={STORE_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-bold text-sm shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.99]"
              >
                <InstagramIcon className="w-5 h-5 fill-current" />
                <span>Follow on Instagram</span>
                <ExternalLink className="w-4 h-4 opacity-75 ml-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Embedded Map Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-subtle">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-brand-dark">Interactive Map</h3>
              <p className="text-xs text-brand-muted mt-0.5">
                Explore the showroom location and find the quickest driving or walking route.
              </p>
            </div>

            <a
              href={STORE_DETAILS.googleMaps.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:text-[#e04c14]"
            >
              <span>View full map view</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <GoogleMapEmbed showCard={false} />
        </div>
      </div>
    </div>
  );
};
