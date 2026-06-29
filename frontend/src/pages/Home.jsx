import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Star, Egg, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
});

const features = [
  {
    icon: ShieldCheck,
    title: 'Pristine Environment',
    desc: 'Raised in clean, open-air landscapes ensuring the highest hygiene and animal welfare standards.',
  },
  {
    icon: Egg,
    title: 'Farm to Table',
    desc: 'Our direct supply chain means your eggs arrive fresh — no unnecessary delays, no cold-chain compromise.',
  },
  {
    icon: Truck,
    title: 'Bulk & Retail',
    desc: 'A dozen for breakfast or a thousand for your bakery — we supply every scale with the same care.',
  },
];

const stats = [
  { value: '500K+', label: 'Eggs Delivered' },
  { value: '12 yrs', label: 'Farm Experience' },
  { value: '98%',   label: 'Customer Satisfaction' },
  { value: '100%',  label: 'Free Range' },
];

const Home = () => {
  return (
    <div className="w-full" style={{ backgroundColor: '#EBEBEB' }}>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/home-hero.png')" }}
        />

        {/* Subtle bottom gradient for text legibility only */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-2xl">

            {/* Badge */}
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6 border" style={{ backgroundColor: 'rgba(221,186,155,0.20)', borderColor: 'rgba(221,186,155,0.40)' }}>
              <Star className="w-3.5 h-3.5" style={{ color: '#DDBA9B', fill: '#DDBA9B' }} />
              <span className="text-sm font-semibold tracking-wide" style={{ color: '#DDBA9B' }}>Sri Lanka's Premium Egg Farm</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6">
              Freshness from the{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #DDBA9B, #D0D8DF)' }}>
                Frosty Valleys
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl mb-10 leading-relaxed max-w-xl" style={{ color: 'rgba(255,255,255,0.80)' }}>
              Premium quality eggs and farm products, raised with care in our pristine landscapes. Purity you can taste — delivered to your door.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/bulk-orders"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-lg rounded-xl transition-all duration-300 hover:-translate-y-1 transform shadow-2xl"
                style={{ backgroundColor: '#52311B', color: '#ffffff', boxShadow: '0 25px 50px -12px rgba(82,49,27,0.35)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#52311B'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#52311B'; e.currentTarget.style.color = '#ffffff'; }}
              >
                Order Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-lg rounded-xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 transform"
                style={{ backgroundColor: 'rgba(255,255,255,0.10)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.30)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.20)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.50)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.30)'; }}
              >
                Our Story
              </Link>
            </motion.div>

          </div>

          {/* Stat strip */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="backdrop-blur-sm rounded-2xl px-5 py-4 text-center border"
                style={{ backgroundColor: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.20)' }}
              >
                <p className="text-3xl font-bold" style={{ color: '#DDBA9B' }}>{value}</p>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.70)' }}>{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to top, #EBEBEB, transparent)' }} />
      </section>

      {/* ── Features Section ─────────────────────────────────────────────── */}
      <section className="py-24 relative" style={{ backgroundColor: '#EBEBEB' }}>
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #013547 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <p className="font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: '#DDBA9B' }}>Why Choose Us</p>
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#013547' }}>The Wimalasooriya Difference</h2>
            <p className="max-w-2xl mx-auto text-lg" style={{ color: '#6C6F6E' }}>
              Our commitment to purity and quality ensures you get only the best for your family and business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 transform"
                style={{
                  backgroundColor: '#D0D8DF',
                  borderColor: 'rgba(108,111,110,0.20)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(221,186,155,0.50)';
                  e.currentTarget.style.boxShadow = '0 20px 40px -8px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(108,111,110,0.20)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300" style={{ backgroundColor: 'rgba(221,186,155,0.25)' }}>
                  <Icon className="w-7 h-7" style={{ color: '#013547' }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#013547' }}>{title}</h3>
                <p className="leading-relaxed" style={{ color: '#6C6F6E' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden">

        {/* CTA background reuses the farm image with a heavy warm overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/home-hero.png')" }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, rgba(0,0,0,0.85), rgba(0,0,0,0.75))' }} />

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(221,186,155,0.10)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#DDBA9B' }}>Ready to get started?</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Experience the difference today
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.70)' }}>
              Join hundreds of happy families and businesses who trust Wimalasooriya Farms for fresh, premium eggs every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-lg rounded-xl transition-all duration-300 shadow-2xl hover:-translate-y-1 transform"
                style={{ backgroundColor: '#52311B', color: '#ffffff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#52311B'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#52311B'; e.currentTarget.style.color = '#ffffff'; }}
              >
                Get in Touch <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/bulk-orders"
                className="inline-flex items-center justify-center px-8 py-4 font-semibold text-lg rounded-xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 transform"
                style={{ backgroundColor: 'rgba(255,255,255,0.10)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.30)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.20)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)'; }}
              >
                Bulk Orders
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
