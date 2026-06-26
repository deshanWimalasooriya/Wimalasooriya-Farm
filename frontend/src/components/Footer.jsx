import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Globe, MessageCircle, Share2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-mountain-brown text-mountain-sand pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-mountain-gold" />
              <span className="font-bold text-3xl tracking-tight">
                Wimalasooriya <span className="text-mountain-gray font-light">Farm</span>
              </span>
            </Link>
            <p className="text-mountain-gray max-w-sm text-lg leading-relaxed">
              Providing fresh, premium quality eggs and farm products with purity and care, straight from our wintery landscapes to your table.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 bg-mountain-moss/20 rounded-full hover:bg-mountain-gold hover:text-mountain-brown transition-all duration-300">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-mountain-moss/20 rounded-full hover:bg-mountain-gold hover:text-mountain-brown transition-all duration-300">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-mountain-moss/20 rounded-full hover:bg-mountain-gold hover:text-mountain-brown transition-all duration-300">
                <Share2 className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-mountain-gold">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-mountain-gray hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link to="/about" className="text-mountain-gray hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link to="/contact" className="text-mountain-gray hover:text-white transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-mountain-gold">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-mountain-gray">
                <MapPin className="h-5 w-5 text-mountain-moss shrink-0 mt-0.5" />
                <span>123 Snowy Mountain Road,<br />Frost Valley, FV 10020</span>
              </li>
              <li className="flex items-center gap-3 text-mountain-gray">
                <Phone className="h-5 w-5 text-mountain-moss shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-mountain-gray">
                <Mail className="h-5 w-5 text-mountain-moss shrink-0" />
                <span>hello@wimalasooriyafarm.com</span>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-mountain-gray/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-mountain-gray text-sm">
            &copy; {new Date().getFullYear()} Wimalasooriya Farm. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-mountain-gray">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
