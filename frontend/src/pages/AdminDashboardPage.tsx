import { AdminBookingsPanel } from '../components/admin/AdminBookingsPanel';
import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { uploadImage } from '../services/uploadService';

export function AdminDashboardPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'inventory' | 'bookings'>('inventory');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', category: 'camera',
    type: 'both', rentPrice: '', sellPrice: '', image: '', available: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/'); return; }
    fetchProducts();
  }, []);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      let imageUrl = form.image;

      if (imageFile) {
        setUploading(true);
        const uploaded = await uploadImage(imageFile);
        imageUrl = uploaded.url;
        setUploading(false);
      }

      const productData = { ...form, image: imageUrl };

      if (editProduct) {
        await updateProduct(editProduct._id, productData);
      } else {
        await createProduct(productData);
      }

      setShowModal(false);
      setEditProduct(null);
      setImageFile(null);
      setImagePreview('');
      setForm({ name: '', description: '', category: 'camera', type: 'both', rentPrice: '', sellPrice: '', image: '', available: true });
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setUploading(false);
      setSaving(false);
    }
  };

  const handleEdit = (product: any) => {
    setImageFile(null);
    setEditProduct(product);
    setImagePreview(product.image || '');
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      type: product.type,
      rentPrice: product.rentPrice || '',
      sellPrice: product.sellPrice || '',
      image: product.image || '',
      available: product.available
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const tabs = (
    <div className="flex gap-3 mb-8" aria-label="Admin sections">
      <button type="button" onClick={() => setActiveTab('inventory')} className={`px-5 py-3 rounded-lg text-sm font-semibold ${activeTab === 'inventory' ? 'bg-amber-500 text-black' : 'bg-[#1F2937] text-gray-300'}`}>Inventory</button>
      <button type="button" onClick={() => setActiveTab('bookings')} className={`px-5 py-3 rounded-lg text-sm font-semibold ${activeTab === 'bookings' ? 'bg-amber-500 text-black' : 'bg-[#1F2937] text-gray-300'}`}>Bookings</button>
    </div>
  );

  if (activeTab === 'bookings') return (
    <div className="min-h-screen bg-[#111827] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {tabs}
        <AdminBookingsPanel onInventoryChange={() => { void fetchProducts(); }} />
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center">
      <div className="text-amber-500 text-xl">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111827] py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {tabs}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your camera equipment</p>
          </div>
          <button
            onClick={() => { setEditProduct(null); setImageFile(null); setImagePreview(''); setForm({ name: '', description: '', category: 'camera', type: 'both', rentPrice: '', sellPrice: '', image: '', available: true }); setShowModal(true); }}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-lg"
          >
            + Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1F2937] rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Products</p>
            <p className="text-4xl font-bold text-white mt-1">{products.length}</p>
          </div>
          <div className="bg-[#1F2937] rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Available</p>
            <p className="text-4xl font-bold text-green-400 mt-1">
              {products.filter((p: any) => p.available).length}
            </p>
          </div>
          <div className="bg-[#1F2937] rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Categories</p>
            <p className="text-4xl font-bold text-amber-400 mt-1">4</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-[#1F2937] rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-white font-bold text-xl">All Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 text-sm px-6 py-4">Product</th>
                  <th className="text-left text-gray-400 text-sm px-6 py-4">Category</th>
                  <th className="text-left text-gray-400 text-sm px-6 py-4">Rent/day</th>
                  <th className="text-left text-gray-400 text-sm px-6 py-4">Buy Price</th>
                  <th className="text-left text-gray-400 text-sm px-6 py-4">Status</th>
                  <th className="text-left text-gray-400 text-sm px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr key={product._id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=50'}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-contain"
                        />
                        <span className="text-white text-sm font-medium line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-amber-400 text-sm capitalize">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white text-sm">{product.rentPrice ? `$${product.rentPrice}` : '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white text-sm">{product.sellPrice ? `$${product.sellPrice}` : '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {product.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(product)} className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs px-3 py-1 rounded-lg">Edit</button>
                        <button onClick={() => handleDelete(product._id)} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs px-3 py-1 rounded-lg">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1F2937] rounded-2xl p-6 w-full max-w-lg border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-white font-bold text-xl mb-6">
              {editProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Image Upload */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">Product Image</label>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-4 text-center hover:border-amber-500 transition-colors">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-40 object-contain rounded-lg mb-2" />
                      <button type="button" onClick={() => { setImagePreview(''); setImageFile(null); setForm(previous => ({ ...previous, image: '' })); }} className="text-red-400 text-xs">Remove Image</button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-gray-400 text-sm">Click to upload image</p>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Product Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500" required />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500" rows={3} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
                    className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500">
                    <option value="camera">Camera</option>
                    <option value="lens">Lens</option>
                    <option value="lighting">Lighting</option>
                    <option value="accessory">Accessory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}
                    className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500">
                    <option value="rent">Rent Only</option>
                    <option value="sell">Sell Only</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Rent Price/day ($)</label>
                  <input type="number" min="0.01" step="0.01" value={form.rentPrice} onChange={(e) => setForm({...form, rentPrice: e.target.value})}
                    className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Sell Price ($)</label>
                  <input type="number" min="0.01" step="0.01" value={form.sellPrice} onChange={(e) => setForm({...form, sellPrice: e.target.value})}
                    className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.available} onChange={(e) => setForm({...form, available: e.target.checked})} className="w-4 h-4 accent-amber-500" />
                <label className="text-gray-300 text-sm">Available</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditProduct(null); }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold py-2 rounded-lg">
                  {uploading ? 'Uploading...' : saving ? 'Saving...' : editProduct ? 'Update' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}