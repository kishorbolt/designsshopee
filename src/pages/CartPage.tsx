import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  MessageCircle,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { OptimizedImage } from '../components/OptimizedImage';

export const CartPage: React.FC = () => {
  const { items, totalItems, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-brand-soft py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 text-center border border-gray-150 shadow-subtle">
          <div className="w-20 h-20 rounded-3xl bg-orange-50 text-brand-orange flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-black text-brand-dark mb-2">
            Your Shopping Cart is Empty
          </h2>
          
          <p className="text-sm text-brand-muted leading-relaxed mb-8">
            You haven't added any products to your cart yet. Explore our curated catalog of 200+ novelties, toys, home accents, and gifts.
          </p>

          <Link
            to="/shop"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-brand-orange hover:bg-[#e04c14] text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200"
          >
            <span>Explore Store Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-soft py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-brand-orange mb-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Checkout Preparation</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-brand-dark tracking-tight">
              Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-brand-orange transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </button>

            <span className="text-gray-300">•</span>

            <button
              onClick={clearCart}
              className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Main Grid: Items List + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-150 shadow-subtle overflow-hidden">
              <div className="p-4 sm:p-6 divide-y divide-gray-100">
                {items.map((item) => {
                  const lineTotal = item.price * item.quantity;

                  return (
                    <div 
                      key={item.id} 
                      className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* Product Thumbnail & Name */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Link 
                          to={`/product/${item.slug}`}
                          className="w-20 h-20 rounded-2xl bg-[#FBFBFB] border border-gray-150 flex items-center justify-center p-1 flex-shrink-0 overflow-hidden hover:opacity-90 transition-opacity"
                        >
                          <OptimizedImage
                            src={item.thumbnail || item.image}
                            fallbackSrc={item.image}
                            alt={item.name}
                            fallbackText={item.name}
                            className="w-full h-full"
                          />
                        </Link>

                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-bold text-brand-orange uppercase tracking-wider block mb-0.5">
                            {item.category}
                          </span>
                          <Link 
                            to={`/product/${item.slug}`}
                            className="text-sm sm:text-base font-bold text-brand-dark hover:text-brand-orange transition-colors line-clamp-2 leading-snug"
                          >
                            {item.name}
                          </Link>
                          <div className="text-xs text-gray-500 mt-1 font-medium">
                            Unit Price: <span className="font-bold text-brand-dark">₹{item.price.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                        {/* Stepper */}
                        <div className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-white text-gray-600 transition-colors"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          
                          <span className="w-9 text-center font-bold text-xs sm:text-sm text-brand-dark">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-white text-gray-600 transition-colors"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Line Subtotal */}
                        <div className="text-right min-w-[80px]">
                          <span className="text-xs text-gray-400 block font-medium">Subtotal</span>
                          <span className="text-base sm:text-lg font-black text-brand-dark">
                            ₹{lineTotal.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="min-w-[40px] min-h-[40px] flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"
                          title="Remove item"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reassurance Banner */}
            <div className="p-4 rounded-2xl bg-white border border-gray-150 flex items-center gap-3 text-xs text-gray-600">
              <ShieldCheck className="w-5 h-5 text-brand-orange flex-shrink-0" />
              <span>
                Orders are fulfilled directly by <strong>DESIGNS SHOPEE</strong> (Vellore showroom). We review each item, confirm packaging, and verify courier / local pickup on WhatsApp.
              </span>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-gray-150 shadow-premium p-6 sm:p-8 space-y-6 sticky top-28">
              <h3 className="text-lg font-extrabold text-brand-dark border-b border-gray-100 pb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Total Items</span>
                  <span className="font-bold text-brand-dark">{totalItems}</span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Cart Subtotal</span>
                  <span className="font-extrabold text-brand-dark text-lg">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-start justify-between text-gray-600 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-brand-orange" />
                    <span>Delivery Charges</span>
                  </div>
                  <span className="text-xs font-semibold text-brand-orange bg-orange-50 px-2 py-0.5 rounded-md">
                    To be confirmed
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Delivery charges are calculated based on your delivery destination and confirmed by our showroom team.
                </p>
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-bold text-brand-dark">Grand Total</span>
                  <span className="text-2xl sm:text-3xl font-black text-brand-dark">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 block">
                  + applicable delivery charges upon order confirmation
                </span>
              </div>

              {/* Proceed to Checkout Button */}
              <div className="pt-2 space-y-3">
                <Link
                  to="/checkout"
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 bg-brand-orange hover:bg-[#e04c14] active:scale-[0.99] text-white rounded-2xl font-bold text-base shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/shop"
                  className="w-full inline-flex items-center justify-center py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <span>Continue Browsing Catalog</span>
                </Link>
              </div>

              {/* Direct WhatsApp Notice */}
              <div className="p-3 bg-green-50/70 border border-green-100 rounded-2xl flex items-center gap-2.5 text-xs text-green-800">
                <MessageCircle className="w-4 h-4 text-[#25D366] fill-current flex-shrink-0" />
                <span>Next step: Fill your delivery details and place your order directly via WhatsApp.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

