import { useCart } from '../context/CartContext';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/productService';
import { getReviews, addReview } from '../services/reviewService';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addApiProduct } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [productData, reviewData] = await Promise.all([
        getProduct(id!),
        getReviews(id!)
      ]);
      setProduct(productData);
      setReviews(reviewData.reviews);
      setAvgRating(reviewData.avgRating);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (type: 'rent' | 'buy') => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    if (addApiProduct(product, type, { startDate, endDate })) navigate('/cart');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      await addReview(id!, rating, comment);
      setComment('');
      setRating(5);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange }: { value: number, onChange?: (v: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange?.(star)}
          className={`text-2xl ${star <= value ? 'text-amber-400' : 'text-gray-600'} ${onChange ? 'hover:text-amber-300 cursor-pointer' : 'cursor-default'}`}>
          ★
        </button>
      ))}
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center">
      <div className="text-amber-500 text-xl">Loading...</div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center">
      <div className="text-red-400 text-xl">Product not found</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111827] py-12 px-4">
      <div className="max-w-6xl mx-auto">

        <button onClick={() => navigate('/products')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2">
          ← Back to Products
        </button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          <div className="rounded-2xl overflow-hidden h-96">
            <img src={product.image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'}
              alt={product.name} className="w-full h-full object-contain" />
          </div>

          <div>
            <span className="text-amber-400 text-sm capitalize font-medium">{product.category}</span>
            <h1 className="text-3xl font-bold text-white mt-2 mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <StarRating value={Math.round(avgRating)} />
              <span className="text-amber-400 font-bold">{avgRating}</span>
              <span className="text-gray-400 text-sm">({reviews.length} reviews)</span>
            </div>

            <p className="text-gray-400 mb-6">{product.description}</p>

            <div className="bg-[#1F2937] rounded-xl p-4 mb-6 border border-gray-700">
              {(product.type === 'rent' || product.type === 'both') && product.rentPrice && (
                <p className="text-amber-400 text-2xl font-bold">${product.rentPrice}<span className="text-gray-400 text-sm font-normal">/day</span></p>
              )}
              {(product.type === 'sell' || product.type === 'both') && product.sellPrice && (
                <p className="text-white text-lg mt-1">Buy: <span className="text-green-400 font-bold">${product.sellPrice}</span></p>
              )}
            </div>

            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mb-6 ${
              product.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${product.available ? 'bg-green-400' : 'bg-red-400'}`}></div>
              {product.available ? 'Available' : 'Not Available'}
            </div>

            {(product.type === 'rent' || product.type === 'both') && product.rentPrice && (
              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Start Date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">End Date</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 text-sm" />
                  </div>
                </div>
                {startDate && endDate && (
                  <p className="text-amber-400 text-sm">
                    Total: ${Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) * product.rentPrice}
                  </p>
                )}
                <button onClick={() => addToCart('rent')} disabled={!startDate || !endDate}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold py-3 rounded-xl">
                  🎬 Rent Now
                </button>
              </div>
            )}

            {(product.type === 'sell' || product.type === 'both') && product.sellPrice && (
              <button onClick={() => addToCart('buy')}
                className="w-full bg-[#1F2937] hover:bg-gray-700 text-white font-bold py-3 rounded-xl border border-gray-600">
                🛒 Buy Now
              </button>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#1F2937] rounded-2xl p-6 border border-gray-700">
            <h2 className="text-white font-bold text-xl mb-4">Write a Review</h2>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Rating</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Comment</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4}
                  placeholder="Share your experience..."
                  className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500"
                  required />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold py-3 rounded-xl">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-white font-bold text-xl mb-4">Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <div className="bg-[#1F2937] rounded-2xl p-6 border border-gray-700 text-center">
                <p className="text-gray-400">No reviews yet — be the first!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review: any) => (
                  <div key={review._id} className="bg-[#1F2937] rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                          {review.user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium text-sm">{review.user.name}</span>
                      </div>
                      <StarRating value={review.rating} />
                    </div>
                    <p className="text-gray-400 text-sm">{review.comment}</p>
                    <p className="text-gray-600 text-xs mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}