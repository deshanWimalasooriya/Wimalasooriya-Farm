import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  LayoutDashboard, PackageSearch, ListOrdered, DollarSign, Users,
  ShoppingBag, MessageSquare, Send, Shield, TrendingUp, BarChart3, UserCog, Settings,
  MapPin, Phone, Mail, Building2, Calendar, ImagePlus, Save, Loader2, PackageOpen, X
} from 'lucide-react';
import io from 'socket.io-client';
import WorkerManagement from '../components/admin/WorkerManagement';
import AnalysisDashboard from '../components/admin/AnalysisDashboard';

const pageVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

// ── Styled field wrapper for Settings ──────────────────────────────────────
const SettingsField = ({ label, icon: Icon, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#6C6F6E' }}>
      <Icon className="w-3.5 h-3.5" style={{ color: '#013547' }} />
      {label}
    </label>
    {children}
  </div>
);

const inputCls = "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2";
const inputStyle = { borderColor: 'rgba(108,111,110,0.30)', color: '#013547', backgroundColor: '#FFFFFF' };

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Bulk Orders State
  const [bulkOrders, setBulkOrders] = useState([]);
  const [rejectModalOrder, setRejectModalOrder] = useState(null);
  const [rejectMessage, setRejectMessage] = useState('');

  // ── Company Settings state ──────────────────────────────────────────────
  const [companySettings, setCompanySettings] = useState({
    name: '', logoUrl: '', email: '', phone: '',
    address: '', businessRegNumber: '', startDate: '',
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');
  const logoInputRef = useRef(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5001');
    socketRef.current.emit('join_room', 'admin_room');
    socketRef.current.on('receive_message', (message) => {
      setChatMessages((prev) => [...prev, message]);
    });
    return () => { socketRef.current.disconnect(); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => { fetchAdminData(); }, [activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (activeTab === 'overview') {
        const res = await axios.get('/api/admin/analytics', config);
        setAnalytics(res.data);
      } else if (activeTab === 'orders') {
        const res = await axios.get('/api/admin/orders', config);
        setOrders(res.data);
      } else if (activeTab === 'products') {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } else if (activeTab === 'bulkOrders') {
        const res = await axios.get('/api/orders/bulk', config);
        setBulkOrders(res.data);
      } else if (activeTab === 'cms') {
        const res = await axios.get('/api/admin/users', config);
        setUsersList(res.data);
      } else if (activeTab === 'settings') {
        const res = await axios.get('/api/company');
        const d = res.data;
        setCompanySettings({
          name: d.name || '',
          logoUrl: d.logoUrl || '',
          email: d.email || '',
          phone: d.phone || '',
          address: d.address || '',
          businessRegNumber: d.businessRegNumber || '',
          startDate: d.startDate ? d.startDate.split('T')[0] : '',
        });
        setLogoPreview(d.logoUrl || '');
      }
    } catch {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBulkOrderStatus = async (id, status, adminMessage = '') => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/bulk/${id}/status`, { status, adminMessage }, config);
      toast.success(`Bulk order ${status.toLowerCase()}`);
      if (status === 'Rejected') {
        setRejectModalOrder(null);
        setRejectMessage('');
      }
      fetchAdminData();
    } catch (e) {
      toast.error('Failed to update bulk order');
    }
  };

  const handleProductUpdate = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/admin/products/${editingProduct._id}`, {
        price: Number(editingProduct.price),
        discountPercentage: Number(editingProduct.discountPercentage)
      }, config);
      toast.success('Product updated!');
      setEditingProduct(null);
      fetchAdminData();
    } catch { toast.error('Failed to update product'); }
  };

  const handleUserClick = async (u) => {
    setActiveChatUser(u);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`/api/chat/${u._id}`, config);
      setChatMessages(res.data);
    } catch (e) { console.error(e); }
  };

  const sendAdminMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatUser) return;
    const messageData = {
      sender: user._id, receiver: activeChatUser._id,
      content: chatInput, isAdminMessage: true,
      createdAt: new Date().toISOString()
    };
    setChatMessages((prev) => [...prev, messageData]);
    setChatInput('');
    socketRef.current.emit('send_message', { room: activeChatUser._id, message: messageData });
    socketRef.current.emit('send_message', { room: 'admin_room', message: messageData });
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/chat', messageData, config);
    } catch (e) { console.error(e); }
  };

  // ── Save company settings ───────────────────────────────────────────────
  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.put('/api/company', companySettings, config);
      setLogoPreview(res.data.logoUrl || '');
      toast.success('Company settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleLogoUrlChange = (val) => {
    setCompanySettings(s => ({ ...s, logoUrl: val }));
    setLogoPreview(val);
  };

  // ── Nav items ──────────────────────────────────────────────────────────────
  const navItems = [
    { id: 'overview',  icon: LayoutDashboard, label: 'Overview'     },
    { id: 'analysis',  icon: BarChart3,       label: 'Analysis'     },
    { id: 'workers',   icon: UserCog,         label: 'Workers'      },
    { id: 'products',  icon: PackageSearch,   label: 'Products'     },
    { id: 'orders',    icon: ListOrdered,     label: 'All Orders'   },
    { id: 'bulkOrders',icon: PackageOpen,     label: 'Bulk Orders'  },
    { id: 'cms',       icon: MessageSquare,   label: 'CMS & Chat'   },
    { id: 'settings',  icon: Settings,        label: 'Settings'     },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] relative" style={{ backgroundColor: '#EBEBEB' }}>

      <div className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-6">

          {/* ── LEFT Sidebar Nav ───────────────────────────────────────────── */}
          <div className="w-full md:w-60 shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="sticky top-24"
            >
              {/* Brand Header */}
              <div
                className="rounded-2xl p-5 mb-3 border shadow-xl"
                style={{ background: '#013547', borderColor: 'rgba(221,186,155,0.25)' }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#DDBA9B' }}>
                    <Shield className="w-5 h-5" style={{ color: '#013547' }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight" style={{ color: '#DDBA9B' }}>Admin Panel</p>
                    <p className="text-[11px] truncate" style={{ color: 'rgba(221,186,155,0.60)' }}>{user?.name}</p>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <div
                className="rounded-2xl p-2.5 border shadow-xl"
                style={{ background: '#013547', borderColor: 'rgba(221,186,155,0.15)' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: 'rgba(221,186,155,0.50)' }}>Navigation</p>
                <nav className="space-y-0.5">
                  {navItems.map(({ id, icon: Icon, label }) => (
                    <motion.button
                      key={id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveTab(id)}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all text-sm"
                      style={{
                        backgroundColor: activeTab === id ? '#DDBA9B' : 'transparent',
                        color: activeTab === id ? '#013547' : 'rgba(221,186,155,0.65)',
                      }}
                      onMouseEnter={e => {
                        if (activeTab !== id) {
                          e.currentTarget.style.backgroundColor = 'rgba(221,186,155,0.10)';
                          e.currentTarget.style.color = '#DDBA9B';
                        }
                      }}
                      onMouseLeave={e => {
                        if (activeTab !== id) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'rgba(221,186,155,0.65)';
                        }
                      }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {label}
                      {activeTab === id && (
                        <motion.div
                          layoutId="admin-active-pip"
                          className="ml-auto w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: '#013547' }}
                        />
                      )}
                    </motion.button>
                  ))}
                </nav>
              </div>
            </motion.div>
          </div>

          {/* ── Main Content ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-5"
            >
              <h1 className="text-2xl font-bold" style={{ color: '#013547' }}>
                {navItems.find(n => n.id === activeTab)?.label}
              </h1>
              <p className="text-sm" style={{ color: '#6C6F6E' }}>Wimalasooriya Farm — Admin Control Centre</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="rounded-2xl p-12 text-center border shadow-xl"
                  style={{ background: 'rgba(255,255,255,0.95)', borderColor: 'rgba(1,53,71,0.10)' }}
                >
                  <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#DDBA9B', borderTopColor: 'transparent' }} />
                  <p className="font-medium" style={{ color: '#013547' }}>Loading admin data…</p>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  variants={pageVariants}
                  initial="hidden" animate="visible" exit="exit"
                  className="space-y-5"
                >

                  {/* ── ANALYSIS ────────────────────────────────────────── */}
                  {activeTab === 'analysis' && <AnalysisDashboard />}

                  {/* ── WORKERS ─────────────────────────────────────────── */}
                  {activeTab === 'workers' && <WorkerManagement />}

                  {/* ── OVERVIEW ────────────────────────────────────────── */}
                  {activeTab === 'overview' && analytics && (
                    <>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { icon: DollarSign,  label: 'Total Revenue',  value: `$${analytics.totalRevenue?.toFixed(2)}`,  accent: '#013547', bg: 'rgba(1,53,71,0.10)'   },
                          { icon: ShoppingBag, label: 'Active Orders',  value: analytics.activeOrders,                   accent: '#DDBA9B', bg: 'rgba(221,186,155,0.18)' },
                          { icon: ListOrdered, label: 'Total Orders',   value: analytics.totalOrders,                    accent: '#013547', bg: 'rgba(1,53,71,0.10)'   },
                          { icon: Users,       label: 'Total Users',    value: analytics.totalUsers,                     accent: '#DDBA9B', bg: 'rgba(221,186,155,0.18)' },
                        ].map(({ icon: Icon, label, value, accent, bg }, i) => (
                          <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="rounded-2xl p-5 border shadow-lg"
                            style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'rgba(1,53,71,0.10)' }}
                          >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
                              <Icon className="w-5 h-5" style={{ color: accent }} />
                            </div>
                            <p className="text-sm font-medium" style={{ color: '#6C6F6E' }}>{label}</p>
                            <p className="text-2xl font-bold mt-0.5" style={{ color: '#013547' }}>{value}</p>
                          </motion.div>
                        ))}
                      </div>

                      <div className="rounded-2xl p-6 border shadow-lg" style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'rgba(1,53,71,0.10)' }}>
                        <h3 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: '#013547' }}>
                          <TrendingUp className="w-5 h-5" style={{ color: '#DDBA9B' }} /> Revenue Over Time
                        </h3>
                        <div className="h-72 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.chartData}>
                              <defs>
                                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%"  stopColor="#DDBA9B" stopOpacity={0.30} />
                                  <stop offset="95%" stopColor="#DDBA9B" stopOpacity={0.02} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6C6F6E', fontSize: 12 }} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6C6F6E', fontSize: 12 }} dx={-10} tickFormatter={(v) => `$${v}`} />
                              <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgb(0 0 0 / 0.12)', fontFamily: 'Inter' }}
                                formatter={(v) => [`$${v.toFixed(2)}`, 'Revenue']}
                              />
                              <Area type="monotone" dataKey="revenue" stroke="#DDBA9B" strokeWidth={2.5} fill="url(#revenueGrad)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="rounded-2xl p-6 border shadow-lg" style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'rgba(1,53,71,0.10)' }}>
                        <h3 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: '#013547' }}>
                          <ListOrdered className="w-5 h-5" style={{ color: '#013547' }} /> Orders Volume
                        </h3>
                        <div className="h-72 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.chartData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6C6F6E', fontSize: 12 }} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6C6F6E', fontSize: 12 }} dx={-10} />
                              <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgb(0 0 0 / 0.12)', fontFamily: 'Inter' }}
                                cursor={{ fill: 'rgba(221,186,155,0.10)' }}
                              />
                              <Bar dataKey="orders" fill="#013547" radius={[6, 6, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── PRODUCTS ────────────────────────────────────────── */}
                  {activeTab === 'products' && (
                    <div className="rounded-2xl p-6 border shadow-lg" style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'rgba(1,53,71,0.10)' }}>
                      <h3 className="text-lg font-bold mb-5" style={{ color: '#013547' }}>Manage Products & Offers</h3>

                      {editingProduct && (
                        <div className="p-5 rounded-2xl border mb-6" style={{ backgroundColor: 'rgba(208,216,223,0.40)', borderColor: 'rgba(1,53,71,0.20)' }}>
                          <h4 className="font-bold mb-4 text-sm uppercase tracking-wide" style={{ color: '#013547' }}>
                            Editing: {editingProduct.name}
                          </h4>
                          <form onSubmit={handleProductUpdate} className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="space-y-1 flex-grow">
                              <label className="text-xs font-medium" style={{ color: '#6C6F6E' }}>Price ($)</label>
                              <input
                                type="number" step="0.01" required
                                className={inputCls}
                                style={inputStyle}
                                value={editingProduct.price}
                                onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                              />
                            </div>
                            <div className="space-y-1 flex-grow">
                              <label className="text-xs font-medium" style={{ color: '#6C6F6E' }}>Discount %</label>
                              <input
                                type="number" min="0" max="100" required
                                className={inputCls}
                                style={inputStyle}
                                value={editingProduct.discountPercentage}
                                onChange={(e) => setEditingProduct({ ...editingProduct, discountPercentage: e.target.value })}
                              />
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2.5 rounded-xl font-medium transition-colors" style={{ color: '#6C6F6E' }}>Cancel</button>
                              <button type="submit" className="px-4 py-2.5 rounded-xl font-medium text-white transition-colors" style={{ backgroundColor: '#013547' }}>Save</button>
                            </div>
                          </form>
                        </div>
                      )}

                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b-2 text-xs uppercase tracking-wider" style={{ borderColor: 'rgba(208,216,223,0.80)', color: '#6C6F6E' }}>
                              <th className="pb-3 font-semibold">Product</th>
                              <th className="pb-3 font-semibold">Base Price</th>
                              <th className="pb-3 font-semibold">Discount</th>
                              <th className="pb-3 font-semibold">Final Price</th>
                              <th className="pb-3 font-semibold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((product) => {
                              const finalPrice = product.price * (1 - product.discountPercentage / 100);
                              return (
                                <tr key={product._id} className="border-b transition-colors group" style={{ borderColor: 'rgba(108,111,110,0.10)' }}>
                                  <td className="py-3.5 flex items-center gap-3">
                                    <img src={product.image} className="w-10 h-10 rounded-xl object-cover" style={{ backgroundColor: 'rgba(208,216,223,0.40)' }} alt={product.name} />
                                    <span className="font-medium text-sm" style={{ color: '#013547' }}>{product.name}</span>
                                  </td>
                                  <td className="py-3.5 text-sm" style={{ color: '#6C6F6E' }}>${product.price.toFixed(2)}</td>
                                  <td className="py-3.5">
                                    {product.discountPercentage > 0 ? (
                                      <span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ backgroundColor: 'rgba(221,186,155,0.20)', color: '#013547' }}>-{product.discountPercentage}%</span>
                                    ) : (
                                      <span className="text-xs" style={{ color: 'rgba(108,111,110,0.50)' }}>None</span>
                                    )}
                                  </td>
                                  <td className="py-3.5 font-bold text-sm" style={{ color: '#013547' }}>${finalPrice.toFixed(2)}</td>
                                  <td className="py-3.5 text-right">
                                    <button
                                      onClick={() => setEditingProduct(product)}
                                      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                                      style={{ color: '#DDBA9B' }}
                                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(221,186,155,0.12)'; }}
                                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                      Edit Price & Offer
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ── ORDERS ──────────────────────────────────────────── */}
                  {activeTab === 'orders' && (
                    <div className="rounded-2xl p-6 border shadow-lg" style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'rgba(1,53,71,0.10)' }}>
                      <h3 className="text-lg font-bold mb-5" style={{ color: '#013547' }}>System Orders</h3>
                      {orders.length === 0 ? (
                        <p className="text-center py-10" style={{ color: '#6C6F6E' }}>No orders have been placed yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <div key={order._id} className="border rounded-2xl p-5 transition-colors" style={{ borderColor: 'rgba(108,111,110,0.15)' }}>
                              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                                <div>
                                  <p className="text-xs font-medium" style={{ color: '#6C6F6E' }}>
                                    Order #{order._id.slice(-6).toUpperCase()} · {new Date(order.createdAt).toLocaleString()}
                                  </p>
                                  <p className="font-bold mt-0.5" style={{ color: '#013547' }}>Customer: {order.user?.name || 'Unknown'}</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold`}
                                    style={order.status === 'Pending'
                                      ? { backgroundColor: 'rgba(221,186,155,0.20)', color: '#013547' }
                                      : { backgroundColor: 'rgba(1,53,71,0.10)', color: '#013547' }
                                    }
                                  >
                                    {order.status}
                                  </span>
                                  <span className="font-bold text-lg" style={{ color: '#013547' }}>${order.totalPrice.toFixed(2)}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 pt-3 border-t" style={{ borderColor: 'rgba(108,111,110,0.10)' }}>
                                {order.orderItems.map((item, idx) => (
                                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: 'rgba(208,216,223,0.50)', color: '#013547' }}>
                                    {item.qty}× {item.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── BULK ORDERS ─────────────────────────────────────── */}
                  {activeTab === 'bulkOrders' && (
                    <div className="rounded-2xl p-6 border shadow-lg" style={{ background: '#FFFFFF', borderColor: '#D0D8DF' }}>
                      <h3 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: '#013547' }}>
                        <PackageOpen className="w-5 h-5" style={{ color: '#DDBA9B' }} /> Bulk Order Requests
                      </h3>
                      {bulkOrders.length === 0 ? (
                        <p className="text-center py-10" style={{ color: '#6C6F6E' }}>No bulk orders received yet.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b-2 text-xs uppercase tracking-wider" style={{ borderColor: '#D0D8DF', color: '#6C6F6E' }}>
                                <th className="pb-3 font-semibold px-2">Date</th>
                                <th className="pb-3 font-semibold px-2">Customer / Company</th>
                                <th className="pb-3 font-semibold px-2">Quantity</th>
                                <th className="pb-3 font-semibold px-2">Status</th>
                                <th className="pb-3 font-semibold px-2 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bulkOrders.map((order) => (
                                <tr key={order._id} className="border-b transition-colors" style={{ borderColor: '#D0D8DF' }}>
                                  <td className="py-4 px-2 text-sm" style={{ color: '#6C6F6E' }}>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="py-4 px-2">
                                    <p className="font-bold text-sm" style={{ color: '#013547' }}>
                                      {order.companyName || order.user?.name || 'Unknown'}
                                    </p>
                                    <p className="text-xs" style={{ color: '#6C6F6E' }}>{order.email}</p>
                                  </td>
                                  <td className="py-4 px-2 font-medium text-sm" style={{ color: '#013547' }}>
                                    {order.quantity} Trays
                                  </td>
                                  <td className="py-4 px-2">
                                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold"
                                      style={{ backgroundColor: '#D0D8DF', color: '#013547' }}
                                    >
                                      {order.status}
                                    </span>
                                  </td>
                                  <td className="py-4 px-2 text-right space-x-2">
                                    {order.status === 'Pending' && (
                                      <>
                                        <button
                                          onClick={() => handleUpdateBulkOrderStatus(order._id, 'Approved')}
                                          className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                                          style={{ backgroundColor: '#DDBA9B', color: '#013547' }}
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => setRejectModalOrder(order)}
                                          className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border"
                                          style={{ borderColor: '#013547', color: '#013547' }}
                                        >
                                          Reject
                                        </button>
                                      </>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Reject Modal */}
                      <AnimatePresence>
                        {rejectModalOrder && (
                          <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                          >
                            <motion.div
                              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                              className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
                              style={{ backgroundColor: '#FFFFFF', border: '1px solid #D0D8DF' }}
                            >
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg" style={{ color: '#013547' }}>Reject Bulk Order</h3>
                                <button onClick={() => setRejectModalOrder(null)} style={{ color: '#6C6F6E' }}>
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                              <p className="text-sm mb-4" style={{ color: '#6C6F6E' }}>
                                Provide a reason or custom message for rejecting this order.
                              </p>
                              <textarea
                                className="w-full px-4 py-3 rounded-xl border outline-none text-sm resize-none mb-4"
                                style={{ borderColor: '#D0D8DF', backgroundColor: '#EBEBEB', color: '#013547' }}
                                rows="3"
                                placeholder="E.g., Unfortunately, we cannot fulfill this quantity right now..."
                                value={rejectMessage}
                                onChange={(e) => setRejectMessage(e.target.value)}
                              />
                              <div className="flex justify-end gap-3">
                                <button
                                  onClick={() => setRejectModalOrder(null)}
                                  className="px-4 py-2 rounded-xl text-sm font-semibold"
                                  style={{ color: '#6C6F6E' }}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleUpdateBulkOrderStatus(rejectModalOrder._id, 'Rejected', rejectMessage)}
                                  className="px-4 py-2 rounded-xl text-sm font-bold shadow-md"
                                  style={{ backgroundColor: '#DDBA9B', color: '#013547' }}
                                >
                                  Send Message & Reject
                                </button>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* ── CMS & CHAT ──────────────────────────────────────── */}
                  {activeTab === 'cms' && (
                    <div
                      className="rounded-2xl border shadow-lg flex overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'rgba(1,53,71,0.10)', height: '620px' }}
                    >
                      {/* Users List */}
                      <div className="w-72 shrink-0 border-r overflow-y-auto flex flex-col" style={{ borderColor: 'rgba(108,111,110,0.10)', backgroundColor: 'rgba(208,216,223,0.15)' }}>
                        <div className="p-4 border-b sticky top-0" style={{ borderColor: 'rgba(108,111,110,0.10)', backgroundColor: 'rgba(208,216,223,0.30)' }}>
                          <h3 className="font-bold text-sm" style={{ color: '#013547' }}>Registered Customers</h3>
                        </div>
                        {usersList.map((u) => (
                          <div
                            key={u._id}
                            onClick={() => handleUserClick(u)}
                            className="p-4 border-b cursor-pointer transition-all border-l-4"
                            style={{
                              borderBottomColor: 'rgba(108,111,110,0.08)',
                              borderLeftColor: activeChatUser?._id === u._id ? '#DDBA9B' : 'transparent',
                              backgroundColor: activeChatUser?._id === u._id ? 'rgba(221,186,155,0.12)' : 'transparent',
                            }}
                          >
                            <p className="font-bold text-sm truncate" style={{ color: '#013547' }}>{u.name}</p>
                            <p className="text-xs truncate mt-0.5" style={{ color: '#6C6F6E' }}>{u.email}</p>
                          </div>
                        ))}
                      </div>

                      {/* Chat Interface */}
                      <div className="flex-1 flex flex-col min-w-0">
                        {activeChatUser ? (
                          <>
                            <div className="p-4 border-b flex items-center gap-3 shrink-0" style={{ borderColor: 'rgba(108,111,110,0.10)', backgroundColor: 'rgba(208,216,223,0.15)' }}>
                              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ backgroundColor: '#013547', color: '#DDBA9B' }}>
                                {activeChatUser.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-bold text-sm" style={{ color: '#013547' }}>{activeChatUser.name}</h3>
                                <p className="text-xs" style={{ color: '#6C6F6E' }}>Live Support Chat</p>
                              </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 space-y-3">
                              {chatMessages.map((msg, idx) => {
                                const isMe = msg.isAdminMessage;
                                return (
                                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className="max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm"
                                      style={isMe
                                        ? { backgroundColor: '#013547', color: '#ffffff', borderRadius: '16px 16px 4px 16px' }
                                        : { backgroundColor: 'rgba(208,216,223,0.60)', color: '#013547', border: '1px solid rgba(108,111,110,0.15)', borderRadius: '16px 16px 16px 4px' }
                                      }
                                    >
                                      {msg.content}
                                    </div>
                                  </div>
                                );
                              })}
                              <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 border-t shrink-0" style={{ borderColor: 'rgba(108,111,110,0.10)', backgroundColor: 'rgba(208,216,223,0.10)' }}>
                              <form onSubmit={sendAdminMessage} className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder={`Reply to ${activeChatUser.name}…`}
                                  className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none"
                                  style={{ borderColor: 'rgba(108,111,110,0.25)', color: '#013547' }}
                                  value={chatInput}
                                  onChange={(e) => setChatInput(e.target.value)}
                                />
                                <button
                                  type="submit"
                                  disabled={!chatInput.trim()}
                                  className="px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 shrink-0"
                                  style={{ backgroundColor: '#52311B', color: '#ffffff' }}
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              </form>
                            </div>
                          </>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center space-y-3" style={{ color: 'rgba(108,111,110,0.40)' }}>
                            <MessageSquare className="w-14 h-14" />
                            <p className="font-medium text-sm">Select a customer to view chat history</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── SETTINGS ────────────────────────────────────────── */}
                  {activeTab === 'settings' && (
                    <form onSubmit={handleSettingsSave} className="space-y-5">

                      {/* Company Identity */}
                      <div className="rounded-2xl p-6 border shadow-lg" style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'rgba(1,53,71,0.10)' }}>
                        <h3 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: '#013547' }}>
                          <Building2 className="w-5 h-5" style={{ color: '#DDBA9B' }} />
                          Company Identity
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <SettingsField label="Company Name" icon={Building2}>
                            <input
                              type="text"
                              className={inputCls}
                              style={inputStyle}
                              value={companySettings.name}
                              onChange={e => setCompanySettings(s => ({ ...s, name: e.target.value }))}
                              placeholder="e.g. Wimalasooriya Farms"
                            />
                          </SettingsField>

                          <SettingsField label="Business Reg. Number" icon={Shield}>
                            <input
                              type="text"
                              className={inputCls}
                              style={inputStyle}
                              value={companySettings.businessRegNumber}
                              onChange={e => setCompanySettings(s => ({ ...s, businessRegNumber: e.target.value }))}
                              placeholder="e.g. BR-123456"
                            />
                          </SettingsField>

                          <SettingsField label="Business Start Date" icon={Calendar}>
                            <input
                              type="date"
                              className={inputCls}
                              style={inputStyle}
                              value={companySettings.startDate}
                              onChange={e => setCompanySettings(s => ({ ...s, startDate: e.target.value }))}
                            />
                          </SettingsField>
                        </div>
                      </div>

                      {/* Logo */}
                      <div className="rounded-2xl p-6 border shadow-lg" style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'rgba(1,53,71,0.10)' }}>
                        <h3 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: '#013547' }}>
                          <ImagePlus className="w-5 h-5" style={{ color: '#DDBA9B' }} />
                          Company Logo
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                          {/* Preview */}
                          <div className="w-28 h-28 rounded-2xl border-2 border-dashed flex items-center justify-center shrink-0 overflow-hidden"
                            style={{ borderColor: 'rgba(221,186,155,0.50)', backgroundColor: 'rgba(208,216,223,0.20)' }}>
                            {logoPreview ? (
                              <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-2" />
                            ) : (
                              <ImagePlus className="w-8 h-8" style={{ color: 'rgba(108,111,110,0.40)' }} />
                            )}
                          </div>
                          <div className="flex-1 space-y-3">
                            <SettingsField label="Logo URL" icon={ImagePlus}>
                              <input
                                type="text"
                                className={inputCls}
                                style={inputStyle}
                                value={companySettings.logoUrl}
                                onChange={e => handleLogoUrlChange(e.target.value)}
                                placeholder="e.g. /logo.png or https://..."
                              />
                            </SettingsField>
                            <p className="text-xs" style={{ color: '#6C6F6E' }}>
                              Enter a URL or a path relative to the <code className="bg-gray-100 px-1 py-0.5 rounded">/public</code> folder. The preview updates as you type.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="rounded-2xl p-6 border shadow-lg" style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'rgba(1,53,71,0.10)' }}>
                        <h3 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: '#013547' }}>
                          <Phone className="w-5 h-5" style={{ color: '#DDBA9B' }} />
                          Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <SettingsField label="Email Address" icon={Mail}>
                            <input
                              type="email"
                              className={inputCls}
                              style={inputStyle}
                              value={companySettings.email}
                              onChange={e => setCompanySettings(s => ({ ...s, email: e.target.value }))}
                              placeholder="e.g. hello@yourfarm.com"
                            />
                          </SettingsField>

                          <SettingsField label="Telephone Number" icon={Phone}>
                            <input
                              type="tel"
                              className={inputCls}
                              style={inputStyle}
                              value={companySettings.phone}
                              onChange={e => setCompanySettings(s => ({ ...s, phone: e.target.value }))}
                              placeholder="e.g. +94 77 123 4567"
                            />
                          </SettingsField>

                          <div className="md:col-span-2">
                            <SettingsField label="Location / Address" icon={MapPin}>
                              <textarea
                                rows={2}
                                className={inputCls}
                                style={{ ...inputStyle, resize: 'none' }}
                                value={companySettings.address}
                                onChange={e => setCompanySettings(s => ({ ...s, address: e.target.value }))}
                                placeholder="e.g. 123 Farm Road, Nuwara Eliya, Sri Lanka"
                              />
                            </SettingsField>
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={settingsSaving}
                          className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg disabled:opacity-60"
                          style={{ backgroundColor: '#52311B', color: '#ffffff', boxShadow: '0 8px 20px -4px rgba(82,49,27,0.30)' }}
                          onMouseEnter={e => { if (!settingsSaving) e.currentTarget.style.backgroundColor = '#ffffff'; if (!settingsSaving) e.currentTarget.style.color = '#52311B'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#52311B'; e.currentTarget.style.color = '#ffffff'; }}
                        >
                          {settingsSaving
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                            : <><Save className="w-4 h-4" /> Save Settings</>
                          }
                        </button>
                      </div>
                    </form>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
