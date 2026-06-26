import { useState } from 'react';
import { PackageOpen, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BulkOrders = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    quantity: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending quote request
    toast.success('Quote request sent! Our team will contact you shortly.');
    setFormData({ companyName: '', email: '', phone: '', quantity: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-mountain-sand/10 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 bg-white rounded-3xl overflow-hidden shadow-2xl border border-mountain-gray/20">
        
        {/* Info Side */}
        <div className="bg-mountain-brown text-white p-12 flex flex-col justify-center animate-fade-in">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
            <PackageOpen className="w-8 h-8 text-mountain-sand" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Partner with Us</h2>
          <p className="text-mountain-gray mb-8 text-lg leading-relaxed">
            Require massive quantities? We supply restaurants, bakeries, and supermarkets with premium farm-fresh eggs at wholesale rates. Request a custom quote today.
          </p>
          <ul className="space-y-4 font-medium">
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-mountain-gold"></div> Reliable Daily Delivery</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-mountain-gold"></div> Unmatched Quality Control</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-mountain-gold"></div> Competitive Wholesale Pricing</li>
          </ul>
        </div>

        {/* Form Side */}
        <div className="p-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-2xl font-bold text-mountain-brown mb-6">Request a Quote</h3>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-mountain-brown">Business Name</label>
              <input 
                type="text" 
                name="companyName"
                required
                className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss focus:ring-2 focus:ring-mountain-moss/20 transition-all outline-none bg-mountain-sand/5" 
                placeholder="Your Company Ltd"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-mountain-brown">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss focus:ring-2 focus:ring-mountain-moss/20 transition-all outline-none bg-mountain-sand/5" 
                  placeholder="hello@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-mountain-brown">Phone</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss focus:ring-2 focus:ring-mountain-moss/20 transition-all outline-none bg-mountain-sand/5" 
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-mountain-brown">Estimated Weekly Quantity (Trays)</label>
              <input 
                type="number" 
                name="quantity"
                required
                className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss focus:ring-2 focus:ring-mountain-moss/20 transition-all outline-none bg-mountain-sand/5" 
                placeholder="e.g. 50"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-mountain-brown">Additional Details</label>
              <textarea 
                name="message"
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss focus:ring-2 focus:ring-mountain-moss/20 transition-all outline-none bg-mountain-sand/5 resize-none" 
                placeholder="Any specific requirements..."
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-mountain-gold text-white rounded-xl font-bold text-lg hover:bg-mountain-brown transition-all duration-300 shadow-lg shadow-mountain-gold/30 hover:shadow-mountain-brown/30 transform hover:-translate-y-0.5 mt-2 flex justify-center items-center gap-2"
            >
              <Send className="w-5 h-5" /> Submit Request
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default BulkOrders;
