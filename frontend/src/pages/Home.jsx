import { motion } from 'framer-motion';
import { ArrowRight, Truck, Clock, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
});

const stats = [
  { icon: Truck,  value: '500K+',    label: 'Eggs Delivered Weekly' },
  { icon: Clock,  value: '20+ Years', label: 'Agricultural Excellence' },
  { icon: Leaf,   value: '100%',      label: 'Organic Certified Produce' },
];

const services = [
  {
    tag: 'PREMIUM RETAIL',
    title: 'Direct to Consumer',
    desc: 'Fresh, carefully selected organic produce delivered straight to your local markets and select retail partners.',
    img: '/service-retail.png',
  },
  {
    tag: 'ENTERPRISE LOGISTICS',
    title: 'Wholesale Operations',
    desc: 'Reliable, high-volume supply chain solutions tailored for commercial kitchens, bakeries, and large-scale distributors.',
    img: '/service-wholesale.png',
  },
];

const Home = () => {
  return (
    <div className="w-full" style={{ backgroundColor: '#F5F3EF' }}>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: '88vh', minHeight: '560px' }}>
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/home-hero-new.png')" }}
        />
        {/* Layered gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.55) 100%)',
          }}
        />
        {/* Left-side gradient for text contrast */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.20) 55%, transparent 100%)' }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
            <div className="max-w-2xl">
              <motion.h1
                {...fadeUp(0.1)}
                className="text-5xl md:text-6xl font-bold text-white leading-[1.08] tracking-tight mb-5"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Sustainable Excellence,<br />Delivered Daily.
              </motion.h1>
              <motion.p
                {...fadeUp(0.22)}
                className="text-lg mb-9 leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.82)', maxWidth: '520px' }}
              >
                Experience the finest quality produce from Wimalasooriya Farm. Combining generations of agricultural heritage with modern, transparent operational efficiency.
              </motion.p>
              <motion.div {...fadeUp(0.34)} className="flex flex-wrap gap-4">
                <Link
                  to="/bulk-orders"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
                  style={{ backgroundColor: '#3E2206', color: '#fff', boxShadow: '0 8px 24px rgba(62,34,6,0.40)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#5a3209'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#3E2206'; }}
                >
                  SHOP NOW <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/bulk-orders"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm border backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
                  style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; }}
                >
                  BULK ORDERS
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ──────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F3EF' }} className="py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E3DC' }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#F5EDE3' }}
                >
                  <Icon className="w-6 h-6" style={{ color: '#3E2206' }} />
                </div>
                <p className="text-3xl font-bold mb-1" style={{ color: '#1A1208', fontFamily: 'Georgia, serif' }}>{value}</p>
                <p className="text-sm" style={{ color: '#7A6A56' }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Services ─────────────────────────────────────────────────── */}
      <section className="py-4 pb-20" style={{ backgroundColor: '#F5F3EF' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#1A1208', fontFamily: 'Georgia, serif' }}>Our Services</h2>
            <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: '#3E2206' }} />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map(({ tag, title, desc, img }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-2xl overflow-hidden group cursor-pointer"
                style={{ height: '360px' }}
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${img}')` }}
                />
                {/* Bottom gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.30) 50%, transparent 100%)' }}
                />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-7">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: '#DDBA9B' }} />
                    {tag}
                  </p>
                  <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)', maxWidth: '360px' }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
