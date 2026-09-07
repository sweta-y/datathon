import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { churnBySegment } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-panel border border-border px-3 py-2 rounded-sm">
      <p className="text-[10px] font-mono text-dim uppercase tracking-widest mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 text-xs">
          <span style={{ color: entry.color }} className="font-mono">{entry.name}</span>
          <span className="font-bold text-white">{entry.value?.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
};

// Color by risk level based on actual churn rate
function getBarColor(value) {
  if (value > 30) return '#FF4FD8';
  if (value > 15) return '#FFB84D';
  return '#22F0D8';
}

export default function ChurnBySegmentChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.45 }}
      className="panel border-border rounded-sm p-5"
    >
      <div className="section-label mb-1">Churn by segment</div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">Actual vs predicted churn rate</h3>

      <ResponsiveContainer width="100%" height={195}>
        <BarChart
          data={churnBySegment}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          barGap={2}
          barCategoryGap="28%"
        >
          <CartesianGrid stroke="#1C1C1C" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="segment"
            tick={{ fill: '#444', fontSize: 9, fontFamily: 'Space Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#444', fontSize: 9, fontFamily: 'Space Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="actual" name="Actual" radius={[2, 2, 0, 0]}>
            {churnBySegment.map((entry, i) => (
              <Cell key={i} fill={getBarColor(entry.actual)} fillOpacity={0.85} />
            ))}
          </Bar>
          <Bar dataKey="predicted" name="Predicted" fill="#7C5CFF" fillOpacity={0.4} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-[13px] font-mono text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" />Actual
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500/50 inline-block" />Predicted
        </span>
        <span className="flex items-center gap-1.5 ml-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> &gt;30%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> &gt;15%
        </span>
      </div>
    </motion.div>
  );
}
