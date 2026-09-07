import { motion, AnimatePresence } from 'framer-motion';
import { retentionPlaybooks } from '../data/mockData';
import { Zap, TrendingUp, X } from 'lucide-react';

function ImpactBadge({ impact }) {
  const map = {
    Critical: 'badge-high',
    High: 'badge-high',
    Medium: 'badge-medium',
    Low: 'badge-low',
  };
  return <span className={map[impact] || 'badge-low'}>{impact}</span>;
}

export default function RetentionPlaybooks({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 h-screen w-80 bg-surface border-l border-border z-40 flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <div className="section-label mb-1">Retention Engine</div>
                <div className="text-sm font-bold text-white">Playbooks</div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center border border-border rounded-sm text-dim hover:text-white hover:border-muted transition-colors"
              >
                <X size={13} />
              </button>
            </div>

            {/* Playbooks list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {retentionPlaybooks.map((pb, i) => (
                <motion.div
                  key={pb.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="border rounded-sm p-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  style={{ borderColor: `${pb.color}25`, background: `${pb.color}06` }}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: pb.color }}
                      />
                      <div className="text-xs font-bold text-white leading-tight">{pb.name}</div>
                    </div>
                    <ImpactBadge impact={pb.impact} />
                  </div>

                  {/* Trigger */}
                  <div className="text-[9px] font-mono text-dim mb-3">
                    TRIGGER: {pb.trigger}
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[9px] font-mono text-dim mb-1">SUCCESS RATE</div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1 bg-muted rounded-sm overflow-hidden">
                          <div
                            className="h-full rounded-sm"
                            style={{ width: `${pb.successRate}%`, backgroundColor: pb.color }}
                          />
                        </div>
                        <span className="text-[10px] font-mono font-bold" style={{ color: pb.color }}>
                          {pb.successRate}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-dim mb-1">AVG RETENTION</div>
                      <div className="text-[10px] font-mono font-bold text-white">
                        +{pb.avgRetention} <span className="font-normal text-dim">mo</span>
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <button
                    className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-sm border transition-all"
                    style={{
                      borderColor: `${pb.color}40`,
                      color: pb.color,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${pb.color}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <Zap size={10} /> Deploy Playbook
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Footer stats */}
            <div className="px-5 py-3 border-t border-border">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="section-label mb-1">Playbooks Active</div>
                  <div className="text-lg font-bold text-violet font-mono">2 / 4</div>
                </div>
                <div>
                  <div className="section-label mb-1">Customers Saved</div>
                  <div className="flex items-center gap-1 text-lg font-bold text-cyan font-mono">
                    <TrendingUp size={13} />214
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
