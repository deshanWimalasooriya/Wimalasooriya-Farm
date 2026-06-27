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
  { icon: Egg,    value: '500K+', label: 'Eggs Delivered' },
  { icon: Users,  value: '200+',  label: 'Happy Clients' },
  { icon: Leaf,   value: '100%',  label: 'Free Range' },
];

const About = () => {
  return (
    <div className="w-full">

      {/* ── Hero Banner ── */}
      <section className="relative h-72 md:h-80 flex items-end overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/about-hero.png')" }}
        />
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-mountain-brown/85 via-mountain-brown/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-mountain-brown/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-mountain-gold text-xs font-bold uppercase tracking-widest mb-2">Our Story</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              About Wimalasooriya Farms
            </h1>
            <p className="text-white/70 mt-2 text-lg max-w-xl">
              A legacy of purity, freshness, and quality — rooted in Sri Lanka's countryside.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Story + Values ── */}
      <section
        className="py-20 relative"
        style={{
          backgroundColor: '#F8F3EA',
          backgroundImage: `radial-gradient(circle, rgba(147,99,31,0.14) 1px, transparent 1px)`,
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
              <h2 className="text-3xl font-bold text-mountain-brown">How It All Started</h2>
              <p className="text-mountain-gray leading-relaxed text-lg">
                Founded on the principles of hard work and an uncompromising dedication to nature, Wimalasooriya Farms began as a small family operation. We believed the clean, open countryside of Sri Lanka provided the perfect setting for healthy, ethical farming.
              </p>
              <p className="text-mountain-gray leading-relaxed text-lg">
                Today, we've grown into a trusted platform supplying both retail customers and wholesale businesses — but our core philosophy remains unchanged: <strong className="text-mountain-brown">pure, fresh, and ethically raised.</strong>
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
                    className="bg-white/80 backdrop-blur-sm border border-mountain-gray/20 rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:-translate-y-1 transition-transform duration-300"
                  >
                    <div className="w-9 h-9 rounded-xl bg-mountain-gold/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-mountain-gold" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-mountain-brown leading-none">{value}</p>
                      <p className="text-xs text-mountain-gray mt-0.5">{label}</p>
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
                  className="bg-white/85 backdrop-blur-sm border border-mountain-gray/20 rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-mountain-moss/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-mountain-moss" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-mountain-brown mb-1">{title}</h3>
                    <p className="text-mountain-gray text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}

              {/* Logo accent */}
              <div className="flex items-center gap-4 pt-2 pl-2">
                <img src="/logo.png" alt="Wimalasooriya Farms" className="w-14 h-14 object-contain" />
                <div>
                  <p className="font-bold text-mountain-brown">Wimalasooriya Farms</p>
                  <p className="text-xs text-mountain-gray">Trusted since 2012 · Sri Lanka</p>
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
        <div className="absolute inset-0 bg-gradient-to-r from-mountain-brown/90 to-mountain-moss/75" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to taste the difference?</h2>
          <p className="text-white/70 mb-7">Place a bulk order or get in touch with us today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/bulk-orders" className="inline-flex items-center justify-center px-7 py-3 bg-mountain-gold text-mountain-brown font-bold rounded-xl hover:bg-white transition-all duration-300 shadow-lg">
              Bulk Orders
            </a>
            <a href="/contact" className="inline-flex items-center justify-center px-7 py-3 bg-white/15 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm hover:bg-white/25 transition-all duration-300">
              Contact Us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
