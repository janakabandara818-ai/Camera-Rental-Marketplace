import React, { useState } from 'react';
import { useEquipment } from '../context/EquipmentContext';
import { useAuth } from '../context/AuthContext';
import { Product, GearCategory } from '../types';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { MOCK_USERS } from '../data/mockData';
import {
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  Filter
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { products, rentals, orders, addProduct, updateProduct, deleteProduct } = useEquipment();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'users'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form state
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Sony',
    category: 'Cameras' as GearCategory,
    rentPrice: '220',
    buyPrice: '5200',
    status: 'Available' as Product['status'],
    condition: 'Production Certified' as Product['condition'],
    location: 'Los Angeles Vault',
    tagline: '',
    description: ''
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      tagline: formData.tagline || `Certified ${formData.brand} ${formData.category} cinema kit`,
      description: formData.description || 'Full production package with accessories and rugged case.',
      images: [products[0]?.images[0] || ''],
      rentPricePerDay: Number(formData.rentPrice) || 150,
      buyPrice: Number(formData.buyPrice) || 4000,
      rating: 5.0,
      reviewCount: 0,
      availableForRent: true,
      availableForSale: true,
      status: formData.status,
      condition: formData.condition,
      location: formData.location,
      depositRequired: Math.round(Number(formData.rentPrice) * 3) || 500,
      specs: [
        { label: 'Category', value: formData.category },
        { label: 'Brand', value: formData.brand },
        { label: 'Condition', value: formData.condition }
      ],
      includedInCase: ['Main Unit', 'Hard Flight Case', 'Power Supplies']
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      brand: 'Sony',
      category: 'Cameras',
      rentPrice: '220',
      buyPrice: '5200',
      status: 'Available',
      condition: 'Production Certified',
      location: 'Los Angeles Vault',
      tagline: '',
      description: ''
    });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      brand: editingProduct.brand,
      rentPricePerDay: Number(editingProduct.rentPricePerDay),
      buyPrice: Number(editingProduct.buyPrice),
      status: editingProduct.status
    });
    setEditingProduct(null);
  };

  // Filtered inventory
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Revenue calculation
  const totalRevenue =
    rentals.reduce((sum, r) => sum + r.totalAmount, 0) +
    orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-[#111827] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-gray-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>CineVault Central Management Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Operations & Inventory Dashboard
            </h1>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add New Equipment
          </Button>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
          <div className="bg-[#161f30] p-5 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs uppercase font-medium">Inventory Items</span>
              <Package className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {products.length}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3" />
              <span>100% In Service</span>
            </div>
          </div>

          <div className="bg-[#161f30] p-5 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs uppercase font-medium">Active Rentals</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {rentals.filter((r) => r.status === 'Active').length}
            </div>
            <div className="text-[11px] text-gray-400 mt-1 font-mono">
              {rentals.filter((r) => r.status === 'Upcoming').length} Upcoming Dispatches
            </div>
          </div>

          <div className="bg-[#161f30] p-5 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs uppercase font-medium">Gross Platform GMV</span>
              <DollarSign className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 font-mono">
              +18.4% vs last 30 days
            </div>
          </div>

          <div className="bg-[#161f30] p-5 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs uppercase font-medium">Verified Accounts</span>
              <Users className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              1,420
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 font-mono">
              100% ID Verified
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 p-1 bg-[#161f30] rounded-xl border border-gray-800 mb-6 max-w-md">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Equipment Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Bookings & Orders
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'users'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Filmmaker Accounts
          </button>
        </div>

        {/* Tab 1: Equipment Inventory Table */}
        {activeTab === 'inventory' && (
          <div className="bg-[#161f30] rounded-xl border border-gray-800 overflow-hidden">
            {/* Search filter in table */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter inventory by name or brand..."
                  className="w-full bg-[#0d131f] border border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="text-xs text-gray-400 font-mono tabular-nums">
                {filteredProducts.length} items cataloged
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0d131f] text-gray-400 uppercase font-mono border-b border-gray-800">
                  <tr>
                    <th className="py-3 px-4">Equipment</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Daily Rent</th>
                    <th className="py-3 px-4">Buy Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/80 text-gray-300">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-8 rounded object-cover bg-black shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-white truncate max-w-xs">{p.name}</div>
                          <div className="text-[11px] text-gray-500 font-mono">{p.brand} · {p.condition}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-white">{p.category}</td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-400 tabular-nums">
                        ${p.rentPricePerDay}/day
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-300 tabular-nums">
                        ${p.buyPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${
                            p.status === 'Available'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 truncate max-w-32">{p.location}</td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-1.5 text-gray-400 hover:text-amber-400 hover:bg-gray-800 rounded transition-colors"
                          title="Edit gear"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${p.name} from inventory?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded transition-colors"
                          title="Delete gear"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: All Bookings & Orders Table */}
        {activeTab === 'orders' && (
          <div className="bg-[#161f30] rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800 font-semibold text-white text-sm">
              All Active Production Rentals & Purchases
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0d131f] text-gray-400 uppercase font-mono border-b border-gray-800">
                  <tr>
                    <th className="py-3 px-4">Order / Rental Ref</th>
                    <th className="py-3 px-4">Equipment</th>
                    <th className="py-3 px-4">Client / Production</th>
                    <th className="py-3 px-4">Period / Date</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Tracking Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/80 text-gray-300">
                  {rentals.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-800/30">
                      <td className="py-3 px-4 font-mono font-semibold text-amber-500">{r.id}</td>
                      <td className="py-3 px-4 font-medium text-white">{r.product.name}</td>
                      <td className="py-3 px-4 text-gray-300">Janaka Bandara (Light & Lens)</td>
                      <td className="py-3 px-4 text-gray-400">{r.startDate} to {r.endDate}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">${r.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-400">{r.trackingNumber}</td>
                    </tr>
                  ))}
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-800/30">
                      <td className="py-3 px-4 font-mono font-semibold text-blue-400">{o.id}</td>
                      <td className="py-3 px-4 font-medium text-white">{o.product.name}</td>
                      <td className="py-3 px-4 text-gray-300">Janaka Bandara</td>
                      <td className="py-3 px-4 text-gray-400">{o.orderDate}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">${o.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950/60 text-blue-400 border border-blue-500/30">
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-400">{o.trackingNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Users Table */}
        {activeTab === 'users' && (
          <div className="bg-[#161f30] rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800 font-semibold text-white text-sm">
              Registered Filmmakers & Equipment Vendors
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0d131f] text-gray-400 uppercase font-mono border-b border-gray-800">
                  <tr>
                    <th className="py-3 px-4">Name / Company</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">COI Verification</th>
                    <th className="py-3 px-4">Rental Credits</th>
                    <th className="py-3 px-4 text-right">Access Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/80 text-gray-300">
                  {MOCK_USERS.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-800/30">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{u.name}</div>
                        <div className="text-[11px] text-gray-500">{u.company}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-400">{u.email}</td>
                      <td className="py-3 px-4 capitalize">{u.role}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active COI</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-400 tabular-nums">${u.credits}</td>
                      <td className="py-3 px-4 text-right font-mono text-gray-400">{u.role === 'admin' ? 'Super Admin' : 'Filmmaker'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add New Equipment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Catalog New Cinema Equipment"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Equipment Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sony FX9 Cinema Camera Package"
                className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Brand *</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as GearCategory })}
                className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="Cameras">Cameras</option>
                <option value="Lenses">Lenses</option>
                <option value="Lighting">Lighting</option>
                <option value="Stabilizers">Stabilizers</option>
                <option value="Audio">Audio</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Daily Rent ($) *</label>
              <input
                type="number"
                required
                value={formData.rentPrice}
                onChange={(e) => setFormData({ ...formData, rentPrice: e.target.value })}
                className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Buy Price ($)</label>
              <input
                type="number"
                value={formData.buyPrice}
                onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="Brand New">Brand New</option>
                <option value="Like New (Mint)">Like New (Mint)</option>
                <option value="Production Certified">Production Certified</option>
                <option value="Good">Good</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Vault Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 uppercase font-semibold mb-1">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. 6K Full-frame sensor with dual base ISO"
              className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="pt-3 border-t border-gray-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" size="sm">
              Save & Add to Catalog
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Equipment Modal */}
      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Edit Inventory Details"
        maxWidth="md"
      >
        {editingProduct && (
          <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Equipment Name</label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 uppercase font-semibold mb-1">Daily Rent ($)</label>
                <input
                  type="number"
                  value={editingProduct.rentPricePerDay}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      rentPricePerDay: Number(e.target.value)
                    })
                  }
                  className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-400 uppercase font-semibold mb-1">Buy Price ($)</label>
                <input
                  type="number"
                  value={editingProduct.buyPrice}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      buyPrice: Number(e.target.value)
                    })
                  }
                  className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Availability Status</label>
              <select
                value={editingProduct.status}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    status: e.target.value as any
                  })
                }
                className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="Available">Available</option>
                <option value="On Rental">On Rental</option>
                <option value="Reserved">Reserved</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="pt-3 border-t border-gray-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <Button type="submit" variant="primary" size="sm">
                Update Gear
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
