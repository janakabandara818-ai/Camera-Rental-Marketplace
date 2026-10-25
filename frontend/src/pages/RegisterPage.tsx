import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Unable to create your account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 disabled:opacity-60';

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center px-4 py-12">
      <div className="bg-[#1F2937] rounded-2xl p-8 w-full max-w-md border border-gray-700">
        <Link
          to="/"
          className="inline-block text-sm text-gray-400 hover:text-amber-400 mb-6"
        >
          ← Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-400">
            Join Camera &amp; Equipment Rental
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="register-name"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Full Name
            </label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className={inputClass}
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={inputClass}
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              minLength={8}
              className={inputClass}
              placeholder="At least 8 characters"
              required
            />
          </div>

          <div>
            <label
              htmlFor="register-confirm-password"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              id="register-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              minLength={8}
              className={inputClass}
              placeholder="Re-enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-amber-500 hover:text-amber-400 font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}