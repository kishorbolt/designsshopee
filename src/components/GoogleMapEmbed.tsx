import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { STORE_DETAILS } from '../utils/constants';

interface GoogleMapEmbedProps {
  className?: string;
  showCard?: boolean;
}

export const GoogleMapEmbed: React.FC<GoogleMapEmbedProps> = ({ 
  className = '', 
  showCard = true 
}) => {
  return (
    <div className={`relative rounded-3xl overflow-hidden border border-gray-200 bg-gray-100 shadow-premium ${className}`}>
      {/* Embedded Google Map iframe */}
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px]">
        <iframe
          title="DESIGNS SHOPEE Location on Google Maps"
          src={STORE_DETAILS.googleMaps.embedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Floating Location Card Overlay */}
      {showCard && (
        <div className="md:absolute md:bottom-6 md:left-6 m-4 md:m-0 z-10 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-gray-100 shadow-floating max-w-sm">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-orange-50 text-brand-orange rounded-xl flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-brand-dark text-base">DESIGNS SHOPEE</h4>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                9, Katpadi Rd, beside Pachaiyappas Silks, Thottapalayam, Vellore, Tamil Nadu 632004
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
            <a
              href={STORE_DETAILS.googleMaps.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-[#e04c14] text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
            </a>

            <span className="text-[11px] font-medium text-gray-500">
              Beside Pachaiyappas Silks
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

