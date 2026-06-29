import { useState, useContext } from 'react';
import { PackageOpen, Send, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BulkOrders = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    companyName: '', email: '', phone: '', quantity: '', userNotes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create config, optionally adding token if user is logged in
      const config = user ? { headers: { Authorization: `Bearer ${user.token}` } } : {};
      
      await axios.post('/api/orders/bulk', formData, config);
      
      toast.success('Bulk order request sent! Our team will contact you shortly.');
      setFormData({ companyName: '', email: '', phone: '', quantity: '', userNotes: '' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const perks = [
    'Reliable Daily Delivery',
    'Unmatched Quality Control',
    'Competitive Wholesale Pricing',
  ];

  return (
    <div
      className="min-h-[calc(100vh-80px)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative"
      style={{ backgroundColor: '#EBEBEB' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl"
      >
        <div 
          className="grid md:grid-cols-5 rounded-2xl overflow-hidden shadow-2xl border"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#D0D8DF' }}
        >

          {/* ── Info panel (2 cols) ── */}
          <div 
            className="md:col-span-2 p-8 flex flex-col justify-center"
            style={{ backgroundColor: '#D0D8DF' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: '#FFFFFF' }}>
              <PackageOpen className="w-6 h-6" style={{ color: '#013547' }} />
            </div>
            <h2 className="text-2xl font-bold mb-3 leading-snug" style={{ color: '#013547' }}>Partner with Us</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#6C6F6E' }}>
              We supply restaurants, bakeries, and supermarkets with premium farm-fresh eggs at wholesale rates. Request a custom quote today.
            </p>
            <ul className="space-y-3">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm font-medium" style={{ color: '#013547' }}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#013547' }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Form panel (3 cols) ── */}
          <div className="md:col-span-3 p-7" style={{ backgroundColor: '#FFFFFF' }}>
            <h3 className="text-xl font-bold mb-5" style={{ color: '#013547' }}>Request a Quote</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#013547' }}>Business Name</label>
                <input
                  type="text" name="companyName" required
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm transition-all"
                  style={{ borderColor: '#D0D8DF', backgroundColor: '#FFFFFF', color: '#013547' }}
                  placeholder="Your Company Ltd"
                  value={formData.companyName} onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#013547' }}>Email</label>
                  <input
                    type="email" name="email" required
                    className="w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm transition-all"
                    style={{ borderColor: '#D0D8DF', backgroundColor: '#FFFFFF', color: '#013547' }}
                    placeholder="hello@company.com"
                    value={formData.email} onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#013547' }}>Phone</label>
                  <input
                    type="tel" name="phone" required
                    className="w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm transition-all"
                    style={{ borderColor: '#D0D8DF', backgroundColor: '#FFFFFF', color: '#013547' }}
                    placeholder="+94 77 000 0000"
                    value={formData.phone} onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#013547' }}>Est. Weekly Quantity (Trays)</label>
                <input
                  type="number" name="quantity" required min="1"
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm transition-all"
                  style={{ borderColor: '#D0D8DF', backgroundColor: '#FFFFFF', color: '#013547' }}
                  placeholder="e.g. 50"
                  value={formData.quantity} onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#013547' }}>Additional Details</label>
                <textarea
                  name="userNotes" rows="2"
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm resize-none transition-all"
                  style={{ borderColor: '#D0D8DF', backgroundColor: '#FFFFFF', color: '#013547' }}
                  placeholder="Any specific requirements…"
                  value={formData.userNotes} onChange={handleChange}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg flex justify-center items-center gap-2"
                style={{ backgroundColor: '#DDBA9B', color: '#013547' }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.backgroundColor = '#013547'; e.currentTarget.style.color = '#FFFFFF'; } }}
                onMouseLeave={e => { if (!loading) { e.currentTarget.style.backgroundColor = '#DDBA9B'; e.currentTarget.style.color = '#013547'; } }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? 'Submitting...' : 'Submit Request'}
              </motion.button>
            </form>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default BulkOrders;
