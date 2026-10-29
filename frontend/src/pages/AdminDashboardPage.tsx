import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

import { AdminBookingsPanel } from '../components/admin/AdminBookingsPanel';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';
import { uploadImage } from '../services/uploadService';

type Category = 'camera' | 'lens' | 'lighting' | 'accessory';
type ProductType = 'rent' | 'sell' | 'both';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: Category;
  type: ProductType;
  rentPrice?: number;
  sellPrice?: number;
  image?: string;
  available: boolean;
}

interface ProductForm {
  name: string;
  description: string;
  category: Category;
  type: ProductType;
  rentPrice: string;
  sellPrice: string;
  image: string;
  available: boolean;
}

const emptyForm: ProductForm = {
  name: '',
  description: '',
  category: 'camera',
  type: 'both',
  rentPrice: '',
  sellPrice: '',
  image: '',
  available: true,
};

const inputClass =
  'w-full min-w-0 rounded-lg border border-gray-600 bg-[#111827] px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 disabled:opacity-50';

function messageFrom(error: unknown, fallback: string) {
  const response = error as {
    response?: {
      data?: {
        message?: unknown;
      };
    };
  };

  const message = response.response?.data?.message;

  return typeof message === 'string' ? message : fallback;
}

function money(value?: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '—';
  }

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

function validPrice(value: string) {
  return (
    /^\d+(?:\.\d{1,2})?$/.test(value.trim()) &&
    Number(value) > 0 &&
    Number.isSafeInteger(Math.round(Number(value) * 100))
  );
}

function InventoryImage({
  src,
  name,
}: {
  src?: string;
  name: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
      {src && !failed ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-1"
        />
      ) : (
        <span className="text-[10px] text-gray-500">No image</span>
      )}
    </div>
  );
}

