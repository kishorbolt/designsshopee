/**
 * SEO & Meta Tags Utility for DESIGNS SHOPEE (https://designsshopee.in/)
 * Ensures dynamic updates for title, description, canonical link, Open Graph and Twitter cards.
 */

export const BASE_CANONICAL_DOMAIN = 'https://designsshopee.in';

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
}

export function updateMetaTags({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = 'website',
}: SEOProps) {
  if (title) {
    document.title = title;
    setMetaTag('og:title', title, 'property');
    setMetaTag('twitter:title', title, 'name');
  }

  if (description) {
    setMetaTag('description', description, 'name');
    setMetaTag('og:description', description, 'property');
    setMetaTag('twitter:description', description, 'name');
  }

  if (canonicalUrl) {
    setMetaTag('og:url', canonicalUrl, 'property');
    setMetaTag('twitter:url', canonicalUrl, 'name');
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonicalUrl;
  }

  if (ogImage) {
    setMetaTag('og:image', ogImage, 'property');
    setMetaTag('twitter:image', ogImage, 'name');
  }

  if (ogType) {
    setMetaTag('og:type', ogType, 'property');
  }
}

function setMetaTag(key: string, content: string, attribute: 'name' | 'property') {
  let meta = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.content = content;
}
