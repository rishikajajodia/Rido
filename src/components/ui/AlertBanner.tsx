interface AlertBannerProps {
  type: string;
  title: string;
  msg: string;
}

const configs: Record<string, { bg: string; border: string; color: string; icon: string }> = {
  payout:  { bg: 'rgba(0,212,170,0.08)',  border: 'rgba(0,212,170,0.3)',  color: 'var(--accent)',  icon: '✓' },
  warning: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', color: 'var(--accent3)', icon: '⏳' },
  danger:  { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.3)',  color: 'var(--red)',     icon: '⚠' },
  info:    { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.3)', color: 'var(--blue)',    icon: '✦' },
};

export default function AlertBanner({ type, title, msg }: AlertBannerProps) {
  const c = configs[type] || configs.info;
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1rem', animation: 'slideIn .3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ fontSize: 16, color: c.color, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, fontFamily: 'Syne, sans-serif', color: c.color }}>{title}</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{msg}</div>
        </div>
      </div>
    </div>
  );
}
