'use client';
import { useRidoStore } from '@/store/ridoStore';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';

export default function RiskChart() {
  const timeSeries = useRidoStore((s) => s.timeSeries);

  return (
    <div style={{ height: 180, marginTop: '.5rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={timeSeries} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" />
          <XAxis dataKey="label" tick={{ fill: '#9999bb', fontSize: 10 }} tickLine={false} interval="preserveStartEnd" />
          <YAxis domain={[0, 100]} tick={{ fill: '#9999bb', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#111118', border: '1px solid #2a2a38', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#9999bb' }}
            formatter={(v: number) => [`${v}%`, 'Risk Score']}
          />
          <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'Alert', fill: '#ef4444', fontSize: 10 }} />
          <Area type="monotone" dataKey="risk" stroke="#f97316" strokeWidth={2} fill="url(#riskGrad)" dot={false} name="Risk" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
