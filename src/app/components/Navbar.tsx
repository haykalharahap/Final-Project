import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { ShoppingCart, User, Menu, X, LogOut, Shield, Home, UtensilsCrossed, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { state } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-orange-600">Singgah Kita</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link to="/" className={`font-medium transition ${isActive('/') ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'}`}>Home</Link>
            <Link to="/menu" className={`font-medium transition ${isActive('/menu') ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'}`}>Menu</Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                    <Shield className="w-4 h-4" /> Admin
                  </Link>
                )}
                <Link to="/profile" className={`font-medium transition ${isActive('/profile') ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'}`}>Profile</Link>
                <div className="relative">
                  <Link to="/cart" className="text-gray-700 hover:text-orange-600">
                    <ShoppingCart className="w-6 h-6" />
                    {state.items.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {state.items.length}
                      </span>
                    )}
                  </Link>
                </div>
                <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 transition" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition font-medium">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/cart" className="text-gray-700 relative">
              <ShoppingCart className="w-6 h-6" />
              {state.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {state.items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-orange-600 focus:outline-none p-1"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      {isOpen && (
        <>
          <div className="md:hidden fixed inset-0 top-16 bg-black/40 z-40" onClick={() => setIsOpen(false)} />
          <div className="md:hidden fixed inset-x-0 top-16 bg-white border-t border-gray-100 z-50 shadow-xl animate-in slide-in-from-top-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${isActive('/') ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                <Home className="w-5 h-5" /> Home
              </Link>
              <Link to="/menu" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${isActive('/menu') ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                <UtensilsCrossed className="w-5 h-5" /> Menu
              </Link>
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-purple-600 hover:bg-purple-50 transition">
                      <Shield className="w-5 h-5" /> Admin Panel
                    </Link>
                  )}
                  <Link to="/profile" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${isActive('/profile') ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <UserCircle className="w-5 h-5" /> Profile
                  </Link>
                  <div className="border-t border-gray-100 my-2" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center justify-center gap-2 mt-2 bg-orange-600 text-white px-4 py-3 rounded-xl text-base font-medium hover:bg-orange-700 transition">
                  Login
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
