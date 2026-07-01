import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const inputBase = {
  backgroundColor: '#FFFFFF',
  borderColor: '#D8CBBF',
  color: '#1A1208',
};
const onFocus = e => {
  e.currentTarget.style.borderColor = '#3E2206';
  e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(62,34,6,0.12)';
};
const onBlur = e => {
  e.currentTarget.style.borderColor = '#D8CBBF';
  e.currentTarget.style.boxShadow   = 'none';
};

const Login = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const { login }  = useContext(AuthContext);
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate('/dashboard');
  };

  return (
    /* Full-screen farm background */
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{
        backgroundImage:    "url('/login-bg.png')",
        backgroundSize:     'cover',
        backgroundPosition: 'center',
        backgroundRepeat:   'no-repeat',
      }}
    >
      {/* Subtle dark scrim so background doesn't overpower */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.28)' }}
      />

      {/* Floating card */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          backgroundColor: 'rgba(250,248,245,0.97)',
          backdropFilter:  'blur(20px) saturate(160%)',
          border:          '1px solid rgba(62,34,6,0.18)',
          boxShadow:       '0 32px 80px -12px rgba(0,0,0,0.40), 0 0 0 1px rgba(62,34,6,0.10)',
        }}
      >
        {/* Thin accent top bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #3E2206, #6B3A1F, #3E2206)' }} />

        <div className="px-8 pt-8 pb-9">

          {/* Header */}
          <div className="text-center mb-7">
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: '#1A1208', fontFamily: 'Georgia, serif' }}
            >
              Wimalasooriya Farm
            </h1>
            <p className="text-sm" style={{ color: '#9E8872' }}>
              Sign in to your estate management portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
                style={{ color: '#5C4F3D' }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: '#B8A090' }}
                />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="manager@wfarm.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm transition-all"
                  style={inputBase}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
                style={{ color: '#5C4F3D' }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: '#B8A090' }}
                />
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border outline-none text-sm transition-all"
                  style={inputBase}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#B8A090' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#5C4F3D'}
                  onMouseLeave={e => e.currentTarget.style.color = '#B8A090'}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot row */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#3E2206] cursor-pointer"
                />
                <span className="text-sm" style={{ color: '#7A6A56' }}>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold transition-colors"
                style={{ color: '#3E2206', fontFamily: 'monospace', letterSpacing: '0.03em' }}
                onMouseEnter={e => e.currentTarget.style.color = '#6B3A1F'}
                onMouseLeave={e => e.currentTarget.style.color = '#3E2206'}
              >
                Forgot your password?
              </Link>
            </div>

            {/* Sign In button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 mt-1 disabled:opacity-70"
              style={{
                backgroundColor: '#3E2206',
                boxShadow: '0 6px 22px rgba(62,34,6,0.36)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#5a3209'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#3E2206'; }}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                : <><LogIn className="w-4 h-4" /> SIGN IN</>
              }
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="h-px w-full" style={{ backgroundColor: '#E8E3DC' }} />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm" style={{ color: '#9E8872' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold uppercase text-xs tracking-wider transition-colors"
              style={{ color: '#1A1208' }}
              onMouseEnter={e => e.currentTarget.style.color = '#3E2206'}
              onMouseLeave={e => e.currentTarget.style.color = '#1A1208'}
            >
              Sign Up
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;
