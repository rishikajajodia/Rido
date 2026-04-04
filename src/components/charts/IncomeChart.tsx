'use client';
import { useRidoStore } from '@/store/ridoStore';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';

export default function IncomeChart() {
  const timeSeries = useRidoStore((s) => s.timeSeries);

  return (
    <div style={{ height: 180, marginTop: '.5rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={timeSeries} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" />
          <XAxis dataKey="label" tick={{ fill: '#9999bb', fontSize: 10 }} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#9999bb', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#111118', border: '1px solid #2a2a38', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#9999bb' }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: '#9999bb' }} />
          <Line type="monotone" dataKey="expected" stroke="#9999bb" strokeDasharray="4 4" strokeWidth={1.5} dot={false} name="Expected" />
          <Line type="monotone" dataKey="actual" stroke="#00d4aa" strokeWidth={2} dot={false} name="Actual" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
