import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { login, appName } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      setShowSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      console.error("Login error:", err);
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (err.message === 'Network Error') {
        setError('Network error: Unable to reach the server. Is it running on port 5000?');
      } else {
        setError('Incorrect Email or Password!');
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <Helmet>
        <title>Sign In | {appName}</title>
      </Helmet>

      {/* Left side: Premium Visual */}
      <div className="auth-split-visual">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 space-y-6"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <span style={{ fontSize: '3rem' }}>💰</span>
            <span className="font-bold text-4xl" style={{ letterSpacing: '-0.025em', color: 'white' }}>{appName}</span>
          </div>
          <h2 className="text-3xl font-bold text-white max-w-sm mx-auto" style={{ lineHeight: '1.4' }}>
            Elevate your financial clarity.
          </h2>
          <p className="text-indigo-200 max-w-sm mx-auto">
            Join thousands of users who have revolutionized the way they manage their personal finances.
          </p>
        </motion.div>
      </div>

      {/* Right side: Login Form */}
      <div className="auth-split-form">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="auth-card"
        >
          <div className="mb-4">
            <Link to="/" className="text-gray text-sm flex items-center gap-2 hover:text-white transition-colors">
              <span>←</span> Back to Home
            </Link>
          </div>

          <div className="auth-header mt-2">
            <div className="auth-icon" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(124,58,237,0.2) 100%)' }}>
              👋
            </div>
            <h1>Welcome Back</h1>
            <p>Enter your details to access your dashboard.</p>
          </div>

          {error && <div className="msg-error animate-pulse">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                id="userEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="name@company.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="userPass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                  style={{ paddingRight: '2.5rem' }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-indigo btn-full shadow-lg hover:shadow-indigo-500/25">
              Sign In
            </button>
          </form>

          <div className="auth-footer space-y-4">
            <p className="text-gray text-sm">
              Don't have an account? <Link to="/signup" className="font-bold text-indigo-400 hover:text-indigo-300">Sign Up</Link>
            </p>
            <div className="mt-5">
              <Link to="/admin-login" className="btn btn-full" style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>
                Switch to Admin Portal
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="popup-overlay z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="popup-card glass"
          >
            <div className="popup-icon" style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>✅</div>
            <h3 className="text-2xl font-bold mb-2">Login Successful!</h3>
            <p className="text-gray mb-4">Redirecting to your dashboard...</p>
            <div className="popup-bar">
              <div className="popup-bar-fill"></div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
