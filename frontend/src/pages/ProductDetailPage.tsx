import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEquipment } from '../context/EquipmentContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { StarRating } from '../components/common/StarRating';
import { ProductCard } from '../components/products/ProductCard';
import { Button } from '../components/common/Button';
import {
  Calendar as CalendarIcon,
  ShieldCheck,
  Heart,
  ShoppingCart,
  Share2,
  CheckCircle2,
  Package,
  MapPin,
  Clock,
  ArrowLeft,
  Info,
  UserCheck
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, products, addReview } = useEquipment();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = getProductById(id || '');

  // Image Gallery State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Rental Date Calculation State
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const defaultEndStr = useMemo(
    () => new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    []
  );

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(defaultEndStr);
  const [includeDamageWaiver, setIncludeDamageWaiver] = useState(true);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRole, setReviewRole] = useState('Director of Photography');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Calculate rental days
  const rentalDays = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  }, [startDate, endDate]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Equipment Not Found</h2>
        <p className="text-sm text-gray-400 mb-6">
          The requested camera gear may have been de-listed or moved to another vault.
        </p>
        <Link
          to="/products"
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-sm transition-colors"
        >
          Return to Equipment Catalog
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  // Live rental calculations
  const rentalBaseFee = product.rentPricePerDay * rentalDays;
  const damageWaiverFee = includeDamageWaiver ? rentalBaseFee * 0.1 : 0;
  const liveRentalTotal = rentalBaseFee + damageWaiverFee;

  const handleBookRental = () => {
    addToCart(product, 'rent', {
      startDate,
      endDate,
      rentalDays,
      includeDamageProtection: includeDamageWaiver
    });
    navigate('/cart');
  };

  const handleBuyNow = () => {
    addToCart(product, 'buy');
    navigate('/cart');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) return;

    addReview(product.id, {
      author: reviewAuthor,
      role: reviewRole,
      rating: reviewRating,
      comment: reviewComment
    });

    setReviewAuthor('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#111827] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link & Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-amber-500" />
            <span>Back to Equipment Catalog</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="font-mono text-amber-500">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="text-gray-300 font-medium truncate max-w-40 sm:max-w-xs">{product.name}</span>
          </div>
        </div>

        {/* Main Product Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Left Column: Image Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Image */}
            <div className="relative aspect-4/3 w-full bg-[#0d131f] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />

              {/* Status and Favorite Badges */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                <div className="pointer-events-auto bg-[#0a0a0a]/80 backdrop-blur-md px-3 py-1 rounded text-xs font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{product.status} · {product.condition}</span>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={() => toggleWishlist(product.id, product.name)}
                    className={`p-2.5 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
                      isFavorited
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-black/60 text-gray-300 hover:text-white border border-white/10'
                    }`}
                    aria-label="Save to Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-amber-500 ring-2 ring-amber-500/40'
                        : 'border-gray-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} angle ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Included in Flight Case Component */}
            <div className="bg-[#161f30] rounded-xl p-6 border border-gray-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Package className="w-5 h-5 text-amber-500" />
                <span>What's Included in the Case</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                {product.includedInCase.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Specifications Table */}
            <div className="bg-[#161f30] rounded-xl p-6 border border-gray-800 space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Full Technical Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between py-2 border-b border-gray-800/80"
                  >
                    <span className="text-gray-400">{spec.label}</span>
                    <span className="text-white font-medium text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase & Rental Module (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 bg-[#161f30] rounded-2xl p-6 sm:p-7 border border-gray-800 shadow-xl space-y-6">
              {/* Brand and Title */}
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                  <span className="text-amber-500 font-bold uppercase tracking-wider font-mono">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span>{product.location}</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-white font-display leading-tight mb-2">
                  {product.name}
                </h1>

                <StarRating rating={product.rating} count={product.reviewCount} size="md" />
              </div>

              {/* Tagline / Overview */}
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {product.description}
              </p>

              {/* Pricing Cards */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-[#0d131f] rounded-xl border border-gray-800">
                <div>
                  <div className="text-[11px] text-gray-400 uppercase font-medium">Daily Rent</div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
                      ${product.rentPricePerDay}
                    </span>
                    <span className="text-xs text-gray-400">/ day</span>
                  </div>
                </div>

                {product.availableForSale && (
                  <div className="border-l border-gray-800 pl-3">
                    <div className="text-[11px] text-gray-400 uppercase font-medium">Purchase</div>
                    <div className="text-lg font-bold text-white font-mono tabular-nums mt-0.5">
                      ${product.buyPrice.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Rental Date Picker & Duration Engine */}
              <div className="space-y-4 pt-2 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-amber-500" />
                    <span>Select Rental Window</span>
                  </label>
                  <span className="text-xs font-mono text-amber-400 font-semibold">
                    {rentalDays} {rentalDays === 1 ? 'Day' : 'Days'} Shoot
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[11px] text-gray-400 mb-1">Dispatch / Pickup</span>
                    <input
                      type="date"
                      value={startDate}
                      min={todayStr}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-gray-400 mb-1">Return to Vault</span>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Optional Damage Protection Toggle */}
                <div className="p-3 bg-[#0d131f] rounded-lg border border-gray-800/80 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="damageWaiver"
                    checked={includeDamageWaiver}
                    onChange={(e) => setIncludeDamageWaiver(e.target.checked)}
                    className="mt-0.5 rounded border-gray-700 bg-gray-900 text-amber-500 focus:ring-amber-500 w-4 h-4"
                  />
                  <label htmlFor="damageWaiver" className="text-xs text-gray-300 cursor-pointer">
                    <span className="font-semibold text-white block">
                      Add Damage Protection Waiver (+10%)
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Zero deductible for accidental drops, lens scratch, and weather moisture.
                    </span>
                  </label>
                </div>

                {/* Live Rental Price Breakdown */}
                <div className="space-y-1.5 text-xs text-gray-300 pt-2 border-t border-gray-800/60">
                  <div className="flex justify-between">
                    <span>
                      ${product.rentPricePerDay} &times; {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                    </span>
                    <span className="font-mono text-white tabular-nums">${rentalBaseFee}</span>
                  </div>

                  {includeDamageWaiver && (
                    <div className="flex justify-between text-gray-400">
                      <span>Damage Protection (10%)</span>
                      <span className="font-mono text-amber-400 tabular-nums">
                        +${damageWaiverFee.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-400">
                    <span>Hold Deposit (Refundable upon return)</span>
                    <span className="font-mono text-gray-400 tabular-nums">
                      ${product.depositRequired}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-gray-800">
                    <span>Total Rental Fee</span>
                    <span className="font-mono text-amber-400 tabular-nums text-base">
                      ${liveRentalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="space-y-2.5 pt-2">
                  <Button
                    onClick={handleBookRental}
                    variant="primary"
                    size="lg"
                    className="w-full"
                    icon={<CalendarIcon className="w-4 h-4" />}
                  >
                    Reserve for {rentalDays} {rentalDays === 1 ? 'Day' : 'Days'} (${liveRentalTotal.toFixed(2)})
                  </Button>

                  {product.availableForSale && (
                    <Button
                      onClick={handleBuyNow}
                      variant="secondary"
                      size="md"
                      className="w-full"
                      icon={<ShoppingCart className="w-4 h-4 text-amber-500" />}
                    >
                      Buy Outright for ${product.buyPrice.toLocaleString()}
                    </Button>
                  )}
                </div>

                {/* Verified Partner Guarantee */}
                <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>$5M COI Certificate Accepted</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Next-Day Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mb-16 bg-[#161f30] rounded-2xl p-6 sm:p-8 border border-gray-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-800 gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-display">
                Cinematographer Reviews & On-Set Feedback
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <StarRating rating={product.rating} count={product.reviewCount} size="md" />
                <span className="text-xs text-gray-400">100% Verified Production Shoots</span>
              </div>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-amber-400 font-medium text-xs rounded-lg border border-gray-700 transition-colors"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Production Review'}
            </button>
          </div>

          {/* Review Submission Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="my-6 p-5 bg-[#0d131f] rounded-xl border border-gray-700/80 space-y-4">
              <h4 className="text-sm font-semibold text-white">Share Your Equipment Experience</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="e.g. Rachel Chen"
                    className="w-full bg-[#161f30] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Production Role</label>
                  <input
                    type="text"
                    value={reviewRole}
                    onChange={(e) => setReviewRole(e.target.value)}
                    placeholder="e.g. 1st AC / Commercial DP"
                    className="w-full bg-[#161f30] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-[#161f30] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value={5}>5 Stars - Flawless Condition</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Comments on Sensor / Optics / Delivery *</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Detail optical sharpness, firmware versions, battery life, or packing quality..."
                  className="w-full bg-[#161f30] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="primary" size="sm">
                  Publish Review
                </Button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4 mt-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-[#0d131f] rounded-xl border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">{rev.author}</div>
                      <div className="text-xs text-gray-400">{rev.role}</div>
                    </div>
                    <div className="text-right">
                      <StarRating rating={rev.rating} showScore={false} size="sm" />
                      <div className="text-[11px] text-gray-500 font-mono mt-0.5">{rev.date}</div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-4">No reviews yet. Be the first to review this gear package!</p>
            )}
          </div>
        </section>

        {/* Related Equipment Section */}
        {relatedProducts.length > 0 && (
          <section className="pt-8 border-t border-gray-800">
            <h2 className="text-xl font-bold text-white font-display mb-6">
              Frequently Rented Together
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
