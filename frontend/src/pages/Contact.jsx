import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="w-full bg-mountain-sand min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-mountain-brown mb-6 animate-slide-up opacity-0">Get in Touch</h1>
          <p className="text-xl text-mountain-gray animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
            Whether you want to place a bulk order or just say hello, we'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="md:col-span-1 space-y-8 animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white p-6 rounded-2xl border border-mountain-gray/20 shadow-sm transition-transform hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-mountain-gold/20 text-mountain-moss rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-mountain-brown mb-2">Visit Us</h3>
              <p className="text-mountain-gray">123 Snowy Mountain Road,<br />Frost Valley, FV 10020</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-mountain-gray/20 shadow-sm transition-transform hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-mountain-gold/20 text-mountain-moss rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-mountain-brown mb-2">Call Us</h3>
              <p className="text-mountain-gray">+1 (555) 123-4567<br />Mon-Fri from 8am to 5pm</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-mountain-gray/20 shadow-sm transition-transform hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-mountain-gold/20 text-mountain-moss rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-mountain-brown mb-2">Email Us</h3>
              <p className="text-mountain-gray">hello@wimalasooriyafarm.com<br />orders@wimalasooriyafarm.com</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white p-8 lg:p-10 rounded-3xl border border-mountain-gray/20 shadow-xl animate-slide-up opacity-0" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-2xl font-bold text-mountain-brown mb-8">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-mountain-brown">First Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss focus:ring-2 focus:ring-mountain-moss/20 transition-all outline-none bg-mountain-sand/50" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-mountain-brown">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss focus:ring-2 focus:ring-mountain-moss/20 transition-all outline-none bg-mountain-sand/50" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-mountain-brown">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss focus:ring-2 focus:ring-mountain-moss/20 transition-all outline-none bg-mountain-sand/50" placeholder="john@example.com" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-mountain-brown">Subject</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss focus:ring-2 focus:ring-mountain-moss/20 transition-all outline-none bg-mountain-sand/50 text-mountain-brown">
                    <option>General Inquiry</option>
                    <option>Retail Order</option>
                    <option>Bulk/Wholesale Order</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-mountain-brown">Message</label>
                  <textarea rows="5" className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss focus:ring-2 focus:ring-mountain-moss/20 transition-all outline-none bg-mountain-sand/50 resize-none" placeholder="How can we help you?"></textarea>
                </div>
                
                <button type="button" className="w-full py-4 bg-mountain-moss text-white rounded-xl font-bold text-lg hover:bg-mountain-brown transition-all duration-300 shadow-lg shadow-mountain-moss/30 hover:shadow-mountain-brown/30 flex items-center justify-center gap-2">
                  Send Message <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
