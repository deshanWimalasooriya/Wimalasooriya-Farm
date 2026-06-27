/**
 * Skeleton — Reusable shimmer placeholder
 *
 * Props:
 *   className   – Tailwind/CSS classes for sizing (e.g. "h-4 w-32")
 *   rounded     – border-radius variant: 'sm' | 'md' | 'lg' | 'full'  (default 'md')
 *   count       – render N skeleton lines stacked (default 1)
 *   gap         – gap between stacked lines in px (default 10)
 *
 * Pre-built composites:
 *   <Skeleton.Card />           – full widget-card placeholder
 *   <Skeleton.Row />            – single activity-row placeholder
 *   <Skeleton.KpiCard />        – KPI stat card placeholder
 *   <Skeleton.TableRow />       – table row placeholder
 *   <Skeleton.Text lines={3} /> – paragraph of text lines
 */

const RADIUS = { sm: '0.25rem', md: '0.5rem', lg: '0.75rem', full: '9999px' };

// ─── Base shimmer bar ────────────────────────────────────────────────────────
const Bar = ({ className = '', rounded = 'md', style = {} }) => (
  <div
    className={`skeleton ${className}`}
    style={{ borderRadius: RADIUS[rounded] || RADIUS.md, ...style }}
    aria-hidden="true"
  />
);

// ─── Stacked text lines ───────────────────────────────────────────────────────
const Text = ({ lines = 3, gap = 10 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>
    {Array.from({ length: lines }).map((_, i) => (
      <Bar
        key={i}
        className="h-3"
        style={{ width: i === lines - 1 ? '65%' : '100%' }}
      />
    ))}
  </div>
);

// ─── KPI stat card skeleton ───────────────────────────────────────────────────
const KpiCard = () => (
  <div
    className="widget-card p-5 flex items-center gap-4"
    aria-hidden="true"
  >
    <Bar className="w-12 h-12 flex-shrink-0" rounded="lg" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Bar className="h-3 w-1/2" />
      <Bar className="h-6 w-3/4" />
    </div>
  </div>
);

// ─── Full widget card skeleton ────────────────────────────────────────────────
const Card = () => (
  <div className="widget-card p-6" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} aria-hidden="true">
    {/* Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Bar className="h-4 w-1/3" />
      <Bar className="h-6 w-16" rounded="full" />
    </div>
    {/* Body */}
    <Text lines={2} />
    {/* Inputs */}
    <Bar className="h-10 w-full" rounded="lg" />
    <Bar className="h-10 w-full" rounded="lg" />
    {/* Button */}
    <Bar className="h-10 w-full" rounded="lg" />
  </div>
);

// ─── Activity row skeleton ────────────────────────────────────────────────────
const Row = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem',
      borderRadius: '0.75rem',
      border: '1px solid #DDE3EC',
      gap: 12,
    }}
    aria-hidden="true"
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
      <Bar className="h-3.5 w-1/3" />
      <Bar className="h-2.5 w-1/2" />
    </div>
    <Bar className="h-6 w-20" rounded="full" />
  </div>
);

// ─── Table row skeleton ───────────────────────────────────────────────────────
const TableRow = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
      gap: 16,
      alignItems: 'center',
      padding: '0.875rem 0',
      borderBottom: '1px solid #DDE3EC',
    }}
    aria-hidden="true"
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Bar className="w-10 h-10 flex-shrink-0" rounded="lg" />
      <Bar className="h-3.5 flex-1" />
    </div>
    <Bar className="h-3.5" />
    <Bar className="h-6 w-14" rounded="full" />
    <Bar className="h-3.5" />
    <Bar className="h-7 w-20 ml-auto" rounded="lg" />
  </div>
);

// ─── Main export (attach composites as static props) ─────────────────────────
const Skeleton = Object.assign(Bar, { Text, Card, KpiCard, Row, TableRow });

export default Skeleton;
