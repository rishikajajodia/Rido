'use client';
import { useState } from 'react';
import { useRidoStore, PLATFORMS, calcGrit } from '@/store/ridoStore';
import type { Zone, Experience, WorkerProfile } from '@/store/ridoStore';

export default function Onboarding() {
  const setProfile = useRidoStore((s) => s.setProfile);
  const addNotification = useRidoStore((s) => s.addNotification);

  const [form, setForm] = useState({
    name: 'Ravi Kumar',
    platform: 'Blinkit',
    zone: 'urban' as Zone,
    exp: 'intermediate' as Experience,
    hours: 9,
  });

  const gritPreview = calcGrit(form.exp, form.hours);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.platform) return;
    const profile: WorkerProfile = { ...form };
    setProfile(profile);
    addNotification(
      `Welcome to Rido, ${form.name.split(' ')[0]}!`,
      `Your income protection is now active. Grit Score: ${gritPreview}`,
      'success'
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 50% 0%,rgba(0,212,170,0.07) 0%,transparent 60%),radial-gradient(ellipse 40% 30% at 80% 80%,rgba(124,58,237,0.06) 0%,transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2rem' }}>
          <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: '#000' }}>R</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22 }}>
            Ri<span style={{ color: 'var(--accent)' }}>do</span>
          </span>
          <div style={{ marginLeft: 'auto', fontSize: 10, padding: '3px 8px', borderRadius: 20, background: 'rgba(0,212,170,0.12)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.25)', fontFamily: 'DM Mono, monospace' }}>AI-POWERED</div>
        </div>

        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: '.3rem' }}>Risk Profiling</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '1.5rem' }}>Build your income protection profile in 60 seconds</div>

        {/* Platform chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.2rem' }}>
          {PLATFORMS.map((p) => (
            <span key={p} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: form.platform === p ? 'rgba(0,212,170,0.12)' : 'var(--surface3)', color: form.platform === p ? 'var(--accent)' : 'var(--text2)', border: `1px solid ${form.platform === p ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`, cursor: 'pointer', transition: 'all .15s' }}
              onClick={() => setForm({ ...form, platform: p })}>{p}</span>
          ))}
        </div>

        {/* Fields */}
        <Field label="Full Name">
          <input
            type="text" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            style={inputStyle}
          />
        </Field>

        <Field label="Delivery Platform">
          <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} style={inputStyle}>
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label="Work Zone">
            <select value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value as Zone })} style={inputStyle}>
              <option value="urban">Urban</option>
              <option value="semi-urban">Semi-Urban</option>
              <option value="high-risk">High-Risk</option>
            </select>
          </Field>
          <Field label="Experience Level">
            <select value={form.exp} onChange={(e) => setForm({ ...form, exp: e.target.value as Experience })} style={inputStyle}>
              <option value="beginner">Beginner (&lt;1yr)</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert (3yr+)</option>
            </select>
          </Field>
        </div>

        <Field label={`Avg Working Hours / Day — ${form.hours}h`}>
          <input type="range" min={4} max={14} step={1} value={form.hours}
            onChange={(e) => setForm({ ...form, hours: parseInt(e.target.value) })}
            style={{ width: '100%', marginTop: 4 }}
          />
        </Field>

        {/* Grit preview */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '.75rem 1rem', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)', marginBottom: '1rem', fontSize: 13 }}>
          <span style={{ color: 'var(--text2)' }}>Projected Grit Score</span>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--accent)' }}>{gritPreview} / 100</span>
        </div>

        <button onClick={handleSubmit} style={{ width: '100%', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 8, padding: '.75rem', fontWeight: 700, fontSize: 14, fontFamily: 'Syne, sans-serif', cursor: 'pointer', letterSpacing: '.3px' }}>
          Generate My Protection Profile →
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: 11, color: 'var(--text2)', marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
  borderRadius: 8, padding: '.6rem .9rem', color: 'var(--text)', fontSize: 14,
  fontFamily: 'DM Sans, sans-serif', outline: 'none',
};
