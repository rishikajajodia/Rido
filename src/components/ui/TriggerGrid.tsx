'use client';
import { useRidoStore } from '@/store/ridoStore';

export default function TriggerGrid() {
  const signals = useRidoStore((s) => s.signals);
  const triggers = useRidoStore((s) => s.triggers);

  const trafficPct = signals.traffic === 'High' ? 90 : signals.traffic === 'Medium' ? 55 : 15;
  const trafficColor = signals.traffic === 'High' ? 'var(--red)' : signals.traffic === 'Medium' ? 'var(--orange)' : 'var(--green)';
  const latencyPct = signals.latency === 'Critical' ? 95 : signals.latency === 'Slow' ? 55 : 15;
  const latencyColor = signals.latency === 'Critical' ? 'var(--red)' : signals.latency === 'Slow' ? 'var(--orange)' : 'var(--green)';
  const rainPct = Math.min(Math.round((signals.rain / 50) * 100), 100);
  const demandPct = Math.min(Math.round((signals.demand / 18) * 100), 100);

  const cards = [
    { id: 'rain', name: 'Rain', value: `${signals.rain.toFixed(1)} mm/hr`, pct: rainPct, color: 'var(--blue)', active: triggers.rain },
    { id: 'traffic', name: 'Traffic', value: signals.traffic, pct: trafficPct, color: trafficColor, active: triggers.traffic },
    { id: 'latency', name: 'Store Latency', value: signals.latency, pct: latencyPct, color: latencyColor, active: triggers.delay },
    { id: 'demand', name: 'Demand', value: `${signals.demand} ord/hr`, pct: demandPct, color: 'var(--green)', active: triggers.orders },
  ];

  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'DM Mono, monospace', marginBottom: '.75rem', fontWeight: 500 }}>Active Triggers</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
        {cards.map((c) => (
          <div key={c.id} style={{
            background: c.active ? 'rgba(239,68,68,0.05)' : 'var(--surface2)',
            border: `1px solid ${c.active ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`,
            borderRadius: 8, padding: '.9rem',
            transition: 'all .3s',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'DM Mono, monospace' }}>{c.name}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginTop: 4, color: c.active ? 'var(--red)' : 'var(--text)', transition: 'color .3s' }}>{c.value}</div>
            <div style={{ height: 4, background: 'var(--surface3)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 2, background: c.color, width: `${c.pct}%`, transition: 'width .6s ease' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
