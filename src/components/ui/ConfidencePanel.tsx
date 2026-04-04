'use client';
import { useRidoStore } from '@/store/ridoStore';

export default function ConfidencePanel() {
  const confidence = useRidoStore((s) => s.confidence);
  const finalConfidence = useRidoStore((s) => s.finalConfidence);

  const rows = [
    { key: 'weather' as const, label: 'Weather' },
    { key: 'traffic' as const, label: 'Traffic' },
    { key: 'latency' as const, label: 'Store Latency' },
    { key: 'demand' as const, label: 'Demand Drop' },
  ];

  const confColor = finalConfidence > 0.7 ? 'var(--red)' : finalConfidence > 0.4 ? 'var(--orange)' : 'var(--green)';

  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'DM Mono, monospace', marginBottom: '.75rem', fontWeight: 500 }}>Confidence Layer</div>

      {rows.map(({ key, label }) => {
        const val = confidence[key];
        return (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '.6rem' }}>
            <span style={{ fontSize: 12, color: 'var(--text2)', width: 100, flexShrink: 0 }}>{label}</span>
            <div style={{ flex: 1, height: 6, background: 'var(--surface3)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 3, background: 'var(--accent)', width: `${Math.round(val * 100)}%`, transition: 'width .5s ease' }} />
            </div>
            <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', width: 35, textAlign: 'right' }}>{val.toFixed(2)}</span>
          </div>
        );
      })}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '.5rem' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'DM Mono, monospace', marginBottom: '.2rem' }}>Final Confidence</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22, color: confColor, transition: 'color .4s' }}>{finalConfidence.toFixed(2)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'DM Mono, monospace', marginBottom: '.2rem' }}>Threshold</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: 'var(--text2)' }}>&gt; 0.70 → Payout</div>
        </div>
      </div>
    </div>
  );
}
