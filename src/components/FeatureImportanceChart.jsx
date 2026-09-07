import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const THEME_COLORS = [
  '#FF4FD8', // Critical (top 1)
  '#FF4FD8', // Critical (top 2)
  '#FFB84D', // High (top 3)
  '#FFB84D', // High (top 4)
  '#7C5CFF', // Medium (top 5)
  '#7C5CFF', // Medium (top 6)
  '#22F0D8', // Low (top 7)
  '#22F0D8', // Low (top 8)
  '#22F0D8', // Low (top 9)
  '#22F0D8', // Low (top 10)
];

const DEFAULT_FEATURES = [
  { feature: 'TotalCharges',    value: 0.1868, color: '#FF4FD8' },
  { feature: 'MonthlyCharges',  value: 0.1792, color: '#FF4FD8' },
  { feature: 'tenure',          value: 0.1543, color: '#FFB84D' },
  { feature: 'Contract',        value: 0.0796, color: '#FFB84D' },
  { feature: 'PaymentMethod',   value: 0.0501, color: '#7C5CFF' },
  { feature: 'OnlineSecurity',  value: 0.0496, color: '#7C5CFF' },
  { feature: 'TechSupport',     value: 0.0436, color: '#22F0D8' },
  { feature: 'gender',          value: 0.0279, color: '#22F0D8' },
  { feature: 'InternetService', value: 0.0278, color: '#22F0D8' },
  { feature: 'OnlineBackup',    value: 0.0271, color: '#22F0D8' },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  return (
    <div className="bg-panel border border-border px-3 py-2 rounded-sm text-xs">
      <p className="font-mono text-dim text-[9px] mb-1">{item?.feature}</p>
      <p className="font-bold" style={{ color: item?.color }}>
        Importance: {typeof item?.value === 'number' ? item.value.toFixed(4) : item?.value}
      </p>
    </div>
  );
};

export default function FeatureImportanceChart({ featureImportance }) {
  // Transform API response into chart data
  let chartData = DEFAULT_FEATURES;
  if (Array.isArray(featureImportance) && featureImportance.length > 0) {
    chartData = featureImportance.map((item, idx) => {
      const name = item.feature || item.name || `Feature ${idx + 1}`;
      const val = typeof item.importance === 'number'
        ? item.importance
        : typeof item.score === 'number'
          ? item.score
          : typeof item.value === 'number'
            ? item.value
            : 0;
      return {
        feature: name,
        value: val,
        color: THEME_COLORS[idx % THEME_COLORS.length],
      };
    });
  }

  // Calculate dynamic upper bound for x-axis
  const maxVal = Math.max(...chartData.map((d) => d.value), 0.2);
  const xDomainMax = Math.ceil(maxVal * 1.2 * 10) / 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.5 }}
      className="panel border-border rounded-sm p-5"
    >
      <div className="section-label mb-1">Explainability</div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">Top 10 feature importances (Random Forest)</h3>

      <ResponsiveContainer width="100%" height={230}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 12, left: 10, bottom: 0 }}
          barCategoryGap="18%"
        >
          <XAxis
            type="number"
            tick={{ fill: '#444', fontSize: 9, fontFamily: 'Space Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v.toFixed(2)}
            domain={[0, xDomainMax]}
          />
          <YAxis
            type="category"
            dataKey="feature"
            tick={{ fill: '#888', fontSize: 9, fontFamily: 'Space Mono' }}
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="value" radius={[0, 2, 2, 0]}>
            {chartData.map((d, i) => (
              <Cell key={i} fill={d.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-4 text-[13px] font-mono text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-rose-500" />Critical (#1-2)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-amber-500" />High (#3-4)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-indigo-500" />Medium (#5-6)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-sky-500" />Low (#7-10)</span>
      </div>
    </motion.div>
  );
}
