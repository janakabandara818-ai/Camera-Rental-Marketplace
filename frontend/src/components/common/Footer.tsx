import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Clock, Headphones } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800 text-gray-400 text-sm">
      {/* Trust & Guarantee Strip */}
      <div className="border-b border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium text-xs sm:text-sm">Certified Tech Inspection</h4>
                <p className="text-xs text-gray-500 mt-0.5">Sensors cleaned, firmware up-to-date</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium text-xs sm:text-sm">Nationwide Dispatch</h4>
                <p className="text-xs text-gray-500 mt-0.5">Early morning on-set delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium text-xs sm:text-sm">Flexible Shoot Windows</h4>
                <p className="text-xs text-gray-500 mt-0.5">Free Sunday pickup & prep day</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium text-xs sm:text-sm">24/7 Cine Support</h4>
                <p className="text-xs text-gray-500 mt-0.5">Live emergency technician line</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-mono text-sm font-black">
                C
              </span>
              <span className="font-display tracking-wider uppercase text-lg">
                Camera <span className="text-amber-500">&amp;</span> Gear
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed">
              Camera & Equipment Rental and Marketplace. Providing verified cinema cameras, matched prime optics, studio lighting, and audio solutions to film crews and creators worldwide.
            </p>
            <div className="pt-2 text-xs text-gray-500">
              Offices & Vault Hubs: Los Angeles · New York · Atlanta · Chicago · London
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Rental Inventory</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products?category=Cameras" className="hover:text-amber-400 transition-colors">Cinema Cameras</Link></li>
              <li><Link to="/products?category=Lenses" className="hover:text-amber-400 transition-colors">Prime & Zoom Lenses</Link></li>
              <li><Link to="/products?category=Lighting" className="hover:text-amber-400 transition-colors">Studio LED & Tube Kits</Link></li>
              <li><Link to="/products?category=Stabilizers" className="hover:text-amber-400 transition-colors">Gimbals & 4D Systems</Link></li>
              <li><Link to="/products?category=Audio" className="hover:text-amber-400 transition-colors">Field Recorders & Shotguns</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">For Filmmakers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products?type=buy" className="hover:text-amber-400 transition-colors">Certified Pre-Owned Store</Link></li>
              <li><Link to="/dashboard?tab=rentals" className="hover:text-amber-400 transition-colors">Manage Active Rentals</Link></li>
              <li><Link to="/dashboard?tab=orders" className="hover:text-amber-400 transition-colors">Order Tracking</Link></li>
              <li><Link to="/dashboard?tab=wishlist" className="hover:text-amber-400 transition-colors">Equipment Wishlist</Link></li>
              <li><Link to="/admin" className="hover:text-amber-400 transition-colors">Vendor Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Protection & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li className="text-gray-400">Damage Waiver Coverage</li>
              <li className="text-gray-400">COI Certificate Verification</li>
              <li className="text-gray-400">ID Verification Policy</li>
              <li className="text-gray-400">Security Deposit Escrow</li>
              <li className="text-gray-400">Terms of Equipment Rental</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} Camera & Equipment Rental and Marketplace Camera & Equipment Rental and Marketplace. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
