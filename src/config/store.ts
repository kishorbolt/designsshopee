/**
 * Centralized Store & Contact Configuration for DESIGNS SHOPEE
 * Primary source of truth for telephone, WhatsApp, social links, and physical showroom address.
 */

export const STORE_CONFIG = {
  name: "DESIGNS SHOPEE",
  phone: "9487703591",
  whatsapp: "919487703591",
  facebook: "https://www.facebook.com/share/1SopKw643u/",
  instagram: "https://www.instagram.com/designsshopee?srtk=MXRwaXIwcWI5d3dmZg==",
  googleReviews: "https://share.google/qgdNMrJip4xBKEjZZ"
};

export const STORE_DETAILS = {
  ...STORE_CONFIG,
  phoneDisplay: "+91 94877 03591",
  whatsappNumber: STORE_CONFIG.whatsapp,
  whatsappDisplay: "+91 94877 03591",
  whatsappRaw: STORE_CONFIG.phone,
  
  address: {
    shopName: "DESIGNS SHOPEE",
    street: "9, Katpadi Rd, beside Pachaiyappas Silks",
    area: "Thottapalayam",
    city: "Vellore",
    state: "Tamil Nadu",
    pincode: "632004",
    country: "India",
    formatted: "DESIGNS SHOPEE, 9, Katpadi Rd, beside Pachaiyappas Silks, Thottapalayam, Vellore, Tamil Nadu 632004, India."
  },

  googleMaps: {
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=DESIGNS+SHOPEE%2C+9%2C+Katpadi+Rd%2C+Thottapalayam%2C+Vellore%2C+Tamil+Nadu+632004",
    embedUrl: "https://www.google.com/maps?q=DESIGNS+SHOPEE+9+Katpadi+Rd+beside+Pachaiyappas+Silks+Thottapalayam+Vellore+Tamil+Nadu+632004&output=embed"
  },

  features: [
    {
      title: "Handpicked Premium Quality",
      description: "Carefully selected gift articles, home novelties, toys, and specialty items with superior craftsmanship."
    },
    {
      title: "Direct WhatsApp Assistance",
      description: "Chat directly with our showroom team for instant pricing, video demos, and product verification."
    },
    {
      title: "Vellore Showroom Experience",
      description: "Conveniently located on Katpadi Road beside Pachaiyappas Silks with easy parking and access."
    },
    {
      title: "Fast Local Pickup & Courier",
      description: "Quick order confirmation, safe packaging, and swift order handling for retail and gifting needs."
    }
  ]
};

