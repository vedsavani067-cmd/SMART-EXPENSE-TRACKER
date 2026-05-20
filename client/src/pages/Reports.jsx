import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);
ChartJS.defaults.color = '#64748b';
ChartJS.defaults.font.family = 'Inter, system-ui, sans-serif';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function Reports() {
  const [data, setData] = useState({ income: 0, expense: 0, savings: 0, rate: 0 });
  const [catData, setCatData] = useState({ labels: [], values: [] });
  const [monthlyData, setMonthlyData] = useState({ labels: [], income: [], expense: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get('/transactions');
        const txs = res.data;
        let totalInc = 0, totalExp = 0;
        const catMap = {}, monthMap = {};
        txs.forEach(t => {
          const amt = t.amount;
          const monthKey = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
          if (!monthMap[monthKey]) monthMap[monthKey] = { income: 0, expense: 0 };
          if (t.type === 'income') { totalInc += amt; monthMap[monthKey].income += amt; }
          else { totalExp += amt; monthMap[monthKey].expense += amt; catMap[t.category || 'Other'] = (catMap[t.category || 'Other'] || 0) + amt; }
        });
        const savings = totalInc - totalExp;
        const rate = totalInc > 0 ? ((savings / totalInc) * 100).toFixed(1) : '0.0';
        setData({ income: totalInc, expense: totalExp, savings, rate });
        setCatData({ labels: Object.keys(catMap), values: Object.values(catMap) });
        const months = Object.keys(monthMap).reverse();
        setMonthlyData({ labels: months, income: months.map(m => monthMap[m].income), expense: months.map(m => monthMap[m].expense) });
      } catch (err) { console.error('Failed to fetch reports', err); }
      finally { setLoading(false); }
    };
    fetchReports();
  }, []);

  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

  const doughnutConfig = {
    labels: catData.labels.length ? catData.labels : ['No Data'],
    datasets: [{ data: catData.values.length ? catData.values : [1], backgroundColor: ['#6366f1','#f59e0b','#ef4444','#10b981','#8b5cf6','#ec4899','#3b82f6'], borderColor: 'transparent', hoverOffset: 12 }]
  };

  const barConfig = {
    labels: monthlyData.labels.length ? monthlyData.labels : ['No Data'],
    datasets: [
      { label: 'Income', data: monthlyData.income.length ? monthlyData.income : [0], backgroundColor: 'rgba(16,185,129,0.8)', borderRadius: 8, borderSkipped: false },
      { label: 'Expense', data: monthlyData.expense.length ? monthlyData.expense : [0], backgroundColor: 'rgba(239,68,68,0.8)', borderRadius: 8, borderSkipped: false },
    ]
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, pointStyle: 'circle' } } }
  };

  const stats = [
    { label: 'Total Income', value: fmt(data.income), color: '#4ade80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.18)', icon: '📈' },
    { label: 'Total Expenses', value: fmt(data.expense), color: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.18)', icon: '📉' },
    { label: 'Net Savings', value: fmt(data.savings), color: '#818cf8', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.18)', icon: '💰' },
    { label: 'Savings Rate', value: `${data.rate}%`, color: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)', icon: '🎯' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1a' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', flex: 1, padding: '2.5rem' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Financial Reports</h1>
          <p style={{ color: '#475569', fontSize: '0.875rem', marginTop: '4px' }}>Visualize your income and spending patterns</p>
        </motion.div>

        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: i === 1 ? '80px' : '300px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </motion.div>
        ) : (
          <>
            {/* Stat Cards */}
            <motion.div initial="hidden" animate="visible" variants={stagger}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
              {stats.map(({ label, value, color, bg, border, icon }) => (
                <motion.div key={label} variants={fadeUp} transition={{ duration: 0.5 }}
                  whileHover={{ y: -4, boxShadow: `0 12px 30px rgba(0,0,0,0.3)` }}
                  style={{ background: bg, border: `1px solid ${border}`, borderRadius: '18px', padding: '1.5rem', cursor: 'default', transition: 'all 0.3s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
                    <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color, fontFamily: 'monospace', letterSpacing: '-0.01em' }}>{value}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Charts */}
            <motion.div initial="hidden" animate="visible" variants={stagger}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.25rem' }}>

              {/* Doughnut */}
              <motion.div variants={fadeUp} transition={{ duration: 0.6 }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: '4px' }}>Expense Breakdown</h3>
                  <p style={{ fontSize: '0.75rem', color: '#475569' }}>By category</p>
                </div>
                <div style={{ height: '280px' }}>
                  <Doughnut data={doughnutConfig} options={{ ...chartOpts, cutout: '72%' }} />
                </div>
              </motion.div>

              {/* Bar Chart */}
              <motion.div variants={fadeUp} transition={{ duration: 0.6 }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: '4px' }}>Monthly Trend</h3>
                  <p style={{ fontSize: '0.75rem', color: '#475569' }}>Income vs Expenses per month</p>
                </div>
                <div style={{ height: '280px' }}>
                  <Bar data={barConfig} options={{
                    ...chartOpts,
                    scales: {
                      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false }, ticks: { color: '#475569' } },
                      x: { grid: { display: false }, border: { display: false }, ticks: { color: '#475569' } }
                    }
                  }} />
                </div>
              </motion.div>
            </motion.div>

            {/* Summary Row */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
              style={{ marginTop: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '1.5rem' }}>💡</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white', marginBottom: '2px' }}>Financial Insight</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {Number(data.rate) >= 50 ? '🏆 Excellent! You are saving more than 50% of your income. Keep it up!'
                    : Number(data.rate) >= 20 ? '✅ Good work! You\'re saving a healthy portion. Aim for 30%+ for financial freedom.'
                    : Number(data.rate) > 0 ? '⚠️ Your savings rate is below 20%. Try reducing non-essential expenses.'
                    : '📊 Start adding transactions to get personalized financial insights.'}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
