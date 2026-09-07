import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { churnTrend } from '../data/mockData';

const RANGES = ['3M', '6M', '12M'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-panel border border-border px-3 py-2 rounded-sm min-w-[140px]">
      <p className="text-[10px] font-mono text-dim uppercase tracking-widest mb-1.5">{label}</p>
      {payload.map((entry) => entry.value != null && (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-xs">
          <span style={{ color: entry.color }} className="font-mono">{entry.name}</span>
          <span className="font-bold text-slate-800">{entry.value?.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
};

export default function ChurnTrendChart() {
  const [range, setRange] = useState('12M');

  const sliceMap = { '3M': 3, '6M': 6, '12M': 12 };
  const data = churnTrend.slice(-sliceMap[range]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="panel border-border rounded-sm p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div className="min-w-0">
          <div className="section-label mb-1">Churn rate trend</div>
          <h3 className="text-xl font-bold text-slate-900">Monthly overview vs forecast</h3>
        </div>
        <div className="flex items-center gap-4 flex-wrap justify-end">
          {/* Legend */}
          <div className="hidden md:flex items-center gap-4 text-[13px] font-mono">
            <span className="flex items-center gap-1.5 text-sky-600 font-medium">
              <span className="w-3 h-0.5 bg-sky-500 inline-block rounded" />Actual
            </span>
            <span className="flex items-center gap-1.5 text-sky-700 font-medium">
              <span className="w-3 h-0.5 bg-sky-600 inline-block rounded" />Predicted
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 font-medium">
              <span className="w-3 h-0.5 bg-amber-500 inline-block rounded" />15% threshold
            </span>
          </div>

          {/* Range toggle */}
          <div className="flex items-center border border-slate-200 rounded-sm overflow-hidden bg-white">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 text-[13px] font-mono transition-colors ${
                  range === r
                    ? 'bg-sky-600 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.22} />
              <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradViolet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0284C7" stopOpacity={0.16} />
              <stop offset="95%" stopColor="#0284C7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[6, 30]} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#CBD5E1', strokeWidth: 1 }} />
          <ReferenceLine y={15} stroke="#D97706" strokeDasharray="4 3" strokeWidth={1.5}
            label={{ value: '15%', fill: '#B45309', fontSize: 9, fontFamily: 'Space Mono', position: 'right' }} />
          <Area type="monotone" dataKey="churnRate" name="Actual" stroke="#0EA5E9" strokeWidth={2}
            fill="url(#gradCyan)" dot={{ fill: '#0EA5E9', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#0EA5E9', stroke: '#FFFFFF', strokeWidth: 2 }} connectNulls={false} />
          <Area type="monotone" dataKey="predicted" name="Predicted" stroke="#0284C7" strokeWidth={1.5}
            strokeDasharray="5 3" fill="url(#gradViolet)" dot={false}
            activeDot={{ r: 4, fill: '#0284C7', stroke: '#FFFFFF', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
