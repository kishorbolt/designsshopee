import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowLeft, 
  ShieldCheck, 
  MessageCircle, 
  Truck, 
  MapPin, 
  User, 
  Phone, 
  CheckCircle2, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CustomerOrderDetails } from '../types';
import { generateCheckoutWhatsAppUrl, openWhatsApp } from '../utils/whatsapp';
import { STORE_CONFIG, STORE_DETAILS } from '../utils/constants';
import { OptimizedImage } from '../components/OptimizedImage';

export const CheckoutPage: React.FC = () => {
  const { items, totalItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CustomerOrderDetails>({
    name: '',
    mobile: '',
    address: '',
    city: 'Vellore',
    state: 'Tamil Nadu',
    pincode: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerOrderDetails, string>>>({});
  const [orderSent, setOrderSent] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');

  if (items.length === 0 && !orderSent) {
    return (
      <div className="min-h-[70vh] bg-brand-soft py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 text-center border border-gray-150 shadow-subtle">
          <div className="w-16 h-16 rounded-3xl bg-orange-50 text-brand-orange flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-brand-dark mb-2">No Items for Checkout</h2>
          <p className="text-sm text-brand-muted mb-6">
            Your shopping cart is currently empty. Add products to your cart before proceeding to checkout.
          </p>
          <Link to="/" className="btn-primary w-full text-sm">
            Browse Store Catalog
          </Link>
        </div>
      </div>
    );
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerOrderDetails, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!cleanMobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (cleanMobile.length < 10) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    const cleanPin = formData.pincode.replace(/\D/g, '');
    if (!cleanPin) {
      newErrors.pincode = 'PIN Code is required';
    } else if (cleanPin.length !== 6) {
      newErrors.pincode = 'Enter a valid 6-digit PIN code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerOrderDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      // Scroll to first error
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    // Generate comprehensive WhatsApp checkout URL
    const whatsappUrl = generateCheckoutWhatsAppUrl(formData, items);
    setLastWhatsAppUrl(whatsappUrl);
    setOrderSent(true);

    // Open WhatsApp in a new tab
    openWhatsApp(whatsappUrl);
  };

  const handleResetOrder = () => {
    clearCart();
    navigate('/shop');
  };

  return (
    <div className="min-h-screen bg-brand-soft py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-brand-orange transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Shopping Cart</span>
          </Link>

          <span className="text-xs text-gray-500 font-medium">
            Checkout Handoff: Official Showroom WhatsApp
          </span>
        </div>

        {/* Order Dispatched Success Modal / Panel */}
        {orderSent && (
          <div className="mb-10 bg-white rounded-3xl p-6 sm:p-8 border-2 border-green-500 shadow-xl animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-black text-brand-dark">
                  Order Details Dispatched to WhatsApp!
                </h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>! Your order with <strong>{totalItems} items</strong> (Subtotal: <strong>₹{subtotal.toLocaleString('en-IN')}</strong>) has been generated. WhatsApp should have opened in a new tab with your pre-filled message.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={lastWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20be5b] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Re-open WhatsApp Chat</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={handleResetOrder}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Cart & Return to Store</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-brand-orange mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Delivery & Showroom Handoff</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-brand-dark tracking-tight">
            Checkout & WhatsApp Order
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Fill in your delivery address below. Your order will be compiled into one formatted message and sent directly to our official showroom WhatsApp for instant confirmation.
          </p>
        </div>

        {/* Main Grid: Customer Form + Order Summary */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customer Details Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-150 shadow-subtle p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
                <User className="w-5 h-5 text-brand-orange" />
                <h2 className="text-lg font-extrabold text-brand-dark">
                  Customer Information
                </h2>
              </div>

              {/* Full Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange/20 ${
                      errors.name ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-brand-orange'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 font-semibold mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-gray-400">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange/20 ${
                        errors.mobile ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-brand-orange'
                      }`}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-xs text-red-500 font-semibold mt-1">{errors.mobile}</p>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Door number, street name, apartment/building, prominent landmark"
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange/20 ${
                    errors.address ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-brand-orange'
                  }`}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 font-semibold mt-1">{errors.address}</p>
                )}
              </div>

              {/* City, State, PIN Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Vellore"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange/20 ${
                      errors.city ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-brand-orange'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-xs text-red-500 font-semibold mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Tamil Nadu"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="632004"
                    maxLength={6}
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange/20 ${
                      errors.pincode ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-brand-orange'
                    }`}
                  />
                  {errors.pincode && (
                    <p className="text-xs text-red-500 font-semibold mt-1">{errors.pincode}</p>
                  )}
                </div>
              </div>

              {/* Order Notes (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Optional Gifting / Delivery Instructions
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="e.g. Gift wrap requested, or pickup at Vellore showroom"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>
            </div>

            {/* Direct Verification Notice */}
            <div className="bg-white rounded-3xl p-6 border border-gray-150 space-y-3 text-xs text-gray-600">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-brand-dark block text-sm">
                    Showroom Verification & Direct Assistance
                  </strong>
                  <p className="leading-relaxed">
                    This order is handled via direct WhatsApp communication with DESIGNS SHOPEE ({STORE_DETAILS.whatsappDisplay}). We confirm stock availability, share live item videos if requested, calculate exact shipping fees based on destination, and arrange local pickup or courier.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-gray-150 shadow-premium p-6 sm:p-8 space-y-6 sticky top-28">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-lg font-extrabold text-brand-dark">
                  Order Summary ({totalItems})
                </h3>
                <Link to="/cart" className="text-xs font-bold text-brand-orange hover:text-[#e04c14]">
                  Edit Items
                </Link>
              </div>

              {/* Selected Items List */}
              <div className="max-h-[260px] overflow-y-auto divide-y divide-gray-100 pr-1">
                {items.map((item) => {
                  const lineTotal = item.price * item.quantity;
                  return (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-[#FBFBFB] border border-gray-150 flex items-center justify-center p-0.5 flex-shrink-0 overflow-hidden">
                        <OptimizedImage
                          src={item.thumbnail || item.image}
                          fallbackSrc={item.image}
                          alt={item.name}
                          fallbackText={item.name}
                          className="w-full h-full"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-brand-dark truncate leading-snug">
                          {item.name}
                        </p>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          Qty: <span className="font-semibold text-brand-dark">{item.quantity}</span> × ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 font-extrabold text-xs sm:text-sm text-brand-dark">
                        ₹{lineTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2.5 pt-4 border-t border-gray-100 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-brand-dark">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-brand-orange" />
                    <span>Shipping Charges</span>
                  </div>
                  <span className="text-xs font-semibold text-brand-orange bg-orange-50 px-2 py-0.5 rounded-md">
                    To be confirmed
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-bold text-brand-dark">Estimated Total</span>
                  <span className="text-2xl sm:text-3xl font-black text-brand-dark">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 block">
                  + applicable delivery charges upon order confirmation
                </span>
              </div>

              {/* Primary Call to Action: WhatsApp Order Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-[#25D366] hover:bg-[#20be5b] active:scale-[0.99] text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Place Order on WhatsApp</span>
                </button>

                <p className="text-[11px] text-gray-400 text-center mt-2.5 leading-relaxed">
                  Sends complete order to official showroom WhatsApp ({STORE_DETAILS.whatsappDisplay}).
                </p>
              </div>

              {/* WhatsApp Guarantee Box */}
              <div className="p-3 bg-brand-soft rounded-2xl border border-gray-150 text-[11px] text-gray-600 space-y-1">
                <div className="font-bold text-brand-dark flex items-center gap-1">
                  <span>WhatsApp Handoff Workflow</span>
                </div>
                <p>
                  No advance online payment required now. Our showroom verifies packing, confirms courier fee, and shares payment QR / bank transfer options directly with you.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

