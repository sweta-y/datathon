import { useState } from 'react';
import { motion } from 'framer-motion';
import { atRiskCustomers } from '../data/mockData';
import { fmt } from '../utils/formatters';
import { AlertTriangle, ExternalLink, ChevronRight, ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';

function ScoreBadge({ score }) {
  let color = '#22F0D8';
  if (score >= 80) color = '#FF4FD8';
  else if (score >= 65) color = '#FFB84D';
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1 bg-muted rounded-sm overflow-hidden">
        <div className="h-full rounded-sm" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-mono font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

const COLUMNS = [
  { key: 'id',            label: 'Customer ID',    sortable: true  },
  { key: 'name',          label: 'Company',        sortable: true  },
  { key: 'segment',       label: 'Segment',        sortable: true  },
  { key: 'score',         label: 'Churn Score',    sortable: true  },
  { key: 'risk',          label: 'Risk Level',     sortable: true  },
  { key: 'predictedDate', label: 'Est. Churn Date',sortable: true  },
  { key: 'ltv',           label: 'LTV',            sortable: true  },
];

function SortIcon({ col, sort }) {
  if (sort.key !== col) return <ChevronsUpDown size={10} className="text-dim" />;
  return sort.dir === 'asc'
    ? <ChevronUp size={10} className="text-violet" />
    : <ChevronDown size={10} className="text-violet" />;
}

export default function CustomerTable({ filters, onSelect }) {
  const [sort, setSort] = useState({ key: 'score', dir: 'desc' });

  function toggleSort(key) {
    setSort((s) => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });
  }

  let data = [...atRiskCustomers];

  // Filter
  if (filters?.segment && filters.segment !== 'All Segments')
    data = data.filter((c) => c.segment === filters.segment);
  if (filters?.risk && filters.risk !== 'All Risk Levels')
    data = data.filter((c) => c.risk === filters.risk.toLowerCase());

  // Sort
  data.sort((a, b) => {
    let va = a[sort.key], vb = b[sort.key];
    if (typeof va === 'string') va = va.toLowerCase(), vb = vb.toLowerCase();
    if (va < vb) return sort.dir === 'asc' ? -1 : 1;
    if (va > vb) return sort.dir === 'asc' ? 1 : -1;
    return 0;
  });

  const GRID = 'grid-cols-[1fr_1.4fr_0.9fr_1.1fr_0.8fr_1fr_0.7fr]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className="panel border-border rounded-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <div className="section-label mb-1">At-Risk Customers</div>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            Top At-Risk Accounts
            <span className="bg-magenta/10 text-magenta border border-magenta/30 text-[9px] font-mono px-1.5 py-0.5 rounded-sm">
              <AlertTriangle size={8} className="inline mr-0.5" />{data.length} ACCOUNTS
            </span>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-[10px] font-mono text-violet hover:text-violet/80 border border-violet/30 px-2.5 py-1.5 rounded-sm hover:bg-violet/10 transition-colors">
          Export CSV <ExternalLink size={10} />
        </button>
      </div>

      {/* Column headers — sortable */}
      <div className={`grid ${GRID} gap-3 px-5 py-2.5 border-b border-border bg-surface`}>
        {COLUMNS.map((col) => (
          <button
            key={col.key}
            onClick={() => col.sortable && toggleSort(col.key)}
            className={`flex items-center gap-1 section-label text-left transition-colors ${
              col.sortable ? 'hover:text-white cursor-pointer' : 'cursor-default'
            } ${sort.key === col.key ? 'text-violet' : ''}`}
          >
            {col.label}
            {col.sortable && <SortIcon col={col.key} sort={sort} />}
          </button>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {data.length === 0 ? (
          <div className="px-5 py-8 text-center text-dim text-xs font-mono">
            No customers match the current filters.
          </div>
        ) : (
          data.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              onClick={() => onSelect?.(c)}
              className={`grid ${GRID} gap-3 px-5 py-3 items-center hover:bg-white/[0.03] transition-colors group cursor-pointer`}
            >
              <span className="text-[10px] font-mono text-dim">{c.id}</span>
              <span className="text-xs font-medium text-white truncate group-hover:text-violet transition-colors">{c.name}</span>
              <span className="text-[10px] font-mono text-subtle">{c.segment}</span>
              <ScoreBadge score={c.score} />
              <span className={`badge-${c.risk}`}>{c.risk}</span>
              <span className="text-[10px] font-mono text-subtle">{fmt.shortDate(c.predictedDate)}</span>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-subtle">{fmt.currency(c.ltv)}</span>
                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-violet" />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border bg-surface flex items-center justify-between">
        <span className="text-[10px] font-mono text-dim">
          Showing {data.length} of 847 · Sorted by <span className="text-violet">{sort.key}</span> {sort.dir} · Click row to inspect
        </span>
        <button className="text-[10px] font-mono text-violet hover:text-violet/80 flex items-center gap-1">
          View all <ChevronRight size={10} />
        </button>
      </div>
    </motion.div>
  );
}
