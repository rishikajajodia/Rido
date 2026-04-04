interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  valueColor?: string;
}

export default function MetricCard({ label, value, sub, valueColor }: MetricCardProps) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem' }}>
      <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'DM Mono, monospace', marginBottom: '.3rem', fontWeight: 500 }}>{label}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22, color: valueColor || 'var(--text)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
