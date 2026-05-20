import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { adminLogin, appName } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Admin Credentials!');
      
      // Pulse effect on error
      const card = document.querySelector('.auth-card');
      if (card) {
        card.classList.add('animate-pulse');
        setTimeout(() => card.classList.remove('animate-pulse'), 500);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <Helmet>
        <title>Admin Portal | {appName}</title>
      </Helmet>

      {/* Left side: Premium Visual */}
      <div className="auth-split-visual" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #000000 100%)' }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 space-y-6"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <span style={{ fontSize: '3rem' }}>🛡️</span>
            <span className="font-bold text-4xl" style={{ letterSpacing: '-0.025em', color: 'white' }}>{appName}</span>
          </div>
          <h2 className="text-3xl font-bold text-white max-w-sm mx-auto" style={{ lineHeight: '1.4' }}>
            System Administration.
          </h2>
          <p className="text-indigo-200 max-w-sm mx-auto">
            Manage users, review system health, and secure the platform's infrastructure.
          </p>
        </motion.div>
      </div>

      {/* Right side: Login Form */}
      <div className="auth-split-form">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="auth-card glass" 
          style={{ borderColor: 'rgba(245,158,11,0.2)' }}
        >
          <div className="glow" style={{ background: 'rgba(245,158,11,0.05)' }}></div>

          <div className="mb-4">
            <Link to="/" className="text-gray text-sm flex items-center gap-2 hover:text-white transition-colors">
              <span>←</span> Back to Home
            </Link>
          </div>

          <div className="auth-header mt-2">
            <div className="auth-icon animate-float" style={{ background: 'rgba(245,158,11,0.2)', boxShadow: '0 10px 15px -3px rgba(245,158,11,0.2)' }}>
              🔐
            </div>
            <h1>Admin Portal</h1>
            <p>Restricted access only</p>
          </div>

          {error && <div className="msg-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input amber-focus"
                placeholder="admin@company.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Security Key</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input amber-focus"
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

            <button type="submit" className="btn btn-amber btn-full">
              Access Dashboard
            </button>
          </form>

          <div className="auth-footer mt-5">
            <Link to="/login" className="btn btn-full flex items-center justify-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>
              <span>←</span> Back to User Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
