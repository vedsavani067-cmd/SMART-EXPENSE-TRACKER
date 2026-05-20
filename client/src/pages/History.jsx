import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const rowAnim = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };

const categoryIcons = { food:'🍔', groceries:'🛒', rent:'🏠', salary:'💼', transport:'🚗', bills:'⚡', entertainment:'🎬', shopping:'🛍️', health:'💊', education:'📚', investment:'📈', freelance:'💻', business:'🏪', other:'💳' };
const getIcon = (cat) => { if (!cat) return '💳'; const k = cat.toLowerCase(); return categoryIcons[Object.keys(categoryIcons).find(key => k.includes(key))] ?? '💳'; };

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);

  const fetchTransactions = async () => {
    try { const res = await API.get('/transactions'); setTransactions(res.data); }
    catch (err) { console.error('Failed to fetch history', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleDelete = async (id) => {
    try { await API.delete(`/transactions/${id}`); setDeleteId(null); fetchTransactions(); }
    catch (err) { console.error('Failed to delete', err); }
  };

  const handleExport = () => {
    if (!transactions.length) return;
    const rows = [['Date', 'Type', 'Category', 'Amount', 'Description'], ...transactions.map(t => [new Date(t.date).toLocaleDateString(), t.type, t.category, t.amount, t.description || ''])];
    const csv = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = encodeURI(csv); a.download = 'transactions.csv'; a.click();
  };

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1a' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', flex: 1, padding: '2.5rem' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Transaction History</h1>
            <p style={{ color: '#475569', fontSize: '0.875rem', marginTop: '4px' }}>View and manage all your records</p>
          </div>
          <motion.button onClick={handleExport} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.7rem 1.4rem', borderRadius: '12px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </motion.button>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2, 3, 4].map(i => <div key={i} style={{ height: '64px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)' }} />)}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <motion.div initial="hidden" animate="visible" variants={stagger}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Transactions', value: transactions.length, color: 'white', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.15)' },
                { label: 'Total Income', value: fmt(totalIncome), color: '#4ade80', bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.15)' },
                { label: 'Total Expenses', value: fmt(totalExpense), color: '#f87171', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.15)' },
              ].map(({ label, value, color, bg, border }) => (
                <motion.div key={label} variants={fadeUp}
                  style={{ background: bg, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color, fontFamily: 'monospace', marginBottom: '4px' }}>{value}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Filter Tabs */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {['all', 'income', 'expense'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: '0.5rem 1.25rem', borderRadius: '999px', border: '1px solid', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
                    borderColor: filter === f ? (f === 'income' ? 'rgba(34,197,94,0.4)' : f === 'expense' ? 'rgba(239,68,68,0.4)' : 'rgba(99,102,241,0.4)') : 'rgba(255,255,255,0.08)',
                    background: filter === f ? (f === 'income' ? 'rgba(34,197,94,0.12)' : f === 'expense' ? 'rgba(239,68,68,0.12)' : 'rgba(99,102,241,0.12)') : 'rgba(255,255,255,0.03)',
                    color: filter === f ? (f === 'income' ? '#4ade80' : f === 'expense' ? '#f87171' : '#818cf8') : '#64748b' }}>
                  {f === 'all' ? `All (${transactions.length})` : f === 'income' ? `Income (${transactions.filter(t=>t.type==='income').length})` : `Expenses (${transactions.filter(t=>t.type==='expense').length})`}
                </button>
              ))}
            </motion.div>

            {/* Transaction List */}
            <motion.div initial="hidden" animate="visible" variants={stagger}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '4rem', textAlign: 'center', color: '#475569' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                  <div style={{ fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>No records found</div>
                  <Link to="/add-expense" style={{ color: '#818cf8', fontSize: '0.875rem', textDecoration: 'none' }}>Add your first transaction →</Link>
                </div>
              ) : (
                filtered.map((t, idx) => {
                  const isIncome = t.type === 'income';
                  return (
                    <motion.div key={t._id} variants={rowAnim} transition={{ duration: 0.3 }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.2s', cursor: 'default' }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: isIncome ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                          {getIcon(t.category)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>{t.category || 'Transaction'}</div>
                          <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                            {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {t.description && <span> · {t.description}</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isIncome ? '#4ade80' : '#f87171', fontFamily: 'monospace' }}>
                            {isIncome ? '+' : '-'}{fmt(t.amount)}
                          </div>
                          <div style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '999px', fontWeight: 600, marginTop: '3px', display: 'inline-block',
                            background: isIncome ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                            color: isIncome ? '#4ade80' : '#f87171' }}>
                            {isIncome ? 'Income' : 'Expense'}
                          </div>
                        </div>
                        <motion.button onClick={() => setDeleteId(t._id)} whileHover={{ scale: 1.1, color: '#f87171' }} whileTap={{ scale: 0.9 }}
                          style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', transition: 'all 0.2s' }}>
                          ✕
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(8px)' }}
              onClick={() => setDeleteId(null)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                style={{ background: '#141b2d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2.5rem', maxWidth: '400px', width: '90%', textAlign: 'center' }}
                onClick={e => e.stopPropagation()}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Delete Transaction?</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>This action cannot be undone.</p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <motion.button onClick={() => handleDelete(deleteId)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    style={{ padding: '0.75rem 2rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                    Yes, Delete
                  </motion.button>
                  <motion.button onClick={() => setDeleteId(null)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    style={{ padding: '0.75rem 2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
