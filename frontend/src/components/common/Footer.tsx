import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  CalendarDays,
  ClipboardList,
  UserRound,
  ArrowUpRight,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

const equipmentLinks = [
  {
    label: 'Cameras',
    to: '/products?category=camera',
  },
  {
    label: 'Lenses',
    to: '/products?category=lens',
  },
  {
    label: 'Lighting',
    to: '/products?category=lighting',
  },
  {
    label: 'Accessories',
    to: '/products?category=accessory',
  },
  {
    label: 'All Equipment',
    to: '/products',
  },
];

const features = [
  {
    icon: Search,
    title: 'Explore Equipment',
    description: 'Search and filter the equipment catalog',
  },
  {
    icon: CalendarDays,
    title: 'Choose Rental Dates',
    description: 'Select your start and return dates',
  },
  {
    icon: ClipboardList,
    title: 'Manage Bookings',
    description: 'View booking status in your dashboard',
  },
  {
    icon: UserRound,
    title: 'Your Account',
    description: 'Sign in to submit and manage requests',
  },
];

const linkClass =
  'inline-flex items-center gap-1 py-1 text-gray-400 hover:text-amber-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 rounded';

export const Footer: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  const isAdmin =
    isAuthenticated && user?.role === 'admin';

  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800 text-gray-400 text-sm">
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                    <Icon
                      aria-hidden="true"
                      className="w-5 h-5"
                    />
                  </div>

                  <div>
                    <h3 className="text-white font-medium text-sm">
                      {feature.title}
                    </h3>

                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="sm:col-span-2 space-y-4">
            <Link
              to="/"
              aria-label="Camera and Gear home"
              className="inline-flex items-center gap-2 text-white"
            >
              <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-black">
                C
              </span>

              <span className="font-display tracking-wider uppercase text-lg font-bold">
                Camera{' '}
                <span className="text-amber-500">&amp;</span>{' '}
                Gear
              </span>
            </Link>

            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Browse cameras, lenses, lighting and accessories
              for rental or purchase. Choose equipment and
              manage your booking requests from one account.
            </p>

            <Link
              to="/products"
              className={`${linkClass} text-sm font-medium`}
            >
              Browse Equipment
              <ArrowUpRight
                aria-hidden="true"
                className="w-4 h-4"
              />
            </Link>
          </div>

          <nav aria-label="Footer equipment categories">
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Equipment
            </h3>

            <ul className="space-y-2 text-sm">
              {equipmentLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={linkClass}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer shopping links">
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Rentals &amp; Purchases
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/products?type=rent"
                  className={linkClass}
                >
                  Rent Equipment
                </Link>
              </li>

              <li>
                <Link
                  to="/products?type=buy"
                  className={linkClass}
                >
                  Buy Equipment
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className={linkClass}
                >
                  View Cart
                </Link>
              </li>

              <li>
                <Link
                  to={
                    isAuthenticated
                      ? '/dashboard'
                      : '/login'
                  }
                  className={linkClass}
                >
                  {isAuthenticated
                    ? 'My Bookings'
                    : 'Sign In to View Bookings'}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Footer account links">
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Account
            </h3>

            <ul className="space-y-2 text-sm">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className={linkClass}
                    >
                      Dashboard
                    </Link>
                  </li>

                  {isAdmin && (
                    <li>
                      <Link
                        to="/admin"
                        className={linkClass}
                      >
                        Admin Panel
                      </Link>
                    </li>
                  )}
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className={linkClass}
                    >
                      Log In
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/register"
                      className={linkClass}
                    >
                      Create Account
                    </Link>
                  </li>
                </>
              )}

              <li>
                <Link
                  to="/"
                  className={linkClass}
                >
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 border border-gray-800 rounded-xl bg-[#111827] p-5">
          <h3 className="text-white text-sm font-semibold mb-2">
            Before You Book
          </h3>

          <p className="text-xs text-gray-400 leading-relaxed">
            Equipment availability and final pricing are
            checked when you submit a booking request.
            Requests remain pending until confirmed by an
            administrator. You can view the latest status
            in your dashboard.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Camera &amp; Gear.
          </p>

          <Link
            to="/products"
            className="hover:text-amber-400 transition-colors"
          >
            Explore the Equipment Catalog
          </Link>
        </div>
      </div>
    </footer>
  );
};