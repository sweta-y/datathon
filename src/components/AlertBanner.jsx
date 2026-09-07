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
      className="border border-rose-200 bg-rose-50 rounded-sm px-4 py-2.5 flex items-center gap-3"
    >
      <div className="flex items-center gap-2 flex-shrink-0">
        <AlertTriangle size={13} className="text-rose-600" />
        <span className="text-xs font-bold text-rose-700">Critical Alert</span>
      </div>

      <div className="flex items-center gap-4 flex-1 min-w-0 text-[10px] font-mono text-subtle">
        <span className="flex items-center gap-1.5">
          <TrendingUp size={10} className="text-rose-600" />
          Churn rate <strong className="text-rose-700">{kpis.churnRate}%</strong> is{' '}
          <strong className="text-rose-700">{(kpis.churnRate - 15).toFixed(1)}pp above</strong> the 15% threshold
        </span>
        <span className="hidden md:block text-dim">·</span>
        <span className="hidden md:block">
          <strong className="text-amber">{kpis.atRiskCount}</strong> customers at high risk ·{' '}
          <strong className="text-sky-700">$2.84M</strong> revenue exposure
        </span>
        <span className="hidden lg:block text-dim">·</span>
        <span className="hidden lg:block text-dim">Predicted to reach <strong className="text-rose-700">22.1%</strong> by end of Sep</span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="text-[9px] font-mono text-sky-700 border border-sky-300 px-2 py-1 rounded-sm hover:bg-sky-50 transition-colors uppercase tracking-wider">
          Deploy Playbooks
        </button>
        <button onClick={() => setDismissed(true)} className="text-dim hover:text-slate-900 transition-colors">
          <X size={13} />
        </button>
      </div>
    </motion.div>
  );
}
