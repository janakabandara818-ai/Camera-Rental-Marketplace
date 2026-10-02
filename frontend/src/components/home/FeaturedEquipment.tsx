import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../products/ProductCard';
import { QuickViewModal } from '../common/QuickViewModal';

interface FeaturedEquipmentProps {
  products: Product[];
}

export const FeaturedEquipment: React.FC<FeaturedEquipmentProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const tabs = ['All', 'Cameras', 'Lenses', 'Lighting', 'Stabilizers'];

  const filteredProducts = products.filter((item) => {
    if (activeTab === 'All') return true;
    return item.category === activeTab;
  }).slice(0, 6);

  return (
    <section className="py-20 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs text-amber-500 font-semibold uppercase tracking-wider mb-1">
              Top Rated by Directors of Photography
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Featured Cinema Equipment
            </h2>
          </div>

          {/* Interactive filter tabs (Zero-pill discipline: quiet segmented control with click handlers) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0d131f] rounded-lg border border-gray-800 self-start md:self-auto overflow-x-auto max-w-full">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? 'bg-amber-500 text-black font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[#161f30] hover:bg-gray-800 text-white border border-gray-700 transition-colors"
          >
            <span>Explore All 200+ Equipment Listings</span>
            <ArrowRight className="w-4 h-4 text-amber-500" />
          </Link>
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
};
