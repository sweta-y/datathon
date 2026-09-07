import { useState } from 'react';
import { motion } from 'framer-motion';
import { atRiskCustomers } from '../data/mockData';
import { fmt } from '../utils/formatters';
import { AlertTriangle, ExternalLink, ChevronRight, ChevronsUpDown, ChevronUp, ChevronDown, ChevronLeft } from 'lucide-react';

function ScoreBadge({ score }) {
  let color = '#059669'; // Emerald low risk
  let bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score >= 80) {
    color = '#E11D48'; // Rose high risk
    bg = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (score >= 60) {
    color = '#D97706'; // Amber medium risk
    bg = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-200 rounded overflow-hidden">
        <div className="h-full rounded" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className={`text-xs font-mono font-bold px-1.5 py-0.5 border rounded ${bg}`}>
        {score}
      </span>
    </div>
  );
}

const COLUMNS = [
  { key: 'id',             label: 'Customer ID',     sortable: true },
  { key: 'Contract',       label: 'Contract',        sortable: true },
  { key: 'tenure',         label: 'Tenure',          sortable: true },
  { key: 'MonthlyCharges', label: 'Monthly Charges', sortable: true },
  { key: 'TotalCharges',   label: 'Total Spend',     sortable: true },
  { key: 'score',          label: 'Churn Risk',      sortable: true },
  { key: 'risk',           label: 'Risk Level',      sortable: true },
];

function SortIcon({ col, sort }) {
  if (sort.key !== col) return <ChevronsUpDown size={11} className="text-slate-400" />;
  return sort.dir === 'asc'
    ? <ChevronUp size={11} className="text-sky-600 font-bold" />
    : <ChevronDown size={11} className="text-sky-600 font-bold" />;
}

