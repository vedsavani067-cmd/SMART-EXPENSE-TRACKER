import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const categoryIcons = {
  food: '🍔', groceries: '🛒', rent: '🏠', salary: '💼',
  transport: '🚗', bills: '⚡', entertainment: '🎬',
  shopping: '🛍️', health: '💊', education: '📚',
  investment: '📈', freelance: '💻', other: '💳',
};

const getCategoryIcon = (cat) => {
  if (!cat) return '💳';
  const key = cat.toLowerCase();
  return Object.keys(categoryIcons).find(k => key.includes(k))
    ? categoryIcons[Object.keys(categoryIcons).find(k => key.includes(k))]
    : '💳';
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ transactions: [], income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get('/transactions');
        const txs = res.data;
        let income = 0, expense = 0;
        txs.forEach(t => {
          if (t.type === 'income') income += t.amount;
          else expense += t.amount;
        });
        setData({ transactions: txs, income, expense, balance: income - expense });
      } catch (err) {
        console.error('Failed to fetch transactions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const fmt = (n) => `₹${Math.abs(n).toLocaleString('en-IN')}`;
  const savingsRate = data.income > 0 ? Math.round(((data.income - data.expense) / data.income) * 100) : 0;
  const spentPct = data.income > 0 ? Math.min(100, Math.round((data.expense / data.income) * 100)) : 0;
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1a' }}>
      <Sidebar />

      <main style={{ marginLeft: '260px', flex: 1, padding: '2.5rem', minHeight: '100vh' }}>

        {/* ── Top Bar ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '4px' }}>
              {greeting()}, {user?.name?.split(' ')[0] || 'User'} 👋
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#475569' }}>{today}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/add-income" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '0.6rem 1.25rem', borderRadius: '10px',
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
              color: '#4ade80', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,197,94,0.1)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Income
            </Link>
            <Link to="/add-expense" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '0.6rem 1.25rem', borderRadius: '10px',
              background: 'linear-gradient(135deg, #ef4444, #db2777)',
              color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem',
              boxShadow: '0 4px 12px rgba(239,68,68,0.3)', transition: 'all 0.2s',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Expense
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: '80px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <>
            {/* ── Stat Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
              {/* Balance */}
              <div style={{ gridColumn: 'span 1', background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 100%)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '18px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', filter: 'blur(20px)' }} />
                <div style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Net Balance</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', fontFamily: 'monospace', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{fmt(data.balance)}</div>
                <div style={{ fontSize: '0.75rem', color: data.balance >= 0 ? '#4ade80' : '#f87171', fontWeight: 600 }}>
                  {data.balance >= 0 ? '↑ Positive' : '↓ Negative'}
                </div>
              </div>

              {/* Income */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Income</div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ade80', fontFamily: 'monospace' }}>{fmt(data.income)}</div>
              </div>

              {/* Expenses */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Expenses</div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171', fontFamily: 'monospace' }}>{fmt(data.expense)}</div>
              </div>

              {/* Savings Rate */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Savings Rate</div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg>
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace' }}>{savingsRate}%</div>
              </div>
            </div>

            {/* ── Budget Progress + Recent Transactions ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.25rem', marginBottom: '1.25rem' }}>

              {/* Spending Progress */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '1.75rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: '0.25rem' }}>Budget Overview</h3>
                <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '2rem' }}>This month's spending vs income</p>

                {/* Donut-style visual using CSS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Spent</span>
                      <span style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 700 }}>{spentPct}%</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${spentPct}%`, background: 'linear-gradient(to right, #ef4444, #f87171)', borderRadius: '999px', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Saved</span>
                      <span style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 700 }}>{Math.max(0, 100 - spentPct)}%</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.max(0, 100 - spentPct)}%`, background: 'linear-gradient(to right, #10b981, #4ade80)', borderRadius: '999px', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <Link to="/add-income" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem', borderRadius: '12px',
                    background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)',
                    textDecoration: 'none', transition: 'all 0.2s',
                  }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>➕</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4ade80' }}>Income</div>
                    <div style={{ fontSize: '0.65rem', color: '#475569' }}>Add funds</div>
                  </Link>
                  <Link to="/add-expense" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem', borderRadius: '12px',
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                    textDecoration: 'none', transition: 'all 0.2s',
                  }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>➖</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f87171' }}>Expense</div>
                    <div style={{ fontSize: '0.65rem', color: '#475569' }}>Track spending</div>
                  </Link>
                </div>
              </div>

              {/* Recent Transactions */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: '2px' }}>Recent Transactions</h3>
                    <p style={{ fontSize: '0.75rem', color: '#475569' }}>{data.transactions.length} total transaction{data.transactions.length !== 1 ? 's' : ''}</p>
                  </div>
                  <Link to="/history" style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.8rem', color: '#818cf8', textDecoration: 'none', fontWeight: 600,
                    padding: '0.35rem 0.875rem', borderRadius: '8px',
                    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                    transition: 'all 0.2s',
                  }}>
                    View All
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {data.transactions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#475569' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                      <div style={{ fontWeight: 600, color: '#64748b' }}>No transactions yet</div>
                      <div style={{ fontSize: '0.8rem', color: '#334155' }}>Add your first income or expense</div>
                    </div>
                  ) : (
                    data.transactions.slice(0, 5).map(t => {
                      const isIncome = t.type === 'income';
                      return (
                        <div key={t._id} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0.875rem 1rem', borderRadius: '12px',
                          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)',
                          transition: 'background 0.2s', cursor: 'default',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            <div style={{
                              width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                              background: isIncome ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
                            }}>
                              {getCategoryIcon(t.category)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'white' }}>{t.category || 'Transaction'}</div>
                              <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                                {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                {t.description && <span style={{ color: '#334155' }}> · {t.description}</span>}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isIncome ? '#4ade80' : '#f87171', fontFamily: 'monospace' }}>
                              {isIncome ? '+' : '-'}{fmt(t.amount)}
                            </div>
                            <div style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '999px', fontWeight: 600,
                              background: isIncome ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                              color: isIncome ? '#4ade80' : '#f87171',
                            }}>
                              {isIncome ? 'Income' : 'Expense'}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* ── Quick Links Bar ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <Link to="/history" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>🧾</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>Full History</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>All transactions</div>
                </div>
              </Link>
              <Link to="/reports" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>📊</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>Analytics</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>Charts & insights</div>
                </div>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>💡</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>Saving Tip</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                    {savingsRate >= 50 ? '🏆 Excellent! 50%+ saved.' : savingsRate >= 20 ? '✅ Good pace, keep it up!' : '⚠️ Try saving at least 20%'}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
