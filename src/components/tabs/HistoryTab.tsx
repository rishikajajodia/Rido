'use client';
import { useRidoStore } from '@/store/ridoStore';

export default function HistoryTab() {
  const payouts = useRidoStore((s) => s.payouts);
  const totalPayouts = useRidoStore((s) => s.totalPayouts);
  const profile = useRidoStore((s) => s.profile);
  const gritScore = useRidoStore((s) => s.gritScore);
  const incomeStabilityScore = useRidoStore((s) => s.incomeStabilityScore);

  const policyDetails = profile ? [
    ['Policy Holder', profile.name],
    ['Platform', profile.platform],
    ['Work Zone', profile.zone],
    ['Experience', profile.exp],
    ['Grit Score', `${gritScore} / 100`],
    ['Income Stability', `${incomeStabilityScore} / 100`],
    ['Base Coverage', '₹50 – ₹250 (adaptive)'],
    ['Policy Status', 'Active'],
    ['Enrolled', new Date().toLocaleDateString()],
  ] : [];

  return (
    <div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16 }}>Payout History</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: 'var(--green)' }}>Total: ₹{totalPayouts}</div>
        </div>

        {payouts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text2)', fontSize: 13 }}>
            No payouts yet. Trigger a disruption in the Simulate tab.
          </div>
        ) : (
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {payouts.map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.75rem 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.reason}</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>
                    {p.time} · Confidence {p.confidence.toFixed(2)} ·{' '}
                    <span style={{ color: p.type === 'large' ? 'var(--red)' : p.type === 'medium' ? 'var(--orange)' : 'var(--accent3)' }}>
                      {p.type === 'large' ? 'High loss' : p.type === 'medium' ? 'Medium loss' : 'Small loss'}
                    </span>
                  </div>
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontWeight: 500, color: 'var(--green)', fontSize: 15 }}>+₹{p.amount}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Policy Details */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
        <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'DM Mono, monospace', marginBottom: '.75rem', fontWeight: 500 }}>Policy Details</div>
        {policyDetails.map(([label, value]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.65rem 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, color: 'var(--text2)' }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 500, fontFamily: 'DM Mono, monospace', textTransform: 'capitalize' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
