import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User as UserIcon, Menu, X, Shield, PlusCircle, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface NavbarProps {
  onOpenListGearModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenListGearModal }) => {
  const { user, isAuthenticated, isAdmin, logout, switchDemoRole } = useAuth();
  const { itemCount } = useCart();
  const { wishlistIds } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single Wordmark Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors shrink-0 group"
        >
          <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform font-mono text-sm font-black">
            C
          </span>
          <span className="font-display tracking-wider text-xl uppercase">
            Cine<span className="text-amber-500">Vault</span>
          </span>
        </Link>

        {/* Zone 2: Navigation Links (Clean text with subtle indicators) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
          <Link
            to="/products"
            className={`transition-colors whitespace-nowrap ${
              isActive('/products') && !location.search.includes('type=buy')
                ? 'text-amber-400 font-semibold'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Rent Equipment
          </Link>
          <Link
            to="/products?type=buy"
            className={`transition-colors whitespace-nowrap ${
              location.search.includes('type=buy')
                ? 'text-amber-400 font-semibold'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Buy Gear
          </Link>
          <Link
            to="/products?category=Cameras"
            className="text-gray-300 hover:text-white transition-colors whitespace-nowrap"
          >
            Cameras
          </Link>
          <Link
            to="/products?category=Lenses"
            className="text-gray-300 hover:text-white transition-colors whitespace-nowrap"
          >
            Lenses
          </Link>
          <button
            onClick={onOpenListGearModal}
            className="text-gray-300 hover:text-amber-400 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-sm"
          >
            <PlusCircle className="w-4 h-4 text-amber-500" />
            <span>List Gear</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions & User State */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Wishlist Link */}
          <Link
            to="/dashboard?tab=wishlist"
            className="hidden sm:flex relative p-2 text-gray-400 hover:text-white hover:bg-gray-800/60 rounded-lg transition-colors"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          {/* Cart Trigger */}
          <Link
            to="/cart"
            className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-colors flex items-center gap-1.5"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            {itemCount > 0 && (
              <span className="bg-amber-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center tabular-nums">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Auth State / Profile */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg bg-gray-800/80 hover:bg-gray-800 border border-gray-700/60 text-sm font-medium transition-colors cursor-pointer"
                aria-expanded={profileDropdownOpen}
              >
                <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-28 truncate text-gray-200">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#161f30] border border-gray-700/80 shadow-2xl py-2 z-40 text-sm">
                    <div className="px-4 py-2.5 border-b border-gray-800">
                      <div className="font-semibold text-white truncate">{user.name}</div>
                      <div className="text-xs text-gray-400 truncate">{user.email}</div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-amber-400 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span className="capitalize">{user.role}</span> · Verified Member
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-500" />
                        <span>User Dashboard</span>
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-amber-500" />
                        <span>Admin Console</span>
                      </Link>
                    </div>

                    {/* Role quick toggle for developer evaluation */}
                    <div className="px-4 py-2 border-t border-gray-800/60 bg-gray-900/40">
                      <div className="text-[11px] text-gray-400 mb-1">Switch Account View:</div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            switchDemoRole('creator');
                            setProfileDropdownOpen(false);
                          }}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            !isAdmin
                              ? 'bg-amber-500 text-black font-semibold'
                              : 'bg-gray-800 text-gray-300 hover:text-white'
                          }`}
                        >
                          Creator
                        </button>
                        <button
                          onClick={() => {
                            switchDemoRole('admin');
                            setProfileDropdownOpen(false);
                          }}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            isAdmin
                              ? 'bg-amber-500 text-black font-semibold'
                              : 'bg-gray-800 text-gray-300 hover:text-white'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-gray-800">
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-red-300 hover:text-red-200 hover:bg-red-950/30 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-500/20"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-[#0a0a0a] px-4 py-5 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-3 text-base font-medium">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-amber-400 transition-colors py-1"
            >
              Rent Equipment
            </Link>
            <Link
              to="/products?type=buy"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-amber-400 transition-colors py-1"
            >
              Buy Gear
            </Link>
            <Link
              to="/products?category=Cameras"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-amber-400 transition-colors py-1"
            >
              Cameras Catalog
            </Link>
            <Link
              to="/products?category=Lenses"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-amber-400 transition-colors py-1"
            >
              Cine Lenses
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenListGearModal();
              }}
              className="text-left text-amber-400 hover:text-amber-300 font-medium py-1 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Equipment</span>
            </button>
            <div className="pt-2 border-t border-gray-800/80 flex flex-col gap-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white py-1 flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4 text-amber-500" />
                <span>My Dashboard</span>
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white py-1 flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-amber-500" />
                <span>Admin Console</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
