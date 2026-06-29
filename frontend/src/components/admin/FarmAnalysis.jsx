import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Egg, TrendingUp, TrendingDown, Users, Feather,
  DollarSign, Minus, BarChart3, RefreshCcw, Database
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  brown:  '#93631F',
  moss:   '#3F4321',
  sage:   '#8B9B7B',
  gold:   '#F4C579',
  coral:  '#E86C60',
  sky:    '#4A90D9',
  violet: '#7C6EE8',
  green:  '#22C55E',
};
const PIE_COLORS = [C.brown, C.moss, C.sky, C.coral, C.gold, C.violet, C.sage];

// ── Mock data generator ───────────────────────────────────────────────────────
const genMock = (period) => {
  const points = period === 'daily' ? 30 : period === 'weekly' ? 12 : period === 'monthly' ? 12 : 5;
  const labels = Array.from({ length: points }, (_, i) => {
    if (period === 'daily')   { const d = new Date(); d.setDate(d.getDate() - (points - 1 - i)); return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }); }
    if (period === 'weekly')  return `Wk ${points - i}`;
    if (period === 'monthly') { const d = new Date(); d.setMonth(d.getMonth() - (points - 1 - i)); return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }); }
    return String(new Date().getFullYear() - (points - 1 - i));
  });

  let totRev = 0, totExp = 0, totEggs = 0;
  const chartData = labels.map(label => {
    const eggs    = Math.floor(Math.random() * 600 + 300);
    const revenue = Math.floor(Math.random() * 30000 + 10000);
    const expenses = Math.floor(Math.random() * 22000 + 6000);
    totRev += revenue; totExp += expenses; totEggs += eggs;
    return { period: label, eggs, revenue, expenses, profit: revenue - expenses, henChanges: Math.floor(Math.random() * 20 - 5) };
  });

  return {
    chartData,
    expenseBreakdown: [
      { name: 'Hen Food',      value: Math.floor(totExp * 0.42) },
      { name: 'Wages/Payroll', value: Math.floor(totExp * 0.26) },
      { name: 'Transport',     value: Math.floor(totExp * 0.13) },
      { name: 'Electricity',   value: Math.floor(totExp * 0.09) },
      { name: 'Water',         value: Math.floor(totExp * 0.05) },
      { name: 'Maintenance',   value: Math.floor(totExp * 0.05) },
    ],
    kpis: {
      totalEggs: totEggs, totalRevenue: totRev, totalExpenses: totExp,
      netProfit: totRev - totExp, currentHens: 2345,
      totalWorkers: 18, activeWorkers: 15,
      avgEggs: Math.round(totEggs / points),
    },
  };
};

