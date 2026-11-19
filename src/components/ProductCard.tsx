import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { OptimizedImage } from './OptimizedImage';
import { generateProductWhatsAppUrl, openWhatsApp, isPlayTent } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { addToCart } = useCart();
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

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-[#E8DEC8] hover:border-brand-green/40 shadow-xs hover:shadow-sm transition-all duration-200 overflow-hidden">
      {/* Square Product Image Area with Rounded Image Container & Warm Ivory Backdrop */}
      <Link 
        to={`/product/${product.slug}`}
        className="block relative p-2 sm:p-2.5 pb-0"
        aria-label={`View ${product.name}`}
      >
        <div className="aspect-square w-full bg-[#FFFDF5] rounded-xl sm:rounded-2xl border border-[#F5EEDC] overflow-hidden flex items-center justify-center p-2 sm:p-3 relative">
          <OptimizedImage
            src={product.thumbnail || product.image}
            fallbackSrc={product.image}
            alt={product.name}
            priority={priority}
            width={product.width || 400}
            height={product.height || 400}
            fallbackText={product.name}
            imageClassName="transition-transform duration-300 group-hover:scale-105 drop-shadow-xs"
            className="w-full h-full"
          />

          {/* Quick view indicator on hover */}
          <div className="absolute inset-0 bg-brand-dark/5 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center pointer-events-none">
            <span className="p-1.5 bg-white/95 text-brand-green rounded-full shadow-xs">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>

      {/* Product Information */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-3 pt-2 justify-between">
        <div>
          {/* Category Tag */}
          <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider block truncate mb-0.5">
            {product.category}
          </span>

          {/* Product Name (2 Lines Max) */}
          <Link 
            to={`/product/${product.slug}`}
            className="text-xs sm:text-sm font-bold text-[#262626] hover:text-brand-green transition-colors line-clamp-2 leading-snug mb-1"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 mt-auto border-t border-gray-100">
          <div className="mb-2 min-h-[24px] flex items-baseline gap-2 flex-wrap">
            {!isTent && product.price !== null ? (
              <>
                <span className="text-sm sm:text-base font-black text-[#262626]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span className="text-xs text-neutral-400 line-through font-medium">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-bold text-brand-green bg-emerald-50 px-1.5 py-0.5 rounded">
                      {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                    </span>
                  </>
                )}
              </>
            ) : (
              <span className="text-[11px] font-bold text-brand-green bg-[#F5EEDC] px-2 py-0.5 rounded-md inline-block">
                Price on Request
              </span>
            )}
          </div>

          {/* Action Button */}
          {isTent ? (
            /* Pop-Up Kids Play Tent: Strictly WhatsApp Enquiry */
            <button
              onClick={handleWhatsAppClick}
              type="button"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold text-white bg-brand-green hover:bg-brand-green-dark rounded-xl shadow-xs transition-all active:scale-95 min-h-[38px]"
              title="Enquire on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current text-[#F5EEDC]" />
              <span>Enquire</span>
            </button>
          ) : (
            /* Standard Products: Forest Green Add to Cart */
            <button
              onClick={handleAddToCart}
              type="button"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold text-white bg-brand-green hover:bg-brand-green-dark rounded-xl shadow-xs transition-all active:scale-95 min-h-[38px]"
              title="Add to Shopping Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
