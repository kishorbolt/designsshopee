import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ShoppingCart, Zap, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { OptimizedImage } from './OptimizedImage';
import { generateProductWhatsAppUrl, openWhatsApp, isPlayTent } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { addToCart, buyNow } = useCart();
  const isTent = isPlayTent(product) || product.enquiryOnly || product.price === null;
  const whatsappUrl = generateProductWhatsAppUrl(product);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openWhatsApp(whatsappUrl);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isTent) {
      addToCart(product, 1);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isTent) {
      buyNow(product, 1);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-subtle hover:shadow-card-hover hover:border-orange-200 transition-all duration-300">
      {/* Product Image Area - Fills 85-90% with minimal padding */}
      <Link 
        to={`/product/${product.slug}`}
        className="block relative w-full aspect-square bg-[#FBFBFB] border-b border-gray-100 overflow-hidden flex items-center justify-center p-2 sm:p-2.5"
      >
        <OptimizedImage
          src={product.thumbnail || product.image}
          fallbackSrc={product.image}
          alt={product.name}
          priority={priority}
          width={product.width || 400}
          height={product.height || 400}
          fallbackText={product.name}
          imageClassName="transition-transform duration-300 group-hover:scale-104 drop-shadow-sm"
          className="w-full h-full"
        />

        {/* Quick View Overlay on Desktop */}
        <div className="absolute inset-0 bg-brand-dark/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:flex items-center justify-center p-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/95 backdrop-blur-sm text-brand-dark text-xs font-semibold rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            View Details <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>

      {/* Product Information */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        {/* Category */}
        <div className="text-[11px] font-semibold text-brand-orange uppercase tracking-wider mb-1 line-clamp-1">
          {product.category}
        </div>

        {/* Clean, Readable Product Name */}
        <Link 
          to={`/product/${product.slug}`}
          className="text-sm sm:text-base font-bold text-brand-dark hover:text-brand-orange transition-colors line-clamp-2 leading-snug mb-2 flex-grow"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Pricing */}
        <div className="mt-auto pt-2 flex items-baseline justify-between border-t border-gray-50">
          <div>
            {!isTent && product.price !== null ? (
              <span className="text-base sm:text-lg font-extrabold text-brand-dark">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            ) : (
              <span className="text-xs sm:text-sm font-semibold text-brand-orange bg-orange-50 px-2.5 py-1 rounded-full">
                Price on Request
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isTent ? (
          /* Pop-Up Kids Play Tent Exception: ONLY WhatsApp Enquiry */
          <div className="mt-3 pt-1">
            <button
              onClick={handleWhatsAppClick}
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 min-h-[44px] text-xs font-bold text-white bg-[#25D366] hover:bg-[#1faa53] rounded-xl shadow-sm transition-all duration-200 active:scale-95"
              title="Enquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Enquire on WhatsApp</span>
            </button>
          </div>
        ) : (
          /* All other products: Add to Cart and Buy Now */
          <div className="mt-3 space-y-1.5 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddToCart}
                type="button"
                className="inline-flex items-center justify-center gap-1 px-2 py-2 min-h-[42px] sm:min-h-[44px] text-xs font-bold text-brand-dark bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition-all duration-200 active:scale-95"
                title="Add to Shopping Cart"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                type="button"
                className="inline-flex items-center justify-center gap-1 px-2 py-2 min-h-[42px] sm:min-h-[44px] text-xs font-bold text-white bg-brand-orange hover:bg-[#e04c14] rounded-xl shadow-sm transition-all duration-200 active:scale-95"
                title="Buy Now - Direct Checkout"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Buy Now</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 px-0.5 text-gray-500">
              <Link 
                to={`/product/${product.slug}`} 
                className="hover:text-brand-orange transition-colors flex items-center gap-0.5 font-medium py-1.5"
              >
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>

              <button
                onClick={handleWhatsAppClick}
                type="button"
                className="hover:text-[#25D366] transition-colors flex items-center gap-1 font-semibold py-1.5 min-h-[36px]"
                title="Enquire on WhatsApp"
              >
                <MessageCircle className="w-3 h-3 fill-current text-[#25D366]" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
