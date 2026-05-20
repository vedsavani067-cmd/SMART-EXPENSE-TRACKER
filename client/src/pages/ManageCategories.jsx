import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const INCOME_ICONS = { Salary: '💼', Freelance: '💻', Investment: '📈', Business: '🏪', Gift: '🎁', Other: '💰' };
const EXPENSE_ICONS = { Food: '🍔', Transport: '🚗', Shopping: '🛍️', Bills: '⚡', Health: '💊', Entertainment: '🎬', Education: '📚', Other: '💳' };

export default function ManageCategories() {
  const [stats, setStats] = useState({ incomeStats: [], expenseStats: [] });
  const [loading, setLoading] = useState(true);
  const [purging, setPurging] = useState(false);
  const [purgeMsg, setPurgeMsg] = useState('');

  const fetchCategories = async () => {
    try { const res = await API.get('/admin/categories'); setStats(res.data); }
    catch (err) { console.error('Failed to fetch categories', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handlePurge = async () => {
    if (!window.confirm('Clean all invalid transactions? This cannot be undone.')) return;
    try {
      setPurging(true);
      const res = await API.delete('/admin/purge-invalid');
      setPurgeMsg(res.data.message || 'Purge complete.');
      fetchCategories();
      setTimeout(() => setPurgeMsg(''), 4000);
    } catch (err) {
      setPurgeMsg('Failed to purge transactions.');
      setTimeout(() => setPurgeMsg(''), 4000);
    } finally { setPurging(false); }
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

  const CategoryCard = ({ cat, icons, accentColor, bgColor }) => (
    <motion.div variants={fadeUp}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', marginBottom: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', cursor: 'default' }}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
          {icons[cat.name] || '📌'}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'white' }}>{cat.name}</div>
          <div style={{ fontSize: '0.7rem', color: '#475569' }}>Used {cat.count} time{cat.count !== 1 ? 's' : ''} · Total {fmt(cat.sum)}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
        <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.875rem', color: accentColor }}>{fmt(cat.sum)}</div>
        <div style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '999px', fontWeight: 600,
          background: cat.count > 0 ? `${accentColor}18` : 'rgba(255,255,255,0.05)',
          color: cat.count > 0 ? accentColor : '#475569' }}>
          {cat.count > 0 ? `${cat.count} txns` : 'Unused'}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1a' }}>
      <Sidebar type="admin" />
      <main style={{ marginLeft: '260px', flex: 1, padding: '2.5rem' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 8px 20px rgba(16,185,129,0.35)', flexShrink: 0 }}>🏷️</div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Categories</h1>
              <p style={{ color: '#475569', fontSize: '0.875rem', marginTop: '2px' }}>Explore system-wide income sources and expense categories, showing how often each is used and its total transaction value.</p>
            </div>
          </div>
          <motion.button onClick={handlePurge} disabled={purging} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.7rem 1.25rem', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontWeight: 600, fontSize: '0.875rem', cursor: purging ? 'not-allowed' : 'pointer', opacity: purging ? 0.7 : 1, flexShrink: 0 }}>
            🗑️ {purging ? 'Cleaning...' : 'Clean Invalid Data'}
          </motion.button>
        </motion.div>

        {/* Purge Message */}
        <AnimatePresence>
          {purgeMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem', borderRadius: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80', fontWeight: 600, fontSize: '0.875rem' }}>
              ✅ {purgeMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {[1,2].map(i => <div key={i} style={{ height: '300px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            {/* Income Sources */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>📥</div>
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>Income Sources</h2>
                  <p style={{ fontSize: '0.72rem', color: '#475569' }}>{stats.incomeStats.length} categories tracked</p>
                </div>
              </div>
              <motion.div variants={stagger} initial="hidden" animate="visible">
                {stats.incomeStats.length === 0
                  ? <div style={{ textAlign: 'center', padding: '2rem', color: '#334155', fontSize: '0.85rem' }}>No income data yet</div>
                  : stats.incomeStats.map(cat => <CategoryCard key={cat.name} cat={cat} icons={INCOME_ICONS} accentColor="#4ade80" bgColor="rgba(34,197,94,0.12)" />)
                }
              </motion.div>
            </motion.div>

            {/* Expense Categories */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>📤</div>
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>Expense Categories</h2>
                  <p style={{ fontSize: '0.72rem', color: '#475569' }}>{stats.expenseStats.length} categories tracked</p>
                </div>
              </div>
              <motion.div variants={stagger} initial="hidden" animate="visible">
                {stats.expenseStats.length === 0
                  ? <div style={{ textAlign: 'center', padding: '2rem', color: '#334155', fontSize: '0.85rem' }}>No expense data yet</div>
                  : stats.expenseStats.map(cat => <CategoryCard key={cat.name} cat={cat} icons={EXPENSE_ICONS} accentColor="#f87171" bgColor="rgba(239,68,68,0.12)" />)
                }
              </motion.div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
