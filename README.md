# DESIGNS SHOPEE — Premium E-Commerce Website & Product Catalog

A complete, production-grade, mobile-first e-commerce and product discovery storefront built for **DESIGNS SHOPEE** (Vellore, Tamil Nadu).

---

## 1. Business & Store Details

* **Brand Name:** DESIGNS SHOPEE
* **Showroom Address:** 
  9, Katpadi Rd, beside Pachaiyappas Silks,
  Thottapalayam, Vellore,
  Tamil Nadu 632004, India.
* **Direct WhatsApp:** `+91 94877 03591` (`919487703591`)
* **Google Maps Directions:** [Click here for navigation](https://www.google.com/maps/search/?api=1&query=DESIGNS+SHOPEE%2C+9%2C+Katpadi+Rd%2C+Thottapalayam%2C+Vellore%2C+Tamil+Nadu+632004)
* **Brand Colors:**
  * Primary: Vibrant Orange (`#FF5A1F`)
  * Secondary: Golden Yellow (`#FFC400`)
  * Dark: Near Black (`#101010`)
  * Light / Surfaces: Soft Warm Gray (`#F7F7F7`) and Pure White (`#FFFFFF`)

---

## 2. PDF Catalogue Extraction & Integration Report

The official catalogue PDF ([`Designs_Shopee_Product_Catalogue_Named.pdf`](public/products/Designs_Shopee_Product_Catalogue_Named.pdf)) serves as the primary source of truth for all product names and product photographs.

| Metric | Count | Details |
| :--- | :--- | :--- |
| **Total Products in PDF** | **210** | Complete sequence from **DS-001** to **DS-210** across 36 pages |
| **Total Unique Product Names** | **208** | 2 genuine duplicate model listings preserved (e.g. separate entries for kitchen weighing scale & padlock models) |
| **Total Images Extracted** | **210** | 100% of embedded image objects extracted directly from PDF streams |
| **Successfully Matched Products** | **210** | Every product paired 1:1 with its authentic extracted catalogue photograph |
| **Missing Images** | **0** | Zero missing images across the entire database |
| **Catalogue Resolution Flagged (<=300px)** | **210** | All 210 embedded photos are 173×245px to 300×212px. Transparently flagged for better source photos rather than artificially upscaled |
| **Products Requiring Verification** | **1** | **`DS-070`** (`Portable Foldable Travel Urinal (image needs verification)`) — flagged with a showroom verification alert |

---

## 3. Image Quality & Handling Standards

1. **Bit-for-Bit Untouched Extraction:** All 210 original JPEG byte streams are extracted directly from the PDF dictionary without re-compression into `public/products/catalog/DS-xxx.jpeg`.
2. **High-Quality WebP Thumbnails:** Saved in `public/products/thumbs/DS-xxx.webp` (quality 92, method 6) for fast mobile rendering.
3. **No Artificial Upscaling:** Transparently notes that catalogue photos are 173–300px wide. No fake HD upscaling filters.
4. **`object-fit: contain`:** Applied everywhere on cards and detail pages to preserve natural aspect ratios with clean, tasteful background framing (`bg-[#fafafa]`).
5. **No Substitution:** Unrelated photos from external folders are NOT substituted. Every product features its genuine catalogue photograph.

---

## 4. WhatsApp Direct Enquiry Integration

* **WhatsApp Number:** `919487703591`
* **Format:** `https://wa.me/919487703591?text=ENCODED_MESSAGE`
* **Product-Specific Message:**
  ```text
  Hello DESIGNS SHOPEE!

  I am interested in this product.

  Product: [Exact Product Name From PDF]
  Item Code: [DS-xxx]
  Category: [Category]
  Price: Available on Request
  Product Link: https://[domain]/product/[slug]

  Please share more details, photos, and availability. Thank you!
  ```
* **Floating WhatsApp Button:** Available across all pages for general store enquiries.

---

## 5. Build and QA Commands

```bash
# Development server
npm run dev

# Discover & extract PDF catalogue
npm run discover

# Production build with automated verification
npm run build

# Run verification suite
npm run verify
```
