'use client';
import { useEffect } from 'react';
import { useRidoStore } from '@/store/ridoStore';
import { useEngine } from '@/hooks/useEngine';
import OverviewTab from './tabs/OverviewTab';
import SimulateTab from './tabs/SimulateTab';
import HistoryTab from './tabs/HistoryTab';
import NotificationStack from './NotificationStack';

export default function Dashboard() {
  useEngine();

  const activeTab = useRidoStore((s) => s.activeTab);
  const setActiveTab = useRidoStore((s) => s.setActiveTab);
  const riskScore = useRidoStore((s) => s.riskScore);
  const disrupting = useRidoStore((s) => s.disrupting);

  const statusActive = !disrupting || riskScore < 50;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <NotificationStack />

      {/* Topbar */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18 }}>
            Ri<span style={{ color: 'var(--accent)' }}>do</span>
          </div>
          <StatusPill active={statusActive} disrupting={disrupting} />
        </div>

        {/* Nav tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--surface2)', borderRadius: 8, padding: 3 }}>
          {(['overview', 'simulate', 'history'] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', background: activeTab === t ? 'var(--surface3)' : 'transparent', color: activeTab === t ? 'var(--text)' : 'var(--text2)', transition: 'all .2s', textTransform: 'capitalize' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1rem', maxWidth: 920, margin: '0 auto', width: '100%' }}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'simulate' && <SimulateTab />}
        {activeTab === 'history' && <HistoryTab />}
      </div>
    </div>
  );
}

function StatusPill({ active, disrupting }: { active: boolean; disrupting: boolean }) {
  const style: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 20,
    fontFamily: 'DM Mono, monospace',
    background: disrupting ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
    color: disrupting ? 'var(--red)' : 'var(--green)',
    border: `1px solid ${disrupting ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`,
  };
  return (
    <div style={style}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', animation: 'pulse-dot 1.5s infinite' }} />
      {disrupting ? 'ALERT' : 'POLICY ACTIVE'}
    </div>
  );
}
