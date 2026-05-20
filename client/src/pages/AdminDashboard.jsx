import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalTransactions: 0, totalVolume: 0, userGroups: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const filteredGroups = stats.userGroups.filter(u =>
    !searchTerm || `${u.name} ${u.email} ${u.userId}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TxRow = ({ t, isIncome }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.875rem', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', marginBottom: '0.4rem', transition: 'background 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'white' }}>{t.category || 'Transaction'}</div>
        <div style={{ fontSize: '0.68rem', color: '#475569' }}>{t.date ? new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}</div>
      </div>
      <div style={{ fontWeight: 700, fontSize: '0.8rem', fontFamily: 'monospace', color: isIncome ? '#4ade80' : '#f87171' }}>{fmt(t.amount)}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1a' }}>
      <Sidebar type="admin" />
      <main style={{ marginLeft: '260px', flex: 1, padding: '2.5rem' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #f59e0b, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 8px 20px rgba(245,158,11,0.35)' }}>🛡️</div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>System Overview</h1>
              <p style={{ color: '#475569', fontSize: '0.875rem', marginTop: '2px' }}>Monitor all registered users, platform transaction volumes, and system-wide financial activity in real time.</p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1,2,3].map(i => <div key={i} style={{ height: '80px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)' }} />)}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <motion.div initial="hidden" animate="visible" variants={stagger}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Registered Users', value: stats.totalUsers.toLocaleString(), color: '#818cf8', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.18)', icon: '👥' },
                { label: 'Total System Volume', value: fmt(stats.totalVolume), color: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)', icon: '💹' },
                { label: 'Total Transactions', value: stats.totalTransactions.toLocaleString(), color: '#38bdf8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.18)', icon: '🔄' },
              ].map(({ label, value, color, bg, border, icon }) => (
                <motion.div key={label} variants={fadeUp} whileHover={{ y: -4 }}
                  style={{ background: bg, border: `1px solid ${border}`, borderRadius: '18px', padding: '1.5rem', cursor: 'default', transition: 'all 0.3s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
                    <span style={{ fontSize: '1.3rem' }}>{icon}</span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color, fontFamily: 'monospace', letterSpacing: '-0.02em' }}>{value}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* User Activity Panel */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'white', marginBottom: '4px' }}>User-wise Activity</h2>
                  <p style={{ fontSize: '0.75rem', color: '#475569' }}>Browse and search per-user income and expense history across the entire platform.</p>
                </div>
                <input type="text" placeholder="🔍  Search user..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ padding: '0.65rem 1.1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.875rem', outline: 'none', minWidth: '220px' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredGroups.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
                    <div style={{ fontWeight: 600, color: '#64748b' }}>No users found</div>
                  </div>
                ) : (
                  filteredGroups.map((u, idx) => (
                    <motion.div key={u.userId} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.5rem' }}>
                      {/* User Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', color: 'white', flexShrink: 0 }}>
                            {(u.name || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>{u.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#475569' }}>{u.email || `ID: ${u.userId}`}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <div style={{ padding: '0.4rem 0.875rem', borderRadius: '8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)', fontSize: '0.8rem', color: '#4ade80', fontWeight: 600 }}>
                            ↑ {fmt(u.totalInc)}
                          </div>
                          <div style={{ padding: '0.4rem 0.875rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', fontSize: '0.8rem', color: '#f87171', fontWeight: 600 }}>
                            ↓ {fmt(u.totalExp)}
                          </div>
                          <div style={{ padding: '0.4rem 0.875rem', borderRadius: '8px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, fontFamily: 'monospace' }}>
                            Net {fmt(u.net)}
                          </div>
                        </div>
                      </div>

                      {/* Transactions Grid */}
                      {!u.hasActivity ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}>
                          <span style={{ fontSize: '1.1rem' }}>🆕</span>
                          <span style={{ fontSize: '0.8rem', color: '#475569', fontStyle: 'italic' }}>No activity yet — this user hasn't recorded any transactions.</span>
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>Recent Income</div>
                            {u.incomeTx.length ? u.incomeTx.map(t => <TxRow key={t._id} t={t} isIncome={true} />) : <div style={{ fontSize: '0.8rem', color: '#334155' }}>No income entries</div>}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#f87171', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>Recent Expenses</div>
                            {u.expenseTx.length ? u.expenseTx.map(t => <TxRow key={t._id} t={t} isIncome={false} />) : <div style={{ fontSize: '0.8rem', color: '#334155' }}>No expense entries</div>}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
