import { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Tractor, Egg, DollarSign, TrendingUp, Minus, Plus,
  Settings, Users, Truck, BarChart3, LayoutDashboard,
  Wallet, ChevronRight, AlertCircle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Feather, Building2, Shield, Calendar, ImagePlus, Mail, Phone, MapPin, Save, Loader2, ListOrdered
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Skeleton from '../components/Skeleton';
import WorkerManagement from '../components/admin/WorkerManagement';
import TransportManagement from '../components/admin/TransportManagement';
import FarmAnalysis from '../components/admin/FarmAnalysis';
import FinancialDashboard from '../components/admin/FinancialDashboard';

// ─── Activity Row ─────────────────────────────────────────────────────────────
const ActivityRow = ({ isNew = false, children }) => (
  <div className={`flex justify-between items-center p-3 rounded-xl border transition-all duration-200 ${isNew ? 'activity-row-new' : ''}`}
       style={{ borderColor: 'rgba(87,92,85,0.20)' }}
       onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(134,97,47,0.40)'; e.currentTarget.style.backgroundColor = 'rgba(208,210,207,0.30)'; }}
       onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(87,92,85,0.20)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
    {children}
  </div>
);

// ─── Stat Pill ────────────────────────────────────────────────────────────────
const StatPill = ({ value, positive }) => (
  <span
    className="stat-badge"
    style={{
      background: positive ? 'rgba(134,97,47,0.20)' : 'rgba(239,68,68,0.1)',
      color: positive ? '#52311B' : '#B91C1C'
    }}
  >
    {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
    {value}
  </span>
);

// ─── Overview KPI Card ────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    className="p-5 flex items-center gap-4 rounded-2xl shadow-lg border"
    style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: 'rgba(82,49,27,0.10)' }}
  >
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(82,49,27,0.10)' }}>
      <Icon className="w-6 h-6" style={{ color: color || '#52311B' }} />
    </div>
    <div>
      <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#575C55' }}>{label}</p>
      <p className="text-2xl font-bold mt-0.5" style={{ color: '#52311B' }}>{value}</p>
    </div>
  </motion.div>
);

