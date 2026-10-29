import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  onOpenListGearModal: () => void;
}

const navigationLinks = [
  {
    key: 'rent',
    label: 'Rent Equipment',
    to: '/products?type=rent',
  },
  {
    key: 'buy',
    label: 'Buy Gear',
    to: '/products?type=buy',
  },
  {
    key: 'camera',
    label: 'Cameras',
    to: '/products?category=camera',
  },
  {
    key: 'lens',
    label: 'Lenses',
    to: '/products?category=lens',
  },
];

export const Navbar: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, clearCart } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  const isAdmin = isAuthenticated && user?.role === 'admin';

  const closeMenus = useCallback(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    closeMenus();
  }, [
    location.pathname,
    location.search,
    closeMenus,
  ]);

  useEffect(() => {
    closeMenus();
  }, [user?.id, isAuthenticated, closeMenus]);

  useEffect(() => {
    if (!dropdownOpen && !mobileMenuOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      ) {
        closeMenus();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      if (dropdownOpen) {
        accountButtonRef.current?.focus();
      } else {
        mobileButtonRef.current?.focus();
      }

      closeMenus();
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener(
        'pointerdown',
        handleOutsideClick
      );
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownOpen, mobileMenuOpen, closeMenus]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    clearCart();
    logout();
    closeMenus();
    navigate('/login', { replace: true });
  };

  const params = new URLSearchParams(location.search);

  const category = (params.get('category') || '')
    .trim()
    .toLowerCase();

  const type = (params.get('type') || '')
    .trim()
    .toLowerCase();

  let activeLink = '';

  if (location.pathname === '/products') {
    if (
      ['camera', 'cameras', 'cinema cameras'].includes(category)
    ) {
      activeLink = 'camera';
    } else if (['lens', 'lenses'].includes(category)) {
      activeLink = 'lens';
    } else if (type === 'buy' || type === 'sell') {
      activeLink = 'buy';
    } else if (type === 'rent') {
      activeLink = 'rent';
    }
  }

  const navigationClass = (key: string) =>
    `transition-colors whitespace-nowrap ${
      activeLink === key
        ? 'text-amber-400 font-semibold'
        : 'text-gray-300 hover:text-white'
    }`;

  const accountName = user?.name?.trim() || 'Account';
  const firstName = accountName.split(/\s+/)[0];
  const initial = accountName.charAt(0).toUpperCase();

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 w-full bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <Link
          to="/"
          onClick={closeMenus}
          aria-label="Camera and Gear home"
          className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors shrink-0"
        >
          <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-black">
            C
          </span>

          <span className="font-display tracking-wider text-sm sm:text-xl uppercase font-bold">
            Camera <span className="text-amber-500">&amp;</span> Gear
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden xl:flex items-center gap-6 text-sm font-medium"
        >
          {navigationLinks.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              onClick={closeMenus}
              aria-current={
                activeLink === item.key ? 'page' : undefined
              }
              className={navigationClass(item.key)}
            >
              {item.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={closeMenus}
              className="text-amber-400 hover:text-amber-300 whitespace-nowrap"
            >
              Manage Gear
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/cart"
            onClick={closeMenus}
            aria-label={`Shopping cart, ${itemCount} items`}
            className="flex items-center gap-1 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ShoppingCart
              aria-hidden="true"
              className="w-5 h-5"
            />

            {itemCount > 0 && (
              <span className="bg-amber-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                ref={accountButtonRef}
                type="button"
                aria-label="Account options"
                aria-expanded={dropdownOpen}
                aria-controls="account-options"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setDropdownOpen((open) => !open);
                }}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
                  {initial}
                </span>

                <span className="hidden sm:inline max-w-24 truncate text-gray-200">
                  {firstName}
                </span>

                <ChevronDown
                  aria-hidden="true"
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div
                  id="account-options"
                  className="absolute right-0 mt-2 w-60 max-w-[calc(100vw-2rem)] rounded-xl bg-[#161f30] border border-gray-700 shadow-2xl py-2 z-50 text-sm"
                >
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="font-semibold text-white break-words">
                      {accountName}
                    </p>

                    <p className="text-xs text-gray-400 mt-1 break-all">
                      {user.email}
                    </p>

                    {isAdmin && (
                      <p className="text-xs text-amber-400 mt-2">
                        Administrator
                      </p>
                    )}
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <LayoutDashboard
                      aria-hidden="true"
                      className="w-4 h-4"
                    />
                    My Bookings
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeMenus}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <ShieldCheck
                        aria-hidden="true"
                        className="w-4 h-4"
                      />
                      Admin Panel
                    </Link>
                  )}

                  <div className="border-t border-gray-800">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-950/30 transition-colors text-left"
                    >
                      <LogOut
                        aria-hidden="true"
                        className="w-4 h-4"
                      />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                onClick={closeMenus}
                className="text-sm font-medium text-gray-300 hover:text-white whitespace-nowrap"
              >
                Log In
              </Link>

              <Link
                to="/register"
                onClick={closeMenus}
                className="hidden sm:inline-block px-3 py-2 text-sm font-semibold text-black bg-amber-500 hover:bg-amber-400 rounded-lg whitespace-nowrap"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            ref={mobileButtonRef}
            type="button"
            aria-label={
              mobileMenuOpen
                ? 'Close navigation'
                : 'Open navigation'
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              setDropdownOpen(false);
              setMobileMenuOpen((open) => !open);
            }}
            className="xl:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
          >
            {mobileMenuOpen ? (
              <X aria-hidden="true" className="w-5 h-5" />
            ) : (
              <Menu aria-hidden="true" className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="xl:hidden border-t border-gray-800 bg-[#0a0a0a] px-4 py-4 max-h-[calc(100dvh-4rem)] overflow-y-auto"
        >
          <div className="flex flex-col gap-1">
            {navigationLinks.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                onClick={closeMenus}
                aria-current={
                  activeLink === item.key ? 'page' : undefined
                }
                className={`${navigationClass(
                  item.key
                )} block px-3 py-3 rounded-lg hover:bg-gray-800 text-sm`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              to="/products"
              onClick={closeMenus}
              className="block px-3 py-3 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800"
            >
              All Equipment
            </Link>

            {isAuthenticated ? (
              <div className="border-t border-gray-800 mt-2 pt-2">
                <Link
                  to="/dashboard"
                  onClick={closeMenus}
                  className="block px-3 py-3 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  My Bookings
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={closeMenus}
                    className="block px-3 py-3 rounded-lg text-sm text-amber-400 hover:bg-gray-800"
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-3 rounded-lg text-sm text-red-300 hover:bg-red-950/30"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-800 mt-2 pt-2">
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="block px-3 py-3 text-sm text-gray-300"
                >
                  Log In
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenus}
                  className="block px-3 py-3 text-sm text-amber-400"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};