import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tickerEvents } from '../data/mockData';
import { AlertTriangle, Zap, Cpu } from 'lucide-react';

const ICONS = {
  alert: { icon: AlertTriangle, color: '#FF4FD8' },
  action: { icon: Zap, color: '#7C5CFF' },
  model: { icon: Cpu, color: '#22F0D8' },
};

export default function LiveTicker() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((i) => (i + 1) % tickerEvents.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const evt = tickerEvents[activeIdx];
  const { icon: Icon, color } = ICONS[evt.type];

  return (
    <div className="flex items-center gap-3 overflow-hidden">
      {/* Label */}
      <div className="flex-shrink-0 flex items-center gap-1.5 bg-magenta/10 border border-magenta/30 px-2 py-1 rounded-sm">
        <span className="w-1 h-1 rounded-full bg-magenta animate-pulse-slow" />
        <span className="text-[9px] font-mono text-magenta uppercase tracking-widest">Live</span>
      </div>

      {/* Ticker message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-2 min-w-0"
        >
          <Icon size={11} style={{ color }} className="flex-shrink-0" />
          <span className="text-[10px] font-mono text-subtle truncate">{evt.msg}</span>
          <span className="text-[9px] font-mono text-dim flex-shrink-0">{evt.time}</span>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex-shrink-0 flex items-center gap-1 ml-2">
        {tickerEvents.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className="w-1 h-1 rounded-full transition-all"
            style={{
              backgroundColor: i === activeIdx ? '#7C5CFF' : '#2A2A2A',
              transform: i === activeIdx ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
