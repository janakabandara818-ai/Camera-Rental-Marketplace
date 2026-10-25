import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const session = await login(email, password);

      navigate(
        session.user.role === 'admin' ? '/admin' : '/dashboard',
        { replace: true }
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Unable to sign in. Check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

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
            Welcome Back
          </h1>
          <p className="text-gray-400">
            Sign in to Camera &amp; Equipment Rental
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
              htmlFor="login-email"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 disabled:opacity-60"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 disabled:opacity-60"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="text-amber-500 hover:text-amber-400 font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}