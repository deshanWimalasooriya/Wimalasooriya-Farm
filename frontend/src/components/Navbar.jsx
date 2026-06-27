import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon, ShoppingCart, LogOut, LayoutDashboard, Package, ShoppingBag, Gauge } from 'lucide-react';
import { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { getCartCount, setIsCartOpen } = useContext(CartContext);
  const dropdownRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); setDropdownOpen(false); }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/bulk-orders', label: 'Bulk Orders' },
    { to: '/contact', label: 'Contact' },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.92, y: -8 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 380, damping: 28, mass: 0.7 }
    },
    exit: {
      opacity: 0,
      scale: 0.93,
      y: -6,
      transition: { duration: 0.15, ease: 'easeIn' }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.04, duration: 0.2, ease: 'easeOut' }
    })
  };

  const mobileMenuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
    exit:    { height: 0, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  return (
    <nav className="bg-mountain-sand shadow-sm border-b border-mountain-gray/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <motion.img
                src="/logo.png"
                alt="Wimalasooriya Farms"
                className="h-14 w-14 object-contain drop-shadow-sm"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              />
              <span className="ml-2 font-bold text-xl text-mountain-brown tracking-tight hidden sm:block">
                Wimalasooriya <span className="text-mountain-moss font-light">Farms</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`font-medium transition-colors duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:bg-mountain-moss after:transition-all after:duration-300 ${
                  location.pathname === to
                    ? 'text-mountain-moss after:w-full'
                    : 'text-mountain-brown hover:text-mountain-moss after:w-0 hover:after:w-full'
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-mountain-brown hover:text-mountain-moss transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              <AnimatePresence>
                {getCartCount() > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute -top-1 -right-1 bg-mountain-gold text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {getCartCount()}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Auth Area */}
            {user ? (
              <div ref={dropdownRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border-2 border-mountain-gold/40 hover:border-mountain-gold bg-mountain-sand hover:bg-mountain-gold/10 transition-all duration-200"
                >
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      className="w-7 h-7 rounded-full object-cover border border-mountain-gold/20"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-mountain-gold text-white flex items-center justify-center font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-mountain-brown hidden lg:block max-w-[90px] truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="profile-dropdown"
                      style={{ zIndex: 100 }}
                    >
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-[#DDE3EC] bg-[#F0F4F8]">
                        <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider">Signed in as</p>
                        <p className="font-bold text-[#1A2B4A] truncate mt-0.5">{user.name}</p>
                        <p className="text-xs text-[#94A3B8] truncate">{user.email}</p>
                      </div>

                      <div className="py-1.5">
                        {[
                          { to: '/dashboard', icon: UserIcon,       label: 'Profile' },
                          { to: '/dashboard', icon: Package,         label: 'My Orders' },
                          { action: () => { setIsCartOpen(true); setDropdownOpen(false); }, icon: ShoppingBag, label: 'Cart' },
                        ].map(({ to, icon: Icon, label, action }, i) => (
                          <motion.div key={label} custom={i} variants={itemVariants} initial="hidden" animate="visible">
                            {to ? (
                              <Link to={to} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                <Icon className="w-4 h-4 text-[#6FA3CC]" /> {label}
                              </Link>
                            ) : (
                              <button className="dropdown-item w-full" onClick={action}>
                                <Icon className="w-4 h-4 text-[#6FA3CC]" /> {label}
                              </button>
                            )}
                          </motion.div>
                        ))}

                        {(user.isAdmin || user.isManager) && (
                          <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                            <div className="mx-3 my-1.5 border-t border-[#DDE3EC]" />
                            <Link
                              to="/operations"
                              className="dropdown-item font-semibold"
                              style={{ color: '#4A90D9' }}
                              onClick={() => setDropdownOpen(false)}
                            >
                              <Gauge className="w-4 h-4" /> Farm Dashboard
                            </Link>
                          </motion.div>
                        )}

                        <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible">
                          <div className="mx-3 my-1.5 border-t border-[#DDE3EC]" />
                          <button
                            className="dropdown-item danger w-full"
                            onClick={() => { logout(); setDropdownOpen(false); }}
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4 border-l border-mountain-gray/20 pl-4">
                <Link to="/login" className="text-mountain-brown hover:text-mountain-moss font-medium transition-colors">
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-mountain-moss text-white rounded-lg font-medium hover:bg-mountain-brown transition-all duration-300 shadow-lg shadow-mountain-moss/30 transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="text-mountain-brown hover:text-mountain-moss transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden overflow-hidden w-full bg-mountain-sand border-b border-mountain-gray/20"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 shadow-lg">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`block px-3 py-2.5 font-medium rounded-lg transition-colors ${
                    location.pathname === to
                      ? 'bg-mountain-gold/20 text-mountain-moss'
                      : 'text-mountain-brown hover:bg-mountain-gold/10'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={() => { setIsCartOpen(true); setIsOpen(false); }}
                className="block w-full text-left px-3 py-2.5 text-mountain-brown font-medium hover:bg-mountain-gold/10 rounded-lg flex items-center justify-between"
              >
                Shopping Cart
                {getCartCount() > 0 && (
                  <span className="bg-mountain-gold text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {getCartCount()}
                  </span>
                )}
              </button>
              <div className="my-2 border-t border-mountain-gray/20" />
              {user ? (
                <>
                  <Link to="/dashboard" className="block px-3 py-2.5 text-mountain-moss font-bold hover:bg-mountain-gold/10 rounded-lg">
                    My Dashboard
                  </Link>
                  {(user.isAdmin || user.isManager) && (
                    <Link to="/operations" className="block px-3 py-2.5 text-blue-600 font-bold hover:bg-blue-50 rounded-lg">
                      Farm Operations
                    </Link>
                  )}
                  <button onClick={logout} className="block w-full text-left px-3 py-2.5 text-red-500 font-medium hover:bg-red-50 rounded-lg">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2.5 text-mountain-brown font-medium hover:bg-mountain-gold/10 rounded-lg">Log In</Link>
                  <Link to="/register" className="block px-3 py-2.5 text-mountain-moss font-bold hover:bg-mountain-gold/10 rounded-lg">Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
