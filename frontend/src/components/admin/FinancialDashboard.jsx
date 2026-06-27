import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import {
  DollarSign, TrendingUp, TrendingDown, Minus, Plus,
  CheckCircle2, Wallet, Receipt, ArrowUpRight, ArrowDownRight,
  Loader2, Tag, FileText, Info
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

// ── Palette ───────────────────────────────────────────────────────────────────
const CATEGORY_META = {
  'Hen Food':                { icon: '🌾', color: '#F59E0B' },
  'Water Bill':              { icon: '💧', color: '#4A90D9' },
  'Light/Electricity Bill':  { icon: '⚡', color: '#FBBF24' },
  'Wages/Payroll':           { icon: '👷', color: '#8B5CF6' },
  'Transport':               { icon: '🚛', color: '#10B981' },
  'Maintenance':             { icon: '🔧', color: '#EF4444' },
  'Other':                   { icon: '📦', color: '#6B7280' },
};

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const FarmTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-mountain-gold/20 rounded-xl shadow-xl px-3.5 py-2.5 min-w-[140px]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-mountain-gray mb-1.5">{label}</p>
      {payload.map((e, i) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
          <span className="text-[11px] text-mountain-gray flex-1">{e.name}</span>
          <span className="text-[11px] font-bold text-mountain-brown">Rs. {Number(e.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

// ── Mini KPI ──────────────────────────────────────────────────────────────────
const MiniKpi = ({ icon: Icon, label, value, sub, accent, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -3, boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}
    className="bg-white/90 backdrop-blur-sm border border-mountain-gold/20 rounded-2xl p-4 shadow-md cursor-default"
  >
    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: accent + '1A' }}>
      <Icon className="w-4.5 h-4.5" style={{ color: accent }} />
    </div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-mountain-gray/80 mb-0.5">{label}</p>
    <p className="text-lg font-black text-mountain-brown leading-tight">{value}</p>
    {sub && <p className="text-[10px] text-mountain-gray/60 mt-0.5">{sub}</p>}
  </motion.div>
);

// ── History Row ───────────────────────────────────────────────────────────────
const HistoryRow = ({ isNew, children }) => (
  <motion.div
    layout
    initial={isNew ? { opacity: 0, x: -10 } : false}
    animate={{ opacity: 1, x: 0 }}
    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200
      ${isNew ? 'border-mountain-gold/50 bg-mountain-gold/5' : 'border-mountain-gray/10 hover:border-mountain-gold/30 hover:bg-white'}`}
  >
    {children}
  </motion.div>
);

// ── Input class ───────────────────────────────────────────────────────────────
const inp = 'w-full px-3.5 py-2.5 rounded-xl border border-mountain-gray/25 focus:border-mountain-gold outline-none text-sm transition-all bg-white placeholder-mountain-gray/40';

// ── Main Component ────────────────────────────────────────────────────────────
const FinancialDashboard = ({ summary, onRefresh }) => {
  const { user } = useContext(AuthContext);
  const authConfig = { headers: { Authorization: `Bearer ${user?.token}` } };

  // Expense form
  const [expAmount, setExpAmount]     = useState('');
  const [expCategory, setExpCategory] = useState('Hen Food');
  const [expDetails, setExpDetails]   = useState('');
  const [expLoading, setExpLoading]   = useState(false);

  // Revenue form
  const [revAmount, setRevAmount] = useState('');
  const [revSource, setRevSource] = useState('');
  const [revLoading, setRevLoading] = useState(false);

  // Active form panel
  const [activeForm, setActiveForm] = useState('expense'); // 'expense' | 'revenue'

  const totalExpenses = summary.latestExpenses.reduce((s, e) => s + e.amount, 0);
  const totalRevenue  = summary.latestRevenues.reduce((s, r) => s + r.amount, 0);
  const netProfit     = totalRevenue - totalExpenses;
  const isProfit      = netProfit >= 0;

  // Build mini chart data from latest records
  const buildChart = () => {
    const map = {};
    const ensure = (d) => { if (!map[d]) map[d] = { date: d, revenue: 0, expenses: 0 }; };
    summary.latestRevenues.forEach(r => { const d = new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }); ensure(d); map[d].revenue += r.amount; });
    summary.latestExpenses.forEach(e => { const d = new Date(e.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }); ensure(d); map[d].expenses += e.amount; });
    return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  const chartData = buildChart();

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    setExpLoading(true);
    try {
      await axios.post('/api/farm/expenses', { amount: Number(expAmount), category: expCategory, details: expDetails }, authConfig);
      toast.success('💸 Expense recorded!');
      setExpAmount(''); setExpDetails('');
      onRefresh?.();
    } catch { toast.error('Failed to log expense'); }
    finally { setExpLoading(false); }
  };

  const handleRevSubmit = async (e) => {
    e.preventDefault();
    setRevLoading(true);
    try {
      await axios.post('/api/farm/revenues', { amount: Number(revAmount), sourceDescription: revSource }, authConfig);
      toast.success('💰 Revenue recorded!');
      setRevAmount(''); setRevSource('');
      onRefresh?.();
    } catch { toast.error('Failed to log revenue'); }
    finally { setRevLoading(false); }
  };

  return (
    <div className="space-y-5 pb-4">

      {/* ── Top KPI Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniKpi icon={TrendingUp} label="Recent Revenue"  value={`Rs. ${totalRevenue.toLocaleString()}`}  sub={`${summary.latestRevenues.length} entries`}  accent="#22C55E" delay={0}    />
        <MiniKpi icon={Minus}      label="Recent Expenses" value={`Rs. ${totalExpenses.toLocaleString()}`} sub={`${summary.latestExpenses.length} entries`}  accent="#EF4444" delay={0.06} />
        <MiniKpi icon={isProfit ? TrendingUp : TrendingDown}
                                   label="Net Balance"     value={`Rs. ${Math.abs(netProfit).toLocaleString()}`}
                                                                                                           sub={isProfit ? '✅ Profitable' : '⚠️ Net loss'}  accent={isProfit ? '#22C55E' : '#EF4444'} delay={0.12} />
        <MiniKpi icon={Wallet}     label="Live Hen Count"  value={summary.totalHens.toLocaleString()}      sub="Current flock"                               accent="#93631F" delay={0.18} />
      </div>

      {/* ── Mini P&L Chart ── */}
      {chartData.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
          className="bg-white/90 backdrop-blur-sm border border-mountain-gold/20 rounded-2xl p-5 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-black text-mountain-brown text-sm">Recent P&amp;L Activity</h3>
              <p className="text-[11px] text-mountain-gray mt-0.5">Revenue vs expenses from the last 5 entries</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${isProfit ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
              {isProfit ? '▲' : '▼'} Rs. {Math.abs(netProfit).toLocaleString()}
            </span>
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -16, right: 0 }}>
                <defs>
                  <linearGradient id="fRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 10 }} dy={6} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 10 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                <Tooltip content={<FarmTooltip />} />
                <Area type="monotone" dataKey="revenue"  name="Revenue"  stroke="#22C55E" strokeWidth={2} fill="url(#fRev)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#EF4444" strokeWidth={2} fill="url(#fExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* ── Entry Forms + History ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Left: Entry Panel (2/5) */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
          className="lg:col-span-2 bg-white/90 backdrop-blur-sm border border-mountain-gold/20 rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Tab selector */}
          <div className="flex border-b border-mountain-gray/10">
            <button
              onClick={() => setActiveForm('expense')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold transition-all ${
                activeForm === 'expense'
                  ? 'bg-red-50 text-red-600 border-b-2 border-red-400'
                  : 'text-mountain-gray hover:bg-mountain-sand/30'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" /> Log Expense
            </button>
            <button
              onClick={() => setActiveForm('revenue')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold transition-all ${
                activeForm === 'revenue'
                  ? 'bg-green-50 text-green-600 border-b-2 border-green-400'
                  : 'text-mountain-gray hover:bg-mountain-sand/30'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" /> Log Revenue
            </button>
          </div>

          <div className="p-5">
            <AnimatePresence mode="wait">

              {/* ── Expense Form ── */}
              {activeForm === 'expense' && (
                <motion.form key="expense" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }} onSubmit={handleExpSubmit} className="space-y-3.5">

                  <div className="bg-red-50 border border-red-200/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    <p className="text-[11px] text-red-600 font-medium">Record any farm-related cost here.</p>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-mountain-gray mb-1.5">Amount (Rs.)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mountain-gray/60 font-bold text-sm">Rs.</span>
                      <input type="number" min="0.01" step="0.01" required value={expAmount}
                        onChange={e => setExpAmount(e.target.value)}
                        className={`${inp} pl-10 font-bold text-mountain-brown text-base`}
                        placeholder="0.00" />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-mountain-gray mb-1.5">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(CATEGORY_META).map(([cat, meta]) => (
                        <button type="button" key={cat}
                          onClick={() => setExpCategory(cat)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all text-left ${
                            expCategory === cat
                              ? 'border-transparent text-white shadow-sm'
                              : 'border-mountain-gray/20 text-mountain-gray hover:border-mountain-gold bg-white'
                          }`}
                          style={expCategory === cat ? { background: meta.color } : {}}
                        >
                          <span>{meta.icon}</span>
                          <span className="truncate text-[10px]">{cat}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-mountain-gray mb-1.5">Details / Notes</label>
                    <textarea rows="2" required value={expDetails} onChange={e => setExpDetails(e.target.value)}
                      placeholder="e.g. Invoice #123, Supplier: AgroFarm…"
                      className={`${inp} resize-none`} />
                  </div>

                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }} type="submit" disabled={expLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all disabled:opacity-60">
                    {expLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><CheckCircle2 className="w-4 h-4" /> Record Expense</>}
                  </motion.button>
                </motion.form>
              )}

              {/* ── Revenue Form ── */}
              {activeForm === 'revenue' && (
                <motion.form key="revenue" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }} onSubmit={handleRevSubmit} className="space-y-3.5">

                  <div className="bg-green-50 border border-green-200/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    <p className="text-[11px] text-green-700 font-medium">For offline sales not captured by the shop.</p>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-mountain-gray mb-1.5">Amount (Rs.)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mountain-gray/60 font-bold text-sm">Rs.</span>
                      <input type="number" min="0.01" step="0.01" required value={revAmount}
                        onChange={e => setRevAmount(e.target.value)}
                        className={`${inp} pl-10 font-bold text-green-700 text-base`}
                        placeholder="0.00" />
                    </div>
                  </div>

                  {/* Quick source suggestions */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-mountain-gray mb-1.5">Revenue Source</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {['Local market', 'Wholesale buyer', 'Hotel supply', 'Direct sale', 'Egg crate'].map(s => (
                        <button type="button" key={s} onClick={() => setRevSource(s)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                            revSource === s ? 'bg-green-500 text-white border-green-500' : 'border-mountain-gray/20 text-mountain-gray hover:border-mountain-gold bg-white'
                          }`}>
                          {s}
                        </button>
                      ))}
                    </div>
                    <input type="text" required value={revSource} onChange={e => setRevSource(e.target.value)}
                      placeholder="Or type a custom source…"
                      className={inp} />
                  </div>

                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }} type="submit" disabled={revLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all disabled:opacity-60">
                    {revLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><TrendingUp className="w-4 h-4" /> Record Revenue</>}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right: History Tables (3/5) */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}
          className="lg:col-span-3 space-y-4"
        >

          {/* ── Expense History ── */}
          <div className="bg-white/90 backdrop-blur-sm border border-mountain-gold/20 rounded-2xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-mountain-gray/8">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                  <Receipt className="w-3.5 h-3.5 text-red-500" />
                </div>
                <h3 className="font-black text-mountain-brown text-sm">Recent Expenses</h3>
              </div>
              <span className="text-xs font-bold bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-lg">
                Rs. {totalExpenses.toLocaleString()}
              </span>
            </div>

            <div className="p-4 space-y-2">
              {summary.latestExpenses.length === 0 ? (
                <div className="text-center py-8">
                  <Receipt className="w-8 h-8 mx-auto text-mountain-gray/25 mb-2" />
                  <p className="text-xs text-mountain-gray/50 font-medium">No expenses recorded yet</p>
                </div>
              ) : summary.latestExpenses.map((exp, i) => {
                const meta = CATEGORY_META[exp.category] || CATEGORY_META['Other'];
                return (
                  <HistoryRow key={exp._id} isNew={i === 0}>
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                        style={{ background: meta.color + '18' }}>
                        {meta.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-mountain-brown truncate">{exp.category}</p>
                        <p className="text-[10px] text-mountain-gray/70 truncate">{exp.details}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-sm font-black text-red-500">−Rs. {exp.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-mountain-gray/60">
                        {new Date(exp.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </p>
                    </div>
                  </HistoryRow>
                );
              })}
            </div>
          </div>

          {/* ── Revenue History ── */}
          <div className="bg-white/90 backdrop-blur-sm border border-mountain-gold/20 rounded-2xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-mountain-gray/8">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                </div>
                <h3 className="font-black text-mountain-brown text-sm">Recent Revenue</h3>
              </div>
              <span className="text-xs font-bold bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-lg">
                Rs. {totalRevenue.toLocaleString()}
              </span>
            </div>

            <div className="p-4 space-y-2">
              {summary.latestRevenues.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="w-8 h-8 mx-auto text-mountain-gray/25 mb-2" />
                  <p className="text-xs text-mountain-gray/50 font-medium">No revenue recorded yet</p>
                </div>
              ) : summary.latestRevenues.map((rev, i) => (
                <HistoryRow key={rev._id} isNew={i === 0}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 text-base">
                      💰
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-mountain-brown truncate">{rev.sourceDescription}</p>
                      <p className="text-[10px] text-mountain-gray/60">Offline revenue entry</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-sm font-black text-green-600">+Rs. {rev.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-mountain-gray/60">
                      {new Date(rev.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </p>
                  </div>
                </HistoryRow>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
