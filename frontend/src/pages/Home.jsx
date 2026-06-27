import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-mountain-sand py-20 lg:py-32">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-mountain-gold/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-mountain-moss/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-mountain-brown mb-6 tracking-tight animate-slide-up opacity-0">
              Freshness from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-mountain-moss to-mountain-gold">Frosty Valleys</span>
            </h1>
            <p className="text-xl text-mountain-gray mb-10 animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
              Experience the crystal-clear purity of Wimalasooriya Farm. We provide premium quality eggs and farm products, raised with care in our pristine winter landscape.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up opacity-0" style={{ animationDelay: '0.4s' }}>
              <Link to="/contact" className="px-8 py-4 bg-mountain-moss text-white rounded-xl font-semibold text-lg hover:bg-mountain-brown transition-all duration-300 shadow-xl shadow-mountain-moss/30 hover:shadow-mountain-brown/40 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                Order Fresh Eggs <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="px-8 py-4 bg-white text-mountain-brown border border-mountain-gray/30 rounded-xl font-semibold text-lg hover:bg-white/50 hover:border-mountain-gold transition-all duration-300 flex items-center justify-center">
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-mountain-brown mb-4">Why Choose Wimalasooriya?</h2>
            <p className="text-mountain-gray max-w-2xl mx-auto">Our commitment to purity and quality ensures you get only the best for your family and business.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Pristine Environment",
                desc: "Raised in clean, wintery landscapes ensuring the highest standards of hygiene and animal welfare."
              },
              {
                title: "Farm to Table",
                desc: "Direct supply chain means your eggs are delivered fresh, skipping unnecessary delays."
              },
              {
                title: "Bulk & Retail",
                desc: "Whether you need a dozen for breakfast or a thousand for your bakery, we've got you covered."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-mountain-sand/50 border border-mountain-gray/20 hover:border-mountain-gold/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CheckCircle2 className="w-10 h-10 text-mountain-moss mb-6" />
                <h3 className="text-xl font-semibold text-mountain-brown mb-3">{feature.title}</h3>
                <p className="text-mountain-gray leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-mountain-brown relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-mountain-sand via-transparent to-transparent animate-pulse"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to experience the difference?</h2>
          <p className="text-mountain-gold text-lg mb-10">Join hundreds of happy families and businesses who trust Wimalasooriya Farm.</p>
          <Link to="/contact" className="inline-flex px-8 py-4 bg-mountain-sand text-mountain-brown rounded-xl font-bold text-lg hover:bg-white transition-all duration-300 shadow-xl shadow-black/20 transform hover:-translate-y-1">
            Get in Touch Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
