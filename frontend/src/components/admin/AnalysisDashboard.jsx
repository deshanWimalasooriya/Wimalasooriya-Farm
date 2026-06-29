import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, Egg, Minus,
  Activity, RefreshCcw, Database, BarChart3
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

// ── Palette ────────────────────────────────────────────────────────────────────
const PALETTE = {
  brown:   '#93631F',
  moss:    '#3F4321',
  sage:    '#8B9B7B',
  sand:    '#C7B798',
  coral:   '#E86C60',
  gold:    '#F4C579',
  sky:     '#4A90D9',
  violet:  '#7C6EE8',
};
const PIE_COLORS = [PALETTE.brown, PALETTE.moss, PALETTE.sky, PALETTE.coral, PALETTE.gold, PALETTE.violet, PALETTE.sage];

// ── Skeleton Loader ────────────────────────────────────────────────────────────
const Shimmer = ({ className = '' }) => (
  <div className={`relative overflow-hidden bg-mountain-sand/30 rounded-xl ${className}`}>
    <motion.div
      className="absolute inset-0 -translate-x-full"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}
      animate={{ translateX: ['−100%', '200%'] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

const KpiSkeleton = () => (
  <div className="bg-white/85 border border-mountain-gold/20 rounded-2xl p-6 shadow-lg space-y-3">
    <Shimmer className="h-4 w-24" />
    <Shimmer className="h-8 w-36" />
    <Shimmer className="h-3 w-20" />
  </div>
);

const ChartSkeleton = ({ tall = false }) => (
  <div className={`bg-white/85 border border-mountain-gold/20 rounded-2xl p-6 shadow-lg space-y-4 ${tall ? 'col-span-2' : ''}`}>
    <Shimmer className="h-5 w-40" />
    <Shimmer className={tall ? 'h-72' : 'h-52'} />
  </div>
);

// ── Recharts custom tooltip ────────────────────────────────────────────────────
const FarmTooltip = ({ active, payload, label, currency = true }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-mountain-gold/20 rounded-2xl shadow-2xl px-4 py-3 min-w-[140px]">
      {label && <p className="text-[11px] font-bold text-mountain-gray uppercase tracking-wider mb-2">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.color }} />
          <span className="text-xs text-mountain-gray flex-1">{entry.name}</span>
          <span className="text-xs font-bold text-mountain-brown ml-2">
            {currency ? `Rs. ${Number(entry.value).toLocaleString()}` : Number(entry.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-mountain-gold/20 rounded-xl shadow-xl px-3 py-2">
      <p className="text-xs font-bold text-mountain-brown">{payload[0].name}</p>
      <p className="text-xs text-mountain-gray">Rs. {payload[0].value.toLocaleString()}</p>
      <p className="text-xs text-mountain-moss font-semibold">{payload[0].payload.percent?.toFixed(1)}%</p>
    </div>
  );
};

// ── Custom Pie Label ───────────────────────────────────────────────────────────
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ── Mock Data Generator ────────────────────────────────────────────────────────
const generateMock = (days = 14) => {
  const now = new Date();
  const revenueExpensesChart = [];
  const productionChart = [];
  let totRev = 0, totExp = 0, totEggs = 0;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const shopSales  = Math.floor(Math.random() * 25000 + 8000);
    const offlineSales = Math.floor(Math.random() * 12000 + 2000);
    const expenses   = Math.floor(Math.random() * 18000 + 5000);
    const eggs       = Math.floor(Math.random() * 800 + 400);
    totRev += shopSales + offlineSales;
    totExp += expenses;
    totEggs += eggs;
    revenueExpensesChart.push({ date: label, shopSales, offlineSales, expenses });
    productionChart.push({ date: label, eggs, liveHens: 2200 + Math.floor(Math.random() * 200 - 100) });
  }

  return {
    kpis: {
      totalRevenue: totRev,
      totalExpenses: totExp,
      netProfit: totRev - totExp,
      totalEggs: totEggs,
      currentHenCount: 2345,
      layingRate: ((totEggs / days / 2345) * 100).toFixed(1),
    },
    revenueExpensesChart,
    productionChart,
    expenseChart: [
      { name: 'Hen Food',     value: Math.floor(totExp * 0.45) },
      { name: 'Wages/Payroll',value: Math.floor(totExp * 0.25) },
      { name: 'Transport',    value: Math.floor(totExp * 0.12) },
      { name: 'Electricity',  value: Math.floor(totExp * 0.08) },
      { name: 'Water',        value: Math.floor(totExp * 0.05) },
      { name: 'Maintenance',  value: Math.floor(totExp * 0.05) },
    ],
    topExpenseTable: [
      { category: 'Hen Food',      amount: Math.floor(totExp * 0.45), change: +3.2 },
      { category: 'Wages/Payroll', amount: Math.floor(totExp * 0.25), change: +0.0 },
      { category: 'Transport',     amount: Math.floor(totExp * 0.12), change: -5.1 },
      { category: 'Electricity',   amount: Math.floor(totExp * 0.08), change: +8.4 },
      { category: 'Water',         amount: Math.floor(totExp * 0.05), change: -2.0 },
      { category: 'Maintenance',   amount: Math.floor(totExp * 0.05), change: +1.5 },
    ],
  };
};

// ── KPI Card ───────────────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, sub, trend, trendLabel, accent, delay }) => {
  const isPositive = trend >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, boxShadow: '0 20px 50px rgba(0,0,0,0.10)' }}
      className="bg-white/90 backdrop-blur-sm border border-mountain-gold/20 rounded-2xl p-6 shadow-lg cursor-default transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: accent + '18' }}>
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg ${
            isPositive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-mountain-gray mb-1">{label}</p>
      <p className="text-2xl font-black text-mountain-brown leading-tight">{value}</p>
      {(sub || trendLabel) && (
        <p className="text-xs text-mountain-gray/70 mt-1.5">{sub || trendLabel}</p>
      )}
    </motion.div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const AnalysisDashboard = () => {
  const { user } = useContext(AuthContext);
  const [timeFilter, setTimeFilter] = useState('7days');
  const [useMock, setUseMock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const filterOptions = [
    { value: '7days',     label: 'Last 7 Days' },
    { value: 'thisMonth', label: 'This Month'  },
    { value: 'thisYear',  label: 'This Year'   },
    { value: 'allTime',   label: 'All Time'    },
  ];

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    if (useMock) {
      await new Promise(r => setTimeout(r, 600)); // simulate latency
      const days = timeFilter === '7days' ? 7 : timeFilter === 'thisMonth' ? 30 : 90;
      setData(generateMock(days));
      setLastUpdated(new Date());
      setLoading(false);
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`/api/admin/advanced-analytics?filter=${timeFilter}`, config);
      // Normalise dates → human-readable labels on chart data
      const fmt = (str) => {
        const d = new Date(str);
        return isNaN(d) ? str : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      };
      const normalised = {
        ...res.data,
        revenueExpensesChart: res.data.revenueExpensesChart.map(r => ({ ...r, date: fmt(r.date) })),
        productionChart:      res.data.productionChart.map(r => ({ ...r, date: fmt(r.date) })),
      };
      // Build topExpenseTable from expenseChart if not returned
      if (!normalised.topExpenseTable && normalised.expenseChart) {
        const total = normalised.expenseChart.reduce((s, e) => s + e.value, 0);
        normalised.topExpenseTable = normalised.expenseChart.map(e => ({
          category: e.name,
          amount: e.value,
          change: 0,
          pct: total ? ((e.value / total) * 100).toFixed(1) : 0,
        }));
      }
      setData(normalised);
      setLastUpdated(new Date());
    } catch {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [timeFilter, useMock, user]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-10">

      {/* ── Header bar ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/75 backdrop-blur-md border border-mountain-gold/20 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-mountain-gold/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-mountain-brown" />
          </div>
          <div>
            <h3 className="font-black text-mountain-brown leading-none">Farm Analytics</h3>
            {lastUpdated && (
              <p className="text-[10px] text-mountain-gray mt-0.5">
                Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Date filter pills */}
          <div className="flex bg-mountain-sand/50 p-1 rounded-xl overflow-x-auto gap-0.5">
            {filterOptions.map(f => (
              <button
                key={f.value}
                onClick={() => setTimeFilter(f.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  timeFilter === f.value
                    ? 'bg-white text-mountain-brown shadow-sm'
                    : 'text-mountain-gray hover:text-mountain-brown'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Mock / Live toggle */}
          <button
            onClick={() => setUseMock(m => !m)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              useMock
                ? 'bg-mountain-gold/20 border-mountain-gold text-mountain-brown'
                : 'bg-white border-mountain-gray/20 text-mountain-gray hover:border-mountain-gold'
            }`}
            title={useMock ? 'Switch to Live API data' : 'Switch to Mock data'}
          >
            <Database className="w-3.5 h-3.5" />
            {useMock ? 'Mock' : 'Live'}
          </button>

          {/* Refresh */}
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="p-2 rounded-xl border border-mountain-gray/20 bg-white text-mountain-gray hover:text-mountain-brown hover:border-mountain-gold transition-all disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      {loading || !data ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <KpiSkeleton key={i} />)}
        </div>
      ) : (() => {
        const { kpis } = data;
        const isProfit = kpis.netProfit >= 0;
        const profitMargin = kpis.totalRevenue > 0
          ? ((kpis.netProfit / kpis.totalRevenue) * 100).toFixed(1)
          : 0;
        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              icon={isProfit ? TrendingUp : TrendingDown}
              label="Net Profit"
              value={`Rs. ${Math.abs(kpis.netProfit).toLocaleString()}`}
              sub={isProfit ? `${profitMargin}% margin` : 'Net loss this period'}
              trend={isProfit ? +parseFloat(profitMargin) : -parseFloat(profitMargin)}
              accent={isProfit ? '#22C55E' : '#EF4444'}
              delay={0}
            />
            <KpiCard
              icon={DollarSign}
              label="Total Revenue"
              value={`Rs. ${kpis.totalRevenue.toLocaleString()}`}
              sub="Shop + offline sales"
              accent={PALETTE.sky}
              delay={0.05}
            />
            <KpiCard
              icon={Minus}
              label="Total Expenses"
              value={`Rs. ${kpis.totalExpenses.toLocaleString()}`}
              sub="All cost categories"
              accent={PALETTE.coral}
              delay={0.1}
            />
            <KpiCard
              icon={Egg}
              label="Avg Daily Yield"
              value={`${Math.round(kpis.totalEggs / (data.productionChart?.length || 1)).toLocaleString()} eggs`}
              sub={`${kpis.layingRate}% laying rate`}
              trend={+parseFloat(kpis.layingRate)}
              accent={PALETTE.gold}
              delay={0.15}
            />
          </div>
        );
      })()}

      {/* ── Main Charts ── */}
      <AnimatePresence mode="wait">
        {loading || !data ? (
          <motion.div key="skeletons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <ChartSkeleton tall />
            <ChartSkeleton />
            <ChartSkeleton />
          </motion.div>
        ) : (
          <motion.div key="charts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ── P&L Area Chart (full width) ── */}
            <div className="lg:col-span-3 bg-white/90 backdrop-blur-sm border border-mountain-gold/20 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-base font-black text-mountain-brown">Profit &amp; Loss Overview</h2>
                  <p className="text-xs text-mountain-gray mt-0.5">Revenue streams vs expenses across the selected period</p>
                </div>
                <div className="flex gap-4 text-xs">
                  {[
                    { color: PALETTE.moss,  label: 'Shop Sales'  },
                    { color: PALETTE.sage,  label: 'Offline Rev' },
                    { color: PALETTE.coral, label: 'Expenses'    },
                  ].map(({ color, label }) => (
                    <span key={label} className="flex items-center gap-1.5 font-semibold text-mountain-gray">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} /> {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.revenueExpensesChart} margin={{ left: -10 }}>
                    <defs>
                      {[
                        { id: 'gShop',    color: PALETTE.moss  },
                        { id: 'gOffline', color: PALETTE.sage  },
                        { id: 'gExp',     color: PALETTE.coral },
                      ].map(({ id, color }) => (
                        <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={color} stopOpacity={0.22} />
                          <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 11 }} tickFormatter={v => `${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                    <Tooltip content={<FarmTooltip />} />
                    <Area type="monotone" dataKey="shopSales"   name="Shop Sales"     stroke={PALETTE.moss}  strokeWidth={2.5} fill="url(#gShop)"    />
                    <Area type="monotone" dataKey="offlineSales" name="Offline Revenue" stroke={PALETTE.sage}  strokeWidth={2}   fill="url(#gOffline)" />
                    <Area type="monotone" dataKey="expenses"    name="Expenses"       stroke={PALETTE.coral} strokeWidth={2.5} fill="url(#gExp)"     />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Expense Pie Chart ── */}
            <div className="lg:col-span-1 bg-white/90 backdrop-blur-sm border border-mountain-gold/20 rounded-2xl p-6 shadow-lg flex flex-col">
              <h2 className="text-base font-black text-mountain-brown mb-1">Expense Breakdown</h2>
              <p className="text-xs text-mountain-gray mb-4">Where your money is going</p>
              {data.expenseChart?.length > 0 ? (
                <>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.expenseChart.map((e, i, arr) => ({
                            ...e,
                            percent: (e.value / arr.reduce((s, x) => s + x.value, 0)) * 100
                          }))}
                          cx="50%" cy="50%"
                          innerRadius={54} outerRadius={82}
                          paddingAngle={3} dataKey="value"
                          stroke="none"
                          labelLine={false}
                          label={renderPieLabel}
                        >
                          {data.expenseChart.map((_, idx) => (
                            <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {data.expenseChart.map((item, idx) => {
                      const total = data.expenseChart.reduce((s, e) => s + e.value, 0);
                      const pct = ((item.value / total) * 100).toFixed(1);
                      return (
                        <div key={item.name} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                          <span className="text-xs text-mountain-gray flex-1 truncate">{item.name}</span>
                          <span className="text-xs font-bold text-mountain-brown">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-mountain-gray/50 h-52">
                  <Activity className="w-10 h-10 mb-2" />
                  <p className="text-sm font-medium">No expense data</p>
                </div>
              )}
            </div>

            {/* ── Egg Production Line Chart ── */}
            <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm border border-mountain-gold/20 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-black text-mountain-brown">Production Trends</h2>
                <span className="text-xs font-bold bg-mountain-gold/15 text-mountain-brown border border-mountain-gold/30 px-3 py-1 rounded-lg">
                  {data.kpis.layingRate}% Laying Rate
                </span>
              </div>
              <p className="text-xs text-mountain-gray mb-5">Daily egg collection vs active hen headcount</p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.productionChart} margin={{ left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 11 }} dy={10} />
                    <YAxis yAxisId="left"  axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#B4B4B4', fontSize: 11 }} />
                    <Tooltip content={props => <FarmTooltip {...props} currency={false} />} />
                    <Line yAxisId="left"  type="monotone" dataKey="eggs"     name="Eggs Collected" stroke={PALETTE.brown} strokeWidth={2.5} dot={{ r: 3, fill: PALETTE.brown }}     activeDot={{ r: 5 }} />
                    <Line yAxisId="right" type="monotone" dataKey="liveHens" name="Active Hens"    stroke={PALETTE.sky}  strokeWidth={2}   dot={false} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Expense Summary Table ── */}
      {!loading && data?.topExpenseTable && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/90 backdrop-blur-sm border border-mountain-gold/20 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-mountain-gold/15 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-mountain-brown">Expense Summary</h2>
              <p className="text-xs text-mountain-gray mt-0.5">Category breakdown with period comparison</p>
            </div>
            <span className="text-xs font-bold bg-mountain-sand/40 text-mountain-brown px-3 py-1 rounded-lg border border-mountain-gold/20">
              {filterOptions.find(f => f.value === timeFilter)?.label}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-mountain-sand/15 border-b border-mountain-gold/10">
                  {['Category', 'Amount (Rs.)', '% of Total', 'vs Prior Period'].map(h => (
                    <th key={h} className="py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-mountain-gray">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.topExpenseTable.map((row, i) => {
                  const total = data.topExpenseTable.reduce((s, r) => s + r.amount, 0);
                  const pct = total > 0 ? ((row.amount / total) * 100).toFixed(1) : 0;
                  const isUp = row.change > 0;
                  return (
                    <tr key={row.category} className={`border-b border-mountain-gray/8 hover:bg-mountain-sand/10 transition-colors ${i % 2 === 0 ? '' : 'bg-mountain-sand/5'}`}>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="text-sm font-semibold text-mountain-brown">{row.category}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 font-bold text-mountain-brown text-sm">
                        {row.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-mountain-sand/50 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          </div>
                          <span className="text-xs font-bold text-mountain-gray">{pct}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        {row.change !== 0 ? (
                          <span className={`flex items-center gap-1 text-xs font-bold ${isUp ? 'text-red-500' : 'text-green-600'}`}>
                            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {isUp ? '+' : ''}{row.change}%
                          </span>
                        ) : (
                          <span className="text-xs text-mountain-gray/50">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-mountain-sand/20 border-t-2 border-mountain-gold/20">
                  <td className="py-3.5 px-6 font-black text-mountain-brown text-sm">Total</td>
                  <td className="py-3.5 px-6 font-black text-mountain-brown text-sm">
                    {data.topExpenseTable.reduce((s, r) => s + r.amount, 0).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-mountain-gray text-xs">100%</td>
                  <td className="py-3.5 px-6" />
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>
      )}

      {/* Mock data banner */}
      <AnimatePresence>
        {useMock && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="flex items-center gap-2 bg-mountain-gold/15 border border-mountain-gold/40 rounded-xl px-4 py-2.5 text-sm text-mountain-brown font-medium"
          >
            <Database className="w-4 h-4 text-mountain-gold flex-shrink-0" />
            You are viewing <strong>demo / mock data</strong>. Toggle the "Live" button above to connect to the real API.
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AnalysisDashboard;
