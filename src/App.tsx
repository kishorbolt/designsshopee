import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CartToast } from './components/CartToast';
import { CartProvider } from './context/CartContext';
import { HomePage } from './pages/HomePage';

// Route-based lazy loading for optimal bundle splitting and performance
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));

// Scroll to top helper on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

// Route transition loading skeleton
const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center py-20 px-4">
    <div className="relative w-14 h-14 mb-4">
      <div className="absolute inset-0 rounded-full border-4 border-orange-100" />
      <div className="absolute inset-0 rounded-full border-4 border-brand-orange border-t-transparent animate-spin" />
    </div>
    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse">
      Loading DESIGNS SHOPEE...
    </p>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-white text-brand-dark overflow-x-hidden w-full">
          <Header />
          <main className="flex-grow">
            <Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <FloatingWhatsApp />
          <CartToast />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
