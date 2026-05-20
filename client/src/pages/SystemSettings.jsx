import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Section = ({ title, icon, desc, children }) => (
  <motion.div variants={fadeUp}
    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.5rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
      <span style={{ fontSize: '1.2rem' }}>{icon}</span>
      <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>{title}</h2>
    </div>
    <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '1.5rem', paddingLeft: '2rem' }}>{desc}</p>
    {children}
  </motion.div>
);

const Field = ({ label, hint, children }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>{label}</label>
    {hint && <p style={{ fontSize: '0.68rem', color: '#334155', marginBottom: '0.4rem' }}>{hint}</p>}
    {children}
  </div>
);

const inputStyle = {
  width: '100%', padding: '0.7rem 1rem', borderRadius: '10px',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'white', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
};

const Toggle = ({ value, onChange, label, desc, color = '#6366f1' }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '12px', background: value ? `${color}10` : 'rgba(255,255,255,0.02)', border: `1px solid ${value ? color + '30' : 'rgba(255,255,255,0.06)'}`, marginBottom: '0.75rem', transition: 'all 0.3s' }}>
    <div>
      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'white' }}>{label}</div>
      <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '2px' }}>{desc}</div>
    </div>
    <button onClick={() => onChange(!value)}
      style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.3s', background: value ? color : 'rgba(255,255,255,0.1)', padding: 0 }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', transition: 'all 0.3s', left: value ? '23px' : '3px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
    </button>
  </div>
);

