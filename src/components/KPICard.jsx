import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { SparklineChart } from './SparklineChart';
import { useCountUp } from '../utils/useCountUp';

const colorMap = {
  violet:  { border: 'border-violet/25',  glow: 'glow-violet',  text: 'text-violet',  bg: 'bg-violet/10',  bar: 'bg-violet'  },
  cyan:    { border: 'border-cyan/25',    glow: 'glow-cyan',    text: 'text-cyan',    bg: 'bg-cyan/10',    bar: 'bg-cyan'    },
  magenta: { border: 'border-magenta/25', glow: 'glow-magenta', text: 'text-magenta', bg: 'bg-magenta/10', bar: 'bg-magenta' },
  amber:   { border: 'border-amber/25',   glow: 'glow-amber',   text: 'text-amber',   bg: 'bg-amber/10',   bar: 'bg-amber'   },
};

const SPARKLINES = {
  cyan:    [4602, 4580, 4591, 4610, 4598, 4602],
  magenta: [9.4, 10.1, 11.8, 13.2, 15.1, 19.2],
  amber:   [620, 680, 702, 755, 723, 847],
  violet:  [2100000, 2240000, 2380000, 2520000, 2700000, 2840000],
};

const STROKE_COLORS = {
  violet: '#7C5CFF', cyan: '#22F0D8', magenta: '#FF4FD8', amber: '#FFB84D',
};

// Strip non-numeric prefix/suffix to get raw number for count-up
function parseNumeric(val) {
  if (val == null) return null;
  const s = String(val);
  const m = s.match(/[\d,.]+/);
  return m ? parseFloat(m[0].replace(/,/g, '')) : null;
}

function AnimatedValue({ value, color }) {
  // Detect format: currency ($), percent (%), plain number
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
    <span className="stat-value text-2xl text-white">
      {numeric != null ? formatted : value}
    </span>
  );
}

export default function KPICard({ label, value, delta, deltaLabel, color, icon: Icon, index = 0 }) {
  const isNegative = delta && (label.includes('Churn') || label.includes('Risk'));
  const c = colorMap[color] || colorMap.violet;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`panel ${c.border} ${c.glow} rounded-sm p-4 relative overflow-hidden`}
    >
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${c.bar} opacity-70`} />

      <div className="flex items-start justify-between mb-2">
        <div className={`w-8 h-8 ${c.bg} border ${c.border} rounded-sm flex items-center justify-center`}>
          <Icon size={15} className={c.text} />
        </div>
        {delta != null && (
          <div className={`flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-sm ${
            isNegative ? 'bg-magenta/10 text-magenta' : 'bg-cyan/10 text-cyan'
          }`}>
            {isNegative ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {delta}
          </div>
        )}
      </div>

      <div className="mb-0.5">
        <AnimatedValue value={value} color={color} />
      </div>
      <div className="section-label">{label}</div>
      {deltaLabel && <div className="text-[9px] font-mono text-dim mt-0.5">{deltaLabel}</div>}

      {/* Sparkline */}
      <div className="mt-3 -mx-1">
        <SparklineChart data={SPARKLINES[color] || []} color={STROKE_COLORS[color]} />
      </div>
    </motion.div>
  );
}
