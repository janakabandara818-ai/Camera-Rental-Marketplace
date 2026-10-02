import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEquipment } from '../context/EquipmentContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  Calendar,
  Package,
  Heart,
  Settings as SettingsIcon,
  ShieldCheck,
  CreditCard,
  Truck,
  RotateCcw,
  CheckCircle2,
  FileText,
  Clock,
  Trash2,
  ExternalLink,
  ChevronRight,
  Bell
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { rentals, orders, returnRental, products } = useEquipment();
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab') || 'rentals';
  const [activeTab, setActiveTab] = useState<'rentals' | 'orders' | 'wishlist' | 'settings'>(
    tabParam as any
  );

  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  useEffect(() => {
    if (['rentals', 'orders', 'wishlist', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  const handleTabChange = (tab: 'rentals' | 'orders' | 'wishlist' | 'settings') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#111827] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header / Profile Banner */}
        <div className="bg-[#161f30] rounded-2xl p-6 sm:p-8 border border-gray-800 shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-2xl font-display">
              {user?.name.charAt(0).toUpperCase() || 'J'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                  {user?.name || 'Janaka Bandara'}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ID & COI Verified</span>
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-3">
                <span>{user?.email || 'janakabandara818@gmail.com'}</span>
                <span aria-hidden="true">·</span>
                <span>Member since {user?.memberSince || 'March 2024'}</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 font-semibold">{user?.company || 'Light & Lens Productions'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-start">
            <div>
              <div className="text-[11px] text-gray-400 uppercase font-mono">Rental Credits</div>
              <div className="text-xl font-bold text-amber-400 font-mono tabular-nums">
                ${user?.credits || 350}
              </div>
            </div>
            <Link
              to="/products"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Rent New Gear
            </Link>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[#161f30] rounded-xl border border-gray-800 mb-8 overflow-x-auto">
          <button
            onClick={() => handleTabChange('rentals')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'rentals'
                ? 'bg-amber-500 text-black font-semibold shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Rentals</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 font-mono">
              {rentals.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-black font-semibold shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders & Purchases</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 font-mono">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('wishlist')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'wishlist'
                ? 'bg-amber-500 text-black font-semibold shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 font-mono">
              {wishlistIds.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-black font-semibold shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* Tab 1: Rentals */}
        {activeTab === 'rentals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Active & Scheduled Rentals</h2>
              <span className="text-xs text-gray-400 font-mono">
                {rentals.filter((r) => r.status === 'Active').length} Active On-Set
              </span>
            </div>

            <div className="space-y-4">
              {rentals.map((rental) => (
                <div
                  key={rental.id}
                  className="bg-[#161f30] rounded-xl p-5 border border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={rental.product.images[0]}
                      alt={rental.product.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-16 rounded-lg object-cover bg-black"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-amber-500">
                          {rental.id}
                        </span>
                        <span
                          className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                            rental.status === 'Active'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                              : rental.status === 'Upcoming'
                              ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                              : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          {rental.status}
                        </span>
                      </div>
                      <Link
                        to={`/product/${rental.product.id}`}
                        className="text-base font-semibold text-white hover:text-amber-400 transition-colors"
                      >
                        {rental.product.name}
                      </Link>
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          <span>{rental.startDate} &rarr; {rental.endDate}</span>
                        </span>
                        <span>({rental.totalDays} Days)</span>
                        <span className="text-gray-500">·</span>
                        <span>{rental.deliveryType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap md:flex-col items-end gap-2 w-full md:w-auto justify-between border-t md:border-t-0 border-gray-800 pt-3 md:pt-0">
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Total Rental Paid</div>
                      <div className="text-base font-bold text-white font-mono tabular-nums">
                        ${rental.totalAmount.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedInvoice(rental)}
                        className="p-1.5 text-xs text-gray-300 hover:text-white hover:bg-gray-800 rounded border border-gray-700 flex items-center gap-1"
                        title="View Rental Agreement & Receipt"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-500" />
                        <span>Receipt</span>
                      </button>

                      {rental.status === 'Active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => returnRental(rental.id)}
                          icon={<RotateCcw className="w-3.5 h-3.5 text-amber-500" />}
                        >
                          Initiate Return
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Purchased Cinema Equipment</h2>
              <span className="text-xs text-gray-400 font-mono">
                {orders.length} Completed Orders
              </span>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#161f30] rounded-xl p-5 border border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={order.product.images[0]}
                      alt={order.product.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-16 rounded-lg object-cover bg-black"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-amber-500">
                          {order.id}
                        </span>
                        <span
                          className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                              : 'bg-blue-950/60 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <Link
                        to={`/product/${order.product.id}`}
                        className="text-base font-semibold text-white hover:text-amber-400 transition-colors"
                      >
                        {order.product.name}
                      </Link>
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-3">
                        <span>Ordered: {order.orderDate}</span>
                        <span>·</span>
                        <span className="font-mono text-gray-300">Tracking: {order.trackingNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-end gap-2 w-full md:w-auto justify-between border-t md:border-t-0 border-gray-800 pt-3 md:pt-0">
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Total Billed</div>
                      <div className="text-base font-bold text-white font-mono tabular-nums">
                        ${order.totalAmount.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedInvoice(order)}
                      className="p-1.5 text-xs text-gray-300 hover:text-white hover:bg-gray-800 rounded border border-gray-700 flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-500" />
                      <span>Tax Invoice</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Saved Gear Wishlist</h2>
              <span className="text-xs text-gray-400 font-mono">
                {wishlistProducts.length} Items Saved
              </span>
            </div>

            {wishlistProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#161f30] rounded-xl overflow-hidden border border-gray-800 flex flex-col justify-between"
                  >
                    <div className="relative aspect-video w-full bg-black">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeFromWishlist(p.id)}
                        className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-950/80 text-gray-300 hover:text-red-300 rounded-lg transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="text-xs font-mono text-amber-500 uppercase">{p.brand}</div>
                      <Link
                        to={`/product/${p.id}`}
                        className="text-sm font-semibold text-white hover:text-amber-400 transition-colors line-clamp-1 mb-2"
                      >
                        {p.name}
                      </Link>

                      <div className="mt-auto pt-3 border-t border-gray-800 flex items-center justify-between mb-3">
                        <span className="text-base font-bold font-mono text-white tabular-nums">
                          ${p.rentPricePerDay}/day
                        </span>
                        <span className="text-xs text-gray-400">
                          Buy: ${p.buyPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            addToCart(p, 'rent', { rentalDays: 3 });
                            removeFromWishlist(p.id);
                          }}
                        >
                          Rent Now
                        </Button>
                        <Link
                          to={`/product/${p.id}`}
                          className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-center text-xs font-medium text-white border border-gray-700"
                        >
                          View Gear
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-[#161f30] rounded-xl border border-gray-800">
                <Heart className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-white">Your Wishlist is Empty</h3>
                <p className="text-xs text-gray-400 mt-1 mb-4">
                  Save cinema cameras, lenses, and lighting packages for future shoot reference.
                </p>
                <Link
                  to="/products"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg"
                >
                  Browse Camera Equipment
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && (
          <div className="bg-[#161f30] rounded-2xl p-6 sm:p-8 border border-gray-800 space-y-6 max-w-3xl">
            <h2 className="text-lg font-semibold text-white">Filmmaker Profile & Insurance Settings</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Full Legal Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || 'Janaka Bandara'}
                  className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Production Company</label>
                <input
                  type="text"
                  defaultValue={user?.company || 'Light & Lens Productions LLC'}
                  className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Studio Telephone</label>
                <input
                  type="text"
                  defaultValue={user?.phone || '+1 (555) 782-9012'}
                  className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">COI Insurance Broker</label>
                <input
                  type="text"
                  defaultValue="Front Row Insurance Brokers (#FR-9941)"
                  className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Primary Production Dispatch Address</label>
              <input
                type="text"
                defaultValue="Stage 4, 742 Sunset Gower Studios, Hollywood, CA 90028"
                className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-4 border-t border-gray-800 flex justify-end">
              <Button variant="primary" size="md">
                Save Account Updates
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Invoice / Receipt Modal */}
      <Modal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title="Official CineVault Transaction Receipt"
        subtitle={`Transaction Reference: ${selectedInvoice?.id || ''}`}
        maxWidth="xl"
      >
        {selectedInvoice && (
          <div className="space-y-4 text-xs text-gray-300">
            <div className="p-4 bg-[#0d131f] rounded-xl border border-gray-800 space-y-2">
              <div className="flex justify-between text-white font-semibold text-sm">
                <span>{selectedInvoice.product?.name}</span>
                <span className="font-mono">${(selectedInvoice.totalAmount || 0).toLocaleString()}</span>
              </div>
              <div className="text-gray-400">
                {selectedInvoice.startDate ? (
                  <span>
                    Rental Term: {selectedInvoice.startDate} to {selectedInvoice.endDate} ({selectedInvoice.totalDays} Days)
                  </span>
                ) : (
                  <span>Outright Purchase Order</span>
                )}
              </div>
              <div className="text-[11px] font-mono text-amber-400">
                Courier Tracking: {selectedInvoice.trackingNumber}
              </div>
            </div>

            <div className="space-y-1.5 border-t border-gray-800 pt-3">
              <div className="flex justify-between">
                <span>Billed To:</span>
                <span className="text-white font-medium">{user?.name} ({user?.company})</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="text-white font-mono">Mastercard ending in ···· 8819</span>
              </div>
              <div className="flex justify-between">
                <span>Insurance / Damage Waiver:</span>
                <span className="text-emerald-400 font-medium">Covered by $5M Master Policy</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  alert('Receipt downloaded as PDF.');
                  setSelectedInvoice(null);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-xs transition-colors"
              >
                Download PDF Invoice
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
