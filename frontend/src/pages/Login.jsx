import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-mountain-sand flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-mountain-gray/20 animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-mountain-gold/20 text-mountain-moss rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-mountain-brown">Welcome back</h2>
          <p className="text-mountain-gray mt-2">Sign in to your account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-mountain-brown">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss focus:ring-2 focus:ring-mountain-moss/20 transition-all outline-none bg-mountain-sand/50" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-mountain-brown">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss focus:ring-2 focus:ring-mountain-moss/20 transition-all outline-none bg-mountain-sand/50" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg transform hover:-translate-y-0.5"
            style={{ backgroundColor: '#52311B', color: '#ffffff', boxShadow: '0 8px 20px -4px rgba(82,49,27,0.30)' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#52311B'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#52311B'; e.currentTarget.style.color = '#ffffff'; }}
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-mountain-gray">
          Don't have an account?{' '}
          <Link to="/register" className="text-mountain-moss hover:text-mountain-brown font-semibold transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
