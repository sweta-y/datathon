import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, SlidersHorizontal, ChevronDown } from 'lucide-react';

/* ── verified filter options from telco_churn.csv ── */
const FILTER_FIELDS = [
  {
    key: 'risk',
    label: 'Risk Level',
    options: ['All Risk Levels', 'High', 'Medium', 'Low'],
    defaultVal: 'All Risk Levels',
  },
  {
    key: 'contract',
    label: 'Contract Type',
    options: ['All Contracts', 'Month-to-month', 'One year', 'Two year'],
    defaultVal: 'All Contracts',
  },
  {
    key: 'internet',
    label: 'Internet Service',
    options: ['All Internet Services', 'DSL', 'Fiber optic', 'No'],
    defaultVal: 'All Internet Services',
  },
  {
    key: 'payment',
    label: 'Payment Method',
    options: [
      'All Payment Methods',
      'Electronic check',
      'Mailed check',
      'Bank transfer (automatic)',
      'Credit card (automatic)',
    ],
    defaultVal: 'All Payment Methods',
  },
  {
    key: 'tenureRange',
    label: 'Tenure Range',
    options: ['All Tenures', '0 - 12 Months', '13 - 24 Months', '25+ Months'],
    defaultVal: 'All Tenures',
  },
  {
    key: 'chargesRange',
    label: 'Monthly Charges',
    options: ['All Charges', '$0 - $50', '$51 - $80', '$81+'],
    defaultVal: 'All Charges',
  },
];

export const ALL_DEFAULTS = Object.fromEntries(
  FILTER_FIELDS.map((f) => [f.key, f.defaultVal]),
);

/** Count how many filters deviate from their default */
export function countActiveFilters(filters = {}) {
  return FILTER_FIELDS.filter(
    ({ key, defaultVal }) => filters[key] && filters[key] !== defaultVal,
  ).length;
}

/* ── Sub-component: single select row ── */
function DrawerSelect({ label, options, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-slate-200 rounded px-3 pr-8 py-2 text-sm font-mono text-slate-800 font-medium focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 transition-all cursor-pointer"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={12}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>
    </div>
  );
}

/**
 * FilterDrawer — slide-in panel from right
 *
 * Props:
 *  isOpen          {boolean}
 *  onClose         {() => void}
 *  appliedFilters  {object}   current live filter state (from App.jsx)
 *  onApplyFilters  {(filters) => void}  updates App.jsx filter state
 */
export default function FilterDrawer({ isOpen, onClose, appliedFilters = {}, onApplyFilters }) {
  const [draft, setDraft] = useState({ ...ALL_DEFAULTS, ...appliedFilters });
  const backdropRef = useRef(null);

  /* Sync draft when drawer opens */
  useEffect(() => {
    if (isOpen) {
      setDraft({ ...ALL_DEFAULTS, ...appliedFilters });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  function handleChange(key, val) {
    setDraft((prev) => ({ ...prev, [key]: val }));
  }

  function handleApply() {
    onApplyFilters?.(draft);
    onClose();
  }

  function handleClearAll() {
    const cleared = { ...ALL_DEFAULTS };
    setDraft(cleared);
    onApplyFilters?.(cleared);
    onClose();
  }

  const draftActiveCount = countActiveFilters(draft);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={backdropRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-slate-400/25 z-40 backdrop-blur-[1px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.9 }}
            className="fixed top-0 right-0 h-full w-80 max-w-[calc(100vw-1rem)] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Customer filters"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-sky-50 flex items-center justify-center text-sky-600">
                  <SlidersHorizontal size={13} />
                </div>
                <span className="text-sm font-mono font-bold text-slate-800">Customer Filters</span>
                {draftActiveCount > 0 && (
                  <span className="min-w-[18px] h-[18px] rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center px-1">
                    {draftActiveCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="relative w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close filters"
              >
                <X size={15} />
              </button>
            </div>

            {/* Source note */}
            <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100">
              <p className="text-[11px] font-mono text-slate-500">
                Filters apply to all 7,043 Telco customer records. Risk level is derived from model probability scores.
              </p>
            </div>

            {/* Filter fields */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {FILTER_FIELDS.map(({ key, label, options }) => (
                <DrawerSelect
                  key={key}
                  label={label}
                  options={options}
                  value={draft[key] ?? ALL_DEFAULTS[key]}
                  onChange={(val) => handleChange(key, val)}
                />
              ))}
            </div>

            {/* Footer actions */}
            <div className="px-5 py-4 border-t border-slate-100 space-y-2">
              <button
                onClick={handleApply}
                className="w-full h-9 rounded bg-sky-600 hover:bg-sky-700 text-white text-sm font-mono font-bold transition-colors cursor-pointer"
              >
                Apply filters{draftActiveCount > 0 ? ` (${draftActiveCount} active)` : ''}
              </button>
              {draftActiveCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="w-full h-9 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-mono font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} />
                  Clear all filters
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
