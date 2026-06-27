import { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Tractor, Egg, DollarSign, TrendingUp, Minus, Plus,
  Settings, Users, Truck, BarChart3, LayoutDashboard,
  Wallet, ChevronRight, AlertCircle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Feather
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Skeleton from '../components/Skeleton';
import WorkerManagement from '../components/admin/WorkerManagement';
import TransportManagement from '../components/admin/TransportManagement';
import FarmAnalysis from '../components/admin/FarmAnalysis';
import FinancialDashboard from '../components/admin/FinancialDashboard';

// ─── Activity Row ─────────────────────────────────────────────────────────────
const ActivityRow = ({ isNew = false, children }) => (
  <div className={`flex justify-between items-center p-3 rounded-xl border border-[#DDE3EC] hover:border-[#C8DCF0] hover:bg-[#E8F1FA]/50 transition-all duration-200 ${isNew ? 'activity-row-new' : ''}`}>
    {children}
  </div>
);

// ─── Stat Pill ────────────────────────────────────────────────────────────────
const StatPill = ({ value, positive }) => (
  <span
    className="stat-badge"
    style={{
      background: positive ? '#DCFCE7' : '#FEE2E2',
      color: positive ? '#15803D' : '#B91C1C'
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
    className="widget-card p-5 flex items-center gap-4"
  >
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: color + '1A' }}>
      <Icon className="w-6 h-6" style={{ color }} />
    </div>
    <div>
      <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-[#1A2B4A] mt-0.5">{value}</p>
    </div>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const FarmOperations = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newRowId, setNewRowId] = useState(null);

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

  useEffect(() => { fetchSummary(); }, []);

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
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/farm-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Warm earthy overlay matching site palette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(55,46,25,0.65) 0%, rgba(63,67,33,0.50) 50%, rgba(244,197,121,0.20) 100%)' }}
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
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(147,99,31,0.9)' }}>
              <Tractor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-mountain-sand leading-tight">Farm Operations</h1>
              <p className="text-sm text-mountain-gold/70 mt-0.5">Internal Monitoring & Inventory Management</p>
            </div>
          </motion.div>

          {/* ── Tab Content ─────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton.Card /><Skeleton.Card /><Skeleton.Card /><Skeleton.Card />
              </motion.div>
            ) : !summary ? (
              <motion.div key="error" {...{ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }}
                className="widget-card p-12 text-center"
              >
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="font-bold text-[#1A2B4A]">Failed to load summary</p>
                <p className="text-sm text-[#64748B] mt-1">Please check your backend connection and try refreshing.</p>
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
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <KpiCard icon={Tractor}    label="Live Hens"      value={summary.totalHens.toLocaleString()} color="#4A90D9" delay={0} />
                      <KpiCard icon={Egg}        label="Batches Logged" value={summary.latestProduction.length}    color="#F59E0B" delay={0.05} />
                      <KpiCard icon={Minus}      label="Recent Expenses" value={summary.latestExpenses.length}     color="#EF4444" delay={0.1} />
                      <KpiCard icon={TrendingUp} label="Revenue Entries" value={summary.latestRevenues.length}     color="#22C55E" delay={0.15} />
                    </div>

                    {/* Recent Hen Log */}
                    <div className="widget-card p-6">
                      <h3 className="font-bold text-[#1A2B4A] mb-4 flex items-center gap-2">
                        <Feather className="w-4 h-4 text-[#4A90D9]" /> Recent Activity
                      </h3>
                      <div className="space-y-2">
                        {summary.latestHenLogs.length === 0 && (
                          <p className="text-sm text-[#94A3B8] text-center py-4">No hen activity yet.</p>
                        )}
                        {summary.latestHenLogs.map((log, i) => (
                          <ActivityRow key={i}>
                            <div>
                              <p className="text-sm font-semibold text-[#1A2B4A] capitalize">{log.type}</p>
                              <p className="text-xs text-[#94A3B8]">{new Date(log.date).toLocaleDateString()} {log.reason ? `· ${log.reason}` : ''}</p>
                            </div>
                            <StatPill value={`${log.quantityChange} hens`} positive={log.type === 'addition'} />
                          </ActivityRow>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── PRODUCTION ──────────────────────────────────────── */}
                {activeTab === 'production' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                      {/* Hen Management Widget */}
                      <div className="widget-card p-6">
                        <div className="flex items-center justify-between mb-5">
                          <h2 className="font-bold text-[#1A2B4A] flex items-center gap-2">
                            <Tractor className="w-5 h-5 text-[#4A90D9]" /> Hen Inventory
                          </h2>
                          <span className="stat-badge" style={{ background: '#DBEAFE', color: '#1D4ED8' }}>
                            {summary.totalHens.toLocaleString()} live
                          </span>
                        </div>
                        <form onSubmit={handleHenSubmit} className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <select
                              className="winter-input winter-select"
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
                            className={`w-full btn-primary justify-center ${henLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                          >
                            {henLoading ? <><span className="btn-spinner" /> Saving…</> : <><CheckCircle2 className="w-4 h-4" /> Log Update</>}
                          </motion.button>
                        </form>
                      </div>

                      {/* Daily Production Widget */}
                      <div className="widget-card p-6">
                        <h2 className="font-bold text-[#1A2B4A] flex items-center gap-2 mb-5">
                          <Egg className="w-5 h-5 text-[#F59E0B]" /> Daily Egg Production
                        </h2>
                        <form onSubmit={handleProdSubmit} className="space-y-3">
                          <input
                            type="number" min="1" required
                            placeholder="Total eggs collected today"
                            className="winter-input text-lg font-semibold"
                            value={prodEggs}
                            onChange={(e) => setProdEggs(e.target.value)}
                          />
                          <p className="text-xs text-[#94A3B8]">Each submission creates a new dated record.</p>
                          <motion.button
                            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={prodLoading}
                            className={`w-full btn-success justify-center ${prodLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                          >
                            {prodLoading ? <><span className="btn-spinner" /> Saving…</> : <><CheckCircle2 className="w-4 h-4" /> Log Production</>}
                          </motion.button>
                        </form>
                      </div>
                    </div>

                    {/* Activity Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="widget-card p-6">
                        <h3 className="font-bold text-[#1A2B4A] mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                          <Tractor className="w-4 h-4 text-[#4A90D9]" /> Hen Adjustments
                        </h3>
                        <div className="space-y-2">
                          {summary.latestHenLogs.length === 0 && <p className="text-sm text-[#94A3B8] text-center py-4">No records yet.</p>}
                          {summary.latestHenLogs.map((log, i) => (
                            <ActivityRow key={log._id || i} isNew={newRowId?.startsWith('hen') && i === 0}>
                              <div>
                                <p className="text-sm font-semibold text-[#1A2B4A] capitalize">{log.type}</p>
                                <p className="text-xs text-[#94A3B8]">{new Date(log.date).toLocaleDateString()} {log.reason ? `· ${log.reason}` : ''}</p>
                              </div>
                              <StatPill value={`${log.type === 'addition' ? '+' : '-'}${log.quantityChange}`} positive={log.type === 'addition'} />
                            </ActivityRow>
                          ))}
                        </div>
                      </div>

                      <div className="widget-card p-6">
                        <h3 className="font-bold text-[#1A2B4A] mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                          <Egg className="w-4 h-4 text-[#F59E0B]" /> Egg Production Log
                        </h3>
                        <div className="space-y-2">
                          {summary.latestProduction.length === 0 && <p className="text-sm text-[#94A3B8] text-center py-4">No records yet.</p>}
                          {summary.latestProduction.map((p, i) => (
                            <ActivityRow key={p._id} isNew={newRowId?.startsWith('prod') && i === 0}>
                              <p className="text-sm text-[#64748B]">{new Date(p.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                              <StatPill value={`+${p.totalEggsCollected} eggs`} positive={true} />
                            </ActivityRow>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── FINANCIAL ───────────────────────────────────────── */}
                {activeTab === 'financial' && (
                  <div className="bg-white/95 rounded-2xl p-4 shadow-xl border border-mountain-gold/20">
                    <FinancialDashboard summary={summary} onRefresh={fetchSummary} />
                  </div>
                )}

                {/* ── WORKERS ─────────────────────────────────────────── */}
                {activeTab === 'workers' && (
                  <div className="bg-white/95 rounded-2xl p-4 shadow-xl border border-mountain-gold/20">
                    <WorkerManagement />
                  </div>
                )}

                {/* ── TRANSPORT ───────────────────────────────────────── */}
                {activeTab === 'transport' && (
                  <div className="bg-white/95 rounded-2xl p-4 shadow-xl border border-mountain-gold/20">
                    <TransportManagement />
                  </div>
                )}

                {/* ── ANALYSIS ────────────────────────────────────────── */}
                {activeTab === 'analysis' && (
                  <div className="bg-white/95 rounded-2xl p-4 shadow-xl border border-mountain-gold/20">
                    <FarmAnalysis />
                  </div>
                )}

                {/* ── COMING SOON MODULES ─────────────────────────────── */}
                {['settings'].includes(activeTab) && (
                  <div className="widget-card p-16 text-center">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {activeTab === 'analysis'  && <BarChart3 className="w-16 h-16 mx-auto mb-4" style={{ color: '#4A90D9' }} />}
                      {activeTab === 'workers'   && <Users     className="w-16 h-16 mx-auto mb-4" style={{ color: '#4A90D9' }} />}
                      {activeTab === 'transport' && <Truck     className="w-16 h-16 mx-auto mb-4" style={{ color: '#4A90D9' }} />}
                      {activeTab === 'settings'  && <Settings  className="w-16 h-16 mx-auto mb-4" style={{ color: '#4A90D9' }} />}
                    </motion.div>
                    <h2 className="text-xl font-bold text-[#1A2B4A] capitalize">{activeTab}</h2>
                    <p className="text-sm text-[#94A3B8] mt-2">This module is coming in Phase 7.</p>
                  </div>
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
              className="rounded-2xl p-4 mb-3 border border-mountain-gold/30 shadow-xl"
              style={{ background: 'rgba(55,46,25,0.88)', backdropFilter: 'blur(12px)' }}
            >
              <div className="flex items-center gap-2.5 mb-0.5">
                <div className="w-8 h-8 rounded-xl bg-mountain-gold flex items-center justify-center shrink-0">
                  <Tractor className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-mountain-sand text-sm leading-tight">Farm Ops</p>
                  <p className="text-[11px] text-mountain-gold/70 truncate">{user?.name}</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <div
              className="rounded-2xl p-2.5 border border-mountain-gold/20 shadow-xl"
              style={{ background: 'rgba(55,46,25,0.82)', backdropFilter: 'blur(12px)' }}
            >
              <p className="text-[10px] font-bold text-mountain-gold/50 uppercase tracking-widest px-2 mb-2">Modules</p>
              <nav className="space-y-0.5">
                {navItems.map(({ id, icon: Icon, label }) => (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all text-sm ${
                      activeTab === id
                        ? 'bg-mountain-gold text-mountain-brown shadow-md'
                        : 'text-mountain-sand/70 hover:bg-mountain-gold/10 hover:text-mountain-sand'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{label}</span>
                    {activeTab === id && (
                      <motion.div layoutId="active-farm-pip">
                        <ChevronRight className="w-3 h-3" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}

                <div className="my-2 border-t border-mountain-gold/15" />

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all text-sm ${
                    activeTab === 'settings'
                      ? 'bg-mountain-gold text-mountain-brown shadow-md'
                      : 'text-mountain-sand/70 hover:bg-mountain-gold/10 hover:text-mountain-sand'
                  }`}
                >
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">Settings</span>
                </motion.button>
              </nav>

              {/* Live Hen Count Footer */}
              {summary && (
                <div className="mt-3 p-3 rounded-xl border border-mountain-gold/20" style={{ background: 'rgba(244,197,121,0.12)' }}>
                  <p className="text-[10px] text-mountain-gold/60 font-medium uppercase tracking-wider">Live Hens</p>
                  <p className="text-xl font-bold text-mountain-sand mt-0.5">{summary.totalHens.toLocaleString()}</p>
                  <p className="text-[10px] text-mountain-sand/40">Current inventory</p>
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
