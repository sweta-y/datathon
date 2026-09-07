import { RefreshCw, Sparkles } from 'lucide-react';
import LiveTicker from './LiveTicker';
import NotificationsPanel from './NotificationsPanel';
import SearchBar from './SearchBar';

export default function TopBar({ onOpenPlaybooks, onSelectCustomer, onOpenClaudeImport, globalSearchQuery, onGlobalSearchChange, modelInfo }) {
  const now = new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <header className="fixed top-0 left-56 right-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-xs">
      {/* Left: title + live model status + live ticker */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-slate-900 leading-none">Churn Prediction</h1>
          <p className="text-[13px] font-mono text-slate-500 mt-0.5 font-medium">
            Executive dashboard · Telco customer churn intelligence
          </p>
        </div>

        {/* Live model status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs font-mono font-bold flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>RF-v1.0 Live ({modelInfo?.accuracy ?? 79.21}% acc)</span>
        </div>

        <div className="hidden xl:block border-l border-slate-200 pl-4 min-w-0 flex-1">
          <LiveTicker />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Global search — state lifted to App */}
        <SearchBar
          onSelect={onSelectCustomer}
          query={globalSearchQuery}
          onQueryChange={onGlobalSearchChange}
        />

        {/* Import with Claude Button */}
        <button
          onClick={onOpenClaudeImport}
          className="flex items-center gap-1.5 h-8 px-3 text-[13px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded transition-colors cursor-pointer"
          title="Import customer datasets via Claude AI JSON ingestion"
        >
          <Sparkles size={13} className="text-indigo-600 animate-pulse" />
          <span>Import with Claude</span>
        </button>

        {/* Playbooks button */}
        <button
          onClick={onOpenPlaybooks}
          className="flex items-center gap-1.5 h-8 px-3 text-[13px] font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded transition-colors cursor-pointer"
        >
          Playbooks
        </button>

        {/* Refresh */}
        <button
          className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw size={13} />
        </button>

        {/* Notifications */}
        <NotificationsPanel />

        {/* Timestamp */}
        <div className="text-[10px] font-mono text-slate-500 border-l border-slate-200 pl-3 hidden xl:block font-medium">
          {now}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">
          AX
        </div>
      </div>
    </header>
  );
}
