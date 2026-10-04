import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'all'
    ? products
    : products.filter((p: any) => p.category === filter);

  if (loading) return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center">
      <div className="text-amber-500 text-xl">Loading products...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111827] py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">All Equipment</h1>
          <p className="text-gray-400">Browse our premium camera gear collection</p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {['all', 'camera', 'lens', 'lighting', 'accessory'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                filter === cat
                  ? 'bg-amber-500 text-black'
                  : 'bg-[#1F2937] text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-400 text-center py-10">{error}</div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product: any) => (
            <div key={product._id} className="bg-[#1F2937] rounded-xl overflow-hidden border border-gray-700 hover:border-amber-500 transition-all group">
              <div className="relative overflow-hidden h-48">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {product.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 capitalize">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">{product.description}</p>

                <div className="flex gap-2 mb-4">
                  {product.rentPrice && (
                    <span className="text-amber-400 text-sm font-medium">${product.rentPrice}/day</span>
                  )}
                  {product.sellPrice && (
                    <span className="text-gray-400 text-sm">| Buy: ${product.sellPrice}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  {product.rentPrice && (
                    <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold py-2 rounded-lg transition-colors">
                      Rent Now
                    </button>
                  )}
                  {product.sellPrice && (
                    <button className="flex-1 bg-[#111827] hover:bg-gray-700 text-white text-xs font-bold py-2 rounded-lg border border-gray-600 transition-colors">
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && !error && (
          <div className="text-center text-gray-400 py-20">
            No products found in this category.
          </div>
        )}
      </div>
    </div>
  );
}