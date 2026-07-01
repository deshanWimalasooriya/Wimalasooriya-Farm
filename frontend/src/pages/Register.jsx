import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  User, Mail, Phone, Lock, ArrowRight, ShieldCheck,
  Loader2, Tractor, Eye, EyeOff, LayoutGrid
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const OPERATION_TYPES = [
  'Poultry Farming',
  'Egg Distribution',
  'Retail / Supermarket',
  'Bakery / Food Business',
  'Restaurant / Hotel',
  'Other',
];

const inputStyle = {
  borderColor: '#D4C5B0',
  backgroundColor: '#FAFAF8',
  color: '#1A1208',
};
const handleFocus = e => {
  e.currentTarget.style.borderColor = '#3E2206';
  e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(62,34,6,0.10)';
};
const handleBlur  = e => {
  e.currentTarget.style.borderColor = '#D4C5B0';
  e.currentTarget.style.boxShadow   = 'none';
};

const Field = ({ label, icon: Icon, type = 'text', suffix, ...props }) => (
  <div>
    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#5C4F3D' }}>
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#B8A090' }} />
      )}
      <input
        type={type}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none text-sm transition-all"
        style={inputStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {suffix}
    </div>
  </div>
);

const Register = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '', operationType: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { toast.error('Please agree to the Terms of Service'); return; }

    setLoading(true);
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    const success = await register(fullName, form.email, form.password);
    setLoading(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div
      className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-4"
      style={{ backgroundColor: '#F0EDEA' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex"
        style={{ minHeight: '560px' }}
      >

        {/* ── Left Panel ── */}
        <div
          className="hidden md:flex flex-col justify-between w-[42%] flex-shrink-0 p-8"
          style={{
            background: 'linear-gradient(160deg, #3E2206 0%, #6B3A1F 60%, #3E2206 100%)',
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            >
              <Tractor className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-sm tracking-wide">Wimalasooriya Farm</span>
          </div>

          {/* Headline */}
          <div>
            <h2
              className="text-2xl font-bold text-white leading-snug mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Cultivate your estate management journey.
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,220,180,0.75)' }}>
              Join our platform to streamline operations, manage inventory, and oversee logistics with unparalleled clarity.
            </p>
          </div>

          {/* Footer trust badge */}
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,220,180,0.65)' }} />
            <span className="text-xs" style={{ color: 'rgba(255,220,180,0.65)' }}>
              Enterprise-grade secure infrastructure
            </span>
          </div>
        </div>

        {/* ── Right Panel (Form) ── */}
        <div className="flex-1 bg-white flex flex-col justify-center px-8 py-10">
          <div className="mb-7">
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: '#1A1208', fontFamily: 'Georgia, serif' }}
            >
              Create Account
            </h1>
            <p className="text-sm" style={{ color: '#9E8872' }}>
              Register to access the estate management dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="First Name"
                icon={User}
                placeholder="John"
                value={form.firstName}
                onChange={set('firstName')}
                required
              />
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#5C4F3D' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-all"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={set('lastName')}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <Field
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="admin@estate.com"
              value={form.email}
              onChange={set('email')}
              required
            />

            {/* Phone */}
            <Field
              label="Phone Number"
              icon={Phone}
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={set('phone')}
            />

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#5C4F3D' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#B8A090' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  minLength={6}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border outline-none text-sm transition-all"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  value={form.password}
                  onChange={set('password')}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#B8A090' }}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Operation Type */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#5C4F3D' }}>
                Operation Type
              </label>
              <div className="relative">
                <LayoutGrid className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#B8A090' }} />
                <select
                  value={form.operationType}
                  onChange={set('operationType')}
                  className="w-full pl-10 pr-8 py-2.5 rounded-lg border outline-none text-sm transition-all appearance-none"
                  style={{
                    ...inputStyle,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23B8A090' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.65rem center',
                    backgroundSize: '1.1rem',
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <option value="">Select operation type...</option>
                  {OPERATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[#3E2206] cursor-pointer flex-shrink-0"
              />
              <label htmlFor="terms" className="text-sm cursor-pointer" style={{ color: '#7A6A56' }}>
                I agree to the{' '}
                <Link to="/terms" className="font-bold underline-offset-2 hover:underline" style={{ color: '#1A1208' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="font-bold underline-offset-2 hover:underline" style={{ color: '#1A1208' }}>Privacy Policy</Link>.
              </label>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm text-white transition-all duration-200 mt-1 disabled:opacity-70"
              style={{ backgroundColor: '#3E2206', boxShadow: '0 6px 20px rgba(62,34,6,0.30)' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#5a3209'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#3E2206'; }}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                : <>Create Account <ArrowRight className="w-4 h-4" /></>
              }
            </motion.button>

          </form>

          {/* Divider + Sign In link */}
          <div className="mt-6">
            <div className="h-px mb-5" style={{ backgroundColor: '#E8E3DC' }} />
            <p className="text-center text-sm" style={{ color: '#9E8872' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold transition-colors"
                style={{ color: '#1A1208' }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Register;
