import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../services/bookingService';

export function CartCheckoutPage() {
  const [cart, setCart] = useState<any[]>(
    JSON.parse(localStorage.getItem('cart') || '[]')
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const removeFromCart = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const getTotal = () => cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      for (const item of cart) {
        await createBooking({
          productId: item.productId,
          type: item.type,
          startDate: item.startDate,
          endDate: item.endDate,
        });
      }
      localStorage.removeItem('cart');
      setCart([]);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      alert('Checkout failed. Please login first.');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h2>
        <p className="text-gray-400">Redirecting to dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111827] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-white mb-2">Cart is Empty</h2>
            <p className="text-gray-400 mb-6">Add some equipment to get started</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-3 rounded-lg"
            >
              Browse Equipment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="bg-[#1F2937] rounded-xl p-4 border border-gray-700 flex gap-4">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{item.name}</h3>
                    <p className="text-amber-400 text-sm capitalize">{item.type}</p>
                    {item.type === 'rent' && (
                      <p className="text-gray-400 text-xs mt-1">
                        {item.startDate} → {item.endDate}
                      </p>
                    )}
                    <p className="text-white font-bold mt-1">${item.totalPrice}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-[#1F2937] rounded-xl p-6 border border-gray-700 h-fit">
              <h2 className="text-white font-bold text-xl mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Items ({cart.length})</span>
                  <span>${getTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Service Fee</span>
                  <span>$0</span>
                </div>
                <div className="border-t border-gray-600 pt-3 flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span>${getTotal()}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Processing...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}