export default function CustomerTable({ filters, onSelect, globalSearch = '' }) {
  const [sort, setSort] = useState({ key: 'score', dir: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  function toggleSort(key) {
    setSort((s) => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });
    setCurrentPage(1);
  }

  let data = [...atRiskCustomers];

  // Global search filter (from TopBar SearchBar, lifted to App)
  if (globalSearch && globalSearch.length >= 1) {
    const q = globalSearch.toLowerCase();
    data = data.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        (c.Contract && c.Contract.toLowerCase().includes(q)) ||
        (c.PaymentMethod && c.PaymentMethod.toLowerCase().includes(q))
    );
  }

  // 7-Axis Filtering Logic
  if (filters?.risk && filters.risk !== 'All Risk Levels')
    data = data.filter((c) => c.risk === filters.risk.toLowerCase());

  if (filters?.contract && filters.contract !== 'All Contracts')
    data = data.filter((c) => (c.Contract || 'Month-to-month') === filters.contract);

  if (filters?.internet && filters.internet !== 'All Internet Services')
    data = data.filter((c) => (c.InternetService || 'Fiber optic') === filters.internet);

  if (filters?.payment && filters.payment !== 'All Payment Methods')
    data = data.filter((c) => (c.PaymentMethod || 'Electronic check') === filters.payment);

  if (filters?.tenureRange && filters.tenureRange !== 'All Tenures') {
    if (filters.tenureRange === '0 - 12 Months') data = data.filter((c) => (c.tenure ?? 1) <= 12);
    else if (filters.tenureRange === '13 - 24 Months') data = data.filter((c) => (c.tenure ?? 1) > 12 && (c.tenure ?? 1) <= 24);
    else if (filters.tenureRange === '25+ Months') data = data.filter((c) => (c.tenure ?? 1) > 24);
  }

  if (filters?.chargesRange && filters.chargesRange !== 'All Charges') {
    if (filters.chargesRange === '$0 - $50') data = data.filter((c) => (c.MonthlyCharges ?? 70) <= 50);
    else if (filters.chargesRange === '$51 - $80') data = data.filter((c) => (c.MonthlyCharges ?? 70) > 50 && (c.MonthlyCharges ?? 70) <= 80);
    else if (filters.chargesRange === '$81+') data = data.filter((c) => (c.MonthlyCharges ?? 70) > 80);
  }

  // Sort
  data.sort((a, b) => {
    let va = a[sort.key], vb = b[sort.key];
    if (typeof va === 'string') va = va.toLowerCase(), vb = vb.toLowerCase();
    if (va < vb) return sort.dir === 'asc' ? -1 : 1;
    if (va > vb) return sort.dir === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const pageData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const GRID = 'grid-cols-[1.2fr_1.2fr_0.8fr_1fr_1fr_1.2fr_0.9fr]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.3 }}
      className="panel border border-slate-200 rounded-md overflow-x-auto bg-white shadow-xs"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap bg-slate-50/50">
        <div className="min-w-0">
          <div className="section-label mb-0.5">High severity accounts</div>
          <div className="text-lg font-bold text-slate-900 flex items-center gap-2 flex-wrap">
            At-risk customer directory
            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[13px] font-mono font-bold px-2 py-0.5 rounded">
              <AlertTriangle size={10} className="inline mr-1" />{data.length} matched
            </span>
          </div>
        </div>
        <button
          onClick={() => alert(`Exporting ${data.length} records to CSV...`)}
          className="flex items-center gap-1.5 text-[13px] font-mono font-bold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded hover:bg-sky-100 transition-colors cursor-pointer"
        >
          Export CSV <ExternalLink size={12} />
        </button>
      </div>

      {/* Column headers — sortable */}
      <div className={`grid ${GRID} min-w-[760px] gap-3 px-5 py-3 border-b border-slate-200 bg-slate-100/70`}>
        {COLUMNS.map((col) => (
          <button
            key={col.key}
            onClick={() => col.sortable && toggleSort(col.key)}
            className={`flex items-center gap-1 text-[13px] font-mono font-semibold text-left transition-colors ${
              col.sortable ? 'hover:text-sky-600 cursor-pointer' : 'cursor-default'
            } ${sort.key === col.key ? 'text-sky-700' : 'text-slate-600'}`}
          >
            {col.label}
            {col.sortable && <SortIcon col={col.key} sort={sort} />}
          </button>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100">
        {pageData.length === 0 ? (
          <div className="px-5 py-10 text-center text-slate-500 text-[13px] font-mono">
            No customer accounts match the current filter criteria.
          </div>
        ) : (
          pageData.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              onClick={() => onSelect?.(c)}
              className={`grid ${GRID} min-w-[760px] gap-3 px-5 py-3.5 items-center hover:bg-sky-50/60 transition-colors group cursor-pointer ${
                i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
              }`}
            >
              <span className="text-sm font-mono font-bold text-sky-700">{c.id}</span>
              <span className="text-sm font-mono text-slate-800">{c.Contract}</span>
              <span className="text-sm font-mono text-slate-600">{c.tenure} mo</span>
              <span className="text-sm font-mono text-slate-800">{fmt.currency(c.MonthlyCharges)}</span>
              <span className="text-sm font-mono font-bold text-slate-900">{fmt.currency(c.TotalCharges)}</span>
              <ScoreBadge score={c.score} />
              <div className="flex items-center justify-between">
                <span className={`badge-${c.risk}`}>{c.risk}</span>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-sky-600" />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer & Pagination Controls */}
      <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 flex-wrap text-[13px] font-mono">
        <span className="text-slate-600 font-medium min-w-0">
          Showing <strong className="text-slate-900">{pageData.length}</strong> of <strong className="text-slate-900">{data.length}</strong> accounts · Page <strong className="text-sky-700">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong>
        </span>

        {/* Pagination buttons */}
        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed text-[13px]"
          >
            <ChevronLeft size={12} /> Prev
          </button>
          
          <div className="flex items-center gap-1 px-1">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-6 h-6 rounded text-[13px] font-bold transition-colors cursor-pointer ${
                  currentPage === p
                    ? 'bg-sky-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed text-[13px]"
          >
            Next <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
