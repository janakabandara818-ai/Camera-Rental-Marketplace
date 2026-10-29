import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

import { CategoryGrid } from '../components/home/CategoryGrid';
import { getProducts } from '../services/productService';
import { useAuth } from '../context/AuthContext';

interface ApiProduct {
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

const HERO_CAMERA = {
  image: '/images/camera-desk.avif',
  alt: 'Canon camera resting on a table',
  link: '/products?category=camera',
};

const categoryOptions = [
  { value: 'all', label: 'All' },
  { value: 'camera', label: 'Cameras' },
  { value: 'lens', label: 'Lenses' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'accessory', label: 'Accessories' },
];

const bookingSteps = [
  {
    title: 'Browse Equipment',
    description:
      'Search the catalog and compare equipment descriptions and prices.',
  },
  {
    title: 'Choose Your Equipment',
    description:
      'For rentals, choose a start and return date. You can also select equipment offered for purchase.',
  },
  {
    title: 'Submit a Booking Request',
    description:
      'Review your cart and submit your request. Availability and final prices are checked by the server.',
  },
  {
    title: 'Manage Your Booking',
    description:
      'View your booking status in the dashboard. Requests remain pending until an administrator confirms them.',
  },
];

function formatPrice(value: number) {
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

function EquipmentImage({
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
      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
        Image unavailable
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
    />
  );
}

function HeroCameraImage() {
  const [failed, setFailed] = useState(false);

  return (
    <Link
      to={HERO_CAMERA.link}
      aria-label="Explore cameras"
      className="group block relative aspect-[4/3] overflow-hidden bg-[#111827] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-[-4px]"
    >
      {failed ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="text-xl font-semibold text-white">
            Explore Our Cameras
          </span>

          <span className="text-sm text-gray-400">
            Browse camera details and booking options.
          </span>
        </div>
      ) : (
        <img
          src={HERO_CAMERA.image}
          alt={HERO_CAMERA.alt}
          loading="eager"
          decoding="async"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent"
      />

      <span className="absolute top-4 left-4 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
        Behind the Lens
      </span>

      <span className="absolute bottom-4 right-4 rounded-lg border border-white/20 bg-black/60 px-3 py-2 text-xs font-medium text-white">
        Explore Cameras →
      </span>
    </Link>
  );
}

export const HomePage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const requestNumber = useRef(0);

  const fetchProducts = useCallback(async () => {
    const currentRequest = ++requestNumber.current;

    setLoading(true);
    setError('');

    try {
      const data = await getProducts();

      if (!Array.isArray(data)) {
        throw new Error('Invalid products response');
      }

      if (currentRequest === requestNumber.current) {
        setProducts(data);
      }
    } catch {
      if (currentRequest === requestNumber.current) {
        setError(
          'Unable to load equipment. Please check your connection and try again.'
        );
      }
    } finally {
      if (currentRequest === requestNumber.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchProducts();

    return () => {
      requestNumber.current += 1;
    };
  }, [fetchProducts]);

  const featuredProducts = products
    .filter(
      (product) =>
        activeCategory === 'all' ||
        product.category === activeCategory
    )
    .sort(
      (first, second) =>
        Number(second.available) - Number(first.available)
    )
    .slice(0, 6);

  const browseLink =
    activeCategory === 'all'
      ? '/products'
      : `/products?category=${activeCategory}`;

  return (
    <div className="min-h-screen bg-[#111827] text-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0a0a0a] via-[#111827] to-[#172033] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <p className="text-xs sm:text-sm text-amber-400 font-semibold uppercase tracking-widest mb-4">
                Camera &amp; Gear
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Equipment for
                <span className="block text-amber-400">
                  Your Next Project
                </span>
              </h1>

              <p className="text-gray-300 mt-6 max-w-xl leading-relaxed">
                Explore cameras, lenses, lighting and accessories.
                Choose equipment for rental or purchase and manage
                your booking requests from your account.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  to="/products?type=rent"
                  className="inline-block bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Rent Equipment
                </Link>

                <Link
                  to="/products?type=buy"
                  className="inline-block bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Buy Equipment
                </Link>
              </div>

              <div className="flex flex-wrap gap-5 mt-6 text-sm">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/register'}
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  {isAuthenticated
                    ? 'View My Bookings →'
                    : 'Create an Account →'}
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-amber-400 hover:text-amber-300"
                  >
                    Manage Equipment →
                  </Link>
                )}
              </div>
            </div>

            {/* Hero card */}
            <div className="rounded-2xl overflow-hidden border border-gray-700 bg-[#161f30] shadow-2xl">
              <HeroCameraImage />

              <div className="p-5 sm:p-6">
                <p className="text-xs text-amber-400 uppercase tracking-wider mb-2">
                  Capture Your Next Story
                </p>

                <p className="text-sm text-gray-400 leading-relaxed">
                  Find camera equipment for your next photography
                  or filmmaking project.
                </p>

                <div className="mt-5 pt-4 border-t border-gray-700/70">
                  <Link
                    to={HERO_CAMERA.link}
                    className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Browse Camera Collection →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategoryGrid />

      {/* Real API products */}
      <section
        aria-labelledby="featured-equipment-title"
        className="py-16 sm:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-2">
                From Our Catalog
              </p>

              <h2
                id="featured-equipment-title"
                className="text-2xl sm:text-3xl font-bold"
              >
                Featured Equipment
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Explore equipment details and choose what suits
                your project.
              </p>
            </div>

            <div
              role="group"
              aria-label="Filter featured equipment"
              className="flex gap-2 flex-wrap"
            >
              {categoryOptions.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  aria-pressed={activeCategory === category.value}
                  onClick={() => setActiveCategory(category.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    activeCategory === category.value
                      ? 'bg-amber-500 text-black'
                      : 'bg-[#1F2937] text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div
              role="status"
              className="text-center py-16 text-gray-400"
            >
              Loading equipment...
            </div>
          ) : error ? (
            <div
              role="alert"
              className="text-center py-12 px-4 rounded-xl bg-[#1F2937] border border-gray-700"
            >
              <p className="text-red-400 mb-5">{error}</p>

              <button
                type="button"
                onClick={() => void fetchProducts()}
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-5 py-3 rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No equipment is listed in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => {
                const canRent =
                  (product.type === 'rent' ||
                    product.type === 'both') &&
                  validPrice(product.rentPrice);

                const canBuy =
                  (product.type === 'sell' ||
                    product.type === 'both') &&
                  validPrice(product.sellPrice);

                return (
                  <article
                    key={product._id}
                    className="flex flex-col bg-[#161f30] border border-gray-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-colors"
                  >
                    <Link
                      to={`/product/${product._id}`}
                      className="block relative aspect-[4/3] bg-white overflow-hidden group"
                    >
                      <EquipmentImage
                        src={product.image}
                        name={product.name}
                      />

                      <span
                        className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                          product.available
                            ? 'bg-emerald-950 text-emerald-300'
                            : 'bg-red-950 text-red-300'
                        }`}
                      >
                        {product.available
                          ? 'Available'
                          : 'Unavailable'}
                      </span>
                    </Link>

                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-xs text-amber-400 uppercase tracking-wider mb-2">
                        {product.category}
                      </p>

                      <Link
                        to={`/product/${product._id}`}
                        className="text-lg font-semibold hover:text-amber-400 line-clamp-2"
                      >
                        {product.name}
                      </Link>

                      <p className="text-sm text-gray-400 mt-3 mb-5 line-clamp-3">
                        {product.description}
                      </p>

                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-x-5 gap-y-3 border-t border-gray-800 pt-4 mb-5">
                          {canRent && (
                            <div>
                              <p className="text-xs text-gray-400">
                                Daily Rental
                              </p>

                              <p className="text-amber-400 font-bold">
                                {formatPrice(product.rentPrice!)}
                                <span className="text-xs text-gray-400 font-normal">
                                  {' '}/ day
                                </span>
                              </p>
                            </div>
                          )}

                          {canBuy && (
                            <div>
                              <p className="text-xs text-gray-400">
                                Purchase
                              </p>

                              <p className="font-bold">
                                {formatPrice(product.sellPrice!)}
                              </p>
                            </div>
                          )}
                        </div>

                        <Link
                          to={`/product/${product._id}`}
                          className="block text-center bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm py-3 rounded-lg transition-colors"
                        >
                          View Equipment
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to={browseLink}
              className="inline-block px-6 py-3 bg-[#1F2937] hover:bg-gray-700 text-sm font-semibold rounded-lg border border-gray-700 transition-colors"
            >
              {activeCategory === 'all'
                ? 'Browse All Equipment →'
                : 'Browse This Category →'}
            </Link>
          </div>
        </div>
      </section>

      {/* Booking workflow */}
      <section
        aria-labelledby="booking-process-title"
        className="py-16 border-y border-gray-800 bg-[#0d1422]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-2">
              Getting Started
            </p>

            <h2
              id="booking-process-title"
              className="text-2xl sm:text-3xl font-bold"
            >
              How Booking Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bookingSteps.map((step, index) => (
              <div
                key={step.title}
                className="bg-[#161f30] border border-gray-800 rounded-xl p-6"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 font-bold mb-5"
                >
                  {index + 1}
                </span>

                <h3 className="font-semibold text-base mb-3">
                  {step.title}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#1F2937] border border-gray-700 p-7 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-3">
                {isAuthenticated
                  ? 'Keep Track of Your Bookings'
                  : 'Plan Your Next Project'}
              </h2>

              <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
                {isAuthenticated
                  ? 'Check booking status and manage your requests from your dashboard.'
                  : 'Create an account to request rentals, purchase equipment and view your bookings.'}
              </p>
            </div>

            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="inline-block text-center bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-3 rounded-lg whitespace-nowrap transition-colors"
            >
              {isAuthenticated ? 'My Bookings' : 'Create Account'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};