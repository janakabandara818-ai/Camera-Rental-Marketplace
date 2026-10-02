import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlusCircle, ShieldCheck, Film, Sparkles } from 'lucide-react';
import { HERO_IMAGE } from '../../data/mockData';

interface HeroSectionProps {
  onOpenListGearModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenListGearModal }) => {
  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center bg-[#0a0a0a] overflow-hidden border-b border-gray-800">
      {/* Background Image with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Cinematic camera rig in studio"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-45 scale-100"
        />
        {/* Measured Scrim for WCAG AA Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-[#0a0a0a]/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-2xl lg:max-w-3xl space-y-6">
          {/* Subtle Lead Label */}
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>CERTIFIED CINEMA & PRODUCTION GEAR</span>
          </div>

          {/* Primary Headline with Balance */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1] text-balance">
            Rent. Hire. Own. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              Premium Camera Gear
            </span>
          </h1>

          {/* Body Prose */}
          <p className="text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed">
            The professional marketplace for cinematographers, directors, and production crews. Access ARRI, RED, Sony Cinema Line, Cooke primes, and studio lighting with instant insurance verification and nationwide delivery.
          </p>

          {/* Primary Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-sm sm:text-base font-semibold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 transition-all duration-150 active:scale-[0.98] cursor-pointer"
            >
              <span>Browse Equipment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={onOpenListGearModal}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm sm:text-base font-medium bg-[#161f30] hover:bg-gray-800 text-white border border-gray-700/80 transition-all duration-150 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-500" />
              <span>List Your Gear</span>
            </button>
          </div>

          {/* Trust Metrics Adjacency */}
          <div className="pt-6 border-t border-gray-800/80 flex flex-wrap items-center gap-6 sm:gap-10 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                <strong className="text-white font-semibold tabular-nums">$5M+</strong> COI Damage Protection
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-400" />
              <span>
                <strong className="text-white font-semibold tabular-nums">100%</strong> Sensor-Clean Certified
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>24/7 On-Set Dispatch Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
