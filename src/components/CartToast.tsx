import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartToast: React.FC = () => {
  const { toast, hideToast, totalItems } = useCart();

  if (!toast || !toast.visible) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-50 max-w-sm w-full animate-bounce-short">
      <div className="bg-brand-dark text-white rounded-2xl p-4 shadow-2xl border border-neutral-700 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-orange text-white flex items-center justify-center flex-shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              {toast.message}
            </h4>
            <button
              onClick={hideToast}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {toast.productName && (
            <p className="text-sm font-semibold text-white truncate mt-0.5">
              {toast.productName}
            </p>
          )}

          <div className="mt-2.5 flex items-center gap-2">
            <Link
              to="/cart"
              onClick={hideToast}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange hover:bg-[#e04c14] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>View Cart ({totalItems})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <Link
              to="/checkout"
              onClick={hideToast}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs font-semibold rounded-lg transition-colors border border-neutral-700"
            >
              <span>Checkout</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

