import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEquipment } from '../context/EquipmentContext';
import { ProductCard } from '../components/products/ProductCard';
import { FilterSidebar, FilterState } from '../components/products/FilterSidebar';
import { SearchBar } from '../components/products/SearchBar';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Product } from '../types';
import { Modal } from '../components/common/Modal';
import { ArrowUpDown, SlidersHorizontal, Camera } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { products } = useEquipment();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from query params
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    type: (searchParams.get('type') as 'all' | 'rent' | 'buy') || 'all',
    minPrice: 0,
    maxPrice: 1000,
    selectedBrands: [],
    inStockOnly: false,
    sortBy: 'featured'
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sync state if URL query params change (e.g. from nav clicks)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const typeParam = searchParams.get('type') as 'all' | 'rent' | 'buy' | null;
    const qParam = searchParams.get('q');

    setFilters((prev) => ({
      ...prev,
      category: categoryParam || '',
      type: typeParam || 'all',
      search: qParam || ''
    }));
    setCurrentPage(1);
  }, [searchParams]);

  // Unique brands list from current catalog
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => brandsSet.add(p.brand));
    return Array.from(brandsSet).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Keyword Search
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchTagline = p.tagline.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchCategory && !matchTagline) return false;
        }

        // Category filter
        if (filters.category && filters.category !== 'All') {
          if (p.category.toLowerCase() !== filters.category.toLowerCase()) return false;
        }

        // Type filter (rent or buy)
        if (filters.type === 'rent' && !p.availableForRent) return false;
        if (filters.type === 'buy' && !p.availableForSale) return false;

        // Daily Rent Price limit
        if (p.rentPricePerDay > filters.maxPrice) return false;

        // Brand filter
        if (filters.selectedBrands.length > 0) {
          if (!filters.selectedBrands.includes(p.brand)) return false;
        }

        // In Stock only
        if (filters.inStockOnly && p.status !== 'Available') return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') {
          return a.rentPricePerDay - b.rentPricePerDay;
        }
        if (filters.sortBy === 'price-desc') {
          return b.rentPricePerDay - a.rentPricePerDay;
        }
        if (filters.sortBy === 'rating') {
          return b.rating - a.rating;
        }
        // 'featured'
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, filters]);

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      type: 'all',
      minPrice: 0,
      maxPrice: 1000,
      selectedBrands: [],
      inStockOnly: false,
      sortBy: 'featured'
    });
    setSearchParams({});
    setCurrentPage(1);
  };

  // Pagination slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#111827] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-wider mb-1">
            <span>Marketplace Catalog</span>
            {filters.category && (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-white">{filters.category}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white font-display">
            {filters.type === 'buy'
              ? 'Certified Cinema Gear for Sale'
              : filters.category
              ? `${filters.category} Rental & Sales`
              : 'Camera & Production Equipment Catalog'}
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-xl">
            Inspected cinema cameras, prime optics, studio lights, and production packages with 24/7 technical assistance.
          </p>
        </div>

        {/* Top Control Bar: Search & Sorting */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-[#161f30] p-4 rounded-xl border border-gray-800">
          <div className="flex-1">
            <SearchBar
              value={filters.search}
              onChange={(search) => {
                setFilters((prev) => ({ ...prev, search }));
                setCurrentPage(1);
              }}
              onClear={() => setFilters((prev) => ({ ...prev, search: '' }))}
              onToggleMobileFilters={() => setMobileFiltersOpen(true)}
              totalResults={filteredProducts.length}
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as FilterState['sortBy']
                }))
              }
              className="bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Rent Price: Low to High</option>
              <option value="price-desc">Rent Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Main Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-[#161f30] p-5 rounded-xl border border-gray-800">
              <FilterSidebar
                filters={filters}
                onChange={(newFilters) => {
                  setFilters(newFilters);
                  setCurrentPage(1);
                }}
                onReset={handleResetFilters}
                availableBrands={availableBrands}
              />
            </div>
          </aside>

          {/* Products Grid & Pagination */}
          <main className="lg:col-span-3 flex flex-col">
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-between border-t border-gray-800 pt-6">
                    <div className="text-xs text-gray-400 font-mono">
                      Showing {(currentPage - 1) * itemsPerPage + 1}–
                      {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
                      {filteredProducts.length} items
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-md text-xs font-medium transition-colors font-mono ${
                              currentPage === pageNum
                                ? 'bg-amber-500 text-black font-bold'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center bg-[#161f30] rounded-xl border border-gray-800">
                <div className="w-16 h-16 rounded-full bg-gray-800 text-amber-500 flex items-center justify-center mb-4">
                  <Camera className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  No matching camera gear found
                </h3>
                <p className="text-xs text-gray-400 max-w-sm mb-6">
                  Try broadening your search criteria, adjusting your daily rent budget, or resetting filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <Modal
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Filter Equipment"
        maxWidth="md"
      >
        <FilterSidebar
          filters={filters}
          onChange={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1);
          }}
          onReset={handleResetFilters}
          availableBrands={availableBrands}
        />
        <div className="mt-6 pt-4 border-t border-gray-800 flex justify-end">
          <button
            onClick={() => setMobileFiltersOpen(false)}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-lg transition-colors"
          >
            Show {filteredProducts.length} Results
          </button>
        </div>
      </Modal>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
