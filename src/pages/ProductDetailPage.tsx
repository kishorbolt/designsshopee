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
  ChevronLeft,
  ShoppingCart,
  Zap,
  Plus,
  Minus,
  Layers,
  Truck,
  RotateCcw
} from 'lucide-react';
import productsData from '../data/products.json';
import { ProductCard } from '../components/ProductCard';
import { OptimizedImage } from '../components/OptimizedImage';
import { Product } from '../types';
import { STORE_DETAILS } from '../utils/constants';
import { useCart } from '../context/CartContext';
import { updateMetaTags, BASE_CANONICAL_DOMAIN } from '../utils/seo';
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
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Touch swipe states for mobile gallery
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const isTent = product ? (isPlayTent(product) || product.enquiryOnly || product.price === null) : false;

  const galleryImages = product && product.images && product.images.length > 0 
    ? product.images 
    : (product ? [product.image] : []);

  const galleryThumbs = product && product.thumbnails && product.thumbnails.length > 0 
    ? product.thumbnails 
    : (product ? [product.thumbnail || product.image] : []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setActiveImageIndex(0);
    setQuantity(1);

    if (product) {
      // Dynamic Search & Social Meta Tags
      const pageTitle = `${product.name} | Toys & Gifts in Vellore | DESIGNS SHOPEE`;
      const pageDesc = `${product.description} Available in-store at DESIGNS SHOPEE, Katpadi Road, Vellore with direct WhatsApp order assistance.`;
      const canonical = `${BASE_CANONICAL_DOMAIN}/product/${product.slug}`;
      const primaryImgUrl = `${BASE_CANONICAL_DOMAIN}${encodeURI(product.image)}`;

      updateMetaTags({
        title: pageTitle,
        description: pageDesc,
        canonicalUrl: canonical,
        ogImage: primaryImgUrl,
        ogType: 'product'
      });
      
      // Inject Schema.org Product JSON-LD for Google Rich Results
      const schemaScriptId = 'product-json-ld';
      let scriptTag = document.getElementById(schemaScriptId) as HTMLScriptElement | null;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = schemaScriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }

      const productLd: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': product.name,
        'image': galleryImages.map(img => `${BASE_CANONICAL_DOMAIN}${encodeURI(img)}`),
        'description': product.description,
        'sku': product.code || product.id,
        'mpn': product.id,
        'category': product.category,
        'brand': {
          '@type': 'Brand',
          'name': 'DESIGNS SHOPEE'
        },
        'offers': {
          '@type': 'Offer',
          'url': canonical,
          'priceCurrency': 'INR',
          'price': product.price || 0,
          'priceValidUntil': '2027-12-31',
          'itemCondition': 'https://schema.org/NewCondition',
          'availability': 'https://schema.org/InStock',
          'seller': {
            '@type': 'Store',
            'name': 'DESIGNS SHOPEE',
            'url': `${BASE_CANONICAL_DOMAIN}/`,
            'telephone': '+919487703591',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': '9, Katpadi Road, beside Pachaiyappas Silks',
              'addressLocality': 'Thottapalayam, Vellore',
              'addressRegion': 'Tamil Nadu',
              'postalCode': '632004',
              'addressCountry': 'IN'
            }
          }
        }
      };

      if (isTent || product.price === null) {
        delete productLd.offers.price;
        delete productLd.offers.priceValidUntil;
        productLd.offers.availability = 'https://schema.org/PreOrder';
      }

      scriptTag.text = JSON.stringify(productLd);
    }

    return () => {
      const scriptTag = document.getElementById('product-json-ld');
      if (scriptTag) scriptTag.remove();

      // Reset to default Homepage SEO on navigation away
      updateMetaTags({
        title: 'DESIGNS SHOPEE | Toys, Gifts & Unique Lifestyle Products in Vellore',
        description: 'Discover toys, kids essentials, unique birthday return gifts, clocks and lifestyle novelties at DESIGNS SHOPEE, 9 Katpadi Road showroom beside Pachaiyappas Silks, Thottapalayam, Vellore. Browse our online catalogue with instant WhatsApp assistance.',
        canonicalUrl: `${BASE_CANONICAL_DOMAIN}/`,
        ogImage: `${BASE_CANONICAL_DOMAIN}/assets/logo.png`,
        ogType: 'website'
      });
    };
  }, [slug, product]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FFFDF5] px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-[#E8DEC8] shadow-xs">
          <HelpCircle className="w-12 h-12 text-brand-green mx-auto mb-3" />
          <h2 className="text-2xl font-black text-[#262626]">Product Not Found</h2>
          <p className="text-sm text-[#262626]/70 mt-2">
            The item you are looking for may have been updated or moved.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link to="/" className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-brand-green text-white font-bold rounded-full text-sm">
              Browse Complete Catalogue ({products.length} Items)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Previous & Next Image Handlers
  const handlePrevImage = () => {
    setActiveImageIndex(prev => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex(prev => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    if (distance > 45) {
      handleNextImage();
    } else if (distance < -45) {
      handlePrevImage();
    }
  };

  // Related products from catalogue (excluding current)
  const relatedProducts = products
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const whatsappUrl = generateProductWhatsAppUrl(product);
  const shareUrl = getProductShareUrl(product);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | DESIGNS SHOPEE Vellore`,
          text: `Check out ${product.name} at DESIGNS SHOPEE, 9 Katpadi Road, Vellore!`,
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

  const discountPercent = product.mrp && product.price && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : null;

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#262626] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#262626]/70 mb-6 font-medium overflow-x-auto whitespace-nowrap pb-1">
          <Link to="/" className="hover:text-brand-green transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link to="/#catalogue" className="hover:text-brand-green transition-colors">Complete Catalogue</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[#262626] font-bold truncate max-w-[240px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#262626]/75 hover:text-brand-green mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </button>

        {/* Main Product Display Grid (Flipkart-style Gallery on Left, Details on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-[#E8DEC8] items-start">
          
          {/* Left Column: Flipkart-Style Product Image Gallery */}
          <div className="lg:col-span-7 select-none">
            
            {/* Large Main Product Image with Swipe & Navigation */}
            <div 
              className="relative rounded-3xl overflow-hidden bg-white border border-[#E8DEC8] shadow-xs w-full aspect-square max-h-[580px] flex items-center justify-center p-4 sm:p-8"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <OptimizedImage
                key={galleryImages[activeImageIndex]}
                src={galleryImages[activeImageIndex]}
                fallbackSrc={galleryThumbs[activeImageIndex] || galleryImages[activeImageIndex]}
                alt={`${product.name} angle ${activeImageIndex + 1}`}
                priority={true}
                width={product.width || 800}
                height={product.height || 800}
                fallbackText={product.name}
                className="w-full h-full"
                imageClassName="transition-transform duration-300 hover:scale-105 drop-shadow-xs"
              />

              {/* Prev Image Button (if multiple images) */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#262626] hover:text-brand-green shadow-md flex items-center justify-center transition-all active:scale-95 border border-[#E8DEC8] z-10"
                  aria-label="Previous product image"
                  title="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Next Image Button (if multiple images) */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#262626] hover:text-brand-green shadow-md flex items-center justify-center transition-all active:scale-95 border border-[#E8DEC8] z-10"
                  aria-label="Next product image"
                  title="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Image Count Indicator (e.g. 1/3) */}
              {galleryImages.length > 1 ? (
                <div className="absolute top-4 right-4 bg-[#262626]/80 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 pointer-events-none">
                  <Layers className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>{activeImageIndex + 1} / {galleryImages.length}</span>
                </div>
              ) : (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs text-[#262626] px-3 py-1 rounded-full text-[11px] font-semibold border border-[#E8DEC8] shadow-xs pointer-events-none">
                  100% Genuine Photo
                </div>
              )}

              {/* Swipe hint for mobile users */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-3 inset-x-0 text-center sm:hidden pointer-events-none">
                  <span className="text-[10px] font-semibold text-[#262626]/60 bg-white/80 px-2.5 py-0.5 rounded-full border border-[#E8DEC8]">
                    Swipe or tap thumbnails to view {galleryImages.length} angles
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Carousel Row (Flipkart Style) */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2.5 sm:gap-3.5 mt-4 overflow-x-auto pb-2 scrollbar-none">
                {galleryImages.map((img, idx) => {
                  const isActive = idx === activeImageIndex;
                  const thumbSrc = galleryThumbs[idx] || img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square w-16 sm:w-20 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white flex-shrink-0 ${
                        isActive 
                          ? 'border-brand-green ring-2 ring-brand-green/30 scale-102 shadow-xs' 
                          : 'border-[#E8DEC8] hover:border-brand-green/60 opacity-80 hover:opacity-100'
                      }`}
                      aria-label={`View angle ${idx + 1} of ${product.name}`}
                    >
                      <OptimizedImage
                        src={thumbSrc}
                        fallbackSrc={img}
                        alt={`${product.name} angle ${idx + 1}`}
                        className="w-full h-full"
                        fit="contain"
                        priority={true}
                      />
                      {isActive && (
                        <span className="absolute bottom-0 inset-x-0 h-1 bg-brand-green" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

          </div>

          {/* Right Column: Product Details, Pricing & Action Workflow */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
            
            <div>
              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#262626] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Store & Location Verification Badge */}
              <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-brand-green">
                <MapPin className="w-3.5 h-3.5 text-[#C6A15B] flex-shrink-0" />
                <span>Showroom item at Katpadi Road, beside Pachaiyappas Silks, Vellore</span>
              </div>
            </div>

            {/* Pricing Section (MRP & Selling Price Extraction) */}
            <div className="p-5 rounded-2xl bg-[#F5EEDC] border border-[#E8DEC8]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#262626]/70 mb-1.5">
                {isTent ? 'Showroom Consultation' : 'Showroom Retail Price'}
              </div>

              {!isTent && product.price !== null ? (
                <div className="space-y-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    {/* Selling Price: Larger, Bold, Prominent */}
                    <span className="text-3xl sm:text-4xl font-black text-[#262626]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>

                    {/* MRP: Smaller, Grey, Struck-through (only when verified) */}
                    {product.mrp && product.mrp > product.price && (
                      <>
                        <span className="text-lg sm:text-xl text-neutral-400 line-through font-semibold">
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs font-bold text-brand-green bg-white px-2 py-0.5 rounded-full border border-brand-green/30 shadow-xs">
                          {discountPercent}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-[#262626]/70 pt-1 font-medium">
                    Verified direct showroom price at DESIGNS SHOPEE, Vellore.
                  </p>
                </div>
              ) : (
                /* Pop-Up Kids Play Tent: Strict Enquiry Only */
                <div>
                  <span className="text-2xl font-black text-brand-green">
                    Price on Request
                  </span>
                  <p className="text-xs text-[#262626]/80 mt-1.5 leading-relaxed font-medium">
                    Showroom specialty item. Contact our team directly on WhatsApp for size variants, current price quotation, and availability.
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#262626]/70">
                Product Details
              </h3>
              <p className="text-sm sm:text-base text-[#262626]/85 leading-relaxed font-normal">
                {product.description}
              </p>
              
              <div className="text-xs text-[#262626]/80 bg-white p-3.5 rounded-2xl border border-[#E8DEC8] leading-relaxed">
                Available at <strong>DESIGNS SHOPEE</strong>, 9 Katpadi Rd, beside Pachaiyappas Silks, Thottapalayam, Vellore. Retail purchases, birthday return gifting, and WhatsApp video verification welcomed.
              </div>
            </div>

            {/* Action Buttons & Quantity Stepper */}
            {isTent ? (
              /* Pop-Up Kids Play Tent Exception: ONLY WhatsApp Enquiry */
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={() => openWhatsApp(whatsappUrl)}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-[#25D366] hover:bg-[#20be5b] active:scale-[0.99] text-white rounded-2xl font-bold text-base shadow-xs hover:shadow-sm transition-all"
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
                  <span className="text-xs font-bold uppercase tracking-wider text-[#262626]/75">
                    Quantity:
                  </span>
                  <div className="inline-flex items-center rounded-xl border border-[#E8DEC8] bg-white p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg hover:bg-[#F5EEDC] text-[#262626] transition-colors"
                      title="Decrease quantity"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-[#262626]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => q + 1)}
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg hover:bg-[#F5EEDC] text-[#262626] transition-colors"
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
                    type="button"
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-2 py-3.5 px-6 bg-[#F5EEDC] hover:bg-[#ebd9bd] text-brand-green border border-[#E8DEC8] active:scale-[0.99] rounded-2xl font-bold text-sm sm:text-base shadow-xs transition-all"
                  >
                    <Zap className="w-4 h-4 fill-current text-brand-green" />
                    <span>Buy Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 py-3.5 px-6 bg-brand-green hover:bg-brand-green-dark active:scale-[0.99] text-white rounded-2xl font-bold text-sm sm:text-base shadow-xs transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>

                {/* Direct WhatsApp Enquiry Button */}
                <button
                  type="button"
                  onClick={() => openWhatsApp(whatsappUrl)}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-[#F5EEDC] text-brand-green border border-brand-green/30 rounded-2xl font-bold text-xs sm:text-sm transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Enquire about this product on WhatsApp (+91 94877 03591)</span>
                </button>
              </div>
            )}

            {/* Share and Showroom Map Shortcuts */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center justify-center gap-2 py-3 px-4 min-h-[44px] bg-white border border-[#E8DEC8] hover:bg-[#F5EEDC] rounded-xl text-xs font-bold text-[#262626] transition-colors shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-brand-green" />
                    <span className="text-brand-green">Link Copied!</span>
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
                className="flex items-center justify-center gap-1.5 py-3 px-4 min-h-[44px] bg-white border border-[#E8DEC8] hover:bg-[#F5EEDC] rounded-xl text-xs font-bold text-brand-green transition-colors shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Showroom Map</span>
                <ExternalLink className="w-3 h-3 text-[#262626]/50" />
              </a>
            </div>

            {/* Trust Assurances */}
            <div className="pt-4 border-t border-[#E8DEC8] space-y-2.5 text-xs text-[#262626]/75">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>Showroom inspection & live WhatsApp video demos available</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#C6A15B] flex-shrink-0" />
                <span>Carefully packed for safe transport and gifting</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>Same-day pickup in Vellore or safe courier across India</span>
              </div>
            </div>

          </div>
        </div>

        {/* More Products from the Catalogue */}
        {relatedProducts.length > 0 && (
          <div className="pt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
                  Showroom Collection
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#262626] mt-1">
                  More Products from DESIGNS SHOPEE
                </h2>
              </div>

              <Link
                to="/#catalogue"
                className="text-xs sm:text-sm font-bold text-brand-green hover:underline flex items-center gap-1"
              >
                <span>View All {products.length} Items</span>
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

export default ProductDetailPage;
