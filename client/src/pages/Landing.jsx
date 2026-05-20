import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

/* ── Animation Variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
};
const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
};
const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

/* ── Animated Counter ── */
function Counter({ from = 0, to, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * (to - from) + from));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to, from, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Data ── */
const features = [
  {
    icon: '📊',
    color: 'rgba(99,102,241,0.15)',
    glow: 'rgba(99,102,241,0.3)',
    title: 'Real-time Dashboard',
    desc: 'Get a live overview of your income, expenses, and net balance. Your financial health, visualised beautifully.',
  },
  {
    icon: '🗂️',
    color: 'rgba(245,158,11,0.15)',
    glow: 'rgba(245,158,11,0.3)',
    title: 'Smart Categories',
    desc: 'Auto-tag your transactions into categories like Food, Rent, and Entertainment. Understand where every rupee goes.',
  },
  {
    icon: '📈',
    color: 'rgba(16,185,129,0.15)',
    glow: 'rgba(16,185,129,0.3)',
    title: 'Advanced Analytics',
    desc: 'Powerful bar and pie charts break down your monthly cashflow. Spot spending trends before they become problems.',
  },
  {
    icon: '📄',
    color: 'rgba(139,92,246,0.15)',
    glow: 'rgba(139,92,246,0.3)',
    title: 'Export Reports',
    desc: 'Generate clean, professional transaction reports at any time — perfect for budget reviews or tax season.',
  },
  {
    icon: '🔒',
    color: 'rgba(34,197,94,0.15)',
    glow: 'rgba(34,197,94,0.3)',
    title: 'Bank-Grade Security',
    desc: 'Your data is encrypted at rest and in transit. We take your financial privacy extremely seriously.',
  },
  {
    icon: '🛡️',
    color: 'rgba(251,146,60,0.15)',
    glow: 'rgba(251,146,60,0.3)',
    title: 'Admin Control Panel',
    desc: 'Full admin portal for managing users and transactions, ensuring your platform runs perfectly at all times.',
  },
];

const steps = [
  { num: '01', title: 'Create Your Account', desc: 'Sign up in under a minute. No credit card required. Just your name and email.' },
  { num: '02', title: 'Add Your Transactions', desc: 'Log your income and expenses manually. Categorise them with our smart system.' },
  { num: '03', title: 'Visualise & Track', desc: 'Watch your financial dashboard come to life with charts, summaries, and trends.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Freelance Designer', text: 'SmartExpenseTracker completely changed the way I manage my monthly budget. The categories feature is a game-changer.', avatar: 'PS' },
  { name: 'Rohan Mehta', role: 'Software Engineer', text: "I've tried 5 different budgeting apps. SmartExpenseTracker is the only one that actually stuck — the dashboard is just so clean.", avatar: 'RM' },
  { name: 'Anjali Patel', role: 'College Student', text: 'As a student, tracking where my money goes was always a pain. Now I just log it in 30 seconds and the app does the rest.', avatar: 'AP' },
];

const stats = [
  { value: 5000, suffix: '+', label: 'Active Users' },
  { value: 12, suffix: 'L+', label: 'Transactions Tracked' },
  { value: 99, suffix: '%', label: 'Uptime Guaranteed' },
  { value: 4, suffix: '.9★', label: 'Average Rating' },
];

