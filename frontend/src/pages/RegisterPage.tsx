import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { User as UserIcon, Mail, Lock, ShieldCheck, Video, DollarSign } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'creator' | 'vendor'>('creator');
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the equipment rental terms and privacy policy.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      register(name, email, role);
      setLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#111827] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <span className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-mono text-base font-black">
            C
          </span>
          <span className="font-display tracking-wider uppercase text-2xl text-white font-bold">
            Cine<span className="text-amber-500">Vault</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white font-display">
          Create Production Account
        </h2>
        <p className="mt-2 text-xs text-gray-400">
          Join thousands of cinematographers, directors, and equipment rental houses.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-[#161f30] py-8 px-6 sm:px-8 rounded-2xl border border-gray-800 shadow-2xl space-y-6">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-lg">
              {error}
            </div>
          )}

          {/* Account Role Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Select Your Primary Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('creator')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  role === 'creator'
                    ? 'bg-amber-500/10 border-amber-500 text-white'
                    : 'bg-[#0d131f] border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <Video className={`w-5 h-5 mb-1.5 ${role === 'creator' ? 'text-amber-400' : 'text-gray-500'}`} />
                <div className="font-semibold text-xs text-white">Filmmaker / Renter</div>
                <div className="text-[11px] text-gray-400 mt-0.5">Rent camera rigs, prime lenses & studio lighting</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  role === 'vendor'
                    ? 'bg-amber-500/10 border-amber-500 text-white'
                    : 'bg-[#0d131f] border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <DollarSign className={`w-5 h-5 mb-1.5 ${role === 'vendor' ? 'text-amber-400' : 'text-gray-500'}`} />
                <div className="font-semibold text-xs text-white">Gear Owner / Vendor</div>
                <div className="text-[11px] text-gray-400 mt-0.5">List equipment & monetize production downtime</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Full Name / Production Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Rostova or Light & Magic Films"
                  className="w-full bg-[#0d131f] border border-gray-700 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@production.com"
                  className="w-full bg-[#0d131f] border border-gray-700 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full bg-[#0d131f] border border-gray-700 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-[#0d131f] border border-gray-700 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-gray-700 bg-gray-900 text-amber-500 focus:ring-amber-500 w-4 h-4"
                />
                <span>
                  I agree to the CineVault <a href="#terms" className="text-amber-400 underline">Terms of Equipment Rental</a> and understand all gear bookings require identity & COI verification.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full"
            >
              Complete Account Registration
            </Button>
          </form>

          <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-800">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
