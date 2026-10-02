import React from 'react';
import { TESTIMONIALS } from '../../data/mockData';
import { Quote } from 'lucide-react';
import { StarRating } from '../common/StarRating';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-[#0d131f] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="text-xs text-amber-500 font-semibold uppercase tracking-wider">
            Trusted on Commercials & Features
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Loved by Production Teams
          </h2>
          <p className="text-sm text-gray-400">
            Over $10M of cinema equipment booked safely with zero insurance claims.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between bg-[#161f30] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <StarRating rating={5.0} showScore={false} size="sm" />
                  <Quote className="w-5 h-5 text-amber-500/40" />
                </div>

                <div className="text-xs font-mono font-semibold text-amber-400 mb-2">
                  {t.highlight}
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic mb-6">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-gray-800/80">
                <div className="font-semibold text-white text-sm">{t.name}</div>
                <div className="text-xs text-gray-400">{t.role}</div>
                <div className="text-[11px] text-gray-500 font-medium mt-0.5">{t.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
