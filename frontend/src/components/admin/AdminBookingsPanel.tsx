import React, { useEffect, useRef, useState } from 'react';
import { getAdminBookings, updateAdminBookingStatus } from '../../services/adminBookingService';

type Status = 'pending' | 'confirmed' | 'completed' | 'cancelled';
interface Booking {
  _id: string;
  user: { name: string; email: string } | null;
  product: { _id: string; name: string; image?: string } | null;
  type: 'rent' | 'buy';
  status: Status;
  totalPrice: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

const date = (value?: string) => {
  if (!value || Number.isNaN(new Date(value).getTime())) return '—';
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};
const money = (value: number) => Number.isFinite(value)
  ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '—';
const badge: Record<Status, string> = {
  pending: 'bg-amber-500/15 text-amber-300', confirmed: 'bg-blue-500/15 text-blue-300',
  completed: 'bg-emerald-500/15 text-emerald-300', cancelled: 'bg-red-500/15 text-red-300',
};

export function AdminBookingsPanel({ onInventoryChange }: { onInventoryChange: () => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const busy = useRef(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminBookings();
      if (!Array.isArray(data)) throw new Error('Invalid response');
      setBookings(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to load bookings. Please try again.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const changeStatus = async (booking: Booking, status: Status) => {
    if (busy.current) return;
    const action = status === 'confirmed' ? 'Confirm' : status === 'completed' ? 'Complete' : 'Cancel';
    if (!window.confirm(`${action} booking ${booking._id} for ${booking.product?.name || 'deleted equipment'}?`)) return;
    busy.current = true;
    setUpdatingId(booking._id);
    setError('');
    setNotice('');
    try {
      const result = await updateAdminBookingStatus(booking._id, status, booking.status);
      setBookings(previous => previous.map(item => item._id === booking._id ? result.booking : item));
      setNotice(`Booking ${booking._id} is now ${result.booking.status}.`);
      onInventoryChange();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Unable to update the booking.';
      if (err.response?.status === 409) await load();
      setError(message);
    } finally {
      busy.current = false;
      setUpdatingId(null);
    }
  };

  const query = search.trim().toLowerCase();
  const visible = bookings.filter(item =>
    (statusFilter === 'all' || item.status === statusFilter) &&
    (typeFilter === 'all' || item.type === typeFilter) &&
    (!query || [item._id, item.user?.name, item.user?.email, item.product?.name]
      .some(value => value?.toLowerCase().includes(query)))
  );

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold">Manage Bookings</h2>
          <p className="text-sm text-gray-400 mt-1">Review requests and manage equipment reservations.</p>
        </div>
        <button type="button" disabled={loading || !!updatingId} onClick={() => void load()} className="px-4 py-2 bg-gray-700 rounded-lg text-sm disabled:opacity-50">{loading ? 'Loading...' : 'Refresh Bookings'}</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {(['pending', 'confirmed', 'completed', 'cancelled'] as Status[]).map(status => (
          <div key={status} className="bg-[#1F2937] border border-gray-700 rounded-xl p-4">
            <p className="text-sm text-gray-400 capitalize">{status}</p>
            <p className="text-2xl font-bold mt-1">{bookings.filter(item => item.status === status).length}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input aria-label="Search bookings" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer, equipment or booking ID" className="flex-1 bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-sm min-w-0" />
        <select aria-label="Filter by booking status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-[#1F2937] border border-gray-700 rounded-lg px-3 py-2 text-sm">
          <option value="all">All Statuses</option>
          {['pending', 'confirmed', 'completed', 'cancelled'].map(status => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
        </select>
        <select aria-label="Filter by booking type" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-[#1F2937] border border-gray-700 rounded-lg px-3 py-2 text-sm">
          <option value="all">Rentals &amp; Purchases</option><option value="rent">Rentals</option><option value="buy">Purchases</option>
        </select>
      </div>

      {error && <div role="alert" className="p-4 mb-4 border border-red-500 rounded-lg bg-red-500/10 text-red-300">{error}</div>}
      {notice && <div role="status" className="p-4 mb-4 border border-emerald-600 rounded-lg bg-emerald-500/10 text-emerald-300">{notice}</div>}

      {loading ? <p role="status" className="text-gray-400 text-center py-12">Loading bookings...</p> : (
        <div className="bg-[#1F2937] border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 bg-[#161f30]"><tr>
                {['Equipment / Reference', 'Customer', 'Type / Dates', 'Total', 'Status', 'Actions'].map(title => <th key={title} className="text-left px-4 py-4 whitespace-nowrap">{title}</th>)}
              </tr></thead>
              <tbody>
                {visible.map(booking => (
                  <tr key={booking._id} className="border-t border-gray-700 align-top">
                    <td className="px-4 py-4 min-w-52">
                      <p className="font-semibold">{booking.product?.name || 'Deleted equipment'}</p>
                      <p className="text-xs text-gray-400 mt-2 break-all">{booking._id}</p>
                      <p className="text-xs text-gray-400 mt-1">Created {date(booking.createdAt)}</p>
                    </td>
                    <td className="px-4 py-4"><p>{booking.user?.name || 'Deleted account'}</p><p className="text-xs text-gray-400 mt-2 break-all">{booking.user?.email || '—'}</p></td>
                    <td className="px-4 py-4 min-w-44"><p>{booking.type === 'rent' ? 'Rental' : 'Purchase'}</p>{booking.type === 'rent' && <p className="text-xs text-gray-400 mt-2">{date(booking.startDate)} → {date(booking.endDate)}</p>}</td>
                    <td className="px-4 py-4 whitespace-nowrap font-semibold text-amber-400">{money(booking.totalPrice)}</td>
                    <td className="px-4 py-4"><span className={`inline-block px-2 py-1 rounded-full text-xs capitalize ${badge[booking.status] || ''}`}>{booking.status}</span></td>
                    <td className="px-4 py-4 min-w-40">
                      <div className="flex flex-wrap gap-2">
                        {booking.status === 'pending' && <button type="button" disabled={!!updatingId} onClick={() => void changeStatus(booking, 'confirmed')} className="bg-blue-500/20 text-blue-300 rounded-lg px-3 py-2 text-xs disabled:opacity-50">Confirm</button>}
                        {booking.status === 'confirmed' && <button type="button" disabled={!!updatingId} onClick={() => void changeStatus(booking, 'completed')} className="bg-emerald-500/20 text-emerald-300 rounded-lg px-3 py-2 text-xs disabled:opacity-50">Complete</button>}
                        {['pending', 'confirmed'].includes(booking.status) && <button type="button" disabled={!!updatingId} onClick={() => void changeStatus(booking, 'cancelled')} className="bg-red-500/20 text-red-300 rounded-lg px-3 py-2 text-xs disabled:opacity-50">Cancel</button>}
                        {['completed', 'cancelled'].includes(booking.status) && <span className="text-xs text-gray-500">Closed</span>}
                        {updatingId === booking._id && <span role="status" className="text-xs text-gray-400">Updating...</span>}
                      </div>
                    </td>
                  </tr>
                ))}
                {!visible.length && <tr><td colSpan={6} className="text-center text-gray-400 px-4 py-12">{bookings.length ? 'No bookings match these filters.' : 'No bookings have been submitted yet.'}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-400 mt-5">Complete rentals after return and inspection, on or after the return date. Completing a purchase marks its equipment unavailable. Booking totals do not indicate payment received.</p>
    </section>
  );
}
