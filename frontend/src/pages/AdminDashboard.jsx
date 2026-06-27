import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  LayoutDashboard, PackageSearch, ListOrdered, DollarSign, Users,
  ShoppingBag, MessageSquare, Send, Shield, TrendingUp, BarChart3, UserCog
} from 'lucide-react';
import io from 'socket.io-client';
import WorkerManagement from '../components/admin/WorkerManagement';
import AnalysisDashboard from '../components/admin/AnalysisDashboard';

const pageVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

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

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
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
      } else if (activeTab === 'cms') {
        const res = await axios.get('/api/admin/users', config);
        setUsersList(res.data);
      }
    } catch {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
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

  // ── Nav items ──────────────────────────────────────────────────────────────
  const navItems = [
    { id: 'overview',  icon: LayoutDashboard, label: 'Overview'     },
    { id: 'analysis',  icon: BarChart3,       label: 'Analysis'     },
    { id: 'workers',   icon: UserCog,         label: 'Workers'      },
    { id: 'products',  icon: PackageSearch,   label: 'Products'     },
    { id: 'orders',    icon: ListOrdered,     label: 'All Orders'   },
    { id: 'cms',       icon: MessageSquare,   label: 'CMS & Chat'   },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] relative bg-egg-shell">

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
                className="rounded-2xl p-5 mb-3 border border-mountain-gold/30 shadow-xl"
                style={{ background: 'rgba(55,46,25,0.88)', backdropFilter: 'blur(12px)' }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-xl bg-mountain-gold flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-mountain-sand text-sm leading-tight">Admin Panel</p>
                    <p className="text-[11px] text-mountain-gold/70 truncate">{user?.name}</p>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <div
                className="rounded-2xl p-2.5 border border-mountain-gold/20 shadow-xl"
                style={{ background: 'rgba(55,46,25,0.82)', backdropFilter: 'blur(12px)' }}
              >
                <p className="text-[10px] font-bold text-mountain-gold/50 uppercase tracking-widest px-2 mb-2">Navigation</p>
                <nav className="space-y-0.5">
                  {navItems.map(({ id, icon: Icon, label }) => (
                    <motion.button
                      key={id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveTab(id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all text-sm ${
                        activeTab === id
                          ? 'bg-mountain-gold text-mountain-brown shadow-md'
                          : 'text-mountain-sand/70 hover:bg-mountain-gold/10 hover:text-mountain-sand'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {label}
                      {activeTab === id && (
                        <motion.div
                          layoutId="admin-active-pip"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-mountain-brown"
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
              <h1 className="text-2xl font-bold text-mountain-sand">
                {navItems.find(n => n.id === activeTab)?.label}
              </h1>
              <p className="text-mountain-gold/60 text-sm">Wimalasooriya Farm — Admin Control Centre</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="rounded-2xl p-12 text-center border border-mountain-gold/20 shadow-xl"
                  style={{ background: 'rgba(255,255,255,0.92)' }}
                >
                  <div className="w-10 h-10 border-4 border-mountain-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-mountain-brown font-medium">Loading admin data…</p>
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
                          { icon: DollarSign,  label: 'Total Revenue',  value: `$${analytics.totalRevenue?.toFixed(2)}`,  accent: '#93631F', bg: 'rgba(147,99,31,0.12)' },
                          { icon: ShoppingBag, label: 'Active Orders',  value: analytics.activeOrders,                   accent: '#3F4321', bg: 'rgba(63,67,33,0.12)'  },
                          { icon: ListOrdered, label: 'Total Orders',   value: analytics.totalOrders,                    accent: '#93631F', bg: 'rgba(147,99,31,0.12)' },
                          { icon: Users,       label: 'Total Users',    value: analytics.totalUsers,                     accent: '#3F4321', bg: 'rgba(63,67,33,0.12)'  },
                        ].map(({ icon: Icon, label, value, accent, bg }, i) => (
                          <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="rounded-2xl p-5 border border-mountain-gold/20 shadow-lg"
                            style={{ background: 'rgba(255,255,255,0.95)' }}
                          >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
                              <Icon className="w-5 h-5" style={{ color: accent }} />
                            </div>
                            <p className="text-sm text-mountain-gray font-medium">{label}</p>
                            <p className="text-2xl font-bold text-mountain-brown mt-0.5">{value}</p>
                          </motion.div>
                        ))}
                      </div>

                      <div
                        className="rounded-2xl p-6 border border-mountain-gold/20 shadow-lg"
                        style={{ background: 'rgba(255,255,255,0.95)' }}
                      >
                        <h3 className="text-lg font-bold text-mountain-brown mb-5 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-mountain-gold" /> Revenue Over Time
                        </h3>
                        <div className="h-72 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.chartData}>
                              <defs>
                                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%"  stopColor="#93631F" stopOpacity={0.25} />
                                  <stop offset="95%" stopColor="#93631F" stopOpacity={0.02} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 12 }} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 12 }} dx={-10} tickFormatter={(v) => `$${v}`} />
                              <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgb(0 0 0 / 0.12)', fontFamily: 'Inter' }}
                                formatter={(v) => [`$${v.toFixed(2)}`, 'Revenue']}
                              />
                              <Area type="monotone" dataKey="revenue" stroke="#93631F" strokeWidth={2.5} fill="url(#revenueGrad)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div
                        className="rounded-2xl p-6 border border-mountain-gold/20 shadow-lg"
                        style={{ background: 'rgba(255,255,255,0.95)' }}
                      >
                        <h3 className="text-lg font-bold text-mountain-brown mb-5 flex items-center gap-2">
                          <ListOrdered className="w-5 h-5 text-mountain-moss" /> Orders Volume
                        </h3>
                        <div className="h-72 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.chartData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 12 }} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 12 }} dx={-10} />
                              <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgb(0 0 0 / 0.12)', fontFamily: 'Inter' }}
                                cursor={{ fill: 'rgba(244,197,121,0.1)' }}
                              />
                              <Bar dataKey="orders" fill="#3F4321" radius={[6, 6, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── PRODUCTS ────────────────────────────────────────── */}
                  {activeTab === 'products' && (
                    <div
                      className="rounded-2xl p-6 border border-mountain-gold/20 shadow-lg"
                      style={{ background: 'rgba(255,255,255,0.97)' }}
                    >
                      <h3 className="text-lg font-bold text-mountain-brown mb-5">Manage Products & Offers</h3>

                      {editingProduct && (
                        <div className="bg-mountain-sand/20 p-5 rounded-2xl border border-mountain-moss/30 mb-6">
                          <h4 className="font-bold text-mountain-brown mb-4 text-sm uppercase tracking-wide">
                            Editing: {editingProduct.name}
                          </h4>
                          <form onSubmit={handleProductUpdate} className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="space-y-1 flex-grow">
                              <label className="text-xs font-medium text-mountain-gray">Price ($)</label>
                              <input
                                type="number" step="0.01" required
                                className="w-full px-4 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold outline-none text-mountain-brown"
                                value={editingProduct.price}
                                onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                              />
                            </div>
                            <div className="space-y-1 flex-grow">
                              <label className="text-xs font-medium text-mountain-gray">Discount %</label>
                              <input
                                type="number" min="0" max="100" required
                                className="w-full px-4 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold outline-none text-mountain-brown"
                                value={editingProduct.discountPercentage}
                                onChange={(e) => setEditingProduct({ ...editingProduct, discountPercentage: e.target.value })}
                              />
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2.5 rounded-xl text-mountain-gray font-medium hover:bg-mountain-gray/10 transition-colors">Cancel</button>
                              <button type="submit" className="px-4 py-2.5 bg-mountain-moss text-white rounded-xl font-medium hover:bg-mountain-brown transition-colors">Save</button>
                            </div>
                          </form>
                        </div>
                      )}

                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b-2 border-mountain-sand/60 text-mountain-gray text-xs uppercase tracking-wider">
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
                                <tr key={product._id} className="border-b border-mountain-gray/10 hover:bg-mountain-sand/10 transition-colors group">
                                  <td className="py-3.5 flex items-center gap-3">
                                    <img src={product.image} className="w-10 h-10 rounded-xl object-cover bg-mountain-sand/30" alt={product.name} />
                                    <span className="font-medium text-mountain-brown text-sm">{product.name}</span>
                                  </td>
                                  <td className="py-3.5 text-mountain-gray text-sm">${product.price.toFixed(2)}</td>
                                  <td className="py-3.5">
                                    {product.discountPercentage > 0 ? (
                                      <span className="px-2 py-0.5 bg-mountain-gold/20 text-mountain-gold rounded-lg text-xs font-bold">-{product.discountPercentage}%</span>
                                    ) : (
                                      <span className="text-mountain-gray/60 text-xs">None</span>
                                    )}
                                  </td>
                                  <td className="py-3.5 font-bold text-mountain-moss text-sm">${finalPrice.toFixed(2)}</td>
                                  <td className="py-3.5 text-right">
                                    <button
                                      onClick={() => setEditingProduct(product)}
                                      className="text-xs font-semibold text-mountain-gold hover:text-mountain-brown transition-colors px-3 py-1.5 rounded-lg hover:bg-mountain-sand/30"
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
                    <div
                      className="rounded-2xl p-6 border border-mountain-gold/20 shadow-lg"
                      style={{ background: 'rgba(255,255,255,0.97)' }}
                    >
                      <h3 className="text-lg font-bold text-mountain-brown mb-5">System Orders</h3>
                      {orders.length === 0 ? (
                        <p className="text-mountain-gray text-center py-10">No orders have been placed yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <div key={order._id} className="border border-mountain-gray/20 rounded-2xl p-5 hover:border-mountain-gold/40 transition-colors">
                              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                                <div>
                                  <p className="text-xs text-mountain-gray font-medium">
                                    Order #{order._id.slice(-6).toUpperCase()} · {new Date(order.createdAt).toLocaleString()}
                                  </p>
                                  <p className="text-mountain-brown font-bold mt-0.5">Customer: {order.user?.name || 'Unknown'}</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    order.status === 'Pending'
                                      ? 'bg-mountain-gold/20 text-mountain-gold'
                                      : 'bg-mountain-moss/10 text-mountain-moss'
                                  }`}>
                                    {order.status}
                                  </span>
                                  <span className="font-bold text-lg text-mountain-brown">${order.totalPrice.toFixed(2)}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 pt-3 border-t border-mountain-gray/10">
                                {order.orderItems.map((item, idx) => (
                                  <span key={idx} className="text-xs bg-mountain-sand/40 text-mountain-brown px-2.5 py-1 rounded-lg font-medium">
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

                  {/* ── CMS & CHAT ──────────────────────────────────────── */}
                  {activeTab === 'cms' && (
                    <div
                      className="rounded-2xl border border-mountain-gold/20 shadow-lg flex overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.97)', height: '620px' }}
                    >
                      {/* Users List */}
                      <div className="w-72 shrink-0 border-r border-mountain-gray/15 bg-mountain-sand/10 overflow-y-auto flex flex-col">
                        <div className="p-4 border-b border-mountain-gray/15 bg-mountain-sand/20 sticky top-0">
                          <h3 className="font-bold text-mountain-brown text-sm">Registered Customers</h3>
                        </div>
                        {usersList.map((u) => (
                          <div
                            key={u._id}
                            onClick={() => handleUserClick(u)}
                            className={`p-4 border-b border-mountain-gray/10 cursor-pointer transition-all ${
                              activeChatUser?._id === u._id
                                ? 'bg-mountain-gold/15 border-l-4 border-l-mountain-gold'
                                : 'hover:bg-mountain-sand/30 border-l-4 border-l-transparent'
                            }`}
                          >
                            <p className="font-bold text-mountain-brown text-sm truncate">{u.name}</p>
                            <p className="text-xs text-mountain-gray truncate mt-0.5">{u.email}</p>
                          </div>
                        ))}
                      </div>

                      {/* Chat Interface */}
                      <div className="flex-1 flex flex-col min-w-0">
                        {activeChatUser ? (
                          <>
                            <div className="p-4 border-b border-mountain-gray/15 bg-mountain-sand/10 flex items-center gap-3 shrink-0">
                              <div className="w-9 h-9 rounded-full bg-mountain-moss text-white flex items-center justify-center font-bold text-sm shrink-0">
                                {activeChatUser.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-bold text-mountain-brown text-sm">{activeChatUser.name}</h3>
                                <p className="text-xs text-mountain-gray">Live Support Chat</p>
                              </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 space-y-3">
                              {chatMessages.map((msg, idx) => {
                                const isMe = msg.isAdminMessage;
                                return (
                                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                      isMe
                                        ? 'bg-mountain-moss text-white rounded-tr-sm'
                                        : 'bg-mountain-sand/50 text-mountain-brown border border-mountain-gray/20 rounded-tl-sm'
                                    }`}>
                                      {msg.content}
                                    </div>
                                  </div>
                                );
                              })}
                              <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 border-t border-mountain-gray/15 bg-mountain-sand/5 shrink-0">
                              <form onSubmit={sendAdminMessage} className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder={`Reply to ${activeChatUser.name}…`}
                                  className="flex-1 px-4 py-2.5 rounded-xl border border-mountain-gray/30 focus:outline-none focus:border-mountain-gold bg-white text-sm"
                                  value={chatInput}
                                  onChange={(e) => setChatInput(e.target.value)}
                                />
                                <button
                                  type="submit"
                                  disabled={!chatInput.trim()}
                                  className="px-5 py-2.5 bg-mountain-gold text-white rounded-xl hover:bg-mountain-brown transition-colors disabled:opacity-50 shrink-0"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              </form>
                            </div>
                          </>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-mountain-gray/40 space-y-3">
                            <MessageSquare className="w-14 h-14" />
                            <p className="font-medium text-sm">Select a customer to view chat history</p>
                          </div>
                        )}
                      </div>
                    </div>
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
