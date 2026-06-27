import { useState } from 'react';
import { PackageOpen, Send, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const BulkOrders = () => {
  const [formData, setFormData] = useState({
    companyName: '', email: '', phone: '', quantity: '', message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Quote request sent! Our team will contact you shortly.');
    setFormData({ companyName: '', email: '', phone: '', quantity: '', message: '' });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const perks = [
    'Reliable Daily Delivery',
    'Unmatched Quality Control',
    'Competitive Wholesale Pricing',
  ];

  return (
    /* ── Page wrapper with earthy dot-grid texture ── */
    <div
      className="min-h-[calc(100vh-80px)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundColor: '#F4ECD8',
        backgroundImage: `radial-gradient(circle, rgba(147,99,31,0.18) 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }}
    >
      {/* Soft ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-mountain-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-mountain-moss/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="grid md:grid-cols-5 bg-white rounded-2xl overflow-hidden shadow-2xl border border-mountain-gray/15">

          {/* ── Info panel (2 cols) ── */}
          <div className="md:col-span-2 bg-mountain-brown text-white p-8 flex flex-col justify-center">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5">
              <PackageOpen className="w-6 h-6 text-mountain-sand" />
            </div>
            <h2 className="text-2xl font-bold mb-3 leading-snug">Partner with Us</h2>
            <p className="text-mountain-gray text-sm leading-relaxed mb-6">
              We supply restaurants, bakeries, and supermarkets with premium farm-fresh eggs at wholesale rates. Request a custom quote today.
            </p>
            <ul className="space-y-3">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 text-mountain-gold flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>

            {/* Logo watermark */}
            <img src="/logo.png" alt="" className="mt-8 w-16 h-16 object-contain opacity-20 select-none" aria-hidden />
          </div>

          {/* ── Form panel (3 cols) ── */}
          <div className="md:col-span-3 p-7">
            <h3 className="text-xl font-bold text-mountain-brown mb-5">Request a Quote</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>

              <div>
                <label className="block text-xs font-semibold text-mountain-brown mb-1.5 uppercase tracking-wide">Business Name</label>
                <input
                  type="text" name="companyName" required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold/20 outline-none bg-mountain-sand/10 text-sm transition-all"
                  placeholder="Your Company Ltd"
                  value={formData.companyName} onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-mountain-brown mb-1.5 uppercase tracking-wide">Email</label>
                  <input
                    type="email" name="email" required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold/20 outline-none bg-mountain-sand/10 text-sm transition-all"
                    placeholder="hello@company.com"
                    value={formData.email} onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-mountain-brown mb-1.5 uppercase tracking-wide">Phone</label>
                  <input
                    type="tel" name="phone" required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold/20 outline-none bg-mountain-sand/10 text-sm transition-all"
                    placeholder="+94 77 000 0000"
                    value={formData.phone} onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-mountain-brown mb-1.5 uppercase tracking-wide">Est. Weekly Quantity (Trays)</label>
                <input
                  type="number" name="quantity" required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold/20 outline-none bg-mountain-sand/10 text-sm transition-all"
                  placeholder="e.g. 50"
                  value={formData.quantity} onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-mountain-brown mb-1.5 uppercase tracking-wide">Additional Details</label>
                <textarea
                  name="message" rows="2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold/20 outline-none bg-mountain-sand/10 text-sm resize-none transition-all"
                  placeholder="Any specific requirements…"
                  value={formData.message} onChange={handleChange}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 bg-mountain-gold text-white rounded-xl font-bold text-sm hover:bg-mountain-brown transition-all duration-300 shadow-lg shadow-mountain-gold/25 flex justify-center items-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit Request
              </motion.button>
            </form>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default BulkOrders;
