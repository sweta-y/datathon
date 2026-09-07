import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, Zap, Cpu, CheckCircle } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 1, type: 'alert',  icon: AlertTriangle, color: '#FF4FD8', title: 'Score Spike',       body: 'C-00412 Meridian Healthcare jumped to 94',     time: '2m ago',  read: false },
  { id: 2, type: 'action', icon: Zap,           color: '#7C5CFF', title: 'Playbook Triggered', body: 'PB-04 deployed for NovaTech Systems',           time: '15m ago', read: false },
  { id: 3, type: 'alert',  icon: AlertTriangle, color: '#FF4FD8', title: 'Payment Failure',   body: 'Apex Logistics — 2nd failure this month',       time: '31m ago', read: false },
  { id: 4, type: 'model',  icon: Cpu,           color: '#22F0D8', title: 'Model Retrained',    body: 'Accuracy improved from 93.9% → 94.3%',         time: '1h ago',  read: true  },
  { id: 5, type: 'action', icon: Zap,           color: '#7C5CFF', title: 'Campaign Sent',      body: '124 at-risk customers received retention email','time': '2h ago', read: true  },
];

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(NOTIFICATIONS);
  const ref = useRef(null);

  const unread = notes.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function markAllRead() {
    setNotes((n) => n.map((x) => ({ ...x, read: true })));
  }

  function dismiss(id) {
    setNotes((n) => n.filter((x) => x.id !== id));
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative w-8 h-8 flex items-center justify-center border rounded-sm transition-colors ${
          open ? 'border-magenta/50 text-magenta bg-magenta/10' : 'border-border text-dim hover:text-magenta hover:border-magenta/40'
        }`}
      >
        <Bell size={13} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-magenta text-[8px] font-bold text-black flex items-center justify-center font-mono">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 w-80 bg-surface border border-border rounded-sm shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Notifications</span>
                {unread > 0 && (
                  <span className="bg-magenta/15 text-magenta text-[9px] font-mono px-1.5 py-0.5 rounded-sm border border-magenta/30">
                    {unread} new
                  </span>
                )}
              </div>
              <button onClick={markAllRead} className="text-[9px] font-mono text-dim hover:text-violet transition-colors uppercase tracking-wider">
                Mark all read
              </button>
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto divide-y divide-border">
              {notes.length === 0 ? (
                <div className="flex flex-col items-center py-8 gap-2">
                  <CheckCircle size={20} className="text-cyan" />
                  <span className="text-xs font-mono text-dim">All caught up!</span>
                </div>
              ) : (
                notes.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02] ${!n.read ? 'bg-white/[0.015]' : ''}`}
                    >
                      <div className="w-6 h-6 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${n.color}15`, border: `1px solid ${n.color}30` }}>
                        <Icon size={11} style={{ color: n.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-semibold text-white truncate">{n.title}</span>
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-magenta flex-shrink-0" />}
                        </div>
                        <p className="text-[10px] text-dim leading-relaxed">{n.body}</p>
                        <span className="text-[9px] font-mono text-dim/60 mt-0.5 block">{n.time}</span>
                      </div>
                      <button onClick={() => dismiss(n.id)} className="text-dim hover:text-white flex-shrink-0 mt-0.5 transition-colors">
                        <X size={11} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-border bg-panel">
              <button className="text-[9px] font-mono text-violet hover:text-violet/80 transition-colors uppercase tracking-wider">
                View all activity →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
