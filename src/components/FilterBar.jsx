import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';

const SEGMENTS = ['All Segments', 'Enterprise', 'Mid-Market', 'SMB', 'Starter', 'Trial'];
const RISKS = ['All Risk Levels', 'High', 'Medium', 'Low'];
const PERIODS = ['Last 30 Days', 'Last 60 Days', 'Last 90 Days', 'YTD'];

function FilterSelect({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-0">
      <label className="text-[9px] font-mono text-dim uppercase tracking-widest px-2 border-y border-l border-border h-7 flex items-center bg-surface rounded-l-sm whitespace-nowrap">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-panel border border-border rounded-r-sm pl-2.5 pr-6 h-7 text-[10px] font-mono text-white focus:outline-none focus:border-violet/50 transition-colors cursor-pointer"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-panel">{o}</option>
          ))}
        </select>
        <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-dim pointer-events-none" />
      </div>
    </div>
  );
}

export default function FilterBar({ onFilterChange }) {
  const [segment, setSegment] = useState('All Segments');
  const [risk, setRisk] = useState('All Risk Levels');
  const [period, setPeriod] = useState('Last 30 Days');

  function handleChange(field, val) {
    const next = { segment, risk, period, [field]: val };
    if (field === 'segment') setSegment(val);
    if (field === 'risk') setRisk(val);
    if (field === 'period') setPeriod(val);
    onFilterChange?.(next);
  }

  const isFiltered = segment !== 'All Segments' || risk !== 'All Risk Levels' || period !== 'Last 30 Days';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="flex items-center gap-3 flex-wrap"
    >
      <div className="flex items-center gap-1 text-[9px] font-mono text-dim">
        <Filter size={11} />
        <span className="uppercase tracking-widest">Filters</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <FilterSelect
          label="Segment"
          options={SEGMENTS}
          value={segment}
          onChange={(v) => handleChange('segment', v)}
        />
        <FilterSelect
          label="Risk"
          options={RISKS}
          value={risk}
          onChange={(v) => handleChange('risk', v)}
        />
        <FilterSelect
          label="Period"
          options={PERIODS}
          value={period}
          onChange={(v) => handleChange('period', v)}
        />
      </div>

      {isFiltered && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            setSegment('All Segments');
            setRisk('All Risk Levels');
            setPeriod('Last 30 Days');
            onFilterChange?.({ segment: 'All Segments', risk: 'All Risk Levels', period: 'Last 30 Days' });
          }}
          className="text-[9px] font-mono text-dim hover:text-magenta transition-colors uppercase tracking-widest border border-border hover:border-magenta/40 px-2 py-1 rounded-sm"
        >
          Clear filters
        </motion.button>
      )}
    </motion.div>
  );
}
