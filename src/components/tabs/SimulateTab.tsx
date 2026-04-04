'use client';
import { useRidoStore } from '@/store/ridoStore';
import PremiumChart from '../charts/PremiumChart';

export default function SimulateTab() {
  const triggers = useRidoStore((s) => s.triggers);
  const setTrigger = useRidoStore((s) => s.setTrigger);
  const resetTriggers = useRidoStore((s) => s.resetTriggers);
  const addNotification = useRidoStore((s) => s.addNotification);

  const handleReset = () => {
    resetTriggers();
    addNotification('↺ Conditions Reset', 'All simulated triggers cleared. System returned to baseline.', 'info');
  };

  const btns = [
    { key: 'rain' as const, label: '🌧 Force Heavy Rain', desc: 'Simulates 28–43mm/hr rainfall' },
    { key: 'traffic' as const, label: '🚦 Force High Traffic', desc: 'Max congestion multiplier' },
    { key: 'delay' as const, label: '🏪 Force Store Delay', desc: 'Critical latency on orders' },
    { key: 'orders' as const, label: '📉 Force Low Orders', desc: 'Demand drop to 4–8 ord/hr' },
  ];

  return (
    <div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16 }}>Simulation Console</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>Force real-world disruption scenarios</div>
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, padding: '4px 10px', borderRadius: 20, background: 'rgba(124,58,237,0.12)', color: 'var(--accent2)', border: '1px solid rgba(124,58,237,0.25)' }}>ML ENGINE ACTIVE</div>
        </div>

        <SectionHd>Disruption Triggers</SectionHd>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem', marginBottom: '.75rem' }}>
          {btns.map((b) => (
            <button key={b.key} onClick={() => setTrigger(b.key, !triggers[b.key])}
              style={{
                background: triggers[b.key] ? 'rgba(239,68,68,0.1)' : 'var(--surface2)',
                border: `1px solid ${triggers[b.key] ? 'rgba(239,68,68,0.4)' : 'var(--border2)'}`,
                borderRadius: 8, padding: '.75rem 1rem', color: triggers[b.key] ? 'var(--red)' : 'var(--text)',
                fontSize: 13, cursor: 'pointer', fontFamily: 'DM Mono, monospace', textAlign: 'left',
                transition: 'all .2s', fontWeight: 500,
              }}>
              <div>{b.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3, fontFamily: 'DM Sans, sans-serif' }}>{b.desc}</div>
              {triggers[b.key] && <div style={{ fontSize: 10, color: 'var(--red)', marginTop: 4 }}>● ACTIVE</div>}
            </button>
          ))}
        </div>

        <button onClick={handleReset}
          style={{ width: '100%', background: 'transparent', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '.6rem 1rem', color: 'var(--green)', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>
          ↺ Reset All Conditions
        </button>
      </div>

      {/* ML Engine info */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem' }}>
        <SectionHd>ML Engine — Disruption Model</SectionHd>
        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: '1rem', fontFamily: 'DM Mono, monospace', background: 'var(--surface2)', borderRadius: 8, padding: '.75rem', lineHeight: 1.8 }}>
          <div>P = baseRate + (risk × volatility) − (grit × discount)</div>
          <div style={{ color: 'var(--accent)', marginTop: '.5rem' }}>score = sigmoid(0.8·rain + 0.6·traffic + 0.7·latency + 0.75·demand − 1.2) × 3</div>
        </div>
        <SectionHd>Signal Weights</SectionHd>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
          {[
            { label: 'Rain signal', val: 0.8, color: 'var(--blue)' },
            { label: 'Traffic signal', val: 0.6, color: 'var(--orange)' },
            { label: 'Latency signal', val: 0.7, color: 'var(--accent)' },
            { label: 'Demand signal', val: 0.75, color: 'var(--accent2)' },
          ].map((w) => (
            <div key={w.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--text2)', width: 110, flexShrink: 0 }}>{w.label}</span>
              <div style={{ flex: 1, height: 6, background: 'var(--surface3)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 3, background: w.color, width: `${w.val * 100}%` }} />
              </div>
              <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', width: 32, textAlign: 'right' }}>{w.val}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
        <SectionHd>Premium Fluctuation · Live</SectionHd>
        <PremiumChart />
      </div>
    </div>
  );
}

function SectionHd({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'DM Mono, monospace', marginBottom: '.75rem', fontWeight: 500 }}>{children}</div>;
}
