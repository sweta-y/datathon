import { RefreshCw, Sparkles, SlidersHorizontal } from 'lucide-react';
import LiveTicker from './LiveTicker';
import NotificationsPanel from './NotificationsPanel';
import SearchBar from './SearchBar';

export default function TopBar({ onOpenPlaybooks, onSelectCustomer, onOpenClaudeImport, globalSearchQuery, onGlobalSearchChange, modelInfo, activeFilterCount, onOpenFilters }) {
  const now = new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <header className="fixed top-0 left-0 lg:left-56 right-0 h-14 bg-white border-b border-slate-200 flex items-center gap-4 px-4 lg:px-6 z-30 shadow-xs">
      {/* Left: title + live model status + live ticker */}
      <div className="flex-1 min-w-0 items-center gap-4 hidden lg:flex">
        <div className="flex-shrink-0 min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 leading-none truncate">Churn Prediction</h1>
          <p className="text-[13px] font-mono text-slate-500 mt-0.5 font-medium truncate">
            Executive dashboard · Telco customer churn intelligence
          </p>
        </div>

        {/* Live model status */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs font-mono font-bold flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>RF-v1.0 Live ({modelInfo?.accuracy ?? 79.21}% acc)</span>
        </div>

        <div className="hidden xl:block border-l border-slate-200 pl-4 min-w-0 flex-1">
          <LiveTicker />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex-[3] min-w-0 flex items-center justify-end gap-2.5">
        {/* Global search — state lifted to App */}
        <div className="flex-1 min-w-0 sm:min-w-[120px]">
          <SearchBar
            onSelect={onSelectCustomer}
            query={globalSearchQuery}
            onQueryChange={onGlobalSearchChange}
            className="w-full"
          />
        </div>

        {/* Import with Claude Button */}
        <button
          onClick={onOpenClaudeImport}
          className="flex-shrink-0 flex items-center gap-1.5 h-8 px-3 text-[13px] font-mono font-bold text-sky-700 bg-white border border-sky-300 hover:bg-sky-50 rounded transition-colors cursor-pointer"
          title="Import customer datasets via Claude AI JSON ingestion"
        >
          <Sparkles size={13} className="text-sky-600 animate-pulse" />
          <span className="hidden sm:inline">Import with Claude</span>
        </button>

        {/* Filters button with active count badge */}
        <button
          onClick={onOpenFilters}
          className="relative flex-shrink-0 flex items-center gap-1.5 h-8 px-3 text-[13px] font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded transition-colors cursor-pointer"
          title="Open filter panel"
        >
          <SlidersHorizontal size={13} className="text-slate-600" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center px-1">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Playbooks button */}
        <button
          onClick={onOpenPlaybooks}
          className="flex-shrink-0 flex items-center gap-1.5 h-8 px-3 text-[13px] font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded transition-colors cursor-pointer"
        >
          <span className="hidden sm:inline">Playbooks</span>
        </button>

        {/* Refresh */}
        <button
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-slate-200 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw size={13} />
        </button>

        {/* Notifications */}
        <div className="flex-shrink-0">
          <NotificationsPanel />
        </div>

        {/* Timestamp */}
        <div className="text-[10px] font-mono text-slate-500 border-l border-slate-200 pl-3 hidden xl:block font-medium">
          {now}
        </div>

        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded bg-sky-50 border border-sky-200 flex items-center justify-center text-xs font-bold text-sky-700">
          AX
        </div>
      </div>
    </header>
  );
}
