import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, MessageCircle, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Footer = () => {
  const [company, setCompany] = useState({
    name: 'Wimalasooriya Farms',
    logoUrl: '/logo.png',
    email: 'hello@wimalasooriyafarm.com',
    phone: '+1 (555) 123-4567',
    address: '123 Snowy Mountain Road,\nFrost Valley, FV 10020',
  });

  useEffect(() => {
    axios.get('/api/company')
      .then(res => {
        const d = res.data;
        setCompany({
          name:    d.name    || 'Wimalasooriya Farms',
          logoUrl: d.logoUrl || '/logo.png',
          email:   d.email   || 'hello@wimalasooriyafarm.com',
          phone:   d.phone   || '+1 (555) 123-4567',
          address: d.address || '123 Snowy Mountain Road,\nFrost Valley, FV 10020',
        });
      })
      .catch(() => {/* silently keep defaults */});
  }, []);

  return (
    <footer style={{ backgroundColor: '#52311B', color: '#D0D8DF' }} className="pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-16 w-16 object-contain drop-shadow-md"
              />
              <span className="font-bold text-3xl tracking-tight" style={{ color: '#FFFFFF' }}>
                {company.name.split(' ')[0]}{' '}
                <span className="font-light" style={{ color: '#DDBA9B' }}>
                  {company.name.split(' ').slice(1).join(' ')}
                </span>
              </span>
            </Link>
            <p className="max-w-sm text-lg leading-relaxed" style={{ color: 'rgba(208,216,223,0.80)' }}>
              Providing fresh, premium quality eggs and farm products with purity and care, straight from our wintery landscapes to your table.
            </p>
            <div className="flex space-x-4 pt-2">
              {[Globe, MessageCircle, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-full transition-all duration-300"
                  style={{ backgroundColor: 'rgba(221,186,155,0.15)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#DDBA9B'; e.currentTarget.style.color = '#013547'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(221,186,155,0.15)'; e.currentTarget.style.color = ''; }}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6" style={{ color: '#DDBA9B' }}>Quick Links</h3>
            <ul className="space-y-4">
              {[
                { to: '/',            label: 'Home'     },
                { to: '/about',       label: 'About Us' },
                { to: '/contact',     label: 'Contact'  },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="transition-colors duration-200"
                    style={{ color: 'rgba(208,216,223,0.75)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(208,216,223,0.75)'; }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info — fetched from backend */}
          <div>
            <h3 className="text-lg font-semibold mb-6" style={{ color: '#DDBA9B' }}>Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3" style={{ color: 'rgba(208,216,223,0.80)' }}>
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#DDBA9B' }} />
                <span style={{ whiteSpace: 'pre-line' }}>{company.address}</span>
              </li>
              <li className="flex items-center gap-3" style={{ color: 'rgba(208,216,223,0.80)' }}>
                <Phone className="h-5 w-5 shrink-0" style={{ color: '#DDBA9B' }} />
                <a href={`tel:${company.phone}`}
                  onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = ''; }}
                >
                  {company.phone}
                </a>
              </li>
              <li className="flex items-center gap-3" style={{ color: 'rgba(208,216,223,0.80)' }}>
                <Mail className="h-5 w-5 shrink-0" style={{ color: '#DDBA9B' }} />
                <a href={`mailto:${company.email}`}
                  onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = ''; }}
                >
                  {company.email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'rgba(208,216,223,0.15)' }}>
          <p className="text-sm" style={{ color: 'rgba(208,216,223,0.55)' }}>
            &copy; {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm" style={{ color: 'rgba(208,216,223,0.55)' }}>
            <a href="#"
              className="transition-colors"
              onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(208,216,223,0.55)'; }}
            >Privacy Policy</a>
            <a href="#"
              className="transition-colors"
              onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(208,216,223,0.55)'; }}
            >Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
