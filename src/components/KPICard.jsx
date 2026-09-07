import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { SparklineChart } from './SparklineChart';
import { useCountUp } from '../utils/useCountUp';

const colorMap = {
  violet:  { border: 'border-sky-200',    text: 'text-sky-700',    bg: 'bg-sky-50',    bar: 'bg-sky-600'    },
  cyan:    { border: 'border-sky-200',    text: 'text-sky-600',    bg: 'bg-sky-50',    bar: 'bg-sky-600'    },
  magenta: { border: 'border-rose-200',   text: 'text-rose-600',   bg: 'bg-rose-50',   bar: 'bg-rose-600'   },
  amber:   { border: 'border-amber-200',  text: 'text-amber-600',  bg: 'bg-amber-50',  bar: 'bg-amber-600'  },
};

const SPARKLINES = {
  cyan:    [4602, 4580, 4591, 4610, 4598, 4602],
  magenta: [9.4, 10.1, 11.8, 13.2, 15.1, 19.2],
  amber:   [620, 680, 702, 755, 723, 847],
  violet:  [2100000, 2240000, 2380000, 2520000, 2700000, 2840000],
};

const STROKE_COLORS = {
  violet: '#0284C7', cyan: '#0EA5E9', magenta: '#E11D48', amber: '#D97706',
};

function parseNumeric(val) {
  if (val == null) return null;
  const s = String(val);
  const m = s.match(/[\d,.]+/);
  return m ? parseFloat(m[0].replace(/,/g, '')) : null;
}

function AnimatedValue({ value }) {
  const raw = String(value);
  const isPercent  = raw.endsWith('%');
  const isCurrency = raw.startsWith('$');
  const numeric    = parseNumeric(value);

  const formatted = useCountUp(
    numeric ?? 0,
    1100,
    (v) => {
      if (isCurrency) {
        if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
        if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}K`;
        return `$${Math.round(v)}`;
      }
      if (isPercent) return `${v.toFixed(1)}%`;
      return Math.round(v).toLocaleString();
    }
  );

  return (
    <span className="stat-value text-3xl sm:text-4xl text-slate-900">
      {numeric != null ? formatted : value}
    </span>
  );
}

export default function KPICard({ label, value, delta, deltaLabel, context, color, icon: Icon, index = 0 }) {
  const isNegative = delta && (label.toLowerCase().includes('churn') || label.toLowerCase().includes('risk'));
  const c = colorMap[color] || colorMap.violet;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`panel ${c.border} rounded-md p-4 relative overflow-hidden bg-white shadow-xs flex flex-col justify-between`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${c.bar}`} />

      <div>
        <div className="flex items-start justify-between mb-2.5">
          <div className={`w-8 h-8 ${c.bg} border ${c.border} rounded-md flex items-center justify-center`}>
            <Icon size={16} className={c.text} />
          </div>
          {delta != null && (
            <div className={`flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded ${
              isNegative ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {isNegative ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {delta}
            </div>
          )}
        </div>

        <div className="mb-1">
          <AnimatedValue value={value} />
        </div>
        <div className="text-sm font-semibold text-slate-700">{label}</div>
      </div>

      {(context || deltaLabel) && (
        <div className="text-[13px] font-mono text-slate-500 mt-2 pt-2 border-t border-slate-100">
          {context || deltaLabel}
        </div>
      )}
    </motion.div>
  );
}
