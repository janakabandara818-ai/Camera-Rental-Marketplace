import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [rentModal, setRentModal] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: any, type: string) => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let totalPrice = 0;

    if (type === 'rent' && startDate && endDate) {
      const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
      totalPrice = days * product.rentPrice;
    } else if (type === 'buy') {
      totalPrice = product.sellPrice;
    }

    cart.push({
      productId: product._id,
      name: product.name,
      image: product.image,
      type,
      startDate,
      endDate,
      totalPrice,
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    setRentModal(null);
    navigate('/cart');
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
                    <button
                      onClick={() => setRentModal(product)}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold py-2 rounded-lg transition-colors"
                    >
                      Rent Now
                    </button>
                  )}
                  {product.sellPrice && (
                    <button
                      onClick={() => addToCart(product, 'buy')}
                      className="flex-1 bg-[#111827] hover:bg-gray-700 text-white text-xs font-bold py-2 rounded-lg border border-gray-600 transition-colors"
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rent Modal */}
      {rentModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1F2937] rounded-2xl p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-white font-bold text-xl mb-2">Rent {rentModal.name}</h2>
            <p className="text-amber-400 mb-4">${rentModal.rentPrice}/day</p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
                />
              </div>
              {startDate && endDate && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                  <p className="text-amber-400 text-sm">
                    Total: ${Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) * rentModal.rentPrice}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setRentModal(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => addToCart(rentModal, 'rent')}
                disabled={!startDate || !endDate}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold py-2 rounded-lg"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}