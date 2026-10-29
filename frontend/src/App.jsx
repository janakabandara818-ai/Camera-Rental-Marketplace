import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';

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

function NotFoundPage() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="flex min-h-[65vh] items-center justify-center px-4 py-16"
    >
      <div className="max-w-xl text-center">
        <p className="mb-4 text-7xl font-bold text-amber-400 sm:text-8xl">
          404
        </p>

        <h1
          id="not-found-title"
          className="mb-4 text-3xl font-bold text-white"
        >
          Page Not Found
        </h1>

        <p className="mb-8 leading-relaxed text-gray-400">
          The page you are looking for could not be found.
          Check the address or explore our equipment catalog.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition-colors hover:bg-amber-400"
          >
            Back to Home
          </Link>

          <Link
            to="/products"
            className="rounded-lg border border-gray-600 bg-[#1F2937] px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-700"
          >
            Browse Equipment
          </Link>
        </div>
      </div>
    </section>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register';

  const handleManageGear = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    navigate(isAdmin ? '/admin' : '/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#111827] text-white">
      {!isAuthPage && (
        <Navbar onOpenListGearModal={handleManageGear} />
      )}

      <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/products"
            element={<ProductsPage />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetailPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

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

          <Route
            path="/cart"
            element={<CartCheckoutPage />}
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CartCheckoutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}