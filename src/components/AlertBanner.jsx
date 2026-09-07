import { motion } from 'framer-motion';
import { AlertTriangle, X, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { kpis } from '../data/mockData';

export default function AlertBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="border border-magenta/30 bg-magenta/5 rounded-sm px-4 py-2.5 flex items-center gap-3"
    >
      <div className="flex items-center gap-2 flex-shrink-0">
        <AlertTriangle size={13} className="text-magenta" />
        <span className="text-xs font-bold text-magenta">Critical Alert</span>
      </div>

      <div className="flex items-center gap-4 flex-1 min-w-0 text-[10px] font-mono text-subtle">
        <span className="flex items-center gap-1.5">
          <TrendingUp size={10} className="text-magenta" />
          Churn rate <strong className="text-magenta">{kpis.churnRate}%</strong> is{' '}
          <strong className="text-magenta">{(kpis.churnRate - 15).toFixed(1)}pp above</strong> the 15% threshold
        </span>
        <span className="hidden md:block text-dim">·</span>
        <span className="hidden md:block">
          <strong className="text-amber">{kpis.atRiskCount}</strong> customers at high risk ·{' '}
          <strong className="text-violet">\$2.84M</strong> revenue exposure
        </span>
        <span className="hidden lg:block text-dim">·</span>
        <span className="hidden lg:block text-dim">Predicted to reach <strong className="text-magenta">22.1%</strong> by end of Sep</span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="text-[9px] font-mono text-violet border border-violet/30 px-2 py-1 rounded-sm hover:bg-violet/10 transition-colors uppercase tracking-wider">
          Deploy Playbooks
        </button>
        <button onClick={() => setDismissed(true)} className="text-dim hover:text-white transition-colors">
          <X size={13} />
        </button>
      </div>
    </motion.div>
  );
}
