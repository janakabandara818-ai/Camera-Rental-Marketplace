import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/bookingService';
import { rentalDays } from '../utils/cartUtils';

const money = (value: number) => value.toLocaleString('en-US', {
  style: 'currency', currency: 'USD',
});

export function CartCheckoutPage() {
  const { items, subtotal, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const submitting = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCheckout = async () => {
    if (submitting.current || !items.length) return;
    if (!isAuthenticated) { navigate('/login'); return; }
    submitting.current = true;
    setLoading(true);
    setError('');
    let completed = 0;
    try {
      // Check every line before sending any booking request.
      for (const item of items) {
        if (item.type === 'rent') rentalDays(item.startDate, item.endDate);
      }
      for (const item of [...items]) {
        await createBooking({
          productId: item.productId,
          type: item.type,
          ...(item.type === 'rent' ? { startDate: item.startDate, endDate: item.endDate } : {}),
        });
        completed += 1;
        // Successful items are removed immediately, including on a later failure.
        removeFromCart(item.id);
      }
      setSuccess(true);
    } catch (err: any) {
      const reason = err.response?.data?.message || err.message || 'Unable to submit booking.';
      setError(`${completed ? `${completed} booking(s) submitted. Remaining items are still in your cart. ` : ''}${reason}`);
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  if (success) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Booking Request Submitted</h1>
      <p className="text-gray-400 mb-7">Your bookings are pending confirmation. View their status in your dashboard.</p>
      <Link to="/dashboard" className="bg-amber-500 text-black font-bold px-6 py-3 rounded-lg">View My Bookings</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-7">Your Cart</h1>
      {error && <div role="alert" className="border border-red-500 rounded-lg bg-red-500/10 text-red-300 p-4 mb-6">{error}</div>}
      {!items.length ? (
        <div className="text-center border border-gray-700 rounded-xl p-12 bg-[#1F2937]">
          <h2 className="text-xl font-semibold mb-3">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Choose equipment from the catalog to get started.</p>
          <Link to="/products" className="text-amber-400 font-semibold">Browse Equipment →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <article key={item.id} className="flex gap-4 p-4 border border-gray-700 rounded-xl bg-[#1F2937]">
                <div className="w-20 h-20 bg-white rounded-lg shrink-0 overflow-hidden">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-contain" />}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.productId}`} className="font-semibold hover:text-amber-400">{item.name}</Link>
                  <p className="text-sm text-amber-400 mt-1">{item.type === 'rent' ? 'Rental' : 'Purchase'}</p>
                  {item.type === 'rent' && <p className="text-xs text-gray-400 mt-2">{item.startDate} → {item.endDate} · {item.rentalDays} days</p>}
                  <p className="font-bold mt-2">{money(item.totalPrice)}</p>
                  <button type="button" disabled={loading} onClick={() => removeFromCart(item.id)} className="text-sm text-red-300 mt-2 disabled:opacity-50">Remove</button>
                </div>
              </article>
            ))}
            <button type="button" disabled={loading} onClick={() => { if (window.confirm('Remove all items from your cart?')) clearCart(); }} className="text-sm text-gray-400 hover:text-white disabled:opacity-50">Clear Cart</button>
          </div>
          <aside className="bg-[#1F2937] border border-gray-700 rounded-xl p-6 h-fit">
            <h2 className="text-xl font-bold mb-5">Booking Summary</h2>
            <div className="flex justify-between text-gray-300 mb-4"><span>Items</span><span>{items.length}</span></div>
            <div className="flex justify-between border-t border-gray-700 pt-4 mb-5 font-bold"><span>Estimated total</span><span>{money(subtotal)}</span></div>
            <p className="text-xs text-gray-400 mb-5">The server calculates the final booking price. Submitting this request does not collect payment.</p>
            <button type="button" disabled={loading} onClick={() => void handleCheckout()} className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold py-3 rounded-lg">{loading ? 'Submitting...' : 'Submit Booking Request'}</button>
          </aside>
        </div>
      )}
    </div>
  );
}