export default function SystemSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [newExpCat, setNewExpCat] = useState('');
  const [newIncCat, setNewIncCat] = useState('');

  useEffect(() => {
    API.get('/admin/settings')
      .then(res => setSettings(res.data))
      .catch(() => setError('Failed to load settings.'))
      .finally(() => setLoading(false));
  }, []);

  const set = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await API.put('/admin/settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addCategory = (type) => {
    const val = type === 'expense' ? newExpCat.trim() : newIncCat.trim();
    if (!val) return;
    const key = type === 'expense' ? 'defaultExpenseCategories' : 'defaultIncomeCategories';
    if (!settings[key].includes(val)) {
      set(key, [...settings[key], val]);
    }
    type === 'expense' ? setNewExpCat('') : setNewIncCat('');
  };

  const removeCategory = (type, name) => {
    const key = type === 'expense' ? 'defaultExpenseCategories' : 'defaultIncomeCategories';
    set(key, settings[key].filter(c => c !== name));
  };

  if (loading) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1a' }}>
      <Sidebar type="admin" />
      <main style={{ marginLeft: '260px', flex: 1, padding: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1,2,3].map(i => <div key={i} style={{ height: '120px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)' }} />)}
        </div>
      </main>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1a' }}>
      <Sidebar type="admin" />
      <main style={{ marginLeft: '260px', flex: 1, padding: '2.5rem', maxWidth: '900px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #f59e0b, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 8px 20px rgba(245,158,11,0.3)' }}>⚙️</div>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>System Settings</h1>
                <p style={{ color: '#475569', fontSize: '0.875rem', marginTop: '2px' }}>Configure platform-wide behaviour, categories, and preferences.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {saved && (
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ padding: '0.45rem 1rem', borderRadius: '10px', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ade80', fontSize: '0.8rem', fontWeight: 600 }}>
                  ✓ Saved!
                </motion.span>
              )}
              <button onClick={handleSave} disabled={saving}
                style={{ padding: '0.65rem 1.5rem', borderRadius: '12px', background: saving ? 'rgba(245,158,11,0.4)' : 'linear-gradient(135deg, #f59e0b, #ea580c)', border: 'none', color: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(245,158,11,0.35)', transition: 'all 0.2s' }}>
                {saving ? '⏳ Saving…' : '💾 Save Changes'}
              </button>
            </div>
          </div>
          {error && (
            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.8rem' }}>
              ⚠️ {error}
            </div>
          )}
        </motion.div>

        {settings && (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}>

            {/* General */}
            <Section title="General" icon="🏷️" desc="Basic platform identity and display settings.">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <Field label="App Name">
                  <input style={inputStyle} value={settings.appName} onChange={e => set('appName', e.target.value)}
                    onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </Field>
                <Field label="Currency Symbol">
                  <input style={inputStyle} value={settings.currency} onChange={e => set('currency', e.target.value)}
                    placeholder="e.g. Rs. or ₹"
                    onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </Field>
                <Field label="Contact / Support Email">
                  <input style={inputStyle} type="email" value={settings.contactEmail} onChange={e => set('contactEmail', e.target.value)}
                    onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </Field>
                <Field label="Max Budget Limit (Rs.)">
                  <input style={inputStyle} type="number" value={settings.maxBudget} onChange={e => set('maxBudget', Number(e.target.value))}
                    onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </Field>
              </div>
              <Field label="Welcome / Support Message" hint="Shown to users on the dashboard or login page.">
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} value={settings.supportMessage} onChange={e => set('supportMessage', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              </Field>
            </Section>

            {/* Platform Controls */}
            <Section title="Platform Controls" icon="🔧" desc="Toggle platform-wide features and access controls.">
              <Toggle value={settings.allowRegistrations} onChange={v => set('allowRegistrations', v)} color="#6366f1"
                label="Allow New Registrations"
                desc="When disabled, new users cannot create accounts." />
              <Toggle value={settings.maintenanceMode} onChange={v => set('maintenanceMode', v)} color="#f59e0b"
                label="Maintenance Mode"
                desc="When enabled, users see a maintenance message instead of the app." />
            </Section>

            {/* Categories */}
            <Section title="Default Categories" icon="🏷️" desc="Manage expense and income categories available to all users.">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {[
                  { type: 'expense', label: 'Expense Categories', color: '#f87171', key: 'defaultExpenseCategories', newVal: newExpCat, setNew: setNewExpCat },
                  { type: 'income', label: 'Income Categories', color: '#4ade80', key: 'defaultIncomeCategories', newVal: newIncCat, setNew: setNewIncCat },
                ].map(({ type, label, color, key, newVal, setNew }) => (
                  <div key={type}>
                    <div style={{ fontSize: '0.72rem', color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{label}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.875rem' }}>
                      {settings[key].map(cat => (
                        <span key={cat} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: '8px', background: `${color}12`, border: `1px solid ${color}30`, fontSize: '0.78rem', color: 'white', fontWeight: 500 }}>
                          {cat}
                          <button onClick={() => removeCategory(type, cat)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: '0.9rem', padding: '0', lineHeight: 1, display: 'flex', alignItems: 'center' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                            onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input style={{ ...inputStyle, flex: 1 }} placeholder={`Add ${type} category…`} value={newVal} onChange={e => setNew(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addCategory(type)}
                        onFocus={e => e.target.style.borderColor = `${color}60`}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                      <button onClick={() => addCategory(type)}
                        style={{ padding: '0.7rem 1rem', borderRadius: '10px', background: `${color}20`, border: `1px solid ${color}40`, color, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${color}30`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = `${color}20`; }}>
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Danger Zone */}
            <motion.div variants={fadeUp}
              style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '20px', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#f87171' }}>Danger Zone</h2>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '1.25rem', paddingLeft: '2rem' }}>
                These actions are irreversible. Proceed with extreme caution.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={async () => {
                    if (!window.confirm('This will permanently delete ALL transactions across all users. Are you absolutely sure?')) return;
                    try {
                      const res = await API.delete('/admin/purge-invalid');
                      alert(res.data.message);
                    } catch {
                      alert('Purge failed. Check server logs.');
                    }
                  }}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}>
                  🗑️ Purge Invalid Transactions
                </button>
              </div>
            </motion.div>

          </motion.div>
        )}
      </main>
    </div>
  );
}
