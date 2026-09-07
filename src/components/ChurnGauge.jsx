import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { kpis } from '../data/mockData';

const RADIAN = Math.PI / 180;
const churnRate = kpis.churnRate;
const retainRate = 100 - churnRate;

const data = [
  { name: 'Churned', value: churnRate, color: '#FF4FD8' },
  { name: 'Retained', value: retainRate, color: '#1C1C1C' },
];

function getRiskLabel(rate) {
  if (rate >= 25) return { label: 'CRITICAL', color: '#FF4FD8' };
  if (rate >= 15) return { label: 'HIGH', color: '#FFB84D' };
  return { label: 'MODERATE', color: '#22F0D8' };
}

export default function ChurnGauge() {
  const { label, color } = getRiskLabel(churnRate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.35 }}
      className="panel border-border rounded-sm p-5 flex flex-col items-center justify-center"
    >
      <div className="section-label mb-1 self-start">Overall Churn Rate</div>
      <div className="text-sm font-bold text-white mb-3 self-start">Live Gauge</div>

      <div className="relative w-full" style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={88}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="text-3xl font-bold font-mono"
            style={{ color }}
          >
            {churnRate}%
          </motion.div>
          <div className="text-[9px] font-mono mt-0.5" style={{ color }}>
            ● {label}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="w-full grid grid-cols-2 gap-2 mt-3">
        <div className="text-center p-2 border border-magenta/20 rounded-sm bg-magenta/5">
          <div className="text-base font-bold text-magenta font-mono">{churnRate}%</div>
          <div className="text-[9px] font-mono text-dim">Churn Rate</div>
        </div>
        <div className="text-center p-2 border border-cyan/20 rounded-sm bg-cyan/5">
          <div className="text-base font-bold text-cyan font-mono">{retainRate.toFixed(1)}%</div>
          <div className="text-[9px] font-mono text-dim">Retention</div>
        </div>
      </div>

      {/* Threshold markers */}
      <div className="w-full mt-3 pt-3 border-t border-border">
        {[
          { label: 'Target ≤10%', color: '#22F0D8', ok: churnRate <= 10 },
          { label: 'Warning ≤15%', color: '#FFB84D', ok: churnRate <= 15 },
          { label: 'Critical >20%', color: '#FF4FD8', ok: churnRate > 20 },
        ].map((t) => (
          <div key={t.label} className="flex items-center justify-between text-[9px] font-mono py-0.5">
            <span className="text-dim">{t.label}</span>
            <span style={{ color: t.ok ? t.color : '#444' }}>{t.ok ? '▲ Active' : '○ Clear'}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
