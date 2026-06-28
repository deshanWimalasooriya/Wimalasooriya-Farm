import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon, ShoppingCart, LogOut, LayoutDashboard, Package, ShoppingBag, Gauge } from 'lucide-react';
import { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { NotificationContext } from '../context/NotificationContext';
import { Bell, CheckCheck } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { getCartCount, setIsCartOpen } = useContext(CartContext);
  const { notifications, markAsRead, markAllAsRead } = useContext(NotificationContext);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const unreadCount = notifications ? notifications.filter(n => !n.isRead).length : 0;

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); setDropdownOpen(false); setNotificationsOpen(false); }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
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
    <nav
      className="sticky top-0 z-50 shadow-sm"
      style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid rgba(108,111,110,0.15)' }}
    >
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
              <span className="ml-2 font-bold text-xl tracking-tight hidden sm:block" style={{ color: '#013547' }}>
                Wimalasooriya <span className="font-light" style={{ color: '#6C6F6E' }}>Farms</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="font-medium transition-colors duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:transition-all after:duration-300"
                style={{
                  color: location.pathname === to ? '#013547' : '#6C6F6E',
                  '--tw-after-bg': '#DDBA9B',
                }}
              >
                <span
                  className="relative"
                  style={{ color: location.pathname === to ? '#013547' : '#6C6F6E' }}
                >
                  {label}
                  {/* Active / hover underline */}
                  <span
                    className="absolute left-0 bottom-[-4px] h-[2px] rounded-full transition-all duration-300"
                    style={{
                      width: location.pathname === to ? '100%' : '0%',
                      backgroundColor: '#DDBA9B',
                    }}
                  />
                </span>
              </Link>
            ))}

            {/* Notifications */}
            {user && (
              <div ref={notificationsRef} className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 transition-colors rounded-lg"
                  style={{ color: '#013547' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(1,53,71,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Bell className="w-6 h-6" style={{ color: '#013547' }} />
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.span
                        key="bell-badge"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="absolute -top-1 -right-1 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center bg-red-500"
                      >
                        {unreadCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border overflow-hidden"
                      style={{ borderColor: 'rgba(108,111,110,0.15)', zIndex: 100 }}
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                        <span className="font-bold text-[#013547]">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-xs text-[#013547] hover:underline font-semibold flex items-center gap-1">
                            <CheckCheck className="w-3 h-3" /> Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {!notifications || notifications.length === 0 ? (
                          <p className="p-4 text-center text-sm text-[#6C6F6E]">No notifications.</p>
                        ) : (
                          notifications.map((n) => (
                            <button
                              key={n._id}
                              onClick={() => { if(!n.isRead) markAsRead(n._id); }}
                              className={`w-full text-left p-4 border-b transition-colors ${!n.isRead ? 'bg-blue-50/50' : 'bg-white hover:bg-gray-50'}`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <p className={`text-sm ${!n.isRead ? 'font-bold text-[#013547]' : 'text-[#6C6F6E]'}`}>
                                  {n.message}
                                </p>
                                {!n.isRead && <span className="w-2 h-2 rounded-full bg-red-500 mt-1 flex-shrink-0" />}
                              </div>
                              <p className="text-[10px] text-[#6C6F6E] mt-2 font-medium uppercase tracking-wider">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </p>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 transition-colors rounded-lg"
              style={{ color: '#013547' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(1,53,71,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <ShoppingCart className="w-6 h-6" style={{ color: '#013547' }} />
              <AnimatePresence>
                {getCartCount() > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute -top-1 -right-1 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#DDBA9B', color: '#013547' }}
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
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border-2 transition-all duration-200"
                  style={{
                    borderColor: 'rgba(221,186,155,0.50)',
                    backgroundColor: 'rgba(221,186,155,0.08)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#DDBA9B';
                    e.currentTarget.style.backgroundColor = 'rgba(221,186,155,0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(221,186,155,0.50)';
                    e.currentTarget.style.backgroundColor = 'rgba(221,186,155,0.08)';
                  }}
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border"
                      style={{ borderColor: 'rgba(221,186,155,0.30)' }}
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm"
                      style={{ backgroundColor: '#DDBA9B', color: '#013547' }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-semibold hidden lg:block max-w-[90px] truncate" style={{ color: '#013547' }}>
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
                      <div
                        className="px-4 py-3 border-b"
                        style={{ backgroundColor: '#D0D8DF', borderColor: 'rgba(108,111,110,0.20)' }}
                      >
                        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#6C6F6E' }}>Signed in as</p>
                        <p className="font-bold truncate mt-0.5" style={{ color: '#013547' }}>{user.name}</p>
                        <p className="text-xs truncate" style={{ color: '#6C6F6E' }}>{user.email}</p>
                      </div>

                      <div className="py-1.5">
                        {[
                          { to: '/dashboard', icon: UserIcon,    label: 'Profile' },
                          { to: '/dashboard', icon: Package,      label: 'My Orders' },
                          { action: () => { setIsCartOpen(true); setDropdownOpen(false); }, icon: ShoppingBag, label: 'Cart' },
                        ].map(({ to, icon: Icon, label, action }, i) => (
                          <motion.div key={label} custom={i} variants={itemVariants} initial="hidden" animate="visible">
                            {to ? (
                              <Link to={to} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                <Icon className="w-4 h-4" style={{ color: '#013547' }} /> {label}
                              </Link>
                            ) : (
                              <button className="dropdown-item w-full" onClick={action}>
                                <Icon className="w-4 h-4" style={{ color: '#013547' }} /> {label}
                              </button>
                            )}
                          </motion.div>
                        ))}

                        {(user.isAdmin || user.isManager) && (
                          <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                            <div className="mx-3 my-1.5 border-t" style={{ borderColor: 'rgba(108,111,110,0.20)' }} />
                            <Link
                              to="/operations"
                              className="dropdown-item font-semibold"
                              style={{ color: '#DDBA9B' }}
                              onClick={() => setDropdownOpen(false)}
                            >
                              <Gauge className="w-4 h-4" style={{ color: '#DDBA9B' }} /> Farm Dashboard
                            </Link>
                          </motion.div>
                        )}

                        <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible">
                          <div className="mx-3 my-1.5 border-t" style={{ borderColor: 'rgba(108,111,110,0.20)' }} />
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
              <div className="flex items-center space-x-4 border-l pl-4" style={{ borderColor: 'rgba(108,111,110,0.20)' }}>
                <Link
                  to="/login"
                  className="font-medium transition-colors"
                  style={{ color: '#6C6F6E' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#013547'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#6C6F6E'; }}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg transform hover:-translate-y-0.5"
                  style={{ backgroundColor: '#013547', color: '#ffffff', boxShadow: '0 8px 20px -4px rgba(1,53,71,0.30)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#DDBA9B'; e.currentTarget.style.color = '#013547'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#013547'; e.currentTarget.style.color = '#ffffff'; }}
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
              className="transition-colors"
              style={{ color: '#013547' }}
            >
              {isOpen ? <X className="h-6 w-6" style={{ color: '#013547' }} /> : <Menu className="h-6 w-6" style={{ color: '#013547' }} />}
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
            className="md:hidden overflow-hidden w-full"
            style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid rgba(108,111,110,0.15)' }}
          >
            <div className="px-4 pt-2 pb-6 space-y-1 shadow-lg">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="block px-3 py-2.5 font-medium rounded-lg transition-colors"
                  style={{
                    backgroundColor: location.pathname === to ? 'rgba(221,186,155,0.18)' : 'transparent',
                    color: location.pathname === to ? '#013547' : '#6C6F6E',
                  }}
                >
                  {label}
                </Link>
              ))}

              <button
                onClick={() => { setIsCartOpen(true); setIsOpen(false); }}
                className="flex w-full text-left px-3 py-2.5 font-medium rounded-lg items-center justify-between transition-colors"
                style={{ color: '#013547' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(1,53,71,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                Shopping Cart
                {getCartCount() > 0 && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#DDBA9B', color: '#013547' }}
                  >
                    {getCartCount()}
                  </span>
                )}
              </button>

              <div className="my-2 border-t" style={{ borderColor: 'rgba(108,111,110,0.20)' }} />

              {user ? (
                <>
                  <Link to="/dashboard" className="block px-3 py-2.5 font-bold rounded-lg" style={{ color: '#013547' }}>
                    My Dashboard
                  </Link>
                  {(user.isAdmin || user.isManager) && (
                    <Link to="/operations" className="block px-3 py-2.5 font-bold rounded-lg" style={{ color: '#DDBA9B' }}>
                      Farm Operations
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-3 py-2.5 font-medium rounded-lg text-red-500 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2.5 font-medium rounded-lg" style={{ color: '#6C6F6E' }}>
                    Log In
                  </Link>
                  <Link to="/register" className="block px-3 py-2.5 font-bold rounded-lg" style={{ color: '#013547' }}>
                    Sign Up
                  </Link>
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
