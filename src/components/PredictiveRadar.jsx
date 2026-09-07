import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';
import { motion } from 'framer-motion';
import { radarData } from '../data/mockData';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-panel border border-border px-3 py-2 rounded-sm text-xs">
      <p className="font-mono text-dim text-[10px] uppercase tracking-widest mb-1">{d.payload?.driver}</p>
      <p className="text-magenta font-bold">{d.value} <span className="text-dim font-normal">/ 100</span></p>
    </div>
  );
};

function getSeverityLabel(v) {
  if (v >= 75) return { label: 'Critical', color: '#FF4FD8' };
  if (v >= 55) return { label: 'High', color: '#FFB84D' };
  return { label: 'Moderate', color: '#22F0D8' };
}

export default function PredictiveRadar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.5 }}
      className="panel border-border rounded-sm p-5"
    >
      <div className="section-label mb-1">Churn driver analysis</div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">Predictive risk radar</h3>

      <ResponsiveContainer width="100%" height={195}>
        <RadarChart data={radarData} margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
          <defs>
            <linearGradient id="radarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF4FD8" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#7C5CFF" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis
            dataKey="driver"
            tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'Space Grotesk' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            dataKey="severity"
            stroke="#6366F1"
            strokeWidth={1.5}
            fill="url(#radarGrad)"
            dot={{ fill: '#6366F1', r: 3, strokeWidth: 0 }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Driver legend */}
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {radarData.map((d) => {
          const sev = getSeverityLabel(d.severity);
          return (
            <div key={d.driver} className="flex items-center justify-between text-[13px] font-mono">
              <span className="text-slate-600 truncate">{d.driver}</span>
              <span style={{ color: sev.color }} className="ml-1 flex-shrink-0 font-bold">{d.severity}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
