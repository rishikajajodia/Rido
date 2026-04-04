'use client';
import { useRidoStore } from '@/store/ridoStore';

export default function LiveTicker() {
  const riskScore = useRidoStore((s) => s.riskScore);
  const disruptionProbability = useRidoStore((s) => s.disruptionProbability);
  const signals = useRidoStore((s) => s.signals);
  const premium = useRidoStore((s) => s.premium);
  const finalConfidence = useRidoStore((s) => s.finalConfidence);

  let msg = '';
  const prob = disruptionProbability;
  if (prob > 0.7) {
    msg = `HIGH ALERT — Disruption probability ${Math.round(prob * 100)}% · Confidence ${finalConfidence.toFixed(2)} · Payout engine armed`;
  } else if (prob > 0.4) {
    msg = `CAUTION — Elevated risk ${Math.round(prob * 100)}% · Rain ${signals.rain}mm/hr · Traffic: ${signals.traffic}`;
  } else {
    msg = `System nominal — All signals green · Risk ${riskScore}% · Premium ₹${premium}/wk`;
  }

  return (
    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--text2)', background: 'var(--surface2)', borderRadius: 8, padding: '.4rem .75rem', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, animation: 'pulse-dot 1.5s infinite' }} />
      <span>{msg}</span>
    </div>
  );
}
