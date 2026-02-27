import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ShoppingCart, User, Menu, X, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { state } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-orange-600">Singgah Kita</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium">Home</Link>
            <Link to="/menu" className="text-gray-700 hover:text-orange-600 font-medium">Menu</Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                    <Shield className="w-4 h-4" /> Admin
                  </Link>
                )}
                <Link to="/profile" className="text-gray-700 hover:text-orange-600 font-medium">Profile</Link>
                <div className="relative">
                  <Link to="/cart" className="text-gray-700 hover:text-orange-600">
                    <ShoppingCart className="w-6 h-6" />
                    {state.items.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {state.items.length}
                      </span>
                    )}
                  </Link>
                </div>
                <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">
                  <LogOut className="w-6 h-6" />
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="mr-4 text-gray-700 relative">
              <ShoppingCart className="w-6 h-6" />
              {state.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-orange-600 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50">Home</Link>
            <Link to="/menu" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50">Menu</Link>
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-purple-600 hover:bg-purple-50">Admin Panel</Link>
                )}
                <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50">Profile</Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-orange-600 hover:bg-orange-50">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
