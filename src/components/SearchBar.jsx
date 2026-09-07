import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import allCustomers from '../data/all_telco_customers.json';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SearchBar — supports both controlled (query/onQueryChange) and uncontrolled modes.
 * When query/onQueryChange props are provided the state is lifted to the parent (App),
 * enabling global table filtering in addition to the quick-select dropdown.
 */
export default function SearchBar({ onSelect, query: externalQuery, onQueryChange, className = '' }) {
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
    ? allCustomers.filter((c) =>
        c.customerID?.toString().toLowerCase().includes(query.toLowerCase()) ||
        c.Contract?.toString().toLowerCase().includes(query.toLowerCase()) ||
        c.PaymentMethod?.toString().toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  // If we have a query but no matches, show a friendly message
  const showNoResults = query.length >= 2 && results.length === 0;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={`relative min-w-0 ${className}`} ref={ref} role="search" aria-label="Search customers">
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
        <input
          type="search"
          value={query}
          placeholder="Search customer ID, customer details…"
          aria-label="Search customers by customer ID or contract"
          aria-expanded={open && results.length > 0}
          aria-autocomplete="list"
          aria-controls="searchbar-results"
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="bg-white border border-slate-200 rounded pl-7 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 w-full min-w-0 transition-all shadow-sm"
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
        {open && (results.length > 0 ? (
          <motion.div
            id="searchbar-results"
            role="listbox"
            aria-label="Search results"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-9 left-0 max-sm:left-auto max-sm:right-0 w-64 max-w-[calc(100vw-1rem)] bg-white border border-slate-200 rounded shadow-xl z-50 overflow-hidden"
          >
            {results.map((c) => (
              <button
                key={c.customerID}
                role="option"
                aria-selected="false"
                onClick={() => { onSelect?.(c); setQuery(''); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-sky-50 transition-colors text-left group"
              >
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  c.risk === 'high' ? 'bg-rose-500' : c.risk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono font-bold text-slate-800 truncate group-hover:text-sky-700 transition-colors">{c.customerID}</div>
                  <div className="text-[11px] font-mono text-slate-500">{c.Contract} · {c.tenure} mo</div>
                </div>
                <div className={`text-[11px] font-mono font-bold flex-shrink-0 ${
                  c.risk === 'high' ? 'text-rose-600' : c.risk === 'medium' ? 'text-amber-600' : 'text-sky-600'
                }`}>{c.score}%</div>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            id="searchbar-no-results"
            role="alert"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-9 left-0 max-sm:left-auto max-sm:right-0 w-64 max-w-[calc(100vw-1rem)] bg-white border border-slate-200 rounded shadow-xl z-50 p-3 text-slate-500 text-sm"
          >
            No customers match your query.
          </motion.div>
        ))}

      </AnimatePresence>
    </div>
  );
}
