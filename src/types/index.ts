export interface Product {
  id: string;
  code?: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  thumbnail: string;
  width: number;
  height: number;
  aspectRatio: number;
  price: number | null;
  priceDisplay: string;
  hasPrice: boolean;
  enquiryOnly?: boolean;
  suggestedPrice?: boolean;
  pendingApproval?: boolean;
  description: string;
  availability: string;
  inStock: boolean;
  featured: boolean;
  newArrival: boolean;
  imageMatched?: boolean;
  matchingSource?: string;
  isLowResolution?: boolean;
  imageResolution?: string;
  flaggedForBetterSource?: boolean;
  resolutionNote?: string;
  needsVerification?: boolean;
  pdfPage?: number;
  pdfReference?: string;
  originalFilename?: string;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  image: string;
  featuredProductId: string;
}

export interface StoreInfo {
  name: string;
  phone: string;
  phoneDisplay: string;
  addressLines: string[];
  fullAddress: string;
  mapsQueryUrl: string;
  mapsEmbedUrl: string;
}

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  thumbnail: string;
  price: number;
  quantity: number;
}

export interface CustomerOrderDetails {
  name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  rating: number;
  text: string;
  hasPhotos?: boolean;
  photoNote?: string;
  source: string;
  relativeTime?: string;
}


