import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onToggleMobileFilters?: () => void;
  placeholder?: string;
  totalResults?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  onToggleMobileFilters,
  placeholder = 'Search by camera model, lens series, brand, or specs...',
  totalResults
}) => {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#161f30] border border-gray-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-colors"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mobile Filter Drawer Button */}
      {onToggleMobileFilters && (
        <button
          onClick={onToggleMobileFilters}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm font-medium text-white transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-500" />
          <span>Filters</span>
        </button>
      )}

      {typeof totalResults === 'number' && (
        <div className="hidden sm:block text-xs font-mono text-gray-400 tabular-nums whitespace-nowrap pl-1">
          {totalResults} {totalResults === 1 ? 'item' : 'items'} found
        </div>
      )}
    </div>
  );
};
