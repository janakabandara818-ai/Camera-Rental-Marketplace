import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../services/productService';
import { Modal } from '../components/common/Modal';

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

const categories = [
  { value: 'all', label: 'All Equipment' },
  { value: 'camera', label: 'Cameras' },
  { value: 'lens', label: 'Lenses' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'accessory', label: 'Accessories' },
];

function normalizeCategory(value: string | null) {
  const aliases: Record<string, string> = {
    camera: 'camera',
    cameras: 'camera',
    'cinema cameras': 'camera',
    lens: 'lens',
    lenses: 'lens',
    lighting: 'lighting',
    accessory: 'accessory',
    accessories: 'accessory',
    audio: 'accessory',
    stabilizer: 'accessory',
    stabilizers: 'accessory',
  };

  return aliases[(value || '').trim().toLowerCase()] || 'all';
}

function normalizeType(value: string | null) {
  const type = (value || '').trim().toLowerCase();

  if (type === 'rent') return 'rent';
  if (type === 'buy' || type === 'sell') return 'buy';

  return 'all';
}

function supportsType(product: Product, type: 'rent' | 'buy') {
  return type === 'rent'
    ? product.type === 'rent' || product.type === 'both'
    : product.type === 'sell' || product.type === 'both';
}

function validPrice(value?: number): value is number {
  return typeof value === 'number' &&
    Number.isFinite(value) &&
    value > 0;
}

function money(value: number) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
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

function nextDay(value: string) {
  const date = new Date(`${value}T00:00:00Z`);

  if (!Number.isFinite(date.getTime())) return '';

  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
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
      <div className="h-full flex items-center justify-center text-sm text-gray-500">
        Image unavailable
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
    />
  );
}

