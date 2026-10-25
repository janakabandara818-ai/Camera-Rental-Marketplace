import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenListGearModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenListGearModal,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Uses the existing checkout cart until the cart integration step.
  let cartCount = 0;

  try {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    cartCount = Array.isArray(savedCart) ? savedCart.length : 0;
  } catch {
    cartCount = 0;
  }

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenus();
    navigate('/login', { replace: true });
  };

  const handleListGear = () => {
    closeMenus();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    onOpenListGearModal();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          onClick={closeMenus}
          className="flex items-center gap-2.5 text-white hover:text-amber-400 transition-colors shrink-0"
        >
          <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-black">
            C
          </span>
          <span className="font-display tracking-wider text-base sm:text-xl uppercase font-bold">
            Camera <span className="text-amber-500">&amp;</span> Gear
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/products"
            className={`transition-colors whitespace-nowrap ${
              location.pathname === '/products'
                ? 'text-amber-400'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Rent Equipment
          </Link>
          <Link
            to="/products?type=buy"
            className="text-gray-300 hover:text-white whitespace-nowrap"
          >
            Buy Gear
          </Link>
          <Link
            to="/products?category=camera"
            className="text-gray-300 hover:text-white"
          >
            Cameras
          </Link>
          <Link
            to="/products?category=lens"
            className="text-gray-300 hover:text-white"
          >
            Lenses
          </Link>
          <button
            type="button"
            onClick={handleListGear}
            className="text-gray-300 hover:text-amber-400 whitespace-nowrap"
          >
            + List Gear
          </button>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/cart"
            onClick={closeMenus}
            aria-label={`Shopping cart, ${cartCount} items`}
            className="relative p-2 text-gray-300 hover:text-white rounded-lg flex items-center gap-1"
          >
            <span aria-hidden="true">🛒</span>
            {cartCount > 0 && (
              <span className="bg-amber-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                aria-expanded={dropdownOpen}
                aria-controls="account-menu"
                className="flex items-center gap-2 p-1.5 rounded-lg bg-gray-800 border border-gray-700 text-sm"
              >
                <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline text-gray-200">
                  {user.name.split(' ')[0]}
                </span>
                <span aria-hidden="true" className="text-gray-400">
                  ▾
                </span>
              </button>

              {dropdownOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close account menu"
                    onClick={() => setDropdownOpen(false)}
                    className="fixed inset-0 z-30 cursor-default"
                  />

                  <div
                    id="account-menu"
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-[#161f30] border border-gray-700 shadow-2xl py-2 z-40 text-sm"
                  >
                    <div className="px-4 py-3 border-b border-gray-800">
                      <div className="font-semibold text-white">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-400 break-all">
                        {user.email}
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={closeMenus}
                      className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                      Dashboard
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={closeMenus}
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800"
                      >
                        Admin Panel
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 border-t border-gray-800 text-red-300 hover:bg-red-950/30"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                onClick={closeMenus}
                className="text-sm text-gray-300 hover:text-white"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={closeMenus}
                className="hidden sm:inline-block px-3 py-1.5 text-sm font-semibold text-black bg-amber-500 hover:bg-amber-400 rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="lg:hidden p-2 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          className="lg:hidden border-t border-gray-800 bg-[#0a0a0a] px-4 py-5 flex flex-col gap-4 text-sm text-gray-300"
        >
          <Link to="/products" onClick={closeMenus}>
            Rent Equipment
          </Link>
          <Link to="/products?type=buy" onClick={closeMenus}>
            Buy Gear
          </Link>
          <Link to="/products?category=camera" onClick={closeMenus}>
            Cameras
          </Link>
          <Link to="/products?category=lens" onClick={closeMenus}>
            Lenses
          </Link>

          <button
            type="button"
            onClick={handleListGear}
            className="text-left hover:text-amber-400"
          >
            + List Gear
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={closeMenus}>
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={closeMenus}>
                  Admin Panel
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="text-left text-red-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/register"
              onClick={closeMenus}
              className="text-amber-400"
            >
              Create Account
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};