// ─── Styled field wrapper for Settings ──────────────────────────────────────
const SettingsField = ({ label, icon: Icon, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#575C55' }}>
      <Icon className="w-3.5 h-3.5" style={{ color: '#52311B' }} />
      {label}
    </label>
    {children}
  </div>
);

const inputCls = "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2";
const inputStyle = { borderColor: 'rgba(87,92,85,0.30)', color: '#52311B', backgroundColor: '#FFFFFF' };


// ─── Main Component ───────────────────────────────────────────────────────────
const FarmOperations = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newRowId, setNewRowId] = useState(null);
  const [orders, setOrders] = useState([]);

  // Hen form
  const [henType, setHenType] = useState('addition');
  const [henQuantity, setHenQuantity] = useState('');
  const [henReason, setHenReason] = useState('Sell');
  const [henLoading, setHenLoading] = useState(false);

  // Production form
  const [prodEggs, setProdEggs] = useState('');
  const [prodLoading, setProdLoading] = useState(false);

  // Expense form
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Hen Food');
  const [expDetails, setExpDetails] = useState('');
  const [expLoading, setExpLoading] = useState(false);

  // Revenue form
  const [revAmount, setRevAmount] = useState('');
  const [revSource, setRevSource] = useState('');
  const [revLoading, setRevLoading] = useState(false);

  // Company Settings form
  const [companySettings, setCompanySettings] = useState({
    name: '', logoUrl: '', email: '', phone: '',
    address: '', businessRegNumber: '', startDate: '',
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');

  const authConfig = { headers: { Authorization: `Bearer ${user?.token}` } };

  const fetchSummary = async () => {
    try {
      const res = await axios.get('/api/farm/summary', authConfig);
      setSummary(res.data);
    } catch {
      // summary stays null → error boundary renders
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
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
    } catch (err) {
      toast.error('Failed to load settings');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/admin/orders', authConfig);
      setOrders(res.data);
    } catch {
      toast.error('Failed to load orders');
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await axios.put(`/api/orders/bulk/${id}/status`, { status }, authConfig);
      toast.success(`Order ${status.toLowerCase()} successfully`);
      fetchOrders();
    } catch (e) {
      toast.error('Failed to update order status');
    }
  };

  useEffect(() => { 
    fetchSummary(); 
    fetchOrders();
  }, []);

  useEffect(() => {
    if (activeTab === 'settings') {
      fetchSettings();
    }
  }, [activeTab]);

  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;


  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleHenSubmit = async (e) => {
    e.preventDefault();
    setHenLoading(true);
    try {
      await axios.post('/api/farm/hens', {
        type: henType,
        quantityChange: Number(henQuantity),
        reason: henType === 'removal' ? henReason : null
      }, authConfig);
      toast.success(henType === 'addition' ? '✅ Hens added successfully!' : '✅ Hen removal recorded.');
      setHenQuantity('');
      await fetchSummary();
      setNewRowId('hen-' + Date.now());
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Failed to log hen update.');
    } finally {
      setHenLoading(false);
    }
  };

  const handleProdSubmit = async (e) => {
    e.preventDefault();
    setProdLoading(true);
    try {
      await axios.post('/api/farm/production', { totalEggsCollected: Number(prodEggs) }, authConfig);
      toast.success('🥚 Production logged!');
      setProdEggs('');
      await fetchSummary();
      setNewRowId('prod-' + Date.now());
    } catch {
      toast.error('❌ Failed to log production.');
    } finally {
      setProdLoading(false);
    }
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    setExpLoading(true);
    try {
      await axios.post('/api/farm/expenses', { amount: Number(expAmount), category: expCategory, details: expDetails }, authConfig);
      toast.success('💸 Expense logged!');
      setExpAmount(''); setExpDetails('');
      await fetchSummary();
      setNewRowId('exp-' + Date.now());
    } catch {
      toast.error('❌ Failed to log expense.');
    } finally {
      setExpLoading(false);
    }
  };

  const handleRevSubmit = async (e) => {
    e.preventDefault();
    setRevLoading(true);
    try {
      await axios.post('/api/farm/revenues', { amount: Number(revAmount), sourceDescription: revSource }, authConfig);
      toast.success('💰 Revenue logged!');
      setRevAmount(''); setRevSource('');
      await fetchSummary();
      setNewRowId('rev-' + Date.now());
    } catch {
      toast.error('❌ Failed to log revenue.');
    } finally {
      setRevLoading(false);
    }
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      const res = await axios.put('/api/company', companySettings, authConfig);
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


  // ── Page variants ──────────────────────────────────────────────────────────
  const pageVariants = {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
    exit:    { opacity: 0, y: -12, transition: { duration: 0.2 } }
  };

  // ── Nav items ──────────────────────────────────────────────────────────────
  const navItems = [
    { id: 'overview',    icon: LayoutDashboard, label: 'Overview' },
    { id: 'financial',   icon: Wallet,          label: 'Financial' },
    { id: 'analysis',    icon: BarChart3,        label: 'Analysis' },
    { id: 'workers',     icon: Users,            label: 'Workers' },
    { id: 'transport',   icon: Truck,            label: 'Transport' },
    { id: 'production',  icon: Tractor,          label: 'Production' },
    { id: 'orders',      icon: ListOrdered,      label: 'All Orders', badge: pendingOrdersCount },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: '#FAFAFA',
        backgroundImage: 'url(/farm-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Light subtle overlay matching new site palette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom right, rgba(250,250,250,0.85) 0%, rgba(250,250,250,0.7) 100%)' }}
      />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row gap-6">


        {/* ── RIGHT: Main Content (85%) ─────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="mb-8 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#52311B' }}>
              <Tractor className="w-6 h-6" style={{ color: '#86612F' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight" style={{ color: '#52311B' }}>Farm Operations</h1>
              <p className="text-sm mt-0.5" style={{ color: '#575C55' }}>Internal Monitoring & Inventory Management</p>
            </div>
          </motion.div>

          {/* ── Tab Content ─────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton.Card /><Skeleton.Card /><Skeleton.Card /><Skeleton.Card />
              </motion.div>
            ) : !summary && activeTab !== 'settings' ? (
              <motion.div key="error" {...{ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }}
                className="p-12 text-center rounded-2xl shadow-lg border"
                style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: 'rgba(82,49,27,0.10)' }}
              >
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="font-bold text-[#1A2B4A]">Failed to load summary</p>
                <p className="text-sm mt-1" style={{ color: '#575C55' }}>Please check your backend connection and try refreshing.</p>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >

                {/* ── OVERVIEW ─────────────────────────────────────────── */}
                {activeTab === 'overview' && summary && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <KpiCard icon={Tractor}    label="Live Hens"      value={summary.totalHens.toLocaleString()} color="#86612F" delay={0} />
                      <KpiCard icon={Egg}        label="Batches Logged" value={summary.latestProduction.length}    color="#52311B" delay={0.05} />
                      <KpiCard icon={Minus}      label="Recent Expenses" value={summary.latestExpenses.length}     color="#575C55" delay={0.1} />
                      <KpiCard icon={TrendingUp} label="Revenue Entries" value={summary.latestRevenues.length}     color="#52311B" delay={0.15} />
                    </div>

                    {/* Recent Hen Log */}
                    <div className="p-6 rounded-2xl shadow-lg border" style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: 'rgba(82,49,27,0.10)' }}>
                      <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#52311B' }}>
                        <Feather className="w-4 h-4" style={{ color: '#86612F' }} /> Recent Activity
                      </h3>
                      <div className="space-y-2">
                        {summary.latestHenLogs.length === 0 && (
                          <p className="text-sm text-center py-4" style={{ color: '#575C55' }}>No hen activity yet.</p>
                        )}
                        {summary.latestHenLogs.map((log, i) => (
                          <ActivityRow key={i}>
                            <div>
                              <p className="text-sm font-semibold capitalize" style={{ color: '#52311B' }}>{log.type}</p>
                              <p className="text-xs" style={{ color: '#575C55' }}>{new Date(log.date).toLocaleDateString()} {log.reason ? `· ${log.reason}` : ''}</p>
                            </div>
                            <StatPill value={`${log.quantityChange} hens`} positive={log.type === 'addition'} />
                          </ActivityRow>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── PRODUCTION ──────────────────────────────────────── */}
                {activeTab === 'production' && summary && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                      {/* Hen Management Widget */}
                      <div className="p-6 rounded-2xl shadow-lg border" style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: 'rgba(82,49,27,0.10)' }}>
                        <div className="flex items-center justify-between mb-5">
                          <h2 className="font-bold flex items-center gap-2" style={{ color: '#52311B' }}>
                            <Tractor className="w-5 h-5" style={{ color: '#86612F' }} /> Hen Inventory
                          </h2>
                          <span className="stat-badge" style={{ background: 'rgba(134,97,47,0.20)', color: '#52311B' }}>
                            {summary.totalHens.toLocaleString()} live
                          </span>
                        </div>
                        <form onSubmit={handleHenSubmit} className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <select
                              className="winter-input winter-select"
                              style={inputStyle}
                              value={henType}
                              onChange={(e) => setHenType(e.target.value)}
                            >
                              <option value="addition">➕ Add Batch</option>
                              <option value="removal">➖ Remove Hens</option>
                            </select>
                            <input
                              type="number" min="1" required
                              placeholder="Quantity"
                              className="winter-input"
                              style={inputStyle}
                              value={henQuantity}
                              onChange={(e) => setHenQuantity(e.target.value)}
                            />
                          </div>
                          <AnimatePresence>
                            {henType === 'removal' && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                style={{ overflow: 'hidden' }}
                              >
                                <select
                                  className="winter-input winter-select"
                                  style={inputStyle}
                                  value={henReason}
                                  onChange={(e) => setHenReason(e.target.value)}
                                >
                                  <option value="Sell">Sell (Live)</option>
                                  <option value="Death">Death / Illness</option>
                                </select>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <motion.button
                            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={henLoading}
                            className={`w-full py-2.5 rounded-xl text-white font-semibold transition-colors flex items-center justify-center gap-2 ${henLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            style={{ backgroundColor: '#52311B' }}
                          >
                            {henLoading ? <><span className="btn-spinner" /> Saving…</> : <><CheckCircle2 className="w-4 h-4" /> Log Update</>}
                          </motion.button>
                        </form>
                      </div>

                      {/* Daily Production Widget */}
                      <div className="p-6 rounded-2xl shadow-lg border" style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: 'rgba(82,49,27,0.10)' }}>
                        <h2 className="font-bold flex items-center gap-2 mb-5" style={{ color: '#52311B' }}>
                          <Egg className="w-5 h-5" style={{ color: '#86612F' }} /> Daily Egg Production
                        </h2>
                        <form onSubmit={handleProdSubmit} className="space-y-3">
                          <input
                            type="number" min="1" required
                            placeholder="Total eggs collected today"
                            className="winter-input text-lg font-semibold"
                            style={inputStyle}
                            value={prodEggs}
                            onChange={(e) => setProdEggs(e.target.value)}
                          />
                          <p className="text-xs" style={{ color: '#575C55' }}>Each submission creates a new dated record.</p>
                          <motion.button
                            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={prodLoading}
                            className={`w-full py-2.5 rounded-xl text-white font-semibold transition-colors flex items-center justify-center gap-2 ${prodLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            style={{ backgroundColor: '#52311B' }}
                          >
                            {prodLoading ? <><span className="btn-spinner" /> Saving…</> : <><CheckCircle2 className="w-4 h-4" /> Log Production</>}
                          </motion.button>
                        </form>
                      </div>
                    </div>

                    {/* Activity Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="p-6 rounded-2xl shadow-lg border" style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: 'rgba(82,49,27,0.10)' }}>
                        <h3 className="font-bold mb-4 text-sm uppercase tracking-wide flex items-center gap-2" style={{ color: '#52311B' }}>
                          <Tractor className="w-4 h-4" style={{ color: '#86612F' }} /> Hen Adjustments
                        </h3>
                        <div className="space-y-2">
                          {summary.latestHenLogs.length === 0 && <p className="text-sm text-center py-4" style={{ color: '#575C55' }}>No records yet.</p>}
                          {summary.latestHenLogs.map((log, i) => (
                            <ActivityRow key={log._id || i} isNew={newRowId?.startsWith('hen') && i === 0}>
                              <div>
                                <p className="text-sm font-semibold capitalize" style={{ color: '#52311B' }}>{log.type}</p>
                                <p className="text-xs" style={{ color: '#575C55' }}>{new Date(log.date).toLocaleDateString()} {log.reason ? `· ${log.reason}` : ''}</p>
                              </div>
                              <StatPill value={`${log.type === 'addition' ? '+' : '-'}${log.quantityChange}`} positive={log.type === 'addition'} />
                            </ActivityRow>
                          ))}
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl shadow-lg border" style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: 'rgba(82,49,27,0.10)' }}>
                        <h3 className="font-bold mb-4 text-sm uppercase tracking-wide flex items-center gap-2" style={{ color: '#52311B' }}>
                          <Egg className="w-4 h-4" style={{ color: '#86612F' }} /> Egg Production Log
                        </h3>
                        <div className="space-y-2">
                          {summary.latestProduction.length === 0 && <p className="text-sm text-center py-4" style={{ color: '#575C55' }}>No records yet.</p>}
                          {summary.latestProduction.map((p, i) => (
                            <ActivityRow key={p._id} isNew={newRowId?.startsWith('prod') && i === 0}>
                              <p className="text-sm" style={{ color: '#575C55' }}>{new Date(p.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                              <StatPill value={`+${p.totalEggsCollected} eggs`} positive={true} />
                            </ActivityRow>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── FINANCIAL ───────────────────────────────────────── */}
                {activeTab === 'financial' && summary && (
                  <div className="bg-white/95 rounded-2xl p-4 shadow-xl border" style={{ borderColor: 'rgba(82,49,27,0.10)' }}>
                    <FinancialDashboard summary={summary} onRefresh={fetchSummary} />
                  </div>
                )}

                {/* ── WORKERS ─────────────────────────────────────────── */}
                {activeTab === 'workers' && (
                  <div className="bg-white/95 rounded-2xl p-4 shadow-xl border" style={{ borderColor: 'rgba(82,49,27,0.10)' }}>
                    <WorkerManagement />
                  </div>
                )}

                {/* ── TRANSPORT ───────────────────────────────────────── */}
                {activeTab === 'transport' && (
                  <div className="bg-white/95 rounded-2xl p-4 shadow-xl border" style={{ borderColor: 'rgba(82,49,27,0.10)' }}>
                    <TransportManagement />
                  </div>
                )}

                {/* ── ANALYSIS ────────────────────────────────────────── */}
                {activeTab === 'analysis' && (
                  <div className="bg-white/95 rounded-2xl p-4 shadow-xl border" style={{ borderColor: 'rgba(82,49,27,0.10)' }}>
                    <FarmAnalysis />
                  </div>
                )}

                {/* ── ORDERS ────────────────────────────────────────── */}
                {activeTab === 'orders' && (
                  <div className="rounded-2xl p-6 border shadow-lg" style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: 'rgba(82,49,27,0.10)' }}>
                    <h3 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: '#52311B' }}>
                      <ListOrdered className="w-5 h-5" style={{ color: '#86612F' }} /> System Orders
                    </h3>
                    {orders.length === 0 ? (
                      <p className="text-center py-10" style={{ color: '#575C55' }}>No orders have been placed yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order._id} className="border rounded-2xl p-5 transition-colors hover:bg-[rgba(208,210,207,0.20)]" style={{ borderColor: 'rgba(87,92,85,0.20)' }}>
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                              <div>
                                <p className="text-xs font-medium" style={{ color: '#575C55' }}>
                                  Order #{order._id.slice(-6).toUpperCase()} · {new Date(order.createdAt).toLocaleString()}
                                </p>
                                <p className="font-bold mt-0.5" style={{ color: '#52311B' }}>Customer: {order.user?.name || order.companyName || 'Unknown'}</p>
                              </div>
                              <div className="flex gap-3 items-center">
                                {order.status === 'Pending' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order._id, 'Approved')}
                                    className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                                    style={{ backgroundColor: '#86612F', color: '#ffffff' }}
                                  >
                                    Approve
                                  </button>
                                )}
                                <span className="px-3 py-1 rounded-full text-xs font-bold"
                                  style={order.status === 'Pending'
                                    ? { backgroundColor: 'rgba(134,97,47,0.20)', color: '#52311B' }
                                    : { backgroundColor: 'rgba(82,49,27,0.10)', color: '#52311B' }
                                  }
                                >
                                  {order.status}
                                </span>
                                <span className="font-bold text-lg" style={{ color: '#52311B' }}>${order.totalPrice.toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-3 border-t" style={{ borderColor: 'rgba(87,92,85,0.15)' }}>
                              {order.orderType === 'Bulk' ? (
                                <span className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: 'rgba(208,210,207,0.50)', color: '#52311B' }}>
                                  {order.quantity} Trays (Bulk Request)
                                </span>
                              ) : order.orderItems.map((item, idx) => (
                                <span key={idx} className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: 'rgba(208,210,207,0.50)', color: '#52311B' }}>
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

                {/* ── SETTINGS ─────────────────────────────── */}
                {activeTab === 'settings' && (
                  <form onSubmit={handleSettingsSave} className="space-y-5">
                    {/* Company Identity */}
                    <div className="rounded-2xl p-6 border shadow-lg" style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'rgba(82,49,27,0.10)' }}>
                      <h3 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: '#52311B' }}>
                        <Building2 className="w-5 h-5" style={{ color: '#86612F' }} />
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
                    <div className="rounded-2xl p-6 border shadow-lg" style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'rgba(82,49,27,0.10)' }}>
                      <h3 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: '#52311B' }}>
                        <ImagePlus className="w-5 h-5" style={{ color: '#86612F' }} />
                        Company Logo
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-6 items-start">
                        {/* Preview */}
                        <div className="w-28 h-28 rounded-2xl border-2 border-dashed flex items-center justify-center shrink-0 overflow-hidden"
                          style={{ borderColor: 'rgba(134,97,47,0.50)', backgroundColor: 'rgba(208,210,207,0.20)' }}>
                          {logoPreview ? (
                            <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-2" />
                          ) : (
                            <ImagePlus className="w-8 h-8" style={{ color: 'rgba(87,92,85,0.40)' }} />
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
                          <p className="text-xs" style={{ color: '#575C55' }}>
                            Enter a URL or a path relative to the <code className="bg-gray-100 px-1 py-0.5 rounded">/public</code> folder. The preview updates as you type.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="rounded-2xl p-6 border shadow-lg" style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'rgba(82,49,27,0.10)' }}>
                      <h3 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: '#52311B' }}>
                        <Phone className="w-5 h-5" style={{ color: '#86612F' }} />
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

        {/* ── LEFT Navigation Panel (15%) ──────────────────────────────── */}
        <div className="w-full md:w-52 flex-shrink-0 order-first">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-24"
          >
            {/* Brand/Header */}
            <div
              className="rounded-2xl p-4 mb-3 border shadow-xl"
              style={{ background: '#52311B', borderColor: 'rgba(134,97,47,0.25)' }}
            >
              <div className="flex items-center gap-2.5 mb-0.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#86612F' }}>
                  <Tractor className="w-4 h-4" style={{ color: '#52311B' }} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm leading-tight" style={{ color: '#ffffff' }}>Farm Ops</p>
                  <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.70)' }}>{user?.name}</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <div
              className="rounded-2xl p-2.5 border shadow-xl"
              style={{ background: '#52311B', borderColor: 'rgba(134,97,47,0.15)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: 'rgba(255,255,255,0.50)' }}>Modules</p>
              <nav className="space-y-0.5">
                {navItems.map(({ id, icon: Icon, label, badge }) => (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all text-sm"
                    style={{
                      backgroundColor: activeTab === id ? '#86612F' : 'transparent',
                      color: activeTab === id ? '#ffffff' : 'rgba(255,255,255,0.70)',
                    }}
                    onMouseEnter={e => {
                      if (activeTab !== id) {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)';
                        e.currentTarget.style.color = '#ffffff';
                      }
                    }}
                    onMouseLeave={e => {
                      if (activeTab !== id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.70)';
                      }
                    }}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{label}</span>
                    {badge > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                    {activeTab === id && (
                      <motion.div layoutId="active-farm-pip">
                        <ChevronRight className="w-3 h-3" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}

                <div className="my-2 border-t" style={{ borderColor: 'rgba(134,97,47,0.15)' }} />

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab('settings')}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all text-sm"
                  style={{
                    backgroundColor: activeTab === 'settings' ? '#86612F' : 'transparent',
                    color: activeTab === 'settings' ? '#ffffff' : 'rgba(255,255,255,0.70)',
                  }}
                  onMouseEnter={e => {
                    if (activeTab !== 'settings') {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={e => {
                    if (activeTab !== 'settings') {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.70)';
                    }
                  }}
                >
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">Settings</span>
                </motion.button>
              </nav>

              {/* Live Hen Count Footer */}
              {summary && (
                <div className="mt-3 p-3 rounded-xl border" style={{ backgroundColor: 'rgba(134,97,47,0.12)', borderColor: 'rgba(134,97,47,0.20)' }}>
                  <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.60)' }}>Live Hens</p>
                  <p className="text-xl font-bold mt-0.5" style={{ color: '#ffffff' }}>{summary.totalHens.toLocaleString()}</p>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.40)' }}>Current inventory</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default FarmOperations;
