import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const contactCards = [
  {
    icon: MapPin,
    title: 'Visit Us',
    lines: ['123 Farm Road,', 'Wimalasooriya, Sri Lanka'],
  },
  {
    icon: Phone,
    title: 'Call Us',
    lines: ['+94 77 123 4567', 'Mon–Sat, 7am to 5pm'],
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: ['hello@wimalasooriyafarms.com', 'orders@wimalasooriyafarms.com'],
  },
];

const Contact = () => {
  return (
    /* ── Page wrapper with subtle linen-weave texture ── */
    <div
      className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundColor: '#F8F3EA',
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 27px,
            rgba(147,99,31,0.07) 27px,
            rgba(147,99,31,0.07) 28px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 27px,
            rgba(147,99,31,0.07) 27px,
            rgba(147,99,31,0.07) 28px
          )
        `,
      }}
    >
      {/* Ambient glows */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-mountain-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-mountain-moss/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          <p className="text-mountain-gold text-xs font-bold uppercase tracking-widest mb-2">We'd love to hear from you</p>
          <h1 className="text-3xl md:text-4xl font-bold text-mountain-brown">Get in Touch</h1>
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
                className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-mountain-gray/20 shadow-sm hover:-translate-y-1 transition-transform duration-300 flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-mountain-gold/15 text-mountain-gold rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-mountain-brown text-sm mb-0.5">{title}</h3>
                  {lines.map((l) => (
                    <p key={l} className="text-mountain-gray text-xs leading-relaxed">{l}</p>
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
            <div className="bg-white/90 backdrop-blur-sm p-7 rounded-2xl border border-mountain-gray/15 shadow-xl">
              <h2 className="text-xl font-bold text-mountain-brown mb-5">Send us a Message</h2>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-mountain-brown mb-1.5 uppercase tracking-wide">First Name</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold/20 outline-none bg-mountain-sand/10 text-sm transition-all"
                      placeholder="Kasun"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-mountain-brown mb-1.5 uppercase tracking-wide">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold/20 outline-none bg-mountain-sand/10 text-sm transition-all"
                      placeholder="Perera"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-mountain-brown mb-1.5 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold/20 outline-none bg-mountain-sand/10 text-sm transition-all"
                    placeholder="kasun@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-mountain-brown mb-1.5 uppercase tracking-wide">Subject</label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold/20 outline-none bg-mountain-sand/10 text-mountain-brown text-sm transition-all">
                    <option>General Inquiry</option>
                    <option>Retail Order</option>
                    <option>Bulk / Wholesale Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-mountain-brown mb-1.5 uppercase tracking-wide">Message</label>
                  <textarea
                    rows="4"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold/20 outline-none bg-mountain-sand/10 text-sm resize-none transition-all"
                    placeholder="How can we help you?"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  type="button"
                  className="w-full py-3 bg-mountain-moss text-white rounded-xl font-bold text-sm hover:bg-mountain-brown transition-all duration-300 shadow-lg shadow-mountain-moss/25 flex items-center justify-center gap-2"
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
