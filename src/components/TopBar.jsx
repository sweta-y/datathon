import { RefreshCw } from 'lucide-react';
import LiveTicker from './LiveTicker';
import NotificationsPanel from './NotificationsPanel';
import SearchBar from './SearchBar';

export default function TopBar({ onOpenPlaybooks, onSelectCustomer }) {
  const now = new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <header className="fixed top-0 left-56 right-0 h-14 bg-surface border-b border-border flex items-center justify-between px-6 z-10">
      {/* Left: title + live ticker */}
      <div className="flex items-center gap-5 min-w-0">
        <div className="flex-shrink-0">
          <h1 className="text-base font-bold text-white leading-none">Churn Prediction</h1>
          <p className="text-[10px] font-mono text-dim mt-0.5 uppercase tracking-widest">
            Executive Dashboard
          </p>
        </div>
        <div className="hidden lg:block border-l border-border pl-5 min-w-0 flex-1">
          <LiveTicker />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Live search */}
        <SearchBar onSelect={onSelectCustomer} />

        {/* Playbooks button */}
        <button
          onClick={onOpenPlaybooks}
          className="flex items-center gap-1.5 h-8 px-3 text-[10px] font-mono uppercase tracking-wider text-violet border border-violet/40 rounded-sm hover:bg-violet/10 transition-colors"
        >
          Playbooks
        </button>

        {/* Refresh */}
        <button className="w-8 h-8 flex items-center justify-center border border-border rounded-sm text-dim hover:text-violet hover:border-violet/40 transition-colors">
          <RefreshCw size={13} />
        </button>

        {/* Notifications */}
        <NotificationsPanel />

        {/* Timestamp */}
        <div className="text-[9px] font-mono text-dim border-l border-border pl-3 hidden xl:block">
          {now}
        </div>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-sm bg-violet/20 border border-violet/40 flex items-center justify-center text-[10px] font-bold text-violet">
          AX
        </div>
      </div>
    </header>
  );
}
