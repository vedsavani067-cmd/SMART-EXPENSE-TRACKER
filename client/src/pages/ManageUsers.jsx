import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try { const res = await API.get('/admin/users'); setUsers(res.data); }
    catch (err) { console.error('Failed to fetch users', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleBan = async (userId) => {
    try { await API.patch(`/admin/users/${userId}/toggle-ban`); fetchUsers(); }
    catch (err) { console.error('Failed to toggle ban', err); }
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
  const filtered = users.filter(u => !search || `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase()));
  const activeCount = users.filter(u => u.status === 'active').length;
  const bannedCount = users.filter(u => u.status !== 'active').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1a' }}>
      <Sidebar type="admin" />
      <main style={{ marginLeft: '260px', flex: 1, padding: '2.5rem' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 8px 20px rgba(99,102,241,0.35)' }}>👥</div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Manage Users</h1>
              <p style={{ color: '#475569', fontSize: '0.875rem', marginTop: '2px' }}>View all registered users, monitor their account balance, and manage access by banning or restoring accounts.</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
          {[
            { label: 'Total Users', value: users.length, color: '#818cf8', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.15)' },
            { label: 'Active Accounts', value: activeCount, color: '#4ade80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.15)' },
            { label: 'Banned Accounts', value: bannedCount, color: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)' },
          ].map(({ label, value, color, bg, border }) => (
            <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '14px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color, fontFamily: 'monospace' }}>{value}</div>
            </div>
          ))}
        </motion.div>

        {/* Table Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>All Users</div>
            <input type="text" placeholder="🔍  Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.85rem', outline: 'none', minWidth: '240px' }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          </div>

          {loading ? (
            <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1,2,3].map(i => <div key={i} style={{ height: '56px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)' }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#475569' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
              <div style={{ fontWeight: 600, color: '#64748b' }}>{users.length === 0 ? 'No users registered yet.' : 'No results found.'}</div>
            </div>
          ) : (
            /* Column Header */
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.8fr 1.2fr', padding: '0.75rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['User', 'Joined', 'Balance', 'Status', 'Actions'].map(h => (
                  <div key={h} style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</div>
                ))}
              </div>

              {filtered.map((u, idx) => {
                const isActive = u.status === 'active';
                const initials = (u.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                return (
                  <motion.div key={u._id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                    style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.8fr 1.2fr', padding: '1rem 1.75rem', borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {/* User */}
                    <div 
                      onClick={() => navigate(`/admin/users/${u._id}/profile`)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', cursor: 'pointer', opacity: 0.9, transition: 'opacity 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '0.9'}
                    >
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: isActive ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(100,116,139,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>{u.name || 'User'}</div>
                        <div style={{ fontSize: '0.72rem', color: '#475569' }}>{u.email}</div>
                      </div>
                    </div>
                    {/* Joined */}
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    {/* Balance */}
                    <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem', color: '#a5b4fc' }}>{fmt(u.balance)}</div>
                    {/* Status Badge */}
                    <div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
                        background: isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        border: `1px solid ${isActive ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                        color: isActive ? '#4ade80' : '#f87171' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                        {isActive ? 'Active' : 'Banned'}
                      </span>
                    </div>
                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <motion.button onClick={() => navigate(`/admin/users/${u._id}/profile`)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.25)', cursor: 'pointer', fontWeight: 600, fontSize: '0.72rem', transition: 'all 0.2s', background: 'rgba(56,189,248,0.08)', color: '#38bdf8' }}>
                        👁 Profile
                      </motion.button>
                      <motion.button onClick={() => toggleBan(u._id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontWeight: 700, fontSize: '0.72rem', transition: 'all 0.2s',
                          background: isActive ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                          borderColor: isActive ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)',
                          color: isActive ? '#f87171' : '#4ade80' }}>
                        {isActive ? 'Ban' : 'Unban'}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
