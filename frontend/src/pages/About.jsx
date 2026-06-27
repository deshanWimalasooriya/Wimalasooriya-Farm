import { Users, Target, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="bg-mountain-sand py-20 border-b border-mountain-gray/20 overflow-hidden relative">
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-mountain-gold/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-mountain-brown mb-6 animate-slide-up opacity-0">About Wimalasooriya Farm</h1>
          <p className="text-xl text-mountain-gray max-w-2xl mx-auto animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
            A legacy of purity, freshness, and quality nestled in the frosty landscapes.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-3xl font-bold text-mountain-brown">Our Story</h2>
            <p className="text-mountain-gray leading-relaxed text-lg">
              Founded on the principles of hard work and an uncompromising dedication to nature, Wimalasooriya Farm started as a small family operation. We believed that the cold, crisp winter environment provided the perfect setting for clean, healthy farming.
            </p>
            <p className="text-mountain-gray leading-relaxed text-lg">
              Today, we have grown into a comprehensive platform, supplying both retail customers and wholesale businesses, but our core philosophy remains unchanged: Pure, fresh, and ethically raised.
            </p>
          </div>
          <div className="bg-mountain-sand rounded-3xl p-8 lg:p-12 border border-mountain-gray/20 animate-fade-in shadow-xl opacity-0" style={{ animationDelay: '0.5s' }}>
             <div className="grid grid-cols-1 gap-8">
               <div className="flex items-start gap-4">
                 <div className="p-3 bg-mountain-moss/20 text-mountain-moss rounded-xl">
                   <Target className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold text-mountain-brown mb-2">Our Mission</h3>
                   <p className="text-mountain-gray">To deliver the freshest farm products directly to your table with absolute transparency and care.</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <div className="p-3 bg-mountain-moss/20 text-mountain-moss rounded-xl">
                   <Users className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold text-mountain-brown mb-2">Community First</h3>
                   <p className="text-mountain-gray">Supporting local businesses and families with reliable, high-quality bulk and retail supply.</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <div className="p-3 bg-mountain-moss/20 text-mountain-moss rounded-xl">
                   <ShieldCheck className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold text-mountain-brown mb-2">Quality Guarantee</h3>
                   <p className="text-mountain-gray">Every egg is inspected for quality, ensuring only the best reaches our customers.</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
