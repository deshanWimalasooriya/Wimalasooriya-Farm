import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Contact = () => {
  const [company, setCompany] = useState({
    email: 'hello@wimalasooriyafarms.com',
    phone: '+94 77 123 4567',
    address: '123 Farm Road,\nWimalasooriya, Sri Lanka',
  });

  useEffect(() => {
    axios.get('/api/company')
      .then(res => {
        const d = res.data;
        setCompany({
          email: d.email || 'hello@wimalasooriyafarms.com',
          phone: d.phone || '+94 77 123 4567',
          address: d.address || '123 Farm Road,\nWimalasooriya, Sri Lanka',
        });
      })
      .catch(() => {/* fallback to defaults */});
  }, []);

  const contactCards = [
    {
      icon: MapPin,
      title: 'Visit Us',
      lines: company.address.split('\n'),
    },
    {
      icon: Phone,
      title: 'Call Us',
      lines: [company.phone, 'Mon–Sat, 7am to 5pm'],
    },
    {
      icon: Mail,
      title: 'Email Us',
      lines: [company.email],
    },
  ];

  return (
    /* ── Page wrapper ── */
    <div
      className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundColor: '#EBEBEB',
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 27px,
            rgba(1,53,71,0.04) 27px,
            rgba(1,53,71,0.04) 28px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 27px,
            rgba(1,53,71,0.04) 27px,
            rgba(1,53,71,0.04) 28px
          )
        `,
      }}
    >
      {/* Ambient glows */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(221,186,155,0.20)' }} />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(1,53,71,0.08)' }} />

      <div className="relative z-10 w-full max-w-5xl">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#DDBA9B' }}>We'd love to hear from you</p>
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: '#013547' }}>Get in Touch</h1>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* ── Contact info cards ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-1 flex flex-col gap-4"
          >
            {contactCards.map(({ icon: Icon, title, lines }) => (
              <div
                key={title}
                className="p-5 rounded-2xl border shadow-sm hover:-translate-y-1 transition-transform duration-300 flex items-start gap-4"
                style={{ backgroundColor: '#D0D8DF', borderColor: 'rgba(108,111,110,0.20)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(221,186,155,0.25)' }}>
                  <Icon className="w-5 h-5" style={{ color: '#013547' }} />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-0.5" style={{ color: '#013547' }}>{title}</h3>
                  {lines.map((l, i) => (
                    <p key={i} className="text-xs leading-relaxed" style={{ color: '#6C6F6E' }}>{l}</p>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* ── Contact form ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-2"
          >
            <div className="p-7 rounded-2xl border shadow-xl" style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderColor: 'rgba(1,53,71,0.15)' }}>
              <h2 className="text-xl font-bold mb-5" style={{ color: '#013547' }}>Send us a Message</h2>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#013547' }}>First Name</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm transition-all focus:ring-2"
                      style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(108,111,110,0.30)', color: '#013547', outlineColor: '#DDBA9B' }}
                      placeholder="Kasun"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#013547' }}>Last Name</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm transition-all focus:ring-2"
                      style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(108,111,110,0.30)', color: '#013547', outlineColor: '#DDBA9B' }}
                      placeholder="Perera"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#013547' }}>Email Address</label>
                  <input
                    type="email"
                    className="w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm transition-all focus:ring-2"
                    style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(108,111,110,0.30)', color: '#013547', outlineColor: '#DDBA9B' }}
                    placeholder="kasun@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#013547' }}>Subject</label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm transition-all focus:ring-2"
                    style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(108,111,110,0.30)', color: '#013547', outlineColor: '#DDBA9B' }}
                  >
                    <option>General Inquiry</option>
                    <option>Retail Order</option>
                    <option>Bulk / Wholesale Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#013547' }}>Message</label>
                  <textarea
                    rows="4"
                    className="w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm resize-none transition-all focus:ring-2"
                    style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(108,111,110,0.30)', color: '#013547', outlineColor: '#DDBA9B' }}
                    placeholder="How can we help you?"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  type="button"
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#52311B', color: '#FFFFFF' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#52311B'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#52311B'; e.currentTarget.style.color = '#FFFFFF'; }}
                >
                  Send Message <Send className="w-4 h-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