/* ── Component ── */
export default function Landing() {
  const { appName } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: '#0a0f1a', color: 'white', fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>
      <Helmet>
        <title>{appName} — Master Your Finances</title>
        <meta name="description" content={`Track expenses, visualise your cashflow, and take full control of your money with ${appName}'s beautiful real-time dashboard.`} />
      </Helmet>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 1.5rem',
        transition: 'all 0.3s',
        background: scrolled ? 'rgba(10,15,26,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>💰</div>
            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'white', letterSpacing: '-0.02em' }}>{appName}</span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
            <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Features</a>
            <a href="#how-it-works" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>How it works</a>
            <a href="#testimonials" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Reviews</a>
            <Link to="/admin-login" style={{ 
              color: '#f59e0b', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700, 
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', 
              padding: '6px 12px', borderRadius: '20px', transition: 'all 0.2s',
              textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px'
            }}
              onMouseEnter={e => { e.target.style.background = 'rgba(245,158,11,0.2)'; e.target.style.color = '#fbbf24'; e.target.style.transform = 'translateY(-1px)'; }} 
              onMouseLeave={e => { e.target.style.background = 'rgba(245,158,11,0.1)'; e.target.style.color = '#f59e0b'; e.target.style.transform = 'translateY(0)'; }}
            >
              <span style={{ fontSize: '0.8rem' }}>🛡️</span> Admin
            </Link>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, padding: '0.5rem 1rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Sign In</Link>
            <Link to="/signup" style={{
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem',
              padding: '0.6rem 1.4rem', borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 8px 25px rgba(99,102,241,0.5)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(99,102,241,0.4)'; }}
            >Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background glows */}
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="hero-grid">
          {/* Left: Text */}
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', marginBottom: '1.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 6px #6366f1', display: 'inline-block' }}></span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a5b4fc', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Premium Expense Tracker</span>
            </motion.div>

            <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem', color: 'white' }}>
              Take Full Control<br />
              <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Of Your Money.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.7, maxWidth: '480px', marginBottom: '2.5rem' }}>
              Stop guessing where your money goes. <strong style={{ color: '#e2e8f0' }}>{appName}</strong> gives you a real-time dashboard, smart categories, and powerful analytics — all in one beautiful app.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <Link to="/signup" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '1rem',
                padding: '0.9rem 2rem', borderRadius: '14px',
                boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
                transition: 'all 0.2s',
              }}>
                Start for Free <span>→</span>
              </Link>
              <a href="#features" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                color: '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '1rem',
                padding: '0.9rem 2rem', borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
                transition: 'all 0.2s',
              }}>
                See Features
              </a>
            </motion.div>

            <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex' }}>
                {['PS', 'RM', 'AP'].map((initials, i) => (
                  <div key={i} style={{ width: '36px', height: '36px', borderRadius: '50%', background: `hsl(${220 + i * 40}, 60%, 40%)`, border: '2px solid #0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'white', marginLeft: i > 0 ? '-10px' : 0 }}>{initials}</div>
                ))}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                <span style={{ color: '#e2e8f0', fontWeight: 600 }}>5,000+</span> people already tracking smarter
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Dashboard Preview */}
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.3, type: 'spring', stiffness: 60 }}>
            <div style={{ position: 'relative' }}>
              {/* Floating glow */}
              <div style={{ position: 'absolute', inset: '-20px', background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(40px)', borderRadius: '32px', pointerEvents: 'none' }} />

              {/* Main Card */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '2rem', backdropFilter: 'blur(20px)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', position: 'relative' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Total Balance</div>
                    <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '-0.02em', color: 'white' }}>₹ 1,45,230</div>
                  </div>
                  <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', padding: '6px 14px', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700 }}>+12.5% ↑</div>
                </div>

                {/* Progress Bar */}
                <div style={{ display: 'flex', gap: '4px', height: '8px', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                  <div style={{ width: '45%', background: '#6366f1', borderRadius: '8px 0 0 8px' }} />
                  <div style={{ width: '30%', background: '#10b981' }} />
                  <div style={{ width: '25%', background: '#f59e0b', borderRadius: '0 8px 8px 0' }} />
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                  {[['Investments', '#6366f1', '45%'], ['Savings', '#10b981', '30%'], ['Expenses', '#f59e0b', '25%']].map(([label, color, pct]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{label} {pct}</span>
                    </div>
                  ))}
                </div>

                {/* Recent Transactions */}
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Recent Transactions</div>
                {[
                  { icon: '🏠', name: 'Rent', cat: 'Housing', amount: '-₹25,000', color: '#f87171' },
                  { icon: '🛒', name: 'Big Bazaar', cat: 'Groceries', amount: '-₹4,500', color: '#fb923c' },
                  { icon: '💼', name: 'Freelance Pay', cat: 'Income', amount: '+₹55,000', color: '#4ade80' },
                ].map((tx) => (
                  <div key={tx.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', marginBottom: '0.5rem', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{tx.icon}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'white' }}>{tx.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{tx.cat}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: tx.color }}>{tx.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }} className="stats-grid">
          {stats.map(({ value, suffix, label }) => (
            <motion.div key={label} variants={fadeUp} style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'monospace', color: 'white', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                <Counter to={value} suffix={suffix} />
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── KEY FEATURES ── */}
      <section id="features" style={{ padding: '8rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <motion.div variants={fadeUp} style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6366f1', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', padding: '6px 16px', borderRadius: '999px', marginBottom: '1.25rem' }}>
              Key Features
            </motion.div>
            <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem', color: 'white' }}>
              Everything you need to master<br />your personal finances
            </motion.h2>
            <motion.p variants={fadeUp} style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              Built for students, freelancers, and professionals who want clear visibility into where their money is going.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="features-grid">
            {features.map(({ icon, color, glow, title, desc }) => (
              <motion.div key={title} variants={fadeUp}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem', cursor: 'default', transition: 'all 0.3s' }}
                whileHover={{ y: -6, borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', boxShadow: `0 20px 40px rgba(0,0,0,0.3)` }}
              >
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem', boxShadow: `0 4px 20px ${glow}` }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '8rem 1.5rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <motion.div variants={fadeUp} style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '6px 16px', borderRadius: '999px', marginBottom: '1.25rem' }}>
              How it works
            </motion.div>
            <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem', color: 'white' }}>
              Up and running in 3 simple steps
            </motion.h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', position: 'relative' }} className="steps-grid">
            {/* Connector Line */}
            <div style={{ position: 'absolute', top: '48px', left: '20%', right: '20%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.4), transparent)', zIndex: 0 }} className="hidden-mobile" />

            {steps.map(({ num, title, desc }, i) => (
              <motion.div key={num} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.15 }}
                style={{ textAlign: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.1rem', fontWeight: 800, color: 'white', boxShadow: '0 8px 24px rgba(99,102,241,0.4)', border: '3px solid rgba(255,255,255,0.1)' }}>{num}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem' }}>{title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.7 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ padding: '8rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <motion.div variants={fadeUp} style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '6px 16px', borderRadius: '999px', marginBottom: '1.25rem' }}>
              Loved by Users
            </motion.div>
            <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem', color: 'white' }}>
              What our users are saying
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="features-grid">
            {testimonials.map(({ name, role, text, avatar }) => (
              <motion.div key={name} variants={fadeUp}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem' }}
                whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.12)' }}>
                <div style={{ color: '#f59e0b', fontSize: '1.2rem', letterSpacing: '2px', marginBottom: '1rem' }}>★★★★★</div>
                <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>"{text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'white' }}>{avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'white' }}>{name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '8rem 1.5rem' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem', borderRadius: '32px', background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(124,58,237,0.08) 100%)', border: '1px solid rgba(99,102,241,0.2)', position: 'relative', overflow: 'hidden', boxShadow: '0 0 80px rgba(99,102,241,0.1)' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'white', marginBottom: '1rem' }}>
            Ready to take control of your finances?
          </motion.h2>
          <motion.p variants={fadeUp} style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Join 5,000+ users already tracking their expenses with {appName}. Free to start, no credit card required.
          </motion.p>
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '1rem',
              padding: '1rem 2.5rem', borderRadius: '14px',
              boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
              transition: 'all 0.2s',
            }}>
              Create Free Account →
            </Link>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '1rem', padding: '1rem 2rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', transition: 'all 0.2s' }}>
              Sign In
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '3rem 1.5rem', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>💰</div>
            <span style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>{appName}</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {['Privacy', 'Terms'].map(link => (
              <a key={link} href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#64748b'}>{link}</a>
            ))}
            <Link to="/admin-login" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>Admin Portal</Link>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#334155' }}>© 2026 {appName} Inc.</div>
        </div>
      </footer>

      {/* ── Responsive styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .hero-grid { grid-template-columns: 1fr 1fr; }
        .hidden-mobile { display: flex; }
        .stats-grid { grid-template-columns: repeat(4, 1fr); }
        .features-grid { grid-template-columns: repeat(3, 1fr); }
        .steps-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .hidden-mobile { display: none !important; }
        }
        @media (max-width: 600px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
