import { motion } from 'framer-motion';
import { Target, Users, Leaf, Award, Egg } from 'lucide-react';
import { Link } from 'react-router-dom';

const milestones = [
  {
    year: '1985',
    title: 'The Roots',
    desc: 'Founded on a modest 50-acre plot, focusing on traditional cultivation and community supply.',
  },
  {
    year: '2005',
    title: 'Expansion & Innovation',
    desc: 'Introduced integrated farming techniques and expanded operations to include automated logistics.',
  },
  {
    year: 'Present Day',
    title: 'Modern Operations',
    desc: 'Now operating across thousands of acres, utilizing data analytics to drive sustainable enterprise logistics.',
  },
];

const teamMembers = [
  { name: 'Sarah Jenkins',  role: 'Minister of Operations',  img: '/team-1.png' },
  { name: 'Dr. Aris Thorne', role: 'Chief Agronomist',       img: '/team-2.png' },
  { name: 'Marcus Chen',    role: 'Logistics Manager',       img: '/team-3.png' },
  { name: 'Elena Rostova',  role: 'Sustainability Lead',     img: '/team-4.png' },
];

const missionTags = ['Water Conservation', 'Soil Restoration'];

const About = () => {
  return (
    <div className="w-full" style={{ backgroundColor: '#F5F3EF' }}>

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: '52vh', minHeight: '340px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/about-hero-new.png')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.55) 100%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.50), transparent 60%)' }}
        />
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-12 w-full">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1
                className="text-4xl md:text-5xl font-bold text-white leading-tight mb-3"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Cultivating Heritage,<br />Engineering the Future.
              </h1>
              <p className="text-base max-w-xl" style={{ color: 'rgba(255,255,255,0.78)' }}>
                Wimalasooriya Farm blends the timeless art of agriculture with cutting-edge sustainable practices, ensuring quality from our soil to your table.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Our Mission ──────────────────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: '#F5F3EF' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex items-center gap-3 mb-10"
          >
            <Target className="w-5 h-5" style={{ color: '#3E2206' }} />
            <h2 className="text-xl font-bold" style={{ color: '#1A1208' }}>Our Mission</h2>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8 items-start">
            {/* Text left */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-3 rounded-2xl p-8 border"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E3DC' }}
            >
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1A1208', fontFamily: 'Georgia, serif' }}>
                Sustainable Agriculture at Scale
              </h3>
              <p className="leading-relaxed mb-6" style={{ color: '#5C4F3D' }}>
                We believe that modern farming must work in harmony with nature, not against it. Our mission is to pioneer sustainable agricultural methods that yield high-quality produce while actively restoring soil health, conserving water, and supporting local ecosystems. We combine deep agricultural knowledge with data-driven precision to ensure every acre thrives.
              </p>
              <div className="flex flex-wrap gap-3">
                {missionTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
                    style={{ backgroundColor: '#F5EDE3', borderColor: '#D4B99A', color: '#3E2206' }}
                  >
                    <Leaf className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Image right */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-2 rounded-2xl overflow-hidden relative"
              style={{ height: '280px' }}
            >
              <img
                src="/commitment-quality.png"
                alt="Commitment to Quality"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute bottom-0 inset-x-0 p-5"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)' }}
              >
                <p className="text-white font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>Commitment to Quality</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.70)' }}>Uncompromising standards in every harvest.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Our History ──────────────────────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: '#F5F3EF' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex items-center gap-3 mb-10"
          >
            <Award className="w-5 h-5" style={{ color: '#3E2206' }} />
            <h2 className="text-xl font-bold" style={{ color: '#1A1208' }}>Our History</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {milestones.map(({ year, title, desc }, i) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-7 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E3DC' }}
              >
                {/* Timeline dot + line */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#3E2206' }} />
                  <div className="flex-1 h-px" style={{ backgroundColor: '#E8E3DC' }} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9E8872' }}>{year}</p>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1A1208', fontFamily: 'Georgia, serif' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7A6A56' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership Team ───────────────────────────────────────────────── */}
      <section className="py-16 pb-24" style={{ backgroundColor: '#F5F3EF' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex items-center justify-between mb-10"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" style={{ color: '#3E2206' }} />
              <h2 className="text-xl font-bold" style={{ color: '#1A1208' }}>Leadership Team</h2>
            </div>
            <Link
              to="/contact"
              className="px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5"
              style={{ backgroundColor: '#3E2206', color: '#fff' }}
            >
              Join Our Team
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map(({ name, role, img }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <div
                  className="rounded-2xl overflow-hidden mb-4 transition-transform duration-300 group-hover:-translate-y-1"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img
                    src={img}
                    alt={name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="font-bold text-sm" style={{ color: '#1A1208' }}>{name}</p>
                <p className="text-xs mt-0.5" style={{ color: '#9E8872' }}>{role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
