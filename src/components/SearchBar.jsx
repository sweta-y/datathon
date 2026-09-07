import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { atRiskCustomers } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SearchBar — supports both controlled (query/onQueryChange) and uncontrolled modes.
 * When query/onQueryChange props are provided the state is lifted to the parent (App),
 * enabling global table filtering in addition to the quick-select dropdown.
 */
export default function SearchBar({ onSelect, query: externalQuery, onQueryChange }) {
  const isControlled = externalQuery !== undefined && onQueryChange !== undefined;

  const [localQuery, setLocalQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const query = isControlled ? externalQuery : localQuery;
  const setQuery = (val) => {
    if (isControlled) {
      onQueryChange(val);
    } else {
      setLocalQuery(val);
    }
  };

  const results = query.length >= 2
    ? atRiskCustomers.filter((c) =>
        c.id.toLowerCase().includes(query.toLowerCase()) ||
        (c.Contract && c.Contract.toLowerCase().includes(query.toLowerCase())) ||
        (c.PaymentMethod && c.PaymentMethod.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref} role="search" aria-label="Search customers">
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
        <input
          type="search"
          value={query}
          placeholder="Search customer ID..."
          aria-label="Search customers by customer ID or contract"
          aria-expanded={open && results.length > 0}
          aria-autocomplete="list"
          aria-controls="searchbar-results"
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="bg-white border border-slate-200 rounded pl-7 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 w-48 transition-all shadow-sm"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={11} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            id="searchbar-results"
            role="listbox"
            aria-label="Search results"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-9 left-0 w-64 bg-white border border-slate-200 rounded shadow-xl z-50 overflow-hidden"
          >
            {results.map((c) => (
              <button
                key={c.id}
                role="option"
                aria-selected="false"
                onClick={() => { onSelect?.(c); setQuery(''); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-indigo-50 transition-colors text-left group"
              >
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  c.risk === 'high' ? 'bg-rose-500' : c.risk === 'medium' ? 'bg-amber-500' : 'bg-sky-500'
                }`} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{c.id}</div>
                  <div className="text-[11px] font-mono text-slate-500">{c.Contract} · {c.tenure} mo</div>
                </div>
                <div className={`text-[11px] font-mono font-bold flex-shrink-0 ${
                  c.risk === 'high' ? 'text-rose-600' : c.risk === 'medium' ? 'text-amber-600' : 'text-sky-600'
                }`}>{c.score}%</div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
