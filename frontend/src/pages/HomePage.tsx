import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { HeroSection } from '../components/home/HeroSection';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { HowItWorks } from '../components/home/HowItWorks';
import { Testimonials } from '../components/home/Testimonials';
import { Newsletter } from '../components/home/Newsletter';

import { getProducts } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

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

const categoryOptions = [
  { value: 'all', label: 'All' },
  { value: 'camera', label: 'Cameras' },
  { value: 'lens', label: 'Lenses' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'accessory', label: 'Accessories' },
];

const formatPrice = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getProducts();

      if (!Array.isArray(data)) {
        throw new Error('Invalid products response');
      }

      setProducts(data);
    } catch {
      setError(
        'Unable to load equipment. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  const handleListGear = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isAdmin) {
      navigate('/admin');
      return;
    }

    showToast(
      'Equipment listings are currently managed by the administrator.',
      'info'
    );
  };

  const featuredProducts = products
    .filter(
      (product) =>
        activeCategory === 'all' ||
        product.category === activeCategory
    )
    .slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection onOpenListGearModal={handleListGear} />

      <CategoryGrid />

      <section className="py-16 sm:py-20 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-xs text-amber-500 font-semibold uppercase tracking-wider mb-2">
                Explore Our Collection
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Featured Equipment
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Discover cameras, lenses and equipment for your next
                project.
              </p>
            </div>

            <div
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
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-5 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No equipment available in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => {
                const canRent =
                  product.type === 'rent' ||
                  product.type === 'both';

                const canBuy =
                  product.type === 'sell' ||
                  product.type === 'both';

                return (
                  <article
                    key={product._id}
                    className="flex flex-col bg-[#161f30] border border-gray-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-colors"
                  >
                    <Link
                      to={`/product/${product._id}`}
                      className="block relative aspect-[4/3] bg-[#0d131f] overflow-hidden group"
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No image available
                        </div>
                      )}

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
                        className="text-lg font-semibold text-white hover:text-amber-400 line-clamp-2"
                      >
                        {product.name}
                      </Link>

                      <p className="text-sm text-gray-400 mt-3 mb-5 line-clamp-3">
                        {product.description}
                      </p>

                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-gray-800 pt-4 mb-5">
                          {canRent &&
                            typeof product.rentPrice === 'number' && (
                              <div>
                                <p className="text-xs text-gray-400">
                                  Daily rental
                                </p>
                                <p className="text-amber-400 font-bold">
                                  {formatPrice(product.rentPrice)}
                                  <span className="text-xs text-gray-400 font-normal">
                                    {' '}/ day
                                  </span>
                                </p>
                              </div>
                            )}

                          {canBuy &&
                            typeof product.sellPrice === 'number' && (
                              <div>
                                <p className="text-xs text-gray-400">
                                  Purchase
                                </p>
                                <p className="text-white font-bold">
                                  {formatPrice(product.sellPrice)}
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
              to="/products"
              className="inline-block px-6 py-3 bg-[#1F2937] hover:bg-gray-700 text-white text-sm font-semibold rounded-lg border border-gray-700 transition-colors"
            >
              Browse All Equipment →
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks />
      <Testimonials />
      <Newsletter />
    </div>
  );
};