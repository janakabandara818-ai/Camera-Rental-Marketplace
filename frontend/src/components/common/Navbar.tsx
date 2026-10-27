import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC<{ onOpenListGearModal: () => void }> = ({ onOpenListGearModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, clearCart } = useCart();

  const handleLogout = () => {
    clearCart();
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const handleListGear = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.role === 'admin') { navigate('/admin'); return; }
    window.alert('Equipment listings are currently managed by the administrator.');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors shrink-0 group">
          <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform font-mono text-sm font-black">C</span>
          <span className="font-display tracking-wider text-xl uppercase">Camera <span className="text-amber-500">&amp;</span> Gear</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/products" className={`transition-colors whitespace-nowrap ${location.pathname === '/products' ? 'text-amber-400 font-semibold' : 'text-gray-300 hover:text-white'}`}>
            Rent Equipment
          </Link>
          <Link to="/products" className="text-gray-300 hover:text-white transition-colors whitespace-nowrap">
            Buy Gear
          </Link>
          <Link to="/products" className="text-gray-300 hover:text-white transition-colors whitespace-nowrap">
            Cameras
          </Link>
          <Link to="/products" className="text-gray-300 hover:text-white transition-colors whitespace-nowrap">
            Lenses
          </Link>
          <button onClick={handleListGear} className="text-gray-300 hover:text-amber-400 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-sm">
            ➕ List Gear
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Cart */}
          <Link to="/cart" className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-colors flex items-center gap-1.5">
            🛒
            {itemCount > 0 && (
              <span className="bg-amber-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg bg-gray-800/80 hover:bg-gray-800 border border-gray-700/60 text-sm font-medium transition-colors cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-gray-200">{user.name?.split(' ')[0]}</span>
                <span className="text-gray-400">▾</span>
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#161f30] border border-gray-700/80 shadow-2xl py-2 z-40 text-sm">
                    <div className="px-4 py-2.5 border-b border-gray-800">
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                    <div className="py-1">
                      <Link to="/dashboard" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors">
                        📊 Dashboard
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors">
                          🛡️ Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="pt-1 border-t border-gray-800">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-red-300 hover:text-red-200 hover:bg-red-950/30 transition-colors text-left">
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3.5 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">Log In</Link>
              <Link to="/register" className="px-3.5 py-1.5 text-sm font-semibold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors">Sign Up</Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-[#0a0a0a] px-4 py-5 space-y-4">
          <nav className="flex flex-col gap-3 text-base font-medium">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-amber-400 transition-colors py-1">Rent Equipment</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-amber-400 transition-colors py-1">Buy Gear</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-amber-400 transition-colors py-1">Cameras</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-amber-400 transition-colors py-1">Lenses</Link>
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white py-1">📊 Dashboard</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white py-1">🛡️ Admin</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};