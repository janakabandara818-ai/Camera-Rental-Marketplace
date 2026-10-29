import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getProduct } from '../services/productService';
import {
  getReviews,
  addReview,
  deleteReview,
} from '../services/reviewService';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: 'camera' | 'lens' | 'lighting' | 'accessory';
  type: 'rent' | 'sell' | 'both';
  rentPrice?: number;
  sellPrice?: number;
  image?: string;
  available: boolean;
}

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  } | null;
  rating: number;
  comment: string;
  createdAt: string;
}

function todayInColombo() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value || '';

  return `${get('year')}-${get('month')}-${get('day')}`;
}

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;

  const timestamp = Date.parse(`${value}T00:00:00Z`);

  if (
    !Number.isFinite(timestamp) ||
    new Date(timestamp).toISOString().slice(0, 10) !== value
  ) {
    return NaN;
  }

  return timestamp;
}

function nextDay(value: string) {
  const timestamp = parseDate(value);

  if (!Number.isFinite(timestamp)) return '';

  return new Date(timestamp + 86400000)
    .toISOString()
    .slice(0, 10);
}

function money(value: number) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

function validPrice(value?: number): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value > 0
  );
}

function errorMessage(error: unknown, fallback: string) {
  const response = error as {
    response?: {
      data?: {
        message?: unknown;
      };
    };
  };

  const message = response.response?.data?.message;

  return typeof message === 'string' ? message : fallback;
}

function ProductImage({
  src,
  name,
}: {
  src?: string;
  name: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Image unavailable
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      decoding="async"
      onError={() => setFailed(true)}
      className="w-full h-full object-contain p-5"
    />
  );
}

