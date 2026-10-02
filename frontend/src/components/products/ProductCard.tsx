import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ArrowUpRight, Calendar, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { StarRating } from '../common/StarRating';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="group relative flex flex-col bg-[#161f30] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700/80 hover:shadow-xl hover:shadow-black/40 transition-all duration-200">
      {/* Image Container with Aspect Ratio and Overlays */}
      <div className="relative aspect-[4/3] w-full bg-[#0d131f] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Floating Controls */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {/* Subtle status tag (Zero-pill discipline: minimal clean label) */}
          <div className="pointer-events-auto bg-[#0a0a0a]/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono font-medium text-gray-300 border border-gray-700/50">
            {product.status === 'Available' ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Available
              </span>
            ) : (
              <span className="text-amber-400">{product.status}</span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id, product.name);
            }}
            className={`pointer-events-auto p-2 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
              isFavorited
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-black/60 text-gray-300 hover:text-white border border-white/10 hover:bg-black/80'
            }`}
            aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Quick View Floating Action */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-2 bg-[#0a0a0a]/90 hover:bg-amber-500 hover:text-black text-gray-200 rounded-lg text-xs font-medium border border-gray-700/60 shadow-lg flex items-center gap-1.5 cursor-pointer"
            title="Quick Preview"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[11px]">Quick View</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand & Category (Unboxed metadata with middle dot separator) */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5 font-medium">
          <span className="tracking-wider uppercase text-amber-400 font-semibold">{product.brand}</span>
          <span aria-hidden="true" className="text-gray-600">·</span>
          <span>{product.category}</span>
          <span aria-hidden="true" className="text-gray-600">·</span>
          <span>{product.condition}</span>
        </div>

        {/* Product Title */}
        <Link
          to={`/product/${product.id}`}
          className="text-base font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-1.5"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Short Tagline / Key Specs */}
        <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
          {product.tagline}
        </p>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={product.rating} count={product.reviewCount} size="sm" />
        </div>

        {/* Pricing Rows */}
        <div className="pt-3 border-t border-gray-800/80 mt-auto flex items-end justify-between mb-4">
          <div>
            <div className="text-[11px] text-gray-400 uppercase font-medium">Rent Rate</div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white font-mono tabular-nums">
                ${product.rentPricePerDay}
              </span>
              <span className="text-xs text-gray-400 font-normal">/ day</span>
            </div>
          </div>

          {product.availableForSale && (
            <div className="text-right">
              <div className="text-[11px] text-gray-400 uppercase font-medium">Buy Outright</div>
              <div className="text-sm font-semibold text-gray-300 font-mono tabular-nums">
                ${product.buyPrice.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addToCart(product, 'rent', { rentalDays: 3 })}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black transition-colors shadow-sm shadow-amber-500/10 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Rent Gear</span>
          </button>

          {product.availableForSale ? (
            <button
              onClick={() => addToCart(product, 'buy')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-gray-300" />
              <span>Buy Own</span>
            </button>
          ) : (
            <Link
              to={`/product/${product.id}`}
              className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-medium bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-colors"
            >
              <span>Details</span>
              <ArrowUpRight className="w-3 h-3 text-gray-400" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
