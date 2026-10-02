import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-16 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs text-amber-500 font-semibold uppercase tracking-wider mb-1">
              Curated Production Departments
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Explore Equipment Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm text-gray-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1 font-medium"
          >
            <span>View all inventory</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative flex flex-col bg-[#161f30] rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-200"
            >
              <div className="relative aspect-square w-full bg-[#0d131f] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161f30] via-transparent to-transparent opacity-80" />
              </div>

              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-gray-500">
                  <span className="tabular-nums">{cat.count}+ available</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
