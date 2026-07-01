import { Mail, Phone, MapPin, Send, Share2, Camera, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Contact = () => {
  const [company, setCompany] = useState({
    email: 'hello@wimalasooriyafarms.com',
    phone: '+94 77 123 4567',
    address: '123 Farm Road,\nWimalasooriya, Sri Lanka',
  });

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: '',
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate send
    await new Promise(res => setTimeout(res, 1200));
    setLoading(false);
    setSent(true);
    setFormData({ firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  const inputStyle = {
    borderColor: '#D4C5B0',
    backgroundColor: '#FAFAF8',
    color: '#1A1208',
  };
  const inputFocus = (e) => {
    e.currentTarget.style.borderColor = '#3E2206';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(62,34,6,0.10)';
  };
  const inputBlur = (e) => {
    e.currentTarget.style.borderColor = '#D4C5B0';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div
      className="min-h-[calc(100vh-80px)] py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#F5F3EF' }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: '#1A1208', fontFamily: 'Georgia, serif' }}
          >
            Get in Touch
          </h1>
          <p className="text-base max-w-lg leading-relaxed" style={{ color: '#7A6A56' }}>
            Whether you have questions about bulk orders, operational support, or want to learn more about our sustainable practices, we're here to help.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">

          {/* ── Left: Message Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 rounded-2xl border p-8"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E3DC' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#F5EDE3' }}
              >
                <Mail className="w-4 h-4" style={{ color: '#3E2206' }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: '#1A1208' }}>Send us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5C4F3D' }}>Full Name</label>
                  <input
                    type="text" name="firstName"
                    value={formData.firstName} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-all"
                    style={inputStyle}
                    onFocus={inputFocus} onBlur={inputBlur}
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5C4F3D' }}>Email Address</label>
                  <input
                    type="email" name="email"
                    value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-all"
                    style={inputStyle}
                    onFocus={inputFocus} onBlur={inputBlur}
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5C4F3D' }}>Subject</label>
                <select
                  name="subject"
                  value={formData.subject} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-all appearance-none"
                  style={{ ...inputStyle, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239E8872' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.1rem', paddingRight: '2.5rem' }}
                  onFocus={inputFocus} onBlur={inputBlur}
                >
                  <option>General Inquiry</option>
                  <option>Retail Order</option>
                  <option>Bulk / Wholesale Order</option>
                  <option>Operational Support</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5C4F3D' }}>Message</label>
                <textarea
                  name="message" rows="5"
                  value={formData.message} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm resize-none transition-all"
                  style={inputStyle}
                  onFocus={inputFocus} onBlur={inputBlur}
                  placeholder="How can we assist you today?"
                />
              </div>

              <div className="flex justify-end pt-1">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || sent}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm text-white transition-all duration-200"
                  style={{
                    backgroundColor: sent ? '#2D6A4F' : '#3E2206',
                    boxShadow: `0 4px 16px rgba(62,34,6,0.28)`,
                  }}
                  onMouseEnter={e => { if (!loading && !sent) e.currentTarget.style.backgroundColor = '#5a3209'; }}
                  onMouseLeave={e => { if (!loading && !sent) e.currentTarget.style.backgroundColor = sent ? '#2D6A4F' : '#3E2206'; }}
                >
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  ) : sent ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? 'Sending...' : sent ? 'Message Sent!' : 'Send Message'}
                  {!loading && !sent && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* ── Right: HQ Info + Connect ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* HQ Card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E3DC' }}
            >
              {/* Map image */}
              <div
                className="h-44 bg-cover bg-center relative"
                style={{ backgroundImage: "url('/about-hero-new.png')" }}
              >
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.20)' }} />
                {/* HQ badge */}
                <div
                  className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: 'rgba(62,34,6,0.85)', backdropFilter: 'blur(4px)' }}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  HQ
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1" style={{ color: '#1A1208', fontFamily: 'Georgia, serif' }}>Headquarters</h3>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: '#7A6A56' }}>
                  {company.address.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#9E8872' }} />
                    <span className="text-sm" style={{ color: '#5C4F3D' }}>{company.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#9E8872' }} />
                    <span className="text-sm" style={{ color: '#5C4F3D' }}>{company.email}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Connect Card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border p-6"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E3DC' }}
            >
              <h3 className="text-lg font-bold mb-1" style={{ color: '#1A1208' }}>Connect</h3>
              <p className="text-sm mb-5" style={{ color: '#9E8872' }}>Follow our daily operations and community updates.</p>
              <div className="flex gap-3">
                {[
                  { icon: Share2,   label: 'Share'     },
                  { icon: Camera,   label: 'Instagram' },
                  { icon: Briefcase, label: 'LinkedIn' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    title={label}
                    className="w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    style={{ backgroundColor: '#F5F3EF', borderColor: '#D4C5B0' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F5EDE3'; e.currentTarget.style.borderColor = '#D4B99A'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F5F3EF'; e.currentTarget.style.borderColor = '#D4C5B0'; }}
                  >
                    <Icon className="w-4 h-4" style={{ color: '#5C4F3D' }} />
                  </button>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
