'use client';
import { useRidoStore } from '@/store/ridoStore';

export default function WorkerCard() {
  const profile = useRidoStore((s) => s.profile);
  const expectedIncome = useRidoStore((s) => s.expectedIncome);
  const actualIncome = useRidoStore((s) => s.actualIncome);
  const disruptionProbability = useRidoStore((s) => s.disruptionProbability);

  if (!profile) return null;

  const initials = profile.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  const incomeLoss = Math.max(0, expectedIncome - actualIncome);
  const prob = disruptionProbability;
  const probPct = Math.round(prob * 100);
  const arcColor = prob > 0.7 ? '#ef4444' : prob > 0.4 ? '#f97316' : '#22c55e';

  // Arc calculation — total arc length ~204 for 180° path
  const totalLen = 204;
  const fillLen = Math.round(prob * totalLen);

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{profile.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>{profile.platform} · {profile.zone}</div>
          </div>
        </div>
        <div style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: 'rgba(34,197,94,0.12)', color: 'var(--green)', border: '1px solid rgba(34,197,94,0.2)', fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>
          ● ACTIVE
        </div>
      </div>

      {/* Probability display */}
      <div style={{ textAlign: 'center', marginBottom: '.5rem' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 44, lineHeight: 1, color: arcColor, transition: 'color .4s' }}>
          {probPct}%
        </div>
        <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'DM Mono, monospace', marginTop: '.3rem' }}>
          disruption probability
        </div>
      </div>

      {/* Arc meter */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '.75rem' }}>
        <svg width="160" height="90" viewBox="0 0 160 90">
          {/* Track */}
          <path d="M 15 85 A 65 65 0 0 1 145 85" fill="none" stroke="#1a1a24" strokeWidth="12" strokeLinecap="round" />
          {/* Fill */}
          <path
            d="M 15 85 A 65 65 0 0 1 145 85"
            fill="none"
            stroke={arcColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${fillLen} ${totalLen - fillLen}`}
            style={{ transition: 'stroke-dasharray .6s ease, stroke .4s' }}
          />
        </svg>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)', margin: '.75rem 0' }} />

      {/* Income comparison */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'DM Mono, monospace', marginBottom: '.2rem' }}>Expected Today</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 14 }}>₹{expectedIncome}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'DM Mono, monospace', marginBottom: '.2rem' }}>Actual (Live)</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 14, color: actualIncome < expectedIncome ? 'var(--red)' : 'var(--green)' }}>₹{actualIncome}</div>
        </div>
      </div>

      {/* Income loss row */}
      {incomeLoss > 50 && (
        <div style={{ marginTop: '.75rem', padding: '.5rem .75rem', background: 'rgba(239,68,68,0.08)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
          <div style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'DM Mono, monospace' }}>
            Income Loss: ₹{incomeLoss} → Payout eligible
          </div>
        </div>
      )}
    </div>
  );
}
