import { motion } from 'framer-motion';
import { Users, Target, ShieldCheck, Egg, Leaf, Award } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    desc: 'To deliver the freshest farm products directly to your table with absolute transparency and care.',
  },
  {
    icon: Users,
    title: 'Community First',
    desc: 'Supporting local businesses and families with reliable, high-quality bulk and retail supply.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Guarantee',
    desc: 'Every egg is carefully inspected, ensuring only the finest reaches our customers.',
  },
];

const milestones = [
  { icon: Award,  value: '12+',   label: 'Years of Farming' },
  { icon: Egg,    value: '500K+', label: 'Eggs Delivered'   },
  { icon: Users,  value: '200+',  label: 'Happy Clients'    },
  { icon: Leaf,   value: '100%',  label: 'Free Range'       },
];

const About = () => {
  return (
    <div className="w-full" style={{ backgroundColor: '#EBEBEB' }}>

      {/* ── Hero Banner ── */}
      <section className="relative h-72 md:h-80 flex items-end overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/about-hero.png')" }}
        />
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.40) 50%, transparent 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.50), transparent)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#DDBA9B' }}>Our Story</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              About Wimalasooriya Farms
            </h1>
            <p className="mt-2 text-lg max-w-xl" style={{ color: 'rgba(255,255,255,0.75)' }}>
              A legacy of purity, freshness, and quality — rooted in Sri Lanka's countryside.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Story + Values ── */}
      <section
        className="py-20 relative"
        style={{
          backgroundColor: '#EBEBEB',
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-14 items-start">

            {/* Story text */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              <h2 className="text-3xl font-bold" style={{ color: '#013547' }}>How It All Started</h2>
              <p className="leading-relaxed text-lg" style={{ color: '#6C6F6E' }}>
                Founded on the principles of hard work and an uncompromising dedication to nature, Wimalasooriya Farms began as a small family operation. We believed the clean, open countryside of Sri Lanka provided the perfect setting for healthy, ethical farming.
              </p>
              <p className="leading-relaxed text-lg" style={{ color: '#6C6F6E' }}>
                Today, we've grown into a trusted platform supplying both retail customers and wholesale businesses — but our core philosophy remains unchanged:{' '}
                <strong style={{ color: '#013547' }}>pure, fresh, and ethically raised.</strong>
              </p>

              {/* Milestone stats */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                {milestones.map(({ icon: Icon, value, label }) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:-translate-y-1 transition-transform duration-300 border"
                    style={{ backgroundColor: '#D0D8DF', borderColor: 'rgba(108,111,110,0.18)' }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(221,186,155,0.25)' }}>
                      <Icon className="w-5 h-5" style={{ color: '#013547' }} />
                    </div>
                    <div>
                      <p className="text-xl font-bold leading-none" style={{ color: '#013547' }}>{value}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#6C6F6E' }}>{label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Values cards */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {values.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="backdrop-blur-sm border rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  style={{ backgroundColor: '#D0D8DF', borderColor: 'rgba(108,111,110,0.18)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(221,186,155,0.50)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(108,111,110,0.18)'; }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(221,186,155,0.22)' }}>
                    <Icon className="w-5 h-5" style={{ color: '#013547' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: '#013547' }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#6C6F6E' }}>{desc}</p>
                  </div>
                </motion.div>
              ))}

              {/* Logo accent */}
              <div className="flex items-center gap-4 pt-2 pl-2">
                <img src="/logo.png" alt="Wimalasooriya Farms" className="w-14 h-14 object-contain" />
                <div>
                  <p className="font-bold" style={{ color: '#013547' }}>Wimalasooriya Farms</p>
                  <p className="text-xs" style={{ color: '#6C6F6E' }}>Trusted since 2012 · Sri Lanka</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Bottom CTA strip ── */}
      <section
        className="relative py-14 overflow-hidden"
        style={{
          backgroundImage: "url('/about-hero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 60%',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, rgba(0,0,0,0.85), rgba(0,0,0,0.70))' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to taste the difference?</h2>
          <p className="mb-7" style={{ color: 'rgba(255,255,255,0.70)' }}>Place a bulk order or get in touch with us today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/bulk-orders"
              className="inline-flex items-center justify-center px-7 py-3 font-bold rounded-xl transition-all duration-300 shadow-lg hover:-translate-y-0.5 transform"
              style={{ backgroundColor: '#52311B', color: '#ffffff' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#52311B'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#52311B'; e.currentTarget.style.color = '#ffffff'; }}
            >
              Bulk Orders
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-7 py-3 font-semibold rounded-xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 transform"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.30)' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
