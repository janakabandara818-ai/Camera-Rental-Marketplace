import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';

export function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState({
    name: '', description: '', category: 'camera',
    type: 'both', rentPrice: '', sellPrice: '', image: '', available: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') { navigate('/'); return; }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await updateProduct(editProduct._id, form);
      } else {
        await createProduct(form);
      }
      setShowModal(false);
      setEditProduct(null);
      setForm({ name: '', description: '', category: 'camera', type: 'both', rentPrice: '', sellPrice: '', image: '', available: true });
      fetchProducts();
    } catch (err) {
      alert('Failed to save product');
    }
  };

  const handleEdit = (product: any) => {
    setEditProduct(product);
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
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center">
      <div className="text-amber-500 text-xl">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111827] py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your camera equipment</p>
          </div>
          <button
            onClick={() => { setEditProduct(null); setShowModal(true); }}
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
                          className="w-10 h-10 rounded-lg object-cover"
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
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs px-3 py-1 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs px-3 py-1 rounded-lg"
                        >
                          Delete
                        </button>
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
              <div>
                <label className="block text-gray-300 text-sm mb-1">Product Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
                  >
                    <option value="camera">Camera</option>
                    <option value="lens">Lens</option>
                    <option value="lighting">Lighting</option>
                    <option value="accessory">Accessory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({...form, type: e.target.value})}
                    className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
                  >
                    <option value="rent">Rent Only</option>
                    <option value="sell">Sell Only</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Rent Price/day ($)</label>
                  <input
                    type="number"
                    value={form.rentPrice}
                    onChange={(e) => setForm({...form, rentPrice: e.target.value})}
                    className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Sell Price ($)</label>
                  <input
                    type="number"
                    value={form.sellPrice}
                    onChange={(e) => setForm({...form, sellPrice: e.target.value})}
                    className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({...form, image: e.target.value})}
                  className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => setForm({...form, available: e.target.checked})}
                  className="w-4 h-4 accent-amber-500"
                />
                <label className="text-gray-300 text-sm">Available</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditProduct(null); }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 rounded-lg"
                >
                  {editProduct ? 'Update' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}