// ── Custom tooltip ────────────────────────────────────────────────────────────
const FarmTooltip = ({ active, payload, label, currency = false }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-mountain-gold/25 rounded-2xl shadow-2xl px-4 py-3 min-w-[160px]">
      {label && <p className="text-[10px] font-bold uppercase tracking-widest text-mountain-gray mb-2">{label}</p>}
      {payload.map((e, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
          <span className="text-xs text-mountain-gray flex-1">{e.name}</span>
          <span className="text-xs font-bold text-mountain-brown ml-1">
            {currency ? `Rs. ${Number(e.value).toLocaleString()}` : Number(e.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Shimmer skeleton ──────────────────────────────────────────────────────────
const Shimmer = ({ h = 'h-5', w = 'w-full' }) => (
  <div className={`${h} ${w} bg-mountain-sand/40 rounded-xl overflow-hidden relative`}>
    <motion.div
      className="absolute inset-0"
      style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent)', translateX: '-100%' }}
      animate={{ translateX: '200%' }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

// ── KPI Card ──────────────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, sub, accent, positive, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -4, boxShadow: '0 20px 48px rgba(0,0,0,0.09)' }}
    className="bg-white/90 backdrop-blur-sm border border-mountain-gold/20 rounded-2xl p-5 shadow-lg cursor-default"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: accent + '1A' }}>
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      {positive !== undefined && (
        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg ${positive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          {positive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          {positive ? 'Up' : 'Down'}
        </span>
      )}
    </div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-mountain-gray mb-0.5">{label}</p>
    <p className="text-xl font-black text-mountain-brown leading-tight">{value}</p>
    {sub && <p className="text-[11px] text-mountain-gray/70 mt-1">{sub}</p>}
  </motion.div>
);

// ── Chart Section wrapper ─────────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, children, className = '', extra }) => (
  <div className={`bg-white/90 backdrop-blur-sm border border-mountain-gold/20 rounded-2xl p-5 shadow-lg ${className}`}>
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-black text-mountain-brown text-sm leading-tight">{title}</h3>
        {subtitle && <p className="text-[11px] text-mountain-gray mt-0.5">{subtitle}</p>}
      </div>
      {extra}
    </div>
    {children}
  </div>
);

// ── Custom Pie label ──────────────────────────────────────────────────────────
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const R = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  return (
    <text x={cx + r * Math.cos(-midAngle * R)} y={cy + r * Math.sin(-midAngle * R)}
      fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const FarmAnalysis = () => {
  const { user } = useContext(AuthContext);
  const [period, setPeriod]   = useState('daily');
  const [useMock, setUseMock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData]       = useState(null);

  const periods = [
    { id: 'daily',   label: 'Daily'   },
    { id: 'weekly',  label: 'Weekly'  },
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly',  label: 'Yearly'  },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    if (useMock) {
      await new Promise(r => setTimeout(r, 500));
      setData(genMock(period));
      setLoading(false);
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`/api/farm/analytics?period=${period}`, config);
      // Humanise period keys for chart labels
      const fmt = (key) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(key)) return new Date(key).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        if (/^\d{4}-\d{2}$/.test(key))        return new Date(key + '-01').toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
        return key;
      };
      setData({ ...res.data, chartData: res.data.chartData.map(d => ({ ...d, period: fmt(d.period) })) });
    } catch {
      toast.error('Failed to load analytics — showing mock data');
      setData(genMock(period));
    } finally {
      setLoading(false);
    }
  }, [period, useMock, user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const { kpis, chartData, expenseBreakdown } = data || {};

  return (
    <div className="space-y-5 pb-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/75 backdrop-blur-md border border-mountain-gold/20 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-mountain-gold/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-mountain-brown" />
          </div>
          <div>
            <h2 className="font-black text-mountain-brown leading-tight text-sm">Farm Statistics</h2>
            <p className="text-[10px] text-mountain-gray">Hens · Eggs · Revenue · Workers</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Period pills */}
          <div className="flex bg-mountain-sand/50 p-1 rounded-xl gap-0.5">
            {periods.map(p => (
              <button key={p.id} onClick={() => setPeriod(p.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  period === p.id ? 'bg-white text-mountain-brown shadow-sm' : 'text-mountain-gray hover:text-mountain-brown'
                }`}
              >{p.label}</button>
            ))}
          </div>

          {/* Mock toggle */}
          <button onClick={() => setUseMock(m => !m)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              useMock ? 'bg-mountain-gold/20 border-mountain-gold text-mountain-brown' : 'bg-white border-mountain-gray/20 text-mountain-gray hover:border-mountain-gold'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> {useMock ? 'Demo' : 'Live'}
          </button>

          {/* Refresh */}
          <button onClick={fetchData} disabled={loading}
            className="p-1.5 rounded-xl border border-mountain-gray/20 bg-white text-mountain-gray hover:text-mountain-brown hover:border-mountain-gold transition-all disabled:opacity-40">
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      {loading || !kpis ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white/85 border border-mountain-gold/15 rounded-2xl p-5 space-y-3">
              <Shimmer h="h-10" w="w-10" /><Shimmer h="h-3" w="w-20" /><Shimmer h="h-6" w="w-28" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard icon={Egg}        label="Total Eggs"     value={kpis.totalEggs.toLocaleString()}   sub={`Avg ${kpis.avgEggs}/period`}           accent={C.gold}   positive={true}  delay={0}    />
          <KpiCard icon={Feather}    label="Live Hens"      value={kpis.currentHens.toLocaleString()} sub="Current flock size"                      accent={C.brown}                  delay={0.05} />
          <KpiCard icon={TrendingUp} label="Total Revenue"  value={`Rs. ${kpis.totalRevenue.toLocaleString()}`}   sub="All income sources"          accent={C.moss}   positive={true}  delay={0.1}  />
          <KpiCard icon={Minus}      label="Total Expenses" value={`Rs. ${kpis.totalExpenses.toLocaleString()}`}  sub="All cost categories"          accent={C.coral}                  delay={0.15} />
          <KpiCard icon={kpis.netProfit >= 0 ? TrendingUp : TrendingDown}
                                     label="Net Profit"     value={`Rs. ${Math.abs(kpis.netProfit).toLocaleString()}`}
                                                                                                      sub={kpis.netProfit >= 0 ? 'Profitable period' : 'Net loss'}
                                                                                                                                                    accent={kpis.netProfit >= 0 ? C.green : C.coral}
                                                                                                                                                                positive={kpis.netProfit >= 0} delay={0.2}  />
          <KpiCard icon={Users}      label="Total Workers"  value={kpis.totalWorkers}                 sub={`${kpis.activeWorkers} active`}          accent={C.sky}                    delay={0.25} />
          <KpiCard icon={Users}      label="Active Workers" value={kpis.activeWorkers}                sub={`${kpis.totalWorkers - kpis.activeWorkers} on leave/retired`} accent={C.violet} delay={0.3} />
          <KpiCard icon={Egg}        label="Avg Eggs/Period" value={kpis.avgEggs.toLocaleString()}   sub="Production average"                      accent={C.sage}                   delay={0.35} />
        </div>
      )}

      {/* ── Charts Grid ── */}
      <AnimatePresence mode="wait">
        {loading || !chartData ? (
          <motion.div key="sk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`bg-white/85 border border-mountain-gold/15 rounded-2xl p-5 space-y-3 ${i === 0 ? 'lg:col-span-3' : i <= 2 ? 'lg:col-span-2' : ''}`}>
                <Shimmer h="h-4" w="w-40" /><Shimmer h="h-52" />
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div key={period} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }} className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* ── 1. Revenue vs Expenses Area (full width) ── */}
            <ChartCard className="lg:col-span-3"
              title="Revenue vs Expenses"
              subtitle="Income streams compared to total costs across the selected period"
              extra={
                <div className="flex gap-3 text-[10px] flex-wrap justify-end">
                  {[{ c: C.moss, l: 'Revenue' }, { c: C.coral, l: 'Expenses' }, { c: C.sky, l: 'Profit' }].map(({ c, l }) => (
                    <span key={l} className="flex items-center gap-1 font-semibold text-mountain-gray">
                      <span className="w-2 h-2 rounded-full" style={{ background: c }} /> {l}
                    </span>
                  ))}
                </div>
              }
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ left: -10 }}>
                    <defs>
                      {[{ id: 'gRev', c: C.moss }, { id: 'gExp', c: C.coral }, { id: 'gPro', c: C.sky }].map(({ id, c }) => (
                        <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={c} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={c} stopOpacity={0.02} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 10 }} dy={8} interval="preserveStartEnd" />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 10 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                    <Tooltip content={props => <FarmTooltip {...props} currency={true} />} />
                    <Area type="monotone" dataKey="revenue"  name="Revenue"  stroke={C.moss}  strokeWidth={2.5} fill="url(#gRev)" />
                    <Area type="monotone" dataKey="expenses" name="Expenses" stroke={C.coral} strokeWidth={2.5} fill="url(#gExp)" />
                    <Area type="monotone" dataKey="profit"   name="Profit"   stroke={C.sky}   strokeWidth={2}   fill="url(#gPro)" strokeDasharray="5 3" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* ── 2. Egg Production Line Chart ── */}
            <ChartCard className="lg:col-span-2"
              title="🥚 Egg Production Trend"
              subtitle="Daily eggs collected across the selected window"
              extra={
                <span className="text-[10px] font-bold bg-mountain-gold/15 text-mountain-brown border border-mountain-gold/30 px-2.5 py-1 rounded-lg">
                  Avg {kpis.avgEggs} / period
                </span>
              }
            >
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 10 }} dy={8} interval="preserveStartEnd" />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 10 }} />
                    <Tooltip content={props => <FarmTooltip {...props} currency={false} />} />
                    <Line type="monotone" dataKey="eggs" name="Eggs Collected" stroke={C.brown} strokeWidth={2.5}
                      dot={{ r: 3, fill: C.brown, strokeWidth: 0 }} activeDot={{ r: 6, fill: C.gold }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* ── 3. Expense Breakdown Pie ── */}
            <ChartCard title="💸 Expense Breakdown" subtitle="Category distribution">
              {expenseBreakdown?.length > 0 ? (
                <>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={expenseBreakdown} cx="50%" cy="50%"
                          innerRadius={44} outerRadius={70} paddingAngle={3}
                          dataKey="value" stroke="none" labelLine={false} label={PieLabel}
                        >
                          {expenseBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: 11 }}
                          formatter={v => [`Rs. ${v.toLocaleString()}`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1.5 mt-1">
                    {expenseBreakdown.map((item, i) => {
                      const total = expenseBreakdown.reduce((s, e) => s + e.value, 0);
                      const pct = total ? ((item.value / total) * 100).toFixed(0) : 0;
                      return (
                        <div key={item.name} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="text-[10px] text-mountain-gray flex-1 truncate">{item.name}</span>
                          <div className="w-12 h-1 bg-mountain-sand/50 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          </div>
                          <span className="text-[10px] font-bold text-mountain-gray w-7 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="h-44 flex items-center justify-center text-mountain-gray/40 text-sm font-medium">No expense data</div>
              )}
            </ChartCard>

            {/* ── 4. Hen Inventory Changes Bar Chart ── */}
            <ChartCard className="lg:col-span-2"
              title="🐔 Hen Inventory Changes"
              subtitle="Net additions and removals to the flock each period"
            >
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 10 }} dy={8} interval="preserveStartEnd" />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 10 }} />
                    <Tooltip content={props => <FarmTooltip {...props} currency={false} />} />
                    <Bar dataKey="henChanges" name="Hen Changes" radius={[5, 5, 0, 0]}
                      fill={C.brown}
                      label={false}
                    >
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.henChanges >= 0 ? C.moss : C.coral} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-2 text-[10px]">
                <span className="flex items-center gap-1 text-mountain-gray font-semibold"><span className="w-2 h-2 rounded-full" style={{ background: C.moss }} /> Additions</span>
                <span className="flex items-center gap-1 text-mountain-gray font-semibold"><span className="w-2 h-2 rounded-full" style={{ background: C.coral }} /> Removals</span>
              </div>
            </ChartCard>

            {/* ── 5. P&L Bar Chart ── */}
            <ChartCard title="📊 Profit & Loss Bars" subtitle="Revenue vs expenses per period as grouped bars">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ left: -10 }} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 10 }} dy={8} interval="preserveStartEnd" />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 10 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                    <Tooltip content={props => <FarmTooltip {...props} currency={true} />} />
                    <Bar dataKey="revenue"  name="Revenue"  fill={C.moss}  radius={[4, 4, 0, 0]} barSize={12} />
                    <Bar dataKey="expenses" name="Expenses" fill={C.coral} radius={[4, 4, 0, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo data banner */}
      <AnimatePresence>
        {useMock && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            className="flex items-center gap-2 bg-mountain-gold/15 border border-mountain-gold/40 rounded-xl px-4 py-2.5 text-xs text-mountain-brown font-medium">
            <Database className="w-4 h-4 text-mountain-gold flex-shrink-0" />
            You are viewing <strong className="mx-1">demo data</strong>. Click "Live" to connect to your real farm database.
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FarmAnalysis;
