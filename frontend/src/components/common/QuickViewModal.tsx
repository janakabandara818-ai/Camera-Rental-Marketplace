import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { Modal } from './Modal';
import { StarRating } from './StarRating';
import { useCart } from '../../context/CartContext';
import { Calendar, ShoppingCart, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Product Image */}
        <div className="relative aspect-4/3 md:aspect-square bg-[#0d131f] rounded-lg overflow-hidden border border-gray-800">
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-[#0a0a0a]/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-mono text-amber-400 border border-amber-500/20">
            {product.brand} · {product.condition}
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="flex flex-col">
          <div className="text-xs text-amber-400 uppercase tracking-wider font-semibold mb-1">
            {product.category}
          </div>
          <h2 className="text-xl font-bold text-white mb-2 leading-snug">
            {product.name}
          </h2>

          <div className="mb-3">
            <StarRating rating={product.rating} count={product.reviewCount} size="sm" />
          </div>

          <p className="text-xs text-gray-300 leading-relaxed line-clamp-3 mb-4">
            {product.description}
          </p>

          {/* Quick Specs List */}
          <div className="bg-[#0f172a] rounded-lg p-3 border border-gray-800/80 mb-4 space-y-1.5 text-xs">
            {product.specs.slice(0, 3).map((spec) => (
              <div key={spec.label} className="flex justify-between">
                <span className="text-gray-400">{spec.label}</span>
                <span className="text-white font-medium">{spec.value}</span>
              </div>
            ))}
          </div>

          {/* Pricing & Deposit */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
            <div>
              <div className="text-[11px] text-gray-400 uppercase font-medium">Daily Rent Rate</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white font-mono tabular-nums">
                  ${product.rentPricePerDay}
                </span>
                <span className="text-xs text-gray-400">/ day</span>
              </div>
            </div>

            {product.availableForSale && (
              <div className="text-right">
                <div className="text-[11px] text-gray-400 uppercase font-medium">Buy Outright</div>
                <div className="text-lg font-bold text-gray-200 font-mono tabular-nums">
                  ${product.buyPrice.toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Included Features */}
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Inspected</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <Check className="w-4 h-4 text-amber-500" />
              <span>Includes Pelican Case</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  addToCart(product, 'rent', { rentalDays: 3 });
                  onClose();
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black transition-colors shadow-sm shadow-amber-500/10 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Rent 3 Days</span>
              </button>

              {product.availableForSale && (
                <button
                  onClick={() => {
                    addToCart(product, 'buy');
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-medium bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-colors cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-gray-300" />
                  <span>Add to Cart</span>
                </button>
              )}
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>View Full Specs & Rental Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};
