import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ChatWidget from './components/ChatWidget';
import PageTransition from './components/PageTransition';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

import BulkOrders from './pages/BulkOrders';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import FarmOperations from './pages/FarmOperations';

// Route guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ManagerRoute from './components/ManagerRoute';

// ── Routes that use the full-viewport "dashboard" layout (no footer) ──────────
const DASHBOARD_ROUTES = ['/admin', '/operations'];

// ── Inner layout — needs useLocation so it must live inside <Router> ──────────
const AppLayout = () => {
  const location = useLocation();
  const isDashboard = DASHBOARD_ROUTES.some((r) => location.pathname.startsWith(r));

  return (
    <div
      className={`flex flex-col font-sans text-mountain-brown selection:bg-mountain-gold selection:text-white ${
        isDashboard ? 'h-screen overflow-hidden' : 'min-h-screen bg-mountain-sand'
      }`}
    >
      {/* ── Persistent chrome ───────────────────────────────────────────── */}
      <Navbar />
      <CartDrawer />

      {/* Hide the live-chat bubble on dashboard routes — it clutters the UI */}
      {!isDashboard && <ChatWidget />}

      {/* ── Animated page content ───────────────────────────────────────── */}
      <main className={isDashboard ? 'flex-1 overflow-y-auto' : 'flex-grow'}>
        <AnimatePresence mode="wait" initial={false}>
          {/*
           * AnimatePresence needs a SINGLE child whose `key` changes on
           * navigation, so we render Routes inside the motion wrapper here.
           * The key is passed to PageTransition inside each route element.
           */}
          <Routes location={location} key={location.pathname}>

            {/* ── Public pages (with footer) ──────────────────────────── */}
            <Route path="/"             element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about"        element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact"      element={<PageTransition><Contact /></PageTransition>} />

            <Route path="/bulk-orders"  element={<PageTransition><BulkOrders /></PageTransition>} />
            <Route path="/login"        element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register"     element={<PageTransition><Register /></PageTransition>} />

            {/* ── Authenticated pages ─────────────────────────────────── */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageTransition><Dashboard /></PageTransition>
                </ProtectedRoute>
              }
            />

            {/* ── Dashboard routes (no footer, full-viewport) ─────────── */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  {/* No PageTransition wrapper — Admin has its own internal transitions */}
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/operations"
              element={
                <ManagerRoute>
                  <FarmOperations />
                </ManagerRoute>
              }
            />

          </Routes>
        </AnimatePresence>
      </main>

      {/* ── Footer — hidden on dashboard routes ─────────────────────────── */}
      {!isDashboard && <Footer />}

      {/* ── Global notifications ─────────────────────────────────────────── */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.875rem',
            borderRadius: '0.75rem',
            boxShadow: '0 8px 30px -4px rgb(0 0 0 / 0.15)',
          },
          success: {
            iconTheme: { primary: '#22C55E', secondary: '#fff' },
            style: { background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#fff' },
            style: { background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' },
          },
        }}
      />
    </div>
  );
};

// ── Root — providers wrap everything ─────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppLayout />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
