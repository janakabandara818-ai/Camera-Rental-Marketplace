import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import {
  getUserBookings,
  cancelBooking,
} from '../services/bookingService';

interface BookingProduct {
  _id: string;
  name: string;
  image?: string;
  category?: string;
}

interface Booking {
  _id: string;
  product: BookingProduct | null;
  type: 'rent' | 'buy';
  startDate?: string;
  endDate?: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt?: string;
}

function formatDate(value?: string) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatMoney(value: number) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

function statusClass(status: Booking['status']) {
  switch (status) {
    case 'confirmed':
      return 'bg-blue-500/15 text-blue-300';
    case 'completed':
      return 'bg-emerald-500/15 text-emerald-300';
    case 'cancelled':
      return 'bg-red-500/15 text-red-300';
    default:
      return 'bg-amber-500/15 text-amber-300';
  }
}

export function UserDashboardPage() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'rent' | 'buy'>('rent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getUserBookings();

      if (!Array.isArray(data)) {
        throw new Error('Invalid bookings response');
      }

      setBookings(
        [...data].sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
      );
    } catch (err: any) {
      setError(
        err.response?.status === 401
          ? 'Your session is invalid or expired. Please sign in again.'
          : 'Unable to load your bookings. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setBookings([]);
    setNotice('');

    if (user?.id) {
      void fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const handleCancel = async (booking: Booking) => {
    if (cancellingId) return;

    const confirmed = window.confirm(
      `Cancel the booking for ${
        booking.product?.name || 'this equipment'
      }?`
    );

    if (!confirmed) return;

    setCancellingId(booking._id);
    setNotice('');
    setError('');

    try {
      await cancelBooking(booking._id);

      setBookings((previous) =>
        previous.map((item) =>
          item._id === booking._id
            ? { ...item, status: 'cancelled' }
            : item
        )
      );

      setNotice('Booking cancelled successfully.');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Unable to cancel this booking. Please try again.'
      );
    } finally {
      setCancellingId(null);
    }
  };

  const rentalCount = bookings.filter(
    (booking) => booking.type === 'rent'
  ).length;

  const purchaseCount = bookings.filter(
    (booking) => booking.type === 'buy'
  ).length;

  const visibleBookings = bookings.filter(
    (booking) => booking.type === activeTab
  );

  return (
    <div className="min-h-screen bg-[#111827] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#1F2937] border border-gray-700 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="text-amber-400 text-sm mb-1">
              My Account
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome, {user?.name || 'Customer'}
            </h1>

            <p className="text-gray-400 text-sm mt-2">
              {user?.email}
            </p>
          </div>

          <Link
            to="/products"
            className="inline-block text-center bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm px-5 py-3 rounded-lg"
          >
            Browse Equipment
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('rent')}
              className={`px-4 py-3 rounded-lg text-sm font-semibold ${
                activeTab === 'rent'
                  ? 'bg-amber-500 text-black'
                  : 'bg-[#1F2937] text-gray-300 hover:bg-gray-700'
              }`}
            >
              My Rentals ({rentalCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('buy')}
              className={`px-4 py-3 rounded-lg text-sm font-semibold ${
                activeTab === 'buy'
                  ? 'bg-amber-500 text-black'
                  : 'bg-[#1F2937] text-gray-300 hover:bg-gray-700'
              }`}
            >
              My Purchases ({purchaseCount})
            </button>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => void fetchBookings()}
            className="text-sm text-amber-400 hover:text-amber-300 disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh Bookings'}
          </button>
        </div>

        {notice && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-emerald-600 bg-emerald-500/10 text-emerald-300 p-4"
          >
            {notice}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-600 bg-red-500/10 text-red-300 p-4"
          >
            <p>{error}</p>

            <Link
              to="/login"
              className="inline-block underline text-sm mt-2"
            >
              Go to Sign In
            </Link>
          </div>
        )}

        {loading ? (
          <div
            role="status"
            className="text-center py-16 text-gray-400"
          >
            Loading your bookings...
          </div>
        ) : !error && visibleBookings.length === 0 ? (
          <div className="text-center bg-[#1F2937] border border-gray-700 rounded-xl py-16 px-4">
            <h2 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'rent'
                ? 'No rentals yet'
                : 'No purchases yet'}
            </h2>

            <p className="text-gray-400 mb-6">
              Your bookings will appear here after checkout.
            </p>

            <Link
              to="/products"
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Explore Equipment →
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {visibleBookings.map((booking) => {
              const canCancel =
                booking.status === 'pending' ||
                booking.status === 'confirmed';

              return (
                <article
                  key={booking._id}
                  className="bg-[#1F2937] border border-gray-700 rounded-xl p-5"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full sm:w-32 h-28 bg-white rounded-lg overflow-hidden shrink-0">
                      {booking.product?.image ? (
                        <img
                          src={booking.product.image}
                          alt={booking.product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-gray-500">
                          Image unavailable
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h2 className="text-lg font-semibold text-white">
                          {booking.product?.name ||
                            'Equipment no longer listed'}
                        </h2>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusClass(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 break-all mt-2">
                        Booking ID: {booking._id}
                      </p>

                      <p className="text-sm text-gray-400 mt-2">
                        Booked: {formatDate(booking.createdAt)}
                      </p>

                      {booking.type === 'rent' && (
                        <p className="text-sm text-gray-300 mt-2">
                          Rental: {formatDate(booking.startDate)} →{' '}
                          {formatDate(booking.endDate)}
                        </p>
                      )}

                      <p className="text-amber-400 font-bold mt-3">
                        Total: {formatMoney(booking.totalPrice)}
                      </p>

                      <div className="flex flex-wrap gap-4 items-center mt-4">
                        {booking.product && (
                          <Link
                            to={`/product/${booking.product._id}`}
                            className="text-sm text-gray-300 hover:text-white underline"
                          >
                            View Equipment
                          </Link>
                        )}

                        {canCancel && (
                          <button
                            type="button"
                            disabled={cancellingId !== null}
                            onClick={() => void handleCancel(booking)}
                            className="text-sm text-red-300 hover:text-red-200 disabled:opacity-50"
                          >
                            {cancellingId === booking._id
                              ? 'Cancelling...'
                              : 'Cancel Booking'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}