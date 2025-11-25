import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = getItemCount();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="text-3xl font-extrabold gradient-text group-hover:scale-105 transition-transform duration-300">
              SA Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-neutral-text-primary font-medium hover:text-primary transition-colors duration-200 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/shop" 
              className="text-neutral-text-primary font-medium hover:text-primary transition-colors duration-200 relative group"
            >
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="text-neutral-text-primary font-medium hover:text-primary transition-colors duration-200 relative group"
              >
                Admin
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative p-2.5 text-neutral-text-primary hover:text-primary transition-all duration-200 hover:bg-primary-light rounded-lg group"
            >
              <ShoppingCart size={24} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce-subtle shadow-primary">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  to="/orders"
                  className="flex items-center gap-2 text-neutral-text-primary hover:text-primary transition-colors duration-200 font-medium"
                >
                  <User size={20} strokeWidth={2} />
                  <span>Orders</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-neutral-text-primary hover:text-primary transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-neutral-text-primary hover:text-primary transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link
              to="/"
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="block py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                    setMobileMenuOpen(false);
                  }}
                  className="block py-2 text-gray-700 hover:text-blue-600 w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

