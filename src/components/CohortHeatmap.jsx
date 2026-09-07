import { motion } from 'framer-motion';

// Cohort: month joined (row) × months since joined (col)
// Values = retention % at that month
const COHORTS = [
  { cohort: 'Apr', values: [100, 88, 76, 65, 58, 51] },
  { cohort: 'May', values: [100, 91, 79, 68, 60, null] },
  { cohort: 'Jun', values: [100, 87, 74, 62, null, null] },
  { cohort: 'Jul', values: [100, 89, 77, null, null, null] },
  { cohort: 'Aug', values: [100, 85, null, null, null, null] },
  { cohort: 'Sep', values: [100, null, null, null, null, null] },
];
const MONTHS = ['M+0', 'M+1', 'M+2', 'M+3', 'M+4', 'M+5'];

function getColor(val) {
  if (val === null) return { bg: 'transparent', text: 'transparent', border: '#1C1C1C' };
  if (val === 100) return { bg: 'rgba(124,92,255,0.25)', text: '#7C5CFF', border: 'rgba(124,92,255,0.2)' };
  if (val >= 75) return { bg: 'rgba(34,240,216,0.15)', text: '#22F0D8', border: 'rgba(34,240,216,0.15)' };
  if (val >= 60) return { bg: 'rgba(255,184,77,0.12)', text: '#FFB84D', border: 'rgba(255,184,77,0.15)' };
  return { bg: 'rgba(255,79,216,0.12)', text: '#FF4FD8', border: 'rgba(255,79,216,0.15)' };
}

export default function CohortHeatmap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.5 }}
      className="panel border-border rounded-sm p-5"
    >
      <div className="section-label mb-1">Cohort retention</div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">Monthly cohort analysis</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-[13px] font-mono text-slate-500 pb-2 pr-3 font-semibold w-12">
                Cohort
              </th>
              {MONTHS.map((m) => (
                <th key={m} className="text-center text-[13px] font-mono text-slate-500 pb-2 px-1 font-semibold">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="space-y-1">
            {COHORTS.map((row, ri) => (
              <tr key={row.cohort}>
                <td className="text-sm font-mono text-slate-700 font-medium pr-3 py-0.5">{row.cohort}</td>
                {row.values.map((val, ci) => {
                  const c = getColor(val);
                  return (
                    <td key={ci} className="px-0.5 py-0.5">
                      {val !== null ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: ri * 0.06 + ci * 0.04 }}
                          className="w-full h-8 flex items-center justify-center rounded-sm text-[13px] font-bold font-mono border cursor-default transition-all hover:scale-105"
                          style={{ background: c.bg, color: c.text, borderColor: c.border }}
                          title={`${row.cohort} cohort at ${MONTHS[ci]}: ${val}% retained`}
                        >
                          {val}%
                        </motion.div>
                      ) : (
                        <div className="w-full h-8 rounded-sm bg-slate-100 border border-slate-200/50" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-[13px] font-mono text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded-sm inline-block" style={{ background: 'rgba(99,102,241,0.3)' }} />100%</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded-sm inline-block" style={{ background: 'rgba(14,165,233,0.2)' }} />≥75%</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded-sm inline-block" style={{ background: 'rgba(217,119,6,0.2)' }} />≥60%</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded-sm inline-block" style={{ background: 'rgba(225,29,72,0.2)' }} />&lt;60%</span>
      </div>
    </motion.div>
  );
}
