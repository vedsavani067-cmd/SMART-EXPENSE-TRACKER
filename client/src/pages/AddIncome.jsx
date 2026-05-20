import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

// Icon + color map for known income sources
const SRC_META = {
  Salary:     { icon: '💼', color: '#10b981' },
  Freelance:  { icon: '💻', color: '#6366f1' },
  Investment: { icon: '📈', color: '#f59e0b' },
  Business:   { icon: '🏪', color: '#8b5cf6' },
  Gift:       { icon: '🎁', color: '#ec4899' },
  Rent:       { icon: '🏠', color: '#f97316' },
  Dividend:   { icon: '💹', color: '#06b6d4' },
  Other:      { icon: '💰', color: '#64748b' },
};
const PALETTE = ['#10b981','#6366f1','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#f97316','#64748b'];
const getSrcMeta = (name, idx) => SRC_META[name] || { icon: '💳', color: PALETTE[idx % PALETTE.length] };

export default function AddIncome() {
  const [sources, setSources] = useState([]);
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/admin/categories/list')
      .then(res => {
        const cats = res.data.incomeCategories || [];
        setSources(cats);
        if (cats.length > 0) setSource(cats[0]);
      })
      .catch(() => {
        const defaults = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'];
        setSources(defaults);
        setSource(defaults[0]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const amtNum = Number(amount);
    if (!amount || !Number.isFinite(amtNum) || amtNum < 1 || amtNum > 10000000) {
      setError('Amount must be between ₹1 and ₹1,00,00,000.');
      return;
    }
    try {
      setLoading(true);
      await API.post('/transactions', { type: 'income', amount: amtNum, category: source, date, description });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
        setDescription('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add income.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1a' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', flex: 1, padding: '2.5rem' }}>

        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* Header */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 8px 20px rgba(16,185,129,0.35)' }}>➕</div>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Add Income</h1>
                <p style={{ color: '#475569', fontSize: '0.875rem' }}>Record your earnings and inflows.</p>
              </div>
            </div>
          </motion.div>

          {/* Success Toast */}
          <AnimatePresence>
            {success && (
              <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
                style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem', borderRadius: '14px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✅ Income recorded! Ready for the next entry...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem', borderRadius: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontWeight: 500 }}>
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} style={{ maxWidth: '640px' }}>
            {/* Amount Card */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem', marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '1rem' }}>Amount</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.75rem', color: '#4ade80', fontWeight: 700 }}>₹</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="1" max="10000000" step="1" placeholder="0"
                  style={{ width: '100%', paddingLeft: '3.5rem', paddingRight: '1.25rem', paddingTop: '1.1rem', paddingBottom: '1.1rem', fontSize: '2rem', fontWeight: 800, fontFamily: 'monospace', background: 'rgba(16,185,129,0.06)', border: '2px solid rgba(16,185,129,0.2)', borderRadius: '14px', color: 'white', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,0.2)'} />
              </div>
              {amount && <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>₹{Number(amount).toLocaleString('en-IN')}</div>}
              <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#334155' }}>Max: ₹1,00,00,000 (1 Cr)</p>
            </motion.div>

            {/* Source */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem', marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '1rem' }}>Income Source</label>
              {sources.length === 0 ? (
                <div style={{ color: '#475569', fontSize: '0.85rem', padding: '1rem 0' }}>Loading categories…</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {sources.map((name, idx) => {
                    const meta = getSrcMeta(name, idx);
                    return (
                      <motion.button key={name} type="button" onClick={() => setSource(name)}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.875rem 1rem',
                          borderRadius: '12px', border: `2px solid ${source === name ? meta.color : 'rgba(255,255,255,0.08)'}`,
                          background: source === name ? `${meta.color}18` : 'rgba(255,255,255,0.03)',
                          color: source === name ? 'white' : '#64748b',
                          cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
                        }}>
                        <span style={{ fontSize: '1.1rem' }}>{meta.icon}</span>
                        {name}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Date & Description */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.75rem' }}>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                  style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.75rem' }}>Note</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional note..."
                  style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} style={{ display: 'flex', gap: '1rem' }}>
              <motion.button type="submit" disabled={loading || success} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ flex: 1, padding: '1rem', borderRadius: '14px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '1rem', color: 'white', background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 20px rgba(16,185,129,0.35)', opacity: loading ? 0.7 : 1, transition: 'all 0.2s' }}>
                {loading ? '⏳ Adding...' : '➕ Add Income'}
              </motion.button>
              <Link to="/dashboard"
                style={{ padding: '1rem 2rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}>
                Cancel
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