export function ProductsPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const { addApiProduct } = useCart();
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [rentModal, setRentModal] = useState<Product | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const requestNumber = useRef(0);

  const rawCategory = (params.get('category') || '')
    .trim()
    .toLowerCase();

  const category = normalizeCategory(params.get('category'));
  const typeFilter = normalizeType(params.get('type'));
  const search = params.get('q') || params.get('search') || '';

  const requestedSort = params.get('sort') || 'default';
  const sortBy = ['price-low', 'price-high', 'name'].includes(
    requestedSort
  )
    ? requestedSort
    : 'default';

  const today = todayInColombo();

  const updateFilters = (
    changes: Record<string, string>,
    replace = false
  ) => {
    const next = new URLSearchParams(params);

    Object.entries(changes).forEach(([key, value]) => {
      if (!value || value === 'all' || value === 'default') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });

    if (Object.hasOwn(changes, 'q')) {
      next.delete('search');
    }

    setParams(next, { replace });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(params);

    ['category', 'type', 'q', 'search', 'sort'].forEach((key) => {
      next.delete(key);
    });

    setParams(next);
  };

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

  const closeRentModal = () => {
    setRentModal(null);
    setStartDate('');
    setEndDate('');
  };

  const openRentModal = (product: Product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product.available) return;

    setStartDate('');
    setEndDate('');
    setRentModal(product);
  };

  const addToCart = (product: Product, type: 'rent' | 'buy') => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product.available) return;

    const added = addApiProduct(product, type, {
      startDate,
      endDate,
    });

    if (added) {
      closeRentModal();
      navigate('/cart');
    }
  };

  const rentalDays =
    startDate && endDate
      ? (
          Date.parse(`${endDate}T00:00:00Z`) -
          Date.parse(`${startDate}T00:00:00Z`)
        ) / 86400000
      : 0;

  let dateError = '';

  if (startDate && startDate < today) {
    dateError = 'Start date cannot be in the past.';
  } else if (
    startDate &&
    endDate &&
    (!Number.isFinite(rentalDays) || rentalDays <= 0)
  ) {
    dateError = 'End date must be after the start date.';
  }

  const validDates =
    !!startDate &&
    !!endDate &&
    !dateError &&
    Number.isFinite(rentalDays) &&
    rentalDays > 0;

  const rentalTotal =
    validDates && validPrice(rentModal?.rentPrice)
      ? Math.round(rentalDays * rentModal.rentPrice * 100) / 100
      : 0;

  const query = search.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const categoryMatches =
      category === 'all' || product.category === category;

    const typeMatches =
      typeFilter === 'all' ||
      supportsType(product, typeFilter as 'rent' | 'buy');

    const searchMatches =
      !query ||
      product.name.toLowerCase().includes(query) ||
      (product.description || '').toLowerCase().includes(query);

    return categoryMatches && typeMatches && searchMatches;
  });

  const priceMode = typeFilter === 'buy' ? 'buy' : 'rent';

  const sortingPrice = (product: Product) => {
    if (!supportsType(product, priceMode)) return undefined;

    const price =
      priceMode === 'buy' ? product.sellPrice : product.rentPrice;

    return validPrice(price) ? price : undefined;
  };

  filtered.sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }

    if (sortBy === 'price-low' || sortBy === 'price-high') {
      const first = sortingPrice(a);
      const second = sortingPrice(b);

      if (first === undefined && second === undefined) return 0;
      if (first === undefined) return 1;
      if (second === undefined) return -1;

      return sortBy === 'price-low'
        ? first - second
        : second - first;
    }

    return 0;
  });

  return (
    <div className="min-h-screen bg-[#111827] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Browse Equipment
          </h1>
          <p className="text-gray-400">
            Find cameras, lenses, lighting and accessories.
          </p>
        </div>

        <div className="relative mb-6">
          <label htmlFor="equipment-search" className="sr-only">
            Search equipment
          </label>
          <input
            id="equipment-search"
            type="search"
            placeholder="Search equipment..."
            value={search}
            onChange={(event) =>
              updateFilters({ q: event.target.value }, true)
            }
            className="w-full bg-[#1F2937] border border-gray-700 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-5 lg:items-center lg:justify-between">
          <div className="flex gap-2 flex-wrap">
            {categories.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={category === item.value}
                onClick={() =>
                  updateFilters({ category: item.value })
                }
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === item.value
                    ? 'bg-amber-500 text-black'
                    : 'bg-[#1F2937] text-gray-300 hover:bg-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              aria-label="Filter by transaction type"
              value={typeFilter}
              onChange={(event) =>
                updateFilters({ type: event.target.value })
              }
              className="bg-[#1F2937] border border-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Types</option>
              <option value="rent">Rentals</option>
              <option value="buy">Purchases</option>
            </select>

            <select
              aria-label="Sort equipment"
              value={sortBy}
              onChange={(event) =>
                updateFilters({ sort: event.target.value })
              }
              className="bg-[#1F2937] border border-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="default">Default Order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A–Z</option>
            </select>

            <button
              type="button"
              onClick={clearFilters}
              className="text-gray-400 hover:text-white text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {['audio', 'stabilizer', 'stabilizers'].includes(
          rawCategory
        ) && (
          <p className="text-sm text-gray-400 mb-4">
            Audio and stabilizer equipment is currently grouped under
            Accessories.
          </p>
        )}

        {sortBy.startsWith('price-') && (
          <p className="text-xs text-gray-400 mb-4">
            {typeFilter === 'buy'
              ? 'Sorting by purchase price.'
              : 'Sorting by daily rental price. Select Purchases to sort by purchase price.'}
          </p>
        )}

        {loading ? (
          <div
            role="status"
            className="text-center py-20 text-amber-400"
          >
            Loading equipment...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="text-center bg-[#1F2937] border border-gray-700 rounded-xl p-10"
          >
            <p className="text-red-400 mb-5">{error}</p>
            <button
              type="button"
              onClick={() => void fetchProducts()}
              className="bg-amber-500 text-black font-semibold px-6 py-3 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <p
              aria-live="polite"
              className="text-gray-400 text-sm mb-6"
            >
              {filtered.length} equipment listing
              {filtered.length === 1 ? '' : 's'} found
              {query && ` for "${search.trim()}"`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => {
                const canRent =
                  supportsType(product, 'rent') &&
                  validPrice(product.rentPrice);

                const canBuy =
                  supportsType(product, 'buy') &&
                  validPrice(product.sellPrice);

                return (
                  <article
                    key={product._id}
                    className="bg-[#1F2937] rounded-xl overflow-hidden border border-gray-700 hover:border-amber-500 transition-colors flex flex-col group"
                  >
                    <Link
                      to={`/product/${product._id}`}
                      className="block relative h-48 bg-white overflow-hidden"
                    >
                      <ProductImage
                        src={product.image}
                        name={product.name}
                      />

                      <span
                        className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                          product.available
                            ? 'bg-green-950 text-green-300'
                            : 'bg-red-950 text-red-300'
                        }`}
                      >
                        {product.available
                          ? 'Available'
                          : 'Unavailable'}
                      </span>
                    </Link>

                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-xs text-amber-400 capitalize mb-2">
                        {product.category}
                      </p>

                      <Link
                        to={`/product/${product._id}`}
                        className="text-white hover:text-amber-400 font-semibold text-sm mb-2 line-clamp-2"
                      >
                        {product.name}
                      </Link>

                      <p className="text-gray-400 text-xs mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-auto mb-4">
                        {canRent && (
                          <span className="text-amber-400 text-sm">
                            {money(product.rentPrice!)} / day
                          </span>
                        )}
                        {canBuy && (
                          <span className="text-gray-300 text-sm">
                            Buy: {money(product.sellPrice!)}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {canRent && (
                          <button
                            type="button"
                            disabled={!product.available}
                            onClick={() => openRentModal(product)}
                            className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-bold py-2.5 rounded-lg"
                          >
                            Rent Now
                          </button>
                        )}

                        {canBuy && (
                          <button
                            type="button"
                            disabled={!product.available}
                            onClick={() =>
                              addToCart(product, 'buy')
                            }
                            className="flex-1 bg-[#111827] hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 rounded-lg border border-gray-600"
                          >
                            Buy Now
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <h2 className="text-xl font-bold text-white mb-2">
                  No matching equipment
                </h2>
                <p className="text-gray-400 mb-5">
                  Try another search or clear your filters.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-amber-500 text-black font-bold px-6 py-3 rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={!!rentModal}
        onClose={closeRentModal}
        title={rentModal ? `Rent ${rentModal.name}` : 'Rent Equipment'}
        maxWidth="md"
      >
        {rentModal && (
          <form
            onSubmit={(event) => {
              event.preventDefault();

              if (validDates) {
                addToCart(rentModal, 'rent');
              }
            }}
            className="space-y-5"
          >
            <p className="text-amber-400 font-semibold">
              {money(rentModal.rentPrice!)} / day
            </p>

            <div>
              <label
                htmlFor="rental-start"
                className="block text-gray-300 text-sm mb-2"
              >
                Start Date
              </label>
              <input
                id="rental-start"
                type="date"
                value={startDate}
                min={today}
                onChange={(event) => {
                  const value = event.target.value;
                  setStartDate(value);

                  if (endDate && endDate <= value) {
                    setEndDate('');
                  }
                }}
                required
                className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label
                htmlFor="rental-end"
                className="block text-gray-300 text-sm mb-2"
              >
                Return Date
              </label>
              <input
                id="rental-end"
                type="date"
                value={endDate}
                min={nextDay(startDate || today)}
                onChange={(event) =>
                  setEndDate(event.target.value)
                }
                required
                className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-3"
              />
            </div>

            {dateError && (
              <p role="alert" className="text-red-400 text-sm">
                {dateError}
              </p>
            )}

            {validDates && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-gray-300 text-sm">
                  {rentalDays} rental day
                  {rentalDays === 1 ? '' : 's'}
                </p>
                <p className="text-amber-400 font-bold mt-1">
                  Estimated total: {money(rentalTotal)}
                </p>
              </div>
            )}

            <p className="text-xs text-gray-400">
              The return date ends the rental period. Availability and
              final price are checked when you submit the booking.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeRentModal}
                className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!validDates || !rentModal.available}
                className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg"
              >
                Add to Cart
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}