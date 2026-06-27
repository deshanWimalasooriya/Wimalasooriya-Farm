import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, User as UserIcon, ShoppingCart, ShieldCheck, Tractor } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { getCartCount, setIsCartOpen } = useContext(CartContext);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className="bg-mountain-sand shadow-sm border-b border-mountain-gray/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-mountain-gold rounded-xl group-hover:bg-mountain-moss transition-colors duration-300">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl text-mountain-brown tracking-tight">
                Wimalasooriya <span className="text-mountain-moss font-light">Farm</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-medium transition-colors duration-300 ${location.pathname === '/' ? 'text-mountain-moss' : 'text-mountain-brown hover:text-mountain-moss'}`}>Home</Link>
            <Link to="/about" className={`font-medium transition-colors duration-300 ${location.pathname === '/about' ? 'text-mountain-moss' : 'text-mountain-brown hover:text-mountain-moss'}`}>About Us</Link>
            <Link to="/shop" className={`font-medium transition-colors duration-300 ${location.pathname === '/shop' ? 'text-mountain-moss' : 'text-mountain-brown hover:text-mountain-moss'}`}>Shop</Link>
            <Link to="/bulk-orders" className={`font-medium transition-colors duration-300 ${location.pathname === '/bulk-orders' ? 'text-mountain-moss' : 'text-mountain-brown hover:text-mountain-moss'}`}>Bulk Orders</Link>
            <Link to="/contact" className={`font-medium transition-colors duration-300 ${location.pathname === '/contact' ? 'text-mountain-moss' : 'text-mountain-brown hover:text-mountain-moss'}`}>Contact</Link>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-mountain-brown hover:text-mountain-moss transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-mountain-gold text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-fade-in">
                  {getCartCount()}
                </span>
              )}
            </button>
            
            {user ? (
              <>
                <Link to="/dashboard" className="px-5 py-2.5 bg-mountain-gold text-white rounded-lg font-medium hover:bg-mountain-moss transition-all duration-300 shadow-lg shadow-mountain-gold/30 transform hover:-translate-y-0.5 flex items-center gap-2">
                  <UserIcon className="w-4 h-4" /> Dashboard
                </Link>
                {(user.isAdmin || user.isManager) && (
                  <Link to="/operations" className="px-5 py-2.5 bg-mountain-moss/90 text-white rounded-lg font-medium hover:bg-mountain-moss transition-all duration-300 shadow-lg shadow-mountain-moss/30 transform hover:-translate-y-0.5 flex items-center gap-2">
                    <Tractor className="w-4 h-4" /> Operations
                  </Link>
                )}
                {user.isAdmin && (
                  <Link to="/admin" className="px-5 py-2.5 bg-mountain-brown text-white rounded-lg font-medium hover:bg-black transition-all duration-300 shadow-lg shadow-mountain-brown/30 transform hover:-translate-y-0.5 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Admin
                  </Link>
                )}
              </>
            ) : (
              <div className="flex items-center space-x-4 border-l border-mountain-gray/20 pl-4">
                <Link to="/login" className="text-mountain-brown hover:text-mountain-moss font-medium transition-colors">Log In</Link>
                <Link to="/register" className="px-5 py-2.5 bg-mountain-moss text-white rounded-lg font-medium hover:bg-mountain-brown transition-all duration-300 shadow-lg shadow-mountain-moss/30 transform hover:-translate-y-0.5">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-mountain-brown hover:text-mountain-moss transition-colors">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-mountain-sand border-b border-mountain-gray/20 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <Link to="/" className="block px-3 py-2 text-mountain-brown font-medium hover:bg-mountain-gold/10 rounded-lg">Home</Link>
          <Link to="/about" className="block px-3 py-2 text-mountain-brown font-medium hover:bg-mountain-gold/10 rounded-lg">About Us</Link>
          <Link to="/shop" className="block px-3 py-2 text-mountain-brown font-medium hover:bg-mountain-gold/10 rounded-lg">Shop</Link>
          <Link to="/bulk-orders" className="block px-3 py-2 text-mountain-brown font-medium hover:bg-mountain-gold/10 rounded-lg">Bulk Orders</Link>
          <Link to="/contact" className="block px-3 py-2 text-mountain-brown font-medium hover:bg-mountain-gold/10 rounded-lg">Contact</Link>
          <button 
            onClick={() => {
              setIsCartOpen(true);
              setIsOpen(false);
            }} 
            className="block w-full text-left px-3 py-2 text-mountain-brown font-medium hover:bg-mountain-gold/10 rounded-lg flex items-center justify-between"
          >
            Shopping Cart
            {getCartCount() > 0 && (
              <span className="bg-mountain-gold text-white text-xs font-bold px-2 py-1 rounded-full">
                {getCartCount()}
              </span>
            )}
          </button>
          <div className="my-2 border-t border-mountain-gray/20"></div>
          {user && user.isAdmin && (
            <Link to="/admin" className="block px-3 py-2 text-mountain-moss font-bold hover:bg-mountain-gold/10 rounded-lg">Admin Panel</Link>
          )}
          {user ? (
            <Link to="/dashboard" className="block px-3 py-2 text-mountain-moss font-bold hover:bg-mountain-gold/10 rounded-lg">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 text-mountain-brown font-medium hover:bg-mountain-gold/10 rounded-lg">Log In</Link>
              <Link to="/register" className="block px-3 py-2 text-mountain-moss font-bold hover:bg-mountain-gold/10 rounded-lg">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