function RatingStars({
  value,
  onChange,
}: {
  value: number;
  onChange?: (value: number) => void;
}) {
  if (!onChange) {
    return (
      <span
        aria-label={`${value} out of 5 stars`}
        className="text-amber-400 whitespace-nowrap tracking-wide"
      >
        <span aria-hidden="true">
          {'★'.repeat(Math.round(value))}
          {'☆'.repeat(5 - Math.round(value))}
        </span>
      </span>
    );
  }

  return (
    <div role="group" aria-label="Choose a rating" className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`Rate ${star} out of 5`}
          aria-pressed={value === star}
          onClick={() => onChange(star)}
          className={`rounded px-1 text-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 ${
            star <= value
              ? 'text-amber-400'
              : 'text-gray-500'
          }`}
        >
          <span aria-hidden="true">★</span>
        </button>
      ))}
    </div>
  );
}

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addApiProduct } = useCart();
  const { user, isAdmin, isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState('');
  const [notice, setNotice] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const requestNumber = useRef(0);
  const reviewBusy = useRef(false);
  const activeProductId = useRef(id);
  activeProductId.current = id;

  const fetchData = useCallback(async () => {
    const currentRequest = ++requestNumber.current;

    setLoading(true);
    setLoadError('');
    setNotFound(false);

    if (!id || !/^[a-f\d]{24}$/i.test(id)) {
      setProduct(null);
      setNotFound(true);
      setLoadError('Product not found.');
      setLoading(false);
      return;
    }

    try {
      const [productData, reviewData] = await Promise.all([
        getProduct(id),
        getReviews(id),
      ]);

      if (
        !productData?._id ||
        !Array.isArray(reviewData?.reviews)
      ) {
        throw new Error('Invalid equipment response');
      }

      if (currentRequest !== requestNumber.current) return;

      setProduct(productData);
      setReviews(reviewData.reviews);
      setAvgRating(
        Number.isFinite(reviewData.avgRating)
          ? Math.max(0, Math.min(5, reviewData.avgRating))
          : 0
      );
    } catch (error: unknown) {
      if (currentRequest !== requestNumber.current) return;

      const response = error as {
        response?: { status?: number };
      };

      const missing = response.response?.status === 404;

      setNotFound(missing);
      setLoadError(
        missing
          ? 'Product not found.'
          : 'Unable to load equipment. Please try again.'
      );
    } finally {
      if (currentRequest === requestNumber.current) {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    setProduct(null);
    setReviews([]);
    setAvgRating(0);
    setStartDate('');
    setEndDate('');
    setComment('');
    setRating(5);
    setReviewError('');
    setNotice('');

    void fetchData();

    return () => {
      requestNumber.current += 1;
    };
  }, [fetchData]);

  const today = todayInColombo();

  const canRent =
    !!product &&
    ['rent', 'both'].includes(product.type) &&
    validPrice(product.rentPrice);

  const canBuy =
    !!product &&
    ['sell', 'both'].includes(product.type) &&
    validPrice(product.sellPrice);

  let dateError = '';
  let rentalDayCount = 0;

  if (startDate && !Number.isFinite(parseDate(startDate))) {
    dateError = 'Select a valid start date.';
  } else if (startDate && startDate < today) {
    dateError = 'Start date cannot be in the past.';
  } else if (endDate && !Number.isFinite(parseDate(endDate))) {
    dateError = 'Select a valid return date.';
  } else if (startDate && endDate) {
    const difference = parseDate(endDate) - parseDate(startDate);

    if (difference <= 0) {
      dateError = 'Return date must be after the start date.';
    } else {
      rentalDayCount = difference / 86400000;
    }
  }

  const validRental =
    !!startDate &&
    !!endDate &&
    !dateError &&
    rentalDayCount > 0;

  const rentalTotal =
    validRental && validPrice(product?.rentPrice)
      ? Math.round(product.rentPrice * rentalDayCount * 100) / 100
      : 0;

  const alreadyReviewed = reviews.some(
    (review) => review.user?._id === user?.id
  );

  const addToCart = (type: 'rent' | 'buy') => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product?.available) return;
    if (type === 'rent' && (!canRent || !validRental)) return;
    if (type === 'buy' && !canBuy) return;

    if (addApiProduct(product, type, { startDate, endDate })) {
      navigate('/cart');
    }
  };

  const handleReviewSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!id || reviewBusy.current) return;

    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      setReviewError('Enter a review before submitting.');
      return;
    }

    const submittedProductId = id;

    reviewBusy.current = true;
    setSubmitting(true);
    setReviewError('');
    setNotice('');

    try {
      await addReview(submittedProductId, rating, trimmedComment);

      if (activeProductId.current !== submittedProductId) return;

      setComment('');
      setRating(5);
      setNotice('Review submitted successfully.');
      await fetchData();
    } catch (error: unknown) {
      if (activeProductId.current === submittedProductId) {
        setReviewError(
          errorMessage(error, 'Unable to submit your review.')
        );
      }
    } finally {
      reviewBusy.current = false;
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (
      !id ||
      reviewBusy.current ||
      !window.confirm('Delete this review?')
    ) {
      return;
    }

    const submittedProductId = id;

    reviewBusy.current = true;
    setDeletingId(reviewId);
    setReviewError('');
    setNotice('');

    try {
      await deleteReview(reviewId);

      if (activeProductId.current !== submittedProductId) return;

      setNotice('Review deleted successfully.');
      await fetchData();
    } catch (error: unknown) {
      if (activeProductId.current === submittedProductId) {
        setReviewError(
          errorMessage(error, 'Unable to delete this review.')
        );
      }
    } finally {
      reviewBusy.current = false;
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div
        role="status"
        className="min-h-[60vh] flex items-center justify-center text-amber-400"
      >
        Loading equipment...
      </div>
    );
  }

  if (loadError || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {notFound ? 'Equipment Not Found' : 'Unable to Load Equipment'}
          </h1>

          <p role="alert" className="text-gray-400 mb-6">
            {loadError || 'This equipment is no longer listed.'}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {!notFound && (
              <button
                type="button"
                onClick={() => void fetchData()}
                className="rounded-lg bg-amber-500 text-black px-5 py-3 font-semibold"
              >
                Try Again
              </button>
            )}

            <Link
              to="/products"
              className="rounded-lg border border-gray-600 px-5 py-3"
            >
              Browse Equipment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827] py-10 px-4 text-white">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/products"
          className="inline-block text-gray-400 hover:text-white mb-6"
        >
          ← Back to Equipment
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-12">
          <div className="aspect-[4/3] rounded-2xl bg-white overflow-hidden border border-gray-700">
            <ProductImage src={product.image} name={product.name} />
          </div>

          <div>
            <p className="text-amber-400 text-sm capitalize">
              {product.category}
            </p>

            <h1 className="text-3xl font-bold mt-2 mb-4 break-words">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <RatingStars value={avgRating} />
              <span className="text-amber-400 font-semibold">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-400">
                ({reviews.length} reviews)
              </span>
            </div>

            <p className="text-gray-300 leading-relaxed whitespace-pre-line break-words mb-6">
              {product.description}
            </p>

            <div className="bg-[#1F2937] rounded-xl p-5 border border-gray-700 mb-5 space-y-3">
              {canRent && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    Daily Rental
                  </p>
                  <p className="text-2xl font-bold text-amber-400">
                    {money(product.rentPrice!)}
                    <span className="text-sm text-gray-400 font-normal">
                      {' '}/ day
                    </span>
                  </p>
                </div>
              )}

              {canBuy && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    Purchase
                  </p>
                  <p className="text-xl font-bold">
                    {money(product.sellPrice!)}
                  </p>
                </div>
              )}

              {!canRent && !canBuy && (
                <p className="text-gray-400">
                  Pricing is currently unavailable.
                </p>
              )}
            </div>

            <span
              className={`inline-block px-3 py-1 rounded-full text-sm mb-5 ${
                product.available
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'bg-red-500/15 text-red-300'
              }`}
            >
              {product.available ? 'Available' : 'Unavailable'}
            </span>

            {!product.available && (
              <p className="text-sm text-gray-400 mb-5">
                This equipment is currently unavailable for new bookings.
              </p>
            )}

            {canRent && (
              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="rental-start"
                      className="block text-sm text-gray-300 mb-2"
                    >
                      Start Date
                    </label>

                    <input
                      id="rental-start"
                      type="date"
                      value={startDate}
                      min={today}
                      disabled={!product.available}
                      onChange={(event) => {
                        const nextStart = event.target.value;
                        setStartDate(nextStart);

                        if (!nextStart || endDate <= nextStart) {
                          setEndDate('');
                        }
                      }}
                      className="w-full min-w-0 bg-[#111827] border border-gray-600 rounded-lg px-3 py-3 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="rental-return"
                      className="block text-sm text-gray-300 mb-2"
                    >
                      Return Date
                    </label>

                    <input
                      id="rental-return"
                      type="date"
                      value={endDate}
                      min={nextDay(startDate || today)}
                      disabled={!product.available || !startDate}
                      onChange={(event) => setEndDate(event.target.value)}
                      className="w-full min-w-0 bg-[#111827] border border-gray-600 rounded-lg px-3 py-3 disabled:opacity-50"
                    />
                  </div>
                </div>

                {dateError && (
                  <p role="alert" className="text-sm text-red-300">
                    {dateError}
                  </p>
                )}

                {validRental && (
                  <p className="text-amber-400 font-semibold">
                    Estimated total: {money(rentalTotal)}
                    <span className="text-sm text-gray-400 font-normal">
                      {' '}for {rentalDayCount}{' '}
                      {rentalDayCount === 1 ? 'day' : 'days'}
                    </span>
                  </p>
                )}

                <button
                  type="button"
                  disabled={!product.available || !validRental}
                  onClick={() => addToCart('rent')}
                  className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl"
                >
                  {product.available
                    ? 'Add Rental to Cart'
                    : 'Currently Unavailable'}
                </button>
              </div>
            )}

            {canBuy && (
              <button
                type="button"
                disabled={!product.available}
                onClick={() => addToCart('buy')}
                className="w-full bg-[#1F2937] hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600 font-semibold py-3 rounded-xl"
              >
                {product.available
                  ? 'Add Purchase to Cart'
                  : 'Currently Unavailable'}
              </button>
            )}

            <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              Availability and final prices are checked when you submit
              your booking request. Rentals use Asia/Colombo calendar
              dates and require a return date after the start date.
            </p>
          </div>
        </div>

        {reviewError && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-600 bg-red-500/10 p-4 text-red-300"
          >
            {reviewError}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-6 rounded-lg border border-emerald-600 bg-emerald-500/10 p-4 text-emerald-300"
          >
            {notice}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-[#1F2937] rounded-2xl p-6 border border-gray-700 h-fit">
            <h2 className="font-bold text-xl mb-5">
              Write a Review
            </h2>

            {!isAuthenticated ? (
              <p className="text-gray-400 leading-relaxed">
                <Link
                  to="/login"
                  className="text-amber-400 underline"
                >
                  Sign in
                </Link>{' '}
                to share your experience.
              </p>
            ) : alreadyReviewed ? (
              <p className="text-gray-400 leading-relaxed">
                You have already reviewed this equipment.
                You can delete your review from the list.
              </p>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-5">
                <div>
                  <p className="text-sm text-gray-300 mb-2">
                    Rating
                  </p>
                  <RatingStars value={rating} onChange={setRating} />
                </div>

                <div>
                  <label
                    htmlFor="review-comment"
                    className="block text-sm text-gray-300 mb-2"
                  >
                    Comment
                  </label>

                  <textarea
                    id="review-comment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    rows={4}
                    maxLength={2000}
                    required
                    placeholder="Share your experience..."
                    className="w-full bg-[#111827] border border-gray-600 rounded-lg px-4 py-3"
                  />

                  <p className="text-xs text-gray-400 text-right mt-1">
                    {comment.length}/2000
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !!deletingId || !comment.trim()}
                  className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold py-3 rounded-xl"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </section>

          <section>
            <h2 className="font-bold text-xl mb-5">
              Reviews ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <div className="bg-[#1F2937] rounded-xl p-6 border border-gray-700 text-gray-400 text-center">
                No reviews yet.
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => {
                  const canDelete =
                    isAdmin ||
                    (!!user && review.user?._id === user.id);

                  return (
                    <article
                      key={review._id}
                      className="bg-[#1F2937] rounded-xl p-5 border border-gray-700"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <p className="font-semibold break-words">
                          {review.user?.name || 'Deleted account'}
                        </p>

                        <RatingStars value={review.rating} />
                      </div>

                      <p className="text-gray-300 text-sm whitespace-pre-line break-words">
                        {review.comment}
                      </p>

                      <p className="text-xs text-gray-400 mt-3">
                        {new Date(review.createdAt).toLocaleDateString(
                          'en-GB',
                          { timeZone: 'Asia/Colombo' }
                        )}
                      </p>

                      {canDelete && (
                        <button
                          type="button"
                          disabled={!!deletingId || submitting}
                          onClick={() =>
                            void handleDeleteReview(review._id)
                          }
                          className="text-sm text-red-300 hover:text-red-200 mt-4 disabled:opacity-50"
                        >
                          {deletingId === review._id
                            ? 'Deleting...'
                            : 'Delete Review'}
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}