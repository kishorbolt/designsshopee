import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CartToast } from './components/CartToast';
import { CartProvider } from './context/CartContext';
import { HomePage } from './pages/HomePage';

// Route-based lazy loading for secondary pages
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));

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
    <div className="relative w-12 h-12 mb-3">
      <div className="absolute inset-0 rounded-full border-3 border-orange-100" />
      <div className="absolute inset-0 rounded-full border-3 border-brand-orange border-t-transparent animate-spin" />
    </div>
    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse">
      Loading DESIGNS SHOPEE...
    </p>
  </div>
);

const AppContent: React.FC = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/' || pathname === '/shop' || pathname === '/categories';

  return (
    <div className="flex flex-col min-h-screen bg-white text-brand-dark overflow-x-hidden w-full">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            {/* Main shopping homepage with complete catalogue */}
            <Route path="/" element={<HomePage />} />
            {/* /shop and /categories display the same main catalogue */}
            <Route path="/shop" element={<HomePage />} />
            <Route path="/categories" element={<HomePage />} />
            {/* Product Detail Pages */}
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            {/* Cart & Checkout */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            {/* About Us (dedicated informational page) */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<AboutPage />} />
            {/* Fallback to Main Shopping Catalogue */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <FloatingWhatsApp />
      <CartToast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
