'use client';
import { useRidoStore } from '@/store/ridoStore';
import MetricCard from '../ui/MetricCard';
import WorkerCard from '../ui/WorkerCard';
import ConfidencePanel from '../ui/ConfidencePanel';
import TriggerGrid from '../ui/TriggerGrid';
import AlertBanner from '../ui/AlertBanner';
import LiveTicker from '../ui/LiveTicker';
import IncomeChart from '../charts/IncomeChart';
import RiskChart from '../charts/RiskChart';

export default function OverviewTab() {
  const riskScore = useRidoStore((s) => s.riskScore);
  const premium = useRidoStore((s) => s.premium);
  const coverage = useRidoStore((s) => s.coverage);
  const gritScore = useRidoStore((s) => s.gritScore);
  const disrupting = useRidoStore((s) => s.disrupting);
  const finalConfidence = useRidoStore((s) => s.finalConfidence);
  const disruptionStart = useRidoStore((s) => s.disruptionStart);
  const payoutCooldown = useRidoStore((s) => s.payoutCooldown);

  const riskColor = riskScore > 70 ? 'var(--red)' : riskScore > 40 ? 'var(--orange)' : 'var(--green)';
  const riskLabel = riskScore > 70 ? 'High risk zone' : riskScore > 40 ? 'Moderate' : 'Low risk';

  // Derive alert state
  let alertType: string | null = null;
  let alertTitle = '';
  let alertMsg = '';
  if (disrupting && finalConfidence > 0.7 && disruptionStart) {
    const elapsed = Date.now() - disruptionStart;
    if (elapsed < 7000 && !payoutCooldown) {
      const remain = Math.ceil((7000 - elapsed) / 1000);
      alertType = 'warning';
      alertTitle = 'Validating Disruption...';
      alertMsg = `Disruption persisting — payout triggers in ~${remain}s`;
    }
  } else if (disrupting && finalConfidence > 0.4) {
    alertType = 'danger';
    alertTitle = 'Disruption Detected';
    alertMsg = 'Elevated risk signals — monitoring for persistence before payout';
  }

  return (
    <div>
      <LiveTicker />

      {alertType && <AlertBanner type={alertType} title={alertTitle} msg={alertMsg} />}

      {/* Metric row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        <MetricCard label="Grit Score" value={String(gritScore)} sub="Consistency index" valueColor="var(--accent)" />
        <MetricCard label="Weekly Premium" value={`₹${premium}/wk`} sub="Auto-adjusted" />
        <MetricCard label="Coverage" value={`₹${coverage}`} sub="Per disruption" valueColor="var(--green)" />
        <MetricCard label="Risk Score" value={String(riskScore)} sub={riskLabel} valueColor={riskColor} />
      </div>

      {/* Main panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <WorkerCard />
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
          <ConfidencePanel />
          <div style={{ borderTop: '1px solid var(--border)', margin: '.75rem 0' }} />
          <TriggerGrid />
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
          <SectionHd>Income vs Actual (Today)</SectionHd>
          <IncomeChart />
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
          <SectionHd>Risk Score · Live</SectionHd>
          <RiskChart />
        </div>
      </div>
    </div>
  );
}

function SectionHd({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'DM Mono, monospace', marginBottom: '.75rem', fontWeight: 500 }}>{children}</div>;
}
