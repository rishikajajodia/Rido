'use client';
import { useRidoStore } from '@/store/ridoStore';

export default function NotificationStack() {
  const notifications = useRidoStore((s) => s.notifications);
  const removeNotification = useRidoStore((s) => s.removeNotification);

  return (
    <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 999, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360, width: 'calc(100% - 2rem)' }}>
      {notifications.map((n) => (
        <div key={n.id} style={{
          background: n.type === 'payout' ? 'rgba(0,30,25,0.97)' : 'var(--surface)',
          border: `1px solid ${n.type === 'payout' ? 'rgba(0,212,170,0.5)' : n.type === 'info' ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
          borderRadius: 12, padding: '1rem 1.25rem',
          animation: 'popIn 0.3s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, fontFamily: 'Syne, sans-serif', color: n.type === 'payout' ? 'var(--accent)' : n.type === 'info' ? 'var(--blue)' : 'var(--text)' }}>{n.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{n.msg}</div>
            </div>
            <button onClick={() => removeNotification(n.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 16, padding: '0 4px', lineHeight: 1 }}>×</button>
          </div>
        </div>
      ))}
    </div>
  );
}
