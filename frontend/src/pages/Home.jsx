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
    <div className="w-full">

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/home-hero.png')" }}
        />

        {/* Layered gradient overlay — dark bottom for text, warm gold at top */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-mountain-brown/80" />
        {/* Horizontal warm-cool split */}
        <div className="absolute inset-0 bg-gradient-to-r from-mountain-brown/50 via-transparent to-transparent" />

        {/* Subtle animated glow orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-mountain-gold/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-mountain-moss/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-2xl">

            {/* Badge */}
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 bg-mountain-gold/20 border border-mountain-gold/40 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6">
              <Star className="w-3.5 h-3.5 text-mountain-gold fill-mountain-gold" />
              <span className="text-mountain-gold text-sm font-semibold tracking-wide">Sri Lanka's Premium Egg Farm</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6">
              Freshness from the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mountain-gold to-mountain-sand">
                Frosty Valleys
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl text-white/75 mb-10 leading-relaxed max-w-xl">
              Premium quality eggs and farm products, raised with care in our pristine landscapes. Purity you can taste — delivered to your door.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/bulk-orders"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-mountain-gold text-mountain-brown font-bold text-lg rounded-xl hover:bg-white transition-all duration-300 shadow-2xl shadow-mountain-gold/30 hover:-translate-y-1 transform"
              >
                Order Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold text-lg rounded-xl border border-white/30 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:-translate-y-1 transform"
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
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4 text-center"
              >
                <p className="text-3xl font-bold text-mountain-gold">{value}</p>
                <p className="text-sm text-white/70 mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ── Features Section ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white relative">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #93631F 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <p className="text-mountain-gold font-semibold text-sm uppercase tracking-widest mb-3">Why Choose Us</p>
            <h2 className="text-4xl font-bold text-mountain-brown mb-4">The Wimalasooriya Difference</h2>
            <p className="text-mountain-gray max-w-2xl mx-auto text-lg">
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
                className="group p-8 rounded-2xl bg-mountain-sand/30 border border-mountain-gray/20 hover:border-mountain-gold/40 hover:shadow-xl hover:shadow-mountain-gold/10 transition-all duration-300 hover:-translate-y-2 transform"
              >
                <div className="w-14 h-14 rounded-2xl bg-mountain-gold/15 flex items-center justify-center mb-6 group-hover:bg-mountain-gold/25 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-mountain-gold" />
                </div>
                <h3 className="text-xl font-bold text-mountain-brown mb-3">{title}</h3>
                <p className="text-mountain-gray leading-relaxed">{desc}</p>
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
        <div className="absolute inset-0 bg-gradient-to-br from-mountain-brown/90 via-mountain-brown/80 to-mountain-moss/75" />

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-mountain-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-mountain-gold text-sm font-semibold uppercase tracking-widest mb-4">Ready to get started?</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Experience the difference today
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Join hundreds of happy families and businesses who trust Wimalasooriya Farms for fresh, premium eggs every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-mountain-gold text-mountain-brown font-bold text-lg rounded-xl hover:bg-white transition-all duration-300 shadow-2xl shadow-black/20 hover:-translate-y-1 transform"
              >
                Get in Touch <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/bulk-orders"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold text-lg rounded-xl border border-white/30 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 transform"
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
