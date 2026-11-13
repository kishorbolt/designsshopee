import { Product, CartItem, CustomerOrderDetails } from '../types';
import { STORE_CONFIG } from '../config/store';

/**
 * Returns the base production or public site URL.
 * Guarantees no localhost URL is ever used in customer WhatsApp enquiry or checkout messages.
 */
export function getBaseSiteUrl(): string {
  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.local')) {
      return 'https://designsshopee.in';
    }
    return window.location.origin;
  }
  return 'https://designsshopee.in';
}

/**
 * Helper to identify Pop-Up Kids Play Tent exception
 */
export function isPlayTent(product?: { name?: string; slug?: string } | null): boolean {
  if (!product) return false;
  return (
    product.slug === 'pop-up-kids-play-tent' || 
    product.name === 'Pop-Up Kids Play Tent'
  );
}

/**
 * Generate canonical shareable product URL
 */
export function getProductShareUrl(product: { slug?: string; id?: string }): string {
  const base = getBaseSiteUrl();
  const identifier = encodeURIComponent(product.slug || product.id || '');
  return `${base}/product/${identifier}`;
}

/**
 * Generate image absolute URL
 */
export function getProductImageUrl(product: { image: string }): string {
  const base = getBaseSiteUrl();
  return `${base}${product.image}`;
}

/**
 * Generates product-specific WhatsApp enquiry URL with encoded message
 * WhatsApp target: https://wa.me/919487703591?text=...
 */
export function generateProductWhatsAppUrl(product: Product): string {
  const productUrl = getProductShareUrl(product);

  // Special Exception: Pop-Up Kids Play Tent
  if (isPlayTent(product)) {
    const tentMessage = `Hello DESIGNS SHOPEE!

I am interested in the Pop-Up Kids Play Tent.

Please share the price and product details.

Product Link: ${productUrl}`;
    return `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(tentMessage)}`;
  }

  const messageText = `Hello DESIGNS SHOPEE!

I am interested in this product.

Product Name: ${product.name}
Product Link: ${productUrl}

Please share more details.`;

  return `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(messageText)}`;
}

/**
 * Generates comprehensive multi-item WhatsApp checkout message
 */
export function generateCheckoutWhatsAppUrl(
  customer: CustomerOrderDetails,
  items: CartItem[]
): string {
  const base = getBaseSiteUrl();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderLines = items.map((item, index) => {
    const itemSubtotal = item.price * item.quantity;
    const itemUrl = `${base}/product/${encodeURIComponent(item.slug || item.id)}`;
    return `${index + 1}. Product: ${item.name}
   Quantity: ${item.quantity}
   Unit Price: ₹${item.price}
   Subtotal: ₹${itemSubtotal}
   Product Link: ${itemUrl}`;
  }).join('\n\n');

  const message = `Hello DESIGNS SHOPEE!

I would like to place an order.

CUSTOMER DETAILS:
Name: ${customer.name.trim()}
Mobile: ${customer.mobile.trim()}
Address: ${customer.address.trim()}
City: ${customer.city.trim()}
PIN Code: ${customer.pincode.trim()}

ORDER DETAILS:

${orderLines}

ORDER SUMMARY:
Total Items: ${totalItems}
Subtotal: ₹${subtotal}
Delivery: To be confirmed
Grand Total: ₹${subtotal} + applicable delivery charges

Please confirm my order and delivery details.

Thank you!
DESIGNS SHOPEE`;

  return `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates general showroom enquiry WhatsApp URL
 */
export function generateGeneralWhatsAppUrl(contextMessage?: string): string {
  const text = contextMessage || `Hello DESIGNS SHOPEE!

I visited your website (https://designsshopee.in) and would like to enquire about your products and showroom in Vellore.

Please share more details.`;

  const encodedMessage = encodeURIComponent(text);
  return `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodedMessage}`;
}

/**
 * Opens WhatsApp conversation in a new secure browser tab
 */
export function openWhatsApp(url: string): void {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
