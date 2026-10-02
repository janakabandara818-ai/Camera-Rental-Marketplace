import React from 'react';
import { CalendarCheck, ShieldCheck, Film } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Select Dates or Purchase',
      description:
        'Choose your shoot schedule or buy certified gear outright. Add insurance waiver protection, compare specs, and customize production packages.',
      icon: <CalendarCheck className="w-6 h-6 text-amber-500" />
    },
    {
      number: '02',
      title: 'Bench Tested & Dispatched',
      description:
        'Every cinema camera and optic undergoes optical bench collimation, sensor cleanliness checks, and firmware validation before courier dispatch in Pelican cases.',
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />
    },
    {
      number: '03',
      title: 'Shoot & Hassle-Free Return',
      description:
        'Deliver your shoot with 24/7 on-set technician telephone support. Return equipment using prepaid shipping labels or schedule courier pickup directly from set.',
      icon: <Film className="w-6 h-6 text-amber-500" />
    }
  ];

  return (
    <section className="py-20 bg-[#0d131f] border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="text-xs text-amber-500 font-semibold uppercase tracking-wider">
            Seamless Production Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            How CineVault Equipment Rental Works
          </h2>
          <p className="text-sm text-gray-400">
            Engineered for high-stakes commercial, feature, and indie productions with zero downtime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="relative flex flex-col bg-[#161f30] rounded-xl p-6 border border-gray-800/80 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  {step.icon}
                </div>
                <span className="font-mono text-xl font-bold text-gray-600">
                  {step.number}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                {step.description}
              </p>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-gray-800 pointer-events-none z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
