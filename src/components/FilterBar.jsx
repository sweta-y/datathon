import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, RotateCcw } from 'lucide-react';

const SEGMENTS = ['All Segments', 'Enterprise', 'Mid-Market', 'SMB', 'Starter', 'Trial'];
const RISKS = ['All Risk Levels', 'High', 'Medium', 'Low'];
const CONTRACTS = ['All Contracts', 'Month-to-month', 'One year', 'Two year'];
const INTERNETS = ['All Internet Services', 'Fiber optic', 'DSL', 'No'];
const PAYMENTS = [
  'All Payment Methods',
  'Electronic check',
  'Mailed check',
  'Bank transfer (automatic)',
  'Credit card (automatic)',
];
const TENURES = ['All Tenures', '0 - 12 Months', '13 - 24 Months', '25+ Months'];
const CHARGES = ['All Charges', '$0 - $50', '$51 - $80', '$81+'];

function FilterSelect({ label, options, value, onChange }) {
  return (
    <div className="flex items-center">
      <label className="text-[13px] font-mono text-slate-500 font-semibold px-2.5 border-y border-l border-slate-200 h-8 flex items-center bg-slate-50 rounded-l-md whitespace-nowrap">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white border border-slate-200 rounded-r-md pl-2.5 pr-7 h-8 text-sm font-mono text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer shadow-xs"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-white text-slate-800">
              {o}
            </option>
          ))}
        </select>
        <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

export default function FilterBar({ onFilterChange }) {
  const [segment, setSegment] = useState('All Segments');
  const [risk, setRisk] = useState('All Risk Levels');
  const [contract, setContract] = useState('All Contracts');
  const [internet, setInternet] = useState('All Internet Services');
  const [payment, setPayment] = useState('All Payment Methods');
  const [tenureRange, setTenureRange] = useState('All Tenures');
  const [chargesRange, setChargesRange] = useState('All Charges');

  function handleChange(field, val) {
    const next = {
      segment,
      risk,
      contract,
      internet,
      payment,
      tenureRange,
      chargesRange,
      [field]: val,
    };
    if (field === 'segment') setSegment(val);
    if (field === 'risk') setRisk(val);
    if (field === 'contract') setContract(val);
    if (field === 'internet') setInternet(val);
    if (field === 'payment') setPayment(val);
    if (field === 'tenureRange') setTenureRange(val);
    if (field === 'chargesRange') setChargesRange(val);
    onFilterChange?.(next);
  }

  const isFiltered =
    segment !== 'All Segments' ||
    risk !== 'All Risk Levels' ||
    contract !== 'All Contracts' ||
    internet !== 'All Internet Services' ||
    payment !== 'All Payment Methods' ||
    tenureRange !== 'All Tenures' ||
    chargesRange !== 'All Charges';

  const resetAll = () => {
    setSegment('All Segments');
    setRisk('All Risk Levels');
    setContract('All Contracts');
    setInternet('All Internet Services');
    setPayment('All Payment Methods');
    setTenureRange('All Tenures');
    setChargesRange('All Charges');
    onFilterChange?.({
      segment: 'All Segments',
      risk: 'All Risk Levels',
      contract: 'All Contracts',
      internet: 'All Internet Services',
      payment: 'All Payment Methods',
      tenureRange: 'All Tenures',
      chargesRange: 'All Charges',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="panel p-3.5 bg-white border border-slate-200 rounded-md shadow-xs space-y-2.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Filter size={12} />
          </div>
          <span className="text-sm font-mono font-bold text-slate-800">
            Customer filters — 7 dimensions
          </span>
        </div>

        {isFiltered && (
          <button
            onClick={resetAll}
            className="text-[13px] font-mono font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={11} /> Reset filters
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
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
          label="Contract"
          options={CONTRACTS}
          value={contract}
          onChange={(v) => handleChange('contract', v)}
        />
        <FilterSelect
          label="Internet"
          options={INTERNETS}
          value={internet}
          onChange={(v) => handleChange('internet', v)}
        />
        <FilterSelect
          label="Payment"
          options={PAYMENTS}
          value={payment}
          onChange={(v) => handleChange('payment', v)}
        />
        <FilterSelect
          label="Tenure"
          options={TENURES}
          value={tenureRange}
          onChange={(v) => handleChange('tenureRange', v)}
        />
        <FilterSelect
          label="Charges"
          options={CHARGES}
          value={chargesRange}
          onChange={(v) => handleChange('chargesRange', v)}
        />
      </div>
    </motion.div>
  );
}
