import React from 'react';
import { GearCategory } from '../../types';
import { RotateCcw } from 'lucide-react';

export interface FilterState {
  search: string;
  category: string;
  type: 'all' | 'rent' | 'buy';
  minPrice: number;
  maxPrice: number;
  selectedBrands: string[];
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  availableBrands: string[];
}

const CATEGORIES: ('All' | GearCategory)[] = [
  'All',
  'Cameras',
  'Lenses',
  'Lighting',
  'Audio',
  'Stabilizers',
  'Accessories'
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  availableBrands
}) => {
  const handleCategoryClick = (cat: string) => {
    onChange({ ...filters, category: cat });
  };

  const handleTypeChange = (type: 'all' | 'rent' | 'buy') => {
    onChange({ ...filters, type });
  };

  const handleBrandToggle = (brand: string) => {
    const isSelected = filters.selectedBrands.includes(brand);
    const newBrands = isSelected
      ? filters.selectedBrands.filter((b) => b !== brand)
      : [...filters.selectedBrands, brand];
    onChange({ ...filters, selectedBrands: newBrands });
  };

  return (
    <div className="space-y-6 text-sm">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <span className="font-semibold text-white tracking-wide text-xs uppercase">
          Filter Equipment
        </span>
        <button
          onClick={onReset}
          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Listing Mode (Rent vs Buy) */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Listing Mode
        </label>
        <div className="grid grid-cols-3 gap-1 bg-[#0d131f] p-1 rounded-lg border border-gray-800">
          <button
            onClick={() => handleTypeChange('all')}
            className={`py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
              filters.type === 'all'
                ? 'bg-amber-500 text-black font-semibold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleTypeChange('rent')}
            className={`py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
              filters.type === 'rent'
                ? 'bg-amber-500 text-black font-semibold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Rent
          </button>
          <button
            onClick={() => handleTypeChange('buy')}
            className={`py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
              filters.type === 'buy'
                ? 'bg-amber-500 text-black font-semibold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Buy
          </button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
          Categories
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected =
              filters.category === cat || (cat === 'All' && !filters.category);
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat === 'All' ? '' : cat)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Daily Rent Limit
          </label>
          <span className="font-mono text-xs text-amber-400 font-semibold tabular-nums">
            ${filters.maxPrice}/day
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="1000"
          step="25"
          value={filters.maxPrice}
          onChange={(e) =>
            onChange({ ...filters, maxPrice: parseInt(e.target.value, 10) })
          }
          className="w-full accent-amber-500 bg-gray-700 h-1.5 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-gray-500 font-mono mt-1">
          <span>$50/d</span>
          <span>$500/d</span>
          <span>$1000/d+</span>
        </div>
      </div>

      {/* Verified Brands */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
          Cinema Brands
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {availableBrands.map((brand) => {
            const checked = filters.selectedBrands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-2.5 text-xs text-gray-300 hover:text-white cursor-pointer select-none py-1"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleBrandToggle(brand)}
                  className="rounded border-gray-700 bg-gray-900 text-amber-500 focus:ring-amber-500/50 w-3.5 h-3.5"
                />
                <span>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Instant Availability Toggle */}
      <div className="pt-2 border-t border-gray-800">
        <label className="flex items-center justify-between cursor-pointer py-1 select-none">
          <span className="text-xs text-gray-300">Ready for Instant Dispatch</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="rounded border-gray-700 bg-gray-900 text-amber-500 focus:ring-amber-500/50 w-4 h-4"
          />
        </label>
      </div>
    </div>
  );
};
