import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  MessageSquare, 
  CheckCircle2, 
  Camera, 
  MapPin, 
  Quote, 
  Grid3X3, 
  Layers
} from 'lucide-react';
import rawReviews from '../data/reviews.json';
import { CustomerReview } from '../types';
import { STORE_CONFIG, STORE_DETAILS } from '../utils/constants';

const reviews: CustomerReview[] = rawReviews as CustomerReview[];

// Official Multi-Colored Google "G" SVG Icon
export const GoogleLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

// Helper for initials
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Avatar background colors based on name hash
const AVATAR_COLORS = [
  'bg-brand-green text-white',
  'bg-stone-700 text-white',
  'bg-teal-800 text-white',
  'bg-emerald-800 text-white',
  'bg-amber-700 text-white',
  'bg-[#C6A15B] text-white',
  'bg-neutral-800 text-white',
  'bg-cyan-800 text-white',
];

const getAvatarColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

// Single Review Card with "Read More / Read Less"
interface ReviewCardProps {
  review: CustomerReview;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const initials = getInitials(review.name);
  const avatarClass = getAvatarColor(review.name);

  // Check if content is long enough to need "Read More"
  const isLong = review.text.length > 130 || review.text.split('\n').length > 3;

  return (
    <div className="h-full flex flex-col justify-between bg-[#FFFDF5] rounded-2xl p-5 sm:p-6 border border-[#E8DEC8] shadow-xs hover:shadow-sm transition-all duration-200 relative group">
      {/* Top Header: Avatar, Name, Star Rating */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div 
              className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm tracking-wider flex-shrink-0 shadow-xs ${avatarClass}`}
              aria-hidden="true"
            >
              {initials}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-base font-bold text-[#262626] truncate leading-snug">
                {review.name}
              </h4>
              <div className="flex items-center gap-1.5 text-[11px] text-[#262626]/65 font-medium">
                <span className="text-brand-green font-semibold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3 text-brand-green inline" />
                  Verified
                </span>
                <span>•</span>
                <span>{review.source}</span>
              </div>
            </div>
          </div>

          {/* Star Rating Badge */}
          <div className="flex items-center gap-0.5 bg-[#F5EEDC] px-2 py-1 rounded-lg border border-[#E8DEC8] flex-shrink-0">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 text-[#C6A15B] fill-[#C6A15B]" />
            ))}
          </div>
        </div>

        {/* Review Text / Photo Note */}
        <div className="mt-2 text-xs sm:text-sm text-[#262626]/85 leading-relaxed">
          {review.text ? (
            <div>
              <p 
                className={`whitespace-pre-line text-[#262626]/85 transition-all duration-200 ${
                  !isExpanded && isLong ? 'line-clamp-4' : ''
                }`}
              >
                {review.text}
              </p>
              
              {isLong && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-xs font-bold text-brand-green hover:underline focus:outline-none inline-flex items-center gap-1 min-h-[32px] py-1"
                  aria-label={isExpanded ? `Show less review for ${review.name}` : `Read more review for ${review.name}`}
                >
                  {isExpanded ? 'Read Less ▲' : 'Read More ▼'}
                </button>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-[#F5EEDC] border border-[#E8DEC8] flex items-center gap-2.5 text-xs text-[#262626]">
              <Camera className="w-4 h-4 text-brand-green flex-shrink-0" />
              <span className="font-medium text-[#262626]/65">
                {review.photoNote || 'Photo review submitted on Google Maps'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Verified Google Badge */}
      <div className="mt-4 pt-3 border-t border-[#E8DEC8]/60 flex items-center justify-between text-[11px] text-[#262626]/60">
        <span className="inline-flex items-center gap-1 text-[#262626]/65">
          <GoogleLogoIcon className="w-3.5 h-3.5" />
          <span>Vellore Showroom Visit</span>
        </span>
        {review.hasPhotos && (
          <span className="inline-flex items-center gap-1 text-brand-green bg-[#F5EEDC] px-2 py-0.5 rounded-full font-bold">
            <Camera className="w-3 h-3" />
            Photos
          </span>
        )}
      </div>
    </div>
  );
};

export const GoogleReviewsSection: React.FC = () => {
  const reviewUrl = STORE_CONFIG.googleReviews || 'https://share.google/qgdNMrJip4xBKEjZZ';
  
  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Responsive itemsPerPage calculation
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerPage(1); // Mobile: 1 card
      } else if (width < 1024) {
        setItemsPerPage(2); // Tablet: 2 cards
      } else {
        setItemsPerPage(3); // Desktop: 3 cards
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  // Auto-play timer
  useEffect(() => {
    if (viewMode !== 'carousel' || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 >= totalPages ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [totalPages, isPaused, viewMode]);

  // Carousel navigation handlers
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 < 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1 >= totalPages ? 0 : prev + 1));
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Visible items for carousel
  const visibleReviews = useMemo(() => {
    const start = currentIndex * itemsPerPage;
    return reviews.slice(start, start + itemsPerPage);
  }, [currentIndex, itemsPerPage]);

  return (
    <section 
      id="google-reviews"
      className="py-14 sm:py-20 md:py-24 bg-[#F5EEDC] border-y border-[#E8DEC8] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF5] border border-[#E8DEC8] shadow-xs text-xs font-bold uppercase tracking-wider text-brand-green mb-3">
            <GoogleLogoIcon className="w-4 h-4" />
            <span>Google Customer Reviews</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#262626] tracking-tight leading-tight">
            What Our Customers Say
          </h2>
          
          <p className="text-sm sm:text-base text-[#262626]/75 mt-2 max-w-xl mx-auto font-medium">
            Real experiences from customers who visited DESIGNS SHOPEE, Vellore.
          </p>
        </div>

        {/* Top Google Business Profile Verification Banner */}
        <div className="max-w-4xl mx-auto mb-10 bg-[#FFFDF5] rounded-3xl p-6 sm:p-8 border border-[#E8DEC8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#F5EEDC] border border-[#E8DEC8] shadow-xs flex items-center justify-center p-3 flex-shrink-0">
              <GoogleLogoIcon className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#262626]">
                  DESIGNS SHOPEE
                </h3>
                <span title="Verified Business">
                  <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0" />
                </span>
              </div>
              <p className="text-xs text-[#262626]/70 mt-1 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                <span>9, Katpadi Rd, beside Pachaiyappas Silks, Thottapalayam, Vellore</span>
              </p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-2.5">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-[#C6A15B] fill-[#C6A15B]" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#262626]">5.0 / 5.0</span>
                <span className="text-xs text-[#262626]/50">•</span>
                <span className="text-xs font-bold text-brand-green">
                  {reviews.length} Verified Customer Reviews
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full sm:w-auto flex-shrink-0">
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-5 bg-brand-green hover:bg-brand-green-dark text-white rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all duration-200 active:scale-[0.99] min-h-[44px]"
            >
              <GoogleLogoIcon className="w-4 h-4" />
              <span>View All Google Reviews</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-[#F5EEDC] hover:bg-[#ebd9bd] text-[#262626] border border-[#E8DEC8] rounded-xl font-bold text-xs transition-colors shadow-xs min-h-[44px]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-brand-green" />
              <span>Write a Google Review</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#262626]/60" />
            </a>
          </div>
        </div>

        {/* View Mode Toggle & Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-[#262626]">
              Original Customer Reviews ({reviews.length})
            </span>
            <span className="text-xs text-[#262626]/65 font-medium hidden sm:inline">
              • Showing page {currentIndex + 1} of {totalPages}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="bg-[#FFFDF5] p-1 rounded-xl flex items-center border border-[#E8DEC8]">
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                  viewMode === 'carousel' 
                    ? 'bg-brand-green text-white shadow-xs' 
                    : 'text-[#262626] hover:text-brand-green'
                }`}
                title="Carousel View"
                aria-label="Switch to carousel view"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Carousel</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                  viewMode === 'grid' 
                    ? 'bg-brand-green text-white shadow-xs' 
                    : 'text-[#262626] hover:text-brand-green'
                }`}
                title="Grid View (All Reviews)"
                aria-label="Switch to grid view"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">All ({reviews.length})</span>
              </button>
            </div>

            {/* Carousel Arrow Controls */}
            {viewMode === 'carousel' && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-xl bg-[#FFFDF5] hover:bg-white text-[#262626] hover:text-brand-green flex items-center justify-center shadow-xs transition-all active:scale-95 border border-[#E8DEC8] focus:outline-none"
                  aria-label="Previous customer reviews"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-10 h-10 rounded-xl bg-[#FFFDF5] hover:bg-white text-[#262626] hover:text-brand-green flex items-center justify-center shadow-xs transition-all active:scale-95 border border-[#E8DEC8] focus:outline-none"
                  aria-label="Next customer reviews"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Content */}
        {viewMode === 'carousel' ? (
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {visibleReviews.map((rev) => (
                <div key={rev.id} className="min-h-[220px]">
                  <ReviewCard review={rev} />
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {[...Array(totalPages)].map((_, pageIdx) => (
                <button
                  key={pageIdx}
                  type="button"
                  onClick={() => setCurrentIndex(pageIdx)}
                  className={`h-2.5 rounded-full transition-all min-w-[10px] min-h-[44px] flex items-center justify-center ${
                    currentIndex === pageIdx
                      ? 'w-8 bg-brand-green'
                      : 'w-2.5 bg-[#E8DEC8] hover:bg-brand-green/40'
                  }`}
                  aria-label={`Go to review page ${pageIdx + 1}`}
                >
                  <span className="sr-only">Page {pageIdx + 1}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Full Grid View of all 30 Genuine Reviews */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="min-h-[220px]">
                <ReviewCard review={rev} />
              </div>
            ))}
          </div>
        )}

        {/* Bottom Google Verified Footnote */}
        <div className="mt-12 text-center border-t border-[#E8DEC8] pt-6">
          <p className="text-xs text-[#262626]/70 flex items-center justify-center gap-2 font-medium">
            <GoogleLogoIcon className="w-4 h-4 flex-shrink-0" />
            <span>
              All reviews are genuine Google Maps visitor ratings for <strong className="text-[#262626]">DESIGNS SHOPEE</strong>, 9, Katpadi Rd, Vellore.
            </span>
          </p>
        </div>

      </div>
    </section>
  );
};

export default GoogleReviewsSection;
