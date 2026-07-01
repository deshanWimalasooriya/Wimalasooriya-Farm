import { useState, useContext } from 'react';
import { Settings, Truck, Headphones, Send, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const perks = [
  {
    icon: Settings,
    title: 'Premium Quality',
    desc: 'Consistent grading and rigorous quality control for every tray.',
  },
  {
    icon: Truck,
    title: 'Reliable Logistics',
    desc: 'Temperature-controlled transport ensuring freshness on arrival.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    desc: 'Direct access to our B2B account management team.',
  },
];

const BulkOrders = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    companyName: '', contactPerson: '', email: '', phone: '', quantity: '', userNotes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = user ? { headers: { Authorization: `Bearer ${user.token}` } } : {};
      await axios.post('/api/orders/bulk', formData, config);
      toast.success('Quote request sent! Our team will contact you shortly.');
      setFormData({ companyName: '', contactPerson: '', email: '', phone: '', quantity: '', userNotes: '' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5F3EF' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid md:grid-cols-5 gap-8 items-start"
        >

          {/* ── Left: Intro panel ── */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl p-8 border"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E3DC' }}
            >
              <h1
                className="text-3xl font-bold leading-tight mb-4"
                style={{ color: '#1A1208', fontFamily: 'Georgia, serif' }}
              >
                B2B Quote<br />Request
              </h1>
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#7A6A56' }}>
                Partner with Winter Farm for reliable, high-volume supply. Fill out the form to request a customized quote for your commercial needs.
              </p>

              <div className="space-y-5">
                {perks.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#F5EDE3', border: '1.5px solid #D4B99A' }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color: '#3E2206' }} />
                    </div>
                    <div>
                      <p className="font-bold text-sm mb-0.5" style={{ color: '#1A1208' }}>{title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: '#9E8872' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right: Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-3 rounded-2xl border"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E3DC' }}
          >
            <form onSubmit={handleSubmit} className="p-8">

              {/* Business Details */}
              <div className="mb-7">
                <h2 className="text-lg font-bold mb-1" style={{ color: '#1A1208' }}>Business Details</h2>
                <div className="h-px mb-5" style={{ backgroundColor: '#E8E3DC' }} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5C4F3D' }}>
                      Company Name <span style={{ color: '#C0392B' }}>*</span>
                    </label>
                    <input
                      type="text" name="companyName" required
                      value={formData.companyName} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-all"
                      style={{ borderColor: '#D4C5B0', backgroundColor: '#FAFAF8', color: '#1A1208' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#3E2206'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(62,34,6,0.10)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#D4C5B0'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5C4F3D' }}>
                      Contact Person <span style={{ color: '#C0392B' }}>*</span>
                    </label>
                    <input
                      type="text" name="contactPerson" required
                      value={formData.contactPerson} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-all"
                      style={{ borderColor: '#D4C5B0', backgroundColor: '#FAFAF8', color: '#1A1208' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#3E2206'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(62,34,6,0.10)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#D4C5B0'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5C4F3D' }}>
                      Email Address <span style={{ color: '#C0392B' }}>*</span>
                    </label>
                    <input
                      type="email" name="email" required
                      value={formData.email} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-all"
                      style={{ borderColor: '#D4C5B0', backgroundColor: '#FAFAF8', color: '#1A1208' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#3E2206'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(62,34,6,0.10)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#D4C5B0'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="work@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5C4F3D' }}>
                      Phone Number <span style={{ color: '#C0392B' }}>*</span>
                    </label>
                    <input
                      type="tel" name="phone" required
                      value={formData.phone} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-all"
                      style={{ borderColor: '#D4C5B0', backgroundColor: '#FAFAF8', color: '#1A1208' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#3E2206'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(62,34,6,0.10)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#D4C5B0'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="(555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Order Requirements */}
              <div className="mb-7">
                <h2 className="text-lg font-bold mb-1" style={{ color: '#1A1208' }}>Order Requirements</h2>
                <div className="h-px mb-5" style={{ backgroundColor: '#E8E3DC' }} />
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5C4F3D' }}>
                      Estimated Monthly Quantity (Egg Trays) <span style={{ color: '#C0392B' }}>*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number" name="quantity" required min="100"
                        value={formData.quantity} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-all pl-10"
                        style={{ borderColor: '#D4C5B0', backgroundColor: '#FAFAF8', color: '#1A1208' }}
                        onFocus={e => { e.currentTarget.style.borderColor = '#3E2206'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(62,34,6,0.10)'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = '#D4C5B0'; e.currentTarget.style.boxShadow = 'none'; }}
                        placeholder="e.g., 500"
                      />
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9E8872' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                    <p className="text-xs mt-1.5" style={{ color: '#9E8872' }}>Minimum order: 100 trays.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5C4F3D' }}>
                      Additional Notes or Requirements
                    </label>
                    <textarea
                      name="userNotes" rows="4"
                      value={formData.userNotes} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm resize-none transition-all"
                      style={{ borderColor: '#D4C5B0', backgroundColor: '#FAFAF8', color: '#1A1208' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#3E2206'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(62,34,6,0.10)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#D4C5B0'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="Delivery frequency, specific grading requirements, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Submit row */}
              <div className="h-px mb-6" style={{ backgroundColor: '#E8E3DC' }} />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs" style={{ color: '#9E8872' }}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secure submission
                </span>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm text-white transition-all duration-200"
                  style={{ backgroundColor: '#3E2206', boxShadow: '0 4px 16px rgba(62,34,6,0.30)' }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#5a3209'; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#3E2206'; }}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {loading ? 'Submitting...' : 'Request Quote'}
                  {!loading && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BulkOrders;
