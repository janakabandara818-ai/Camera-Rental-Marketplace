import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      showToast('Subscribed! Check your inbox for gear drops & rental credits.', 'success');
      setEmail('');
    }, 500);
  };

  return (
    <section className="py-16 bg-[#0a0a0a] border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded mb-4">
          <Mail className="w-3.5 h-3.5" />
          <span>PRODUCTION GEAR DISPATCH</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-3">
          Stay Ahead of Cinema Gear Releases
        </h2>
        <p className="text-sm text-gray-400 max-w-lg mx-auto mb-8">
          Weekly updates on newly listed cameras, Cooke/Arri prime restocks, weekend discount specials, and tech calibration guides.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>You are subscribed! $50 credit applied toward your first gear rental.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your studio or personal email"
              className="w-full bg-[#161f30] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="w-full sm:w-auto shrink-0"
            >
              Subscribe
            </Button>
          </form>
        )}

        <div className="mt-4 text-xs text-gray-500">
          No spam. Unsubscribe anytime with one click.
        </div>
      </div>
    </section>
  );
};
