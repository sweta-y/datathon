import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { atRiskCustomers } from '../data/mockData';
import { fmt } from '../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const results = query.length >= 2
    ? atRiskCustomers.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.id.toLowerCase().includes(query.toLowerCase()) ||
        c.segment.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dim pointer-events-none" />
        <input
          type="text"
          value={query}
          placeholder="Search customer..."
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="bg-panel border border-border rounded-sm pl-7 pr-7 py-1.5 text-xs text-subtle placeholder-dim focus:outline-none focus:border-violet/50 w-44 transition-colors"
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-dim hover:text-white">
            <X size={11} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-9 left-0 w-64 bg-surface border border-border rounded-sm shadow-2xl z-50 overflow-hidden"
          >
            {results.map((c) => (
              <button
                key={c.id}
                onClick={() => { onSelect?.(c); setQuery(''); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.04] transition-colors text-left group"
              >
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  c.risk === 'high' ? 'bg-magenta' : c.risk === 'medium' ? 'bg-amber' : 'bg-cyan'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate group-hover:text-violet transition-colors">{c.name}</div>
                  <div className="text-[9px] font-mono text-dim">{c.id} · {c.segment}</div>
                </div>
                <div className={`text-[10px] font-mono font-bold flex-shrink-0 ${
                  c.risk === 'high' ? 'text-magenta' : c.risk === 'medium' ? 'text-amber' : 'text-cyan'
                }`}>{c.score}</div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
