import { motion } from 'framer-motion';
import { riskDistribution } from '../data/mockData';
import { fmt } from '../utils/formatters';

export default function RiskDistributionChart() {
  const total = riskDistribution.reduce((s, d) => s + d.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.4 }}
      className="panel border-border rounded-sm p-5 flex flex-col"
    >
      <div className="section-label mb-1">Risk Distribution</div>
      <div className="text-sm font-bold text-white mb-4">
        Customer Risk Buckets
      </div>

      {/* Stacked bar overview */}
      <div className="h-2 rounded-sm overflow-hidden flex mb-5">
        {riskDistribution.map((d) => (
          <motion.div
            key={d.label}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{ width: `${d.pct}%`, backgroundColor: d.color, transformOrigin: 'left' }}
          />
        ))}
      </div>

      {/* Horizontal bars */}
      <div className="space-y-4 flex-1">
        {riskDistribution.map((d, i) => (
          <div key={d.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-xs font-mono text-subtle">{d.label}</span>
              </div>
              <div className="flex items-center gap-2 text-right">
                <span className="text-xs font-bold text-white font-mono">{fmt.number(d.count)}</span>
                <span className="text-[9px] font-mono text-dim w-8">{fmt.pct(d.pct)}</span>
              </div>
            </div>
            <div className="h-1.5 bg-muted rounded-sm overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.pct}%` }}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.1 }}
                className="h-full rounded-sm"
                style={{ backgroundColor: d.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <span className="section-label">Total Customers</span>
        <span className="text-sm font-bold text-white font-mono">{fmt.number(total)}</span>
      </div>
    </motion.div>
  );
}
