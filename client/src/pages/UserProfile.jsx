import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const fmt = (n) => `Rs.${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [txFilter, setTxFilter] = useState('all');

  // Edit Settings State (User specific)
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', password: '', monthlyBudget: '' });
  const [saving, setSaving] = useState(false);
  const [updateMsg, setUpdateMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetch = async () => {
      try {
        const endpoint = isAdmin ? `/admin/users/${id}/profile` : `/auth/profile`;
        const res = await API.get(endpoint);
        setData(res.data);
        if (!isAdmin) {
          setFormData({ name: res.data.user.name, password: '', monthlyBudget: res.data.user.monthlyBudget || 0 });
        }
      } catch (e) {
        setError('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, isAdmin]);

  if (loading) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1a' }}>
      <Sidebar type={isAdmin ? "admin" : "user"} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1,2,3].map(i => <div key={i} style={{ height: '80px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s infinite' }} />)}
        </div>
      </main>
    </div>
  );

  if (error || !data) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1a' }}>
      <Sidebar type={isAdmin ? "admin" : "user"} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#f87171' }}><div style={{ fontSize: '3rem' }}>⚠️</div><p>{error || 'User not found'}</p></div>
      </main>
    </div>
  );

  const { user, stats, recentTransactions, monthly, categories } = data;
  const maxMonthly = Math.max(...monthly.map(m => Math.max(m.income, m.expense)), 1);
  const filtered = txFilter === 'all' ? recentTransactions : recentTransactions.filter(t => t.type === txFilter);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateMsg({ type: '', text: '' });
    setSaving(true);
    try {
      const payload = { name: formData.name, monthlyBudget: formData.monthlyBudget };
      if (formData.password) payload.password = formData.password;
      
      const res = await API.put('/auth/profile', payload);
      setUpdateMsg({ type: 'success', text: 'Profile updated successfully!' });
      setData({ ...data, user: res.data.user });
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err) {
      setUpdateMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("⚠️ DANGER ZONE ⚠️\n\nAre you absolutely sure you want to reset your account? This will PERMANENTLY delete ALL your transactions and return your balance to zero. This action CANNOT be undone.")) {
      try {
        await API.delete('/auth/profile/reset');
        window.location.reload(); // Refresh the page to clear the dashboard
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to reset account');
      }
    }
  };

  const statusColor = user.status === 'banned' ? '#f87171' : '#4ade80';
  const statusBg = user.status === 'banned' ? 'rgba(239,68,68,0.1)' : 'rgba(74,222,128,0.1)';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1a' }}>
      <Sidebar type={isAdmin ? "admin" : "user"} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '2.5rem', maxWidth: '1200px' }}>

        {/* Back Button + Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <button onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#94a3b8', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1.5rem', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}>
            ← Back
          </button>

          {/* User Hero Card */}
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '24px', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, color: 'white', boxShadow: '0 8px 24px rgba(99,102,241,0.35)', flexShrink: 0 }}>
                {(user.name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{user.name}</h1>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>{user.email}</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ padding: '0.28rem 0.75rem', borderRadius: '20px', background: statusBg, border: `1px solid ${statusColor}40`, color: statusColor, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    ● {user.status || 'active'}
                  </span>
                  <span style={{ padding: '0.28rem 0.75rem', borderRadius: '20px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 600 }}>
                    Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#475569', textAlign: 'right' }}>
              <div>User ID</div>
              <div style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '0.68rem', marginTop: '4px' }}>{user._id}</div>
              {!isAdmin && (
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={handleReset}
                    title="Permanently Delete All Your Transactions"
                    style={{ marginTop: '0.75rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#f87171', padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}>
                    Reset Data ⚠️
                  </button>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    style={{ marginTop: '0.75rem', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#818cf8', padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                    {isEditing ? 'Cancel Edit' : 'Edit Profile ⚙️'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Edit Profile Form Sub-card */}
          {(!isAdmin && isEditing) && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} 
              onSubmit={handleUpdateProfile}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0 0 24px 24px', padding: '1.5rem 2rem', marginTop: '-10px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 600 }}>Display Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 600 }}>Monthly Budget (Rs.)</label>
                  <input type="number" min="0" value={formData.monthlyBudget} onChange={e => setFormData({...formData, monthlyBudget: e.target.value})}
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 600 }}>New Password (Optional)</label>
                  <div style={{ fontSize: '0.65rem', color: '#475569', marginBottom: '8px', lineHeight: '1.4' }}>Must include 1 uppercase, 1 number, and 1 special char.</div>
                  <div style={{ position: 'relative' }}>
                    <input type={showPassword ? 'text' : 'password'} placeholder="e.g. Pass@123" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                      style={{ width: '100%', padding: '0.7rem', paddingRight: '2.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                {updateMsg.text && (
                  <span style={{ fontSize: '0.8rem', color: updateMsg.type === 'error' ? '#f87171' : '#4ade80' }}>{updateMsg.text}</span>
                )}
                <button type="submit" disabled={saving}
                  style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', padding: '0.6rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.form>
          )}
        </motion.div>

        {/* Stat Cards */}
        <motion.div initial="hidden" animate="visible" variants={stagger}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Income', value: fmt(stats.totalIncome), color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.18)', icon: '↑' },
            { label: 'Total Expenses', value: fmt(stats.totalExpense), color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.18)', icon: '↓' },
            { label: 'Net Balance', value: fmt(stats.net), color: stats.net >= 0 ? '#818cf8' : '#fb923c', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.18)', icon: '⚖' },
            { label: 'Transactions', value: stats.txCount, color: '#38bdf8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.18)', icon: '🔄' },
          ].map(({ label, value, color, bg, border, icon }) => (
            <motion.div key={label} variants={fadeUp} whileHover={{ y: -3 }}
              style={{ background: bg, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.25rem', cursor: 'default' }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{label}</span><span style={{ fontSize: '1rem' }}>{icon}</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color, fontFamily: 'monospace' }}>{value}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Monthly Chart + Category Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>

          {/* Monthly Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.75rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: '0.25rem' }}>Monthly Activity</h2>
            <p style={{ fontSize: '0.73rem', color: '#475569', marginBottom: '1.5rem' }}>Last 6 months income vs expenses</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '150px' }}>
              {monthly.map((m, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', display: 'flex', gap: '3px', alignItems: 'flex-end', height: '130px' }}>
                    <div title={`Income: ${fmt(m.income)}`}
                      style={{ flex: 1, background: 'linear-gradient(to top, #22c55e, #4ade80)', borderRadius: '4px 4px 0 0', height: `${(m.income / maxMonthly) * 100}%`, minHeight: m.income > 0 ? '4px' : '0', transition: 'all 0.5s', cursor: 'pointer' }} />
                    <div title={`Expense: ${fmt(m.expense)}`}
                      style={{ flex: 1, background: 'linear-gradient(to top, #ef4444, #f87171)', borderRadius: '4px 4px 0 0', height: `${(m.expense / maxMonthly) * 100}%`, minHeight: m.expense > 0 ? '4px' : '0', transition: 'all 0.5s', cursor: 'pointer' }} />
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#475569', fontWeight: 600 }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#64748b' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#4ade80' }} /> Income
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#64748b' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f87171' }} /> Expenses
              </div>
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: '0.25rem' }}>Top Categories</h2>
            <p style={{ fontSize: '0.73rem', color: '#475569', marginBottom: '1.25rem' }}>Spending distribution by category</p>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {categories.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#334155', fontSize: '0.8rem', padding: '2rem 0' }}>No category data</div>
              ) : (
                categories.sort((a, b) => (b.income + b.expense) - (a.income + a.expense)).slice(0, 7).map((cat, i) => {
                  const total = cat.income + cat.expense;
                  const maxCat = Math.max(...categories.map(c => c.income + c.expense), 1);
                  const pct = Math.round((total / maxCat) * 100);
                  const colors = ['#818cf8','#4ade80','#f87171','#fbbf24','#38bdf8','#fb923c','#a78bfa'];
                  return (
                    <div key={cat.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'white', fontWeight: 600 }}>{cat.name}</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{cat.count} tx · {fmt(total)}</span>
                      </div>
                      <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.4 + i * 0.05, duration: 0.6 }}
                          style={{ height: '100%', background: colors[i % colors.length], borderRadius: '3px' }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>

        {/* Transaction History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: '2px' }}>Transaction History</h2>
              <p style={{ fontSize: '0.73rem', color: '#475569' }}>Showing last {Math.min(20, recentTransactions.length)} transactions</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['all', 'income', 'expense'].map(f => (
                <button key={f} onClick={() => setTxFilter(f)}
                  style={{ padding: '0.4rem 0.875rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                    background: txFilter === f ? (f === 'income' ? 'rgba(74,222,128,0.15)' : f === 'expense' ? 'rgba(248,113,113,0.15)' : 'rgba(99,102,241,0.15)') : 'rgba(255,255,255,0.04)',
                    color: txFilter === f ? (f === 'income' ? '#4ade80' : f === 'expense' ? '#f87171' : '#818cf8') : '#64748b',
                  }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#334155' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
              <div>No transactions found</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* Table Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 110px', gap: '1rem', padding: '0.5rem 0.875rem', fontSize: '0.65rem', color: '#334155', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <span>Description / Category</span><span>Date</span><span>Type</span><span style={{ textAlign: 'right' }}>Amount</span>
              </div>
              {filtered.map((t, i) => (
                <motion.div key={t._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 110px', gap: '1rem', padding: '0.75rem 0.875rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', alignItems: 'center', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'white' }}>{t.category}</div>
                    {t.description && <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '2px' }}>{t.description}</div>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {t.date ? new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                  </div>
                  <div>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                      background: t.type === 'income' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                      color: t.type === 'income' ? '#4ade80' : '#f87171' }}>
                      {t.type}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.85rem', color: t.type === 'income' ? '#4ade80' : '#f87171' }}>
                    {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
