import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EquipmentProvider } from './context/EquipmentContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { ListGearModal } from './components/common/ListGearModal';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CartCheckoutPage } from './pages/CartCheckoutPage';

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppContent() {
  const [listGearOpen, setListGearOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
    setListGearOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      setListGearOpen(false);
    }
  }, [isAuthenticated]);

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-[#111827] text-white">
      {!isAuthPage && (
        <Navbar
          onOpenListGearModal={() => setListGearOpen(true)}
        />
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="/cart" element={<CartCheckoutPage />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CartCheckoutPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}

      <ToastContainer />

      <ListGearModal
        isOpen={listGearOpen}
        onClose={() => setListGearOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <EquipmentProvider>
            <CartProvider>
              <WishlistProvider>
                <AppContent />
              </WishlistProvider>
            </CartProvider>
          </EquipmentProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}