export function AdminDashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [activeTab, setActiveTab] =
    useState<'inventory' | 'bookings'>('inventory');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>({ ...emptyForm });
  const [formError, setFormError] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const requestNumber = useRef(0);
  const saveBusy = useRef(false);
  const deleteBusy = useRef(false);

  const fetchProducts = useCallback(async () => {
    if (!isAdmin) return;

    const currentRequest = ++requestNumber.current;

    setLoading(true);
    setLoadError('');

    try {
      const data = await getProducts();

      if (!Array.isArray(data)) {
        throw new Error('Invalid products response');
      }

      if (currentRequest === requestNumber.current) {
        setProducts(data);
      }
    } catch (error: unknown) {
      if (currentRequest === requestNumber.current) {
        setLoadError(
          messageFrom(error, 'Unable to load inventory. Please try again.')
        );
      }
    } finally {
      if (currentRequest === requestNumber.current) {
        setLoading(false);
      }
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      void fetchProducts();
    }

    return () => {
      requestNumber.current += 1;
    };
  }, [fetchProducts, isAdmin]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(form.image);
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [imageFile, form.image]);

  const closeModal = () => {
    if (saveBusy.current) return;

    setShowModal(false);
    setEditProduct(null);
    setImageFile(null);
    setFormError('');
    setForm({ ...emptyForm });
  };

  const openCreate = () => {
    setEditProduct(null);
    setForm({ ...emptyForm });
    setImageFile(null);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setImageFile(null);
    setFormError('');

    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      type: product.type,
      rentPrice:
        product.rentPrice === undefined
          ? ''
          : String(product.rentPrice),
      sellPrice:
        product.sellPrice === undefined
          ? ''
          : String(product.sellPrice),
      image: product.image || '',
      available: product.available,
    });

    setShowModal(true);
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFormError('Choose a JPG, PNG or WebP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image must be 5 MB or smaller.');
      return;
    }

    setFormError('');
    setImageFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAdmin || saveBusy.current) return;

    setFormError('');

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name || !description) {
      setFormError('Enter a product name and description.');
      return;
    }

    if (form.type !== 'sell' && !validPrice(form.rentPrice)) {
      setFormError(
        'Enter a positive daily rental price with at most 2 decimal places.'
      );
      return;
    }

    if (form.type !== 'rent' && !validPrice(form.sellPrice)) {
      setFormError(
        'Enter a positive purchase price with at most 2 decimal places.'
      );
      return;
    }

    saveBusy.current = true;
    setSaving(true);

    try {
      let imageUrl = form.image;

      if (imageFile) {
        setUploading(true);

        const uploaded = await uploadImage(imageFile);

        if (!uploaded || typeof uploaded.url !== 'string') {
          throw new Error('Invalid image upload response');
        }

        imageUrl = uploaded.url;
        setUploading(false);
      }

      const productData = {
        name,
        description,
        category: form.category,
        type: form.type,
        available: form.available,
        image: imageUrl,
        ...(form.type !== 'sell'
          ? { rentPrice: Number(form.rentPrice) }
          : {}),
        ...(form.type !== 'rent'
          ? { sellPrice: Number(form.sellPrice) }
          : {}),
      };

      if (editProduct) {
        await updateProduct(editProduct._id, productData);
      } else {
        await createProduct(productData);
      }

      setNotice(
        editProduct
          ? 'Equipment updated successfully.'
          : 'Equipment added successfully.'
      );
      setActionError('');
      setShowModal(false);
      setEditProduct(null);
      setImageFile(null);
      setForm({ ...emptyForm });

      await fetchProducts();
    } catch (error: unknown) {
      setFormError(
        messageFrom(
          error,
          'Unable to save equipment. Check your connection and try again.'
        )
      );
    } finally {
      saveBusy.current = false;
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (
      !isAdmin ||
      deleteBusy.current ||
      !window.confirm(`Delete "${product.name}" permanently?`)
    ) {
      return;
    }

    deleteBusy.current = true;
    setDeletingId(product._id);
    setActionError('');
    setNotice('');

    try {
      await deleteProduct(product._id);
      setNotice('Equipment deleted successfully.');
      await fetchProducts();
    } catch (error: unknown) {
      setActionError(
        messageFrom(error, 'Unable to delete equipment. Please try again.')
      );
    } finally {
      deleteBusy.current = false;
      setDeletingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
        <h1 className="text-2xl font-bold">Administrator Access Required</h1>
        <Link to="/dashboard" className="text-amber-400">
          Go to My Account →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827] py-10 px-4 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-7">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Manage equipment and booking requests.
            </p>
          </div>

          {activeTab === 'inventory' && (
            <button
              type="button"
              onClick={openCreate}
              disabled={!!deletingId}
              className="rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-3 font-semibold text-black disabled:opacity-50"
            >
              + Add Equipment
            </button>
          )}
        </div>

        <div
          role="group"
          aria-label="Admin sections"
          className="flex flex-wrap gap-3 mb-7"
        >
          {(['inventory', 'bookings'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              aria-pressed={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-5 py-3 text-sm font-semibold capitalize ${
                activeTab === tab
                  ? 'bg-amber-500 text-black'
                  : 'bg-[#1F2937] text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'bookings' ? (
          <AdminBookingsPanel
            onInventoryChange={() => {
              void fetchProducts();
            }}
          />
        ) : (
          <>
            {notice && (
              <p
                role="status"
                className="mb-5 rounded-lg border border-emerald-600 bg-emerald-500/10 p-4 text-emerald-300"
              >
                {notice}
              </p>
            )}

            {actionError && (
              <p
                role="alert"
                className="mb-5 rounded-lg border border-red-600 bg-red-500/10 p-4 text-red-300"
              >
                {actionError}
              </p>
            )}

            {loading ? (
              <p role="status" className="py-16 text-center text-gray-400">
                Loading inventory...
              </p>
            ) : loadError ? (
              <div
                role="alert"
                className="rounded-xl border border-gray-700 bg-[#1F2937] p-8 text-center"
              >
                <p className="text-red-300 mb-5">{loadError}</p>
                <button
                  type="button"
                  onClick={() => void fetchProducts()}
                  className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-black"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
                  {[
                    { label: 'Total Equipment', value: products.length },
                    {
                      label: 'Available Listings',
                      value: products.filter((product) => product.available)
                        .length,
                    },
                    {
                      label: 'Categories in Inventory',
                      value: new Set(
                        products.map((product) => product.category)
                      ).size,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-gray-700 bg-[#1F2937] p-5"
                    >
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <p className="mt-2 text-3xl font-bold text-amber-400">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-gray-700 bg-[#1F2937] overflow-hidden">
                  <div className="flex items-center justify-between gap-4 border-b border-gray-700 p-5">
                    <h2 className="text-xl font-semibold">Equipment Inventory</h2>
                    <button
                      type="button"
                      disabled={!!deletingId}
                      onClick={() => void fetchProducts()}
                      className="text-sm text-amber-400 disabled:opacity-50"
                    >
                      Refresh
                    </button>
                  </div>

                  {products.length === 0 ? (
                    <div className="px-4 py-14 text-center">
                      <p className="font-semibold mb-2">No equipment yet</p>
                      <p className="text-gray-400 text-sm">
                        Use Add Equipment to create your first listing.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <caption className="sr-only">
                          Equipment listings and administrator actions
                        </caption>

                        <thead className="text-gray-400">
                          <tr className="border-b border-gray-700">
                            {[
                              'Equipment',
                              'Category',
                              'Rent / Day',
                              'Purchase',
                              'Status',
                              'Actions',
                            ].map((heading) => (
                              <th
                                key={heading}
                                scope="col"
                                className="px-5 py-4 font-medium whitespace-nowrap"
                              >
                                {heading}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {products.map((product) => (
                            <tr
                              key={product._id}
                              className="border-b border-gray-700/50 last:border-0 hover:bg-gray-700/20"
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3 min-w-48">
                                  <InventoryImage
                                    src={product.image}
                                    name={product.name}
                                  />
                                  <Link
                                    to={`/product/${product._id}`}
                                    className="font-medium hover:text-amber-400 break-words"
                                  >
                                    {product.name}
                                  </Link>
                                </div>
                              </td>

                              <td className="px-5 py-4 capitalize text-amber-400">
                                {product.category}
                              </td>

                              <td className="px-5 py-4 whitespace-nowrap">
                                {product.type !== 'sell'
                                  ? money(product.rentPrice)
                                  : '—'}
                              </td>

                              <td className="px-5 py-4 whitespace-nowrap">
                                {product.type !== 'rent'
                                  ? money(product.sellPrice)
                                  : '—'}
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs ${
                                    product.available
                                      ? 'bg-emerald-500/15 text-emerald-300'
                                      : 'bg-red-500/15 text-red-300'
                                  }`}
                                >
                                  {product.available
                                    ? 'Available'
                                    : 'Unavailable'}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    disabled={!!deletingId}
                                    onClick={() => openEdit(product)}
                                    aria-label={`Edit ${product.name}`}
                                    className="rounded-lg bg-blue-500/15 px-3 py-2 text-xs text-blue-300 disabled:opacity-50"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    disabled={!!deletingId}
                                    onClick={() => void handleDelete(product)}
                                    aria-label={`Delete ${product.name}`}
                                    className="rounded-lg bg-red-500/15 px-3 py-2 text-xs text-red-300 disabled:opacity-50"
                                  >
                                    {deletingId === product._id
                                      ? 'Deleting...'
                                      : 'Delete'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-xs text-gray-400 leading-relaxed">
                  Equipment with booking or review history cannot be
                  deleted. Edit the listing and mark it unavailable instead.
                </p>
              </>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editProduct ? 'Edit Equipment' : 'Add Equipment'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <p
              role="alert"
              className="rounded-lg border border-red-600 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {formError}
            </p>
          )}

          <fieldset disabled={saving} className="space-y-5">
            <div>
              <label
                htmlFor="equipment-image"
                className="block text-sm text-gray-300 mb-2"
              >
                Equipment Image
              </label>

              {imagePreview && (
                <div className="mb-3">
                  <img
                    src={imagePreview}
                    alt="Equipment preview"
                    className="h-40 w-full rounded-lg bg-white object-contain p-3"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setForm((previous) => ({
                        ...previous,
                        image: '',
                      }));
                    }}
                    className="mt-2 text-xs text-red-300"
                  >
                    Remove Image
                  </button>
                </div>
              )}

              <input
                id="equipment-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-300"
              />

              <p className="mt-2 text-xs text-gray-400">
                JPG, PNG or WebP. Maximum 5 MB.
              </p>
            </div>

            <div>
              <label
                htmlFor="equipment-name"
                className="block text-sm text-gray-300 mb-2"
              >
                Equipment Name
              </label>
              <input
                id="equipment-name"
                type="text"
                value={form.name}
                maxLength={150}
                required
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="equipment-description"
                className="block text-sm text-gray-300 mb-2"
              >
                Description
              </label>
              <textarea
                id="equipment-description"
                value={form.description}
                rows={4}
                maxLength={5000}
                required
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="equipment-category"
                  className="block text-sm text-gray-300 mb-2"
                >
                  Category
                </label>
                <select
                  id="equipment-category"
                  value={form.category}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      category: event.target.value as Category,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="camera">Camera</option>
                  <option value="lens">Lens</option>
                  <option value="lighting">Lighting</option>
                  <option value="accessory">Accessory</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="equipment-type"
                  className="block text-sm text-gray-300 mb-2"
                >
                  Listing Type
                </label>
                <select
                  id="equipment-type"
                  value={form.type}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      type: event.target.value as ProductType,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="rent">Rent Only</option>
                  <option value="sell">Sell Only</option>
                  <option value="both">Rent and Sell</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {form.type !== 'sell' && (
                <div>
                  <label
                    htmlFor="equipment-rent-price"
                    className="block text-sm text-gray-300 mb-2"
                  >
                    Daily Rental Price ($)
                  </label>
                  <input
                    id="equipment-rent-price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.rentPrice}
                    required
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        rentPrice: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </div>
              )}

              {form.type !== 'rent' && (
                <div>
                  <label
                    htmlFor="equipment-sell-price"
                    className="block text-sm text-gray-300 mb-2"
                  >
                    Purchase Price ($)
                  </label>
                  <input
                    id="equipment-sell-price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.sellPrice}
                    required
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        sellPrice: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            <label className="flex items-center gap-3 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    available: event.target.checked,
                  }))
                }
                className="h-4 w-4 accent-amber-500"
              />
              Available for new bookings
            </label>
          </fieldset>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={closeModal}
              className="flex-1 rounded-lg bg-gray-700 py-3 font-semibold disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-amber-500 py-3 text-black font-semibold disabled:opacity-50"
            >
              {uploading
                ? 'Uploading...'
                : saving
                  ? 'Saving...'
                  : editProduct
                    ? 'Save Changes'
                    : 'Add Equipment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}