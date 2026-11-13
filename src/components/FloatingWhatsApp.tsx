import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { STORE_DETAILS } from '../utils/constants';
import { generateGeneralWhatsAppUrl, openWhatsApp } from '../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    openWhatsApp(generateGeneralWhatsAppUrl());
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Floating Tooltip Pill */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-brand-dark px-4 py-2 rounded-full shadow-floating border border-gray-100 text-xs font-semibold animate-fade-in">
          <span>Need help? Chat with DESIGNS SHOPEE</span>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20be5b] text-white rounded-full shadow-floating hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300"
        aria-label="Direct WhatsApp Enquiry"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-orange" />
        </span>
        <MessageCircle className="w-7 h-7 fill-current" />
      </button>
    </div>
  );
};

