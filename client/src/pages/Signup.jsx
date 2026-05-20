import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const { register, appName, sysSettings } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error("Signup error:", err);
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (err.message === 'Network Error') {
        setError('Network error: Unable to reach the server. Is it running on port 5000?');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <Helmet>
        <title>Create Account | {appName}</title>
      </Helmet>

      {/* Left side: Premium Visual */}
      <div className="auth-split-visual" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, var(--bg-primary) 100%)' }}>
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
            Start your journey to financial freedom.
          </h2>
          <p className="text-emerald-200 max-w-sm mx-auto">
            Get comprehensive insights and full control over your money in less than a minute.
          </p>
        </motion.div>
      </div>

      {/* Right side: Signup Form */}
      <div className="auth-split-form">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
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
            <div className="auth-icon" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.2) 100%)' }}>
              ✨
            </div>
            <h1>Create Account</h1>
            <p>Enter your details below to get started for free.</p>
          </div>

          {error && <div className="msg-error animate-pulse">{error}</div>}

          {!sysSettings?.allowRegistrations ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(239,68,68,0.05)', borderRadius: '16px', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛔</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f87171', marginBottom: '0.5rem' }}>Registrations Disabled</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                New account creations are currently turned off. Please contact the administrator for an invite.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group mb-4">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-input green-focus"
                  placeholder="Your name"
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  pattern="^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,3}$"
                  title="A valid email with a 2 or 3 letter domain (e.g. .com, .in)"
                  className="form-input green-focus"
                  placeholder="name@example.com"
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label" style={{ marginBottom: '2px' }}>Password</label>
                <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '8px' }}>Min 6 chars, 1 uppercase, 1 number, 1 special char (@, $...)</div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="form-input green-focus"
                    style={{ paddingRight: '2.5rem' }}
                    placeholder="e.g. Pass@123"
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

              <div className="form-group mb-4">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={6}
                    className="form-input green-focus"
                    style={{ paddingRight: '2.5rem' }}
                    placeholder="Re-type password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? '👁️‍🗨️' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-green btn-full mt-6 shadow-lg hover:shadow-emerald-500/25">
                Create Account
              </button>
            </form>
          )}

          <div className="auth-footer mt-6">
            <p className="text-gray text-sm">
              Already have an account? <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
