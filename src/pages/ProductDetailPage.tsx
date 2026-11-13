import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Share2, 
  ArrowLeft, 
  MapPin, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ZoomIn,
  ShoppingCart,
  Zap,
  Plus,
  Minus
} from 'lucide-react';
import productsData from '../data/products.json';
import { ProductCard } from '../components/ProductCard';
import { OptimizedImage } from '../components/OptimizedImage';
import { Product } from '../types';
import { STORE_DETAILS } from '../utils/constants';
import { useCart } from '../context/CartContext';
import { 
  generateProductWhatsAppUrl, 
  getProductShareUrl, 
  openWhatsApp,
  isPlayTent 
} from '../utils/whatsapp';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const products = productsData as Product[];
  const { addToCart, buyNow } = useCart();

  // Find product by slug or id
  const product = products.find(p => p.slug === slug || p.id === slug);

  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isTent = product ? (isPlayTent(product) || product.enquiryOnly || product.price === null) : false;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setImageLoaded(false);
    setQuantity(1);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-brand-soft px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-subtle">
          <HelpCircle className="w-12 h-12 text-brand-orange mx-auto mb-3" />
          <h2 className="text-2xl font-extrabold text-brand-dark">Product Not Found</h2>
          <p className="text-sm text-brand-muted mt-2">
            The item you are looking for may have been updated or moved.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link to="/shop" className="btn-primary text-sm">
              Browse Store Catalog
            </Link>
            <Link to="/" className="btn-secondary text-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Related products from same category
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const whatsappUrl = generateProductWhatsAppUrl(product);
  const shareUrl = getProductShareUrl(product);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | DESIGNS SHOPEE`,
          text: `Check out ${product.name} at DESIGNS SHOPEE, Vellore!`,
          url: shareUrl
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddToCart = () => {
    if (!isTent) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (!isTent) {
      buyNow(product, quantity);
    }
  };

  return (
    <div className="min-h-screen bg-white py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-brand-muted mb-6 font-medium overflow-x-auto whitespace-nowrap pb-1">
          <Link to="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link to="/shop" className="hover:text-brand-orange transition-colors">Catalog</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link 
            to={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-brand-orange transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-brand-dark font-bold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-dark mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous</span>
        </button>

        {/* Main Product Display Grid (58% image width on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-gray-100 items-start">
          {/* Left Column: Large High-Resolution Product Image */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden bg-[#FBFBFB] border border-gray-150 shadow-premium w-full aspect-square max-h-[620px] flex items-center justify-center p-4 sm:p-6">
              <OptimizedImage
                src={product.image}
                fallbackSrc={product.thumbnail}
                alt={product.name}
                priority={true}
                width={product.width || 800}
                height={product.height || 800}
                fallbackText={product.name}
                className="w-full h-full"
                imageClassName="drop-shadow-sm"
              />

              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[11px] font-semibold text-gray-600 shadow-sm flex items-center gap-1.5 pointer-events-none">
                <ZoomIn className="w-3.5 h-3.5 text-brand-orange" />
                <span>Original Showroom Photo</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details, Pricing & Action Workflow */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
            <div>
              <Link
                to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase text-brand-orange bg-orange-50 hover:bg-orange-100 rounded-full transition-colors mb-2.5"
              >
                {product.category}
              </Link>

              {/* Exact Clean Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-dark tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-brand-soft border border-gray-100">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                {isTent ? 'Showroom Consultation' : 'Showroom Price'}
              </div>
              <div className="flex items-baseline gap-3">
                {!isTent && product.price !== null ? (
                  <>
                    <span className="text-3xl sm:text-4xl font-black text-brand-dark">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      (Suggested showroom retail price)
                    </span>
                  </>
                ) : (
                  <div>
                    <span className="text-2xl font-black text-brand-orange">
                      Price on Request
                    </span>
                    <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                      Exclusive showroom item. Contact our team directly on WhatsApp for size variants, current price quotation, and availability.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Product Details
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {product.description}
              </p>
              <div className="text-xs text-gray-500 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 leading-relaxed">
                Available at <strong>DESIGNS SHOPEE</strong>, 9 Katpadi Rd, beside Pachaiyappas Silks, Thottapalayam, Vellore. Retail, custom gifting, and bulk orders welcomed.
              </div>
            </div>

            {/* Action Buttons & Quantity Stepper */}
            {isTent ? (
              /* Pop-Up Kids Play Tent Exception: ONLY WhatsApp Enquiry */
              <div className="pt-2 space-y-3">
                <button
                  onClick={() => openWhatsApp(whatsappUrl)}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-[#25D366] hover:bg-[#20be5b] active:scale-[0.99] text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Enquire via WhatsApp</span>
                </button>
              </div>
            ) : (
              /* Standard Products: Quantity Selector, Buy Now & Add to Cart */
              <div className="pt-2 space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    Quantity:
                  </span>
                  <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                      title="Decrease quantity"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-brand-dark">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                      title="Increase quantity"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary Buy Now & Add to Cart Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-2 py-3.5 px-6 bg-brand-orange hover:bg-[#e04c14] active:scale-[0.99] text-white rounded-2xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Buy Now</span>
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 py-3.5 px-6 bg-brand-dark hover:bg-black active:scale-[0.99] text-white rounded-2xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>

                {/* Direct WhatsApp Enquiry Button */}
                <button
                  onClick={() => openWhatsApp(whatsappUrl)}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#1faa53] border border-[#25D366]/30 rounded-2xl font-bold text-xs sm:text-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Enquire about this product on WhatsApp</span>
                </button>
              </div>
            )}

            {/* Share and Showroom Map Shortcuts */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 py-3 px-4 min-h-[44px] bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-700 transition-colors shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Share Product</span>
                  </>
                )}
              </button>

              <a
                href={STORE_DETAILS.googleMaps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-3 px-4 min-h-[44px] bg-white border border-gray-200 hover:border-brand-orange rounded-xl text-xs font-bold text-gray-700 hover:text-brand-orange transition-colors shadow-sm"
              >
                <MapPin className="w-4 h-4 text-brand-orange" />
                <span>Showroom Map</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            </div>

            {/* Trust Assurances */}
            <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-600">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-orange flex-shrink-0" />
                <span>Showroom inspection & live WhatsApp video demos available</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                <span>Carefully packed for safe transport and gifting</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Similar Collection
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark mt-1">
                  More in {product.category}
                </h2>
              </div>

              <Link
                to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="text-xs sm:text-sm font-bold text-brand-orange hover:text-[#e04c14] flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
