import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, PieChart, Cpu, FileText,
  Settings, Zap, ChevronRight, Home, LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Users, label: 'Customers' },
  { icon: PieChart, label: 'Segments' },
  { icon: Cpu, label: 'Models' },
  { icon: FileText, label: 'Reports' },
];

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <motion.button
      whileHover={{ x: 2 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all duration-150 group cursor-pointer ${
        active
          ? 'bg-sky-50 text-sky-700 border-l-2 border-sky-600'
          : 'text-subtle hover:text-slate-900 hover:bg-slate-50 border-l-2 border-transparent'
      }`}
    >
      <Icon size={16} className={active ? 'text-sky-600' : 'text-dim group-hover:text-subtle'} />
      <span>{label}</span>
      {active && <ChevronRight size={12} className="ml-auto text-sky-600" />}
    </motion.button>
  );
}

export default function Sidebar({ modelInfo, onNavigateHome, onNavigateLogin }) {
  const accuracy = modelInfo?.accuracy ?? 79.21;
  const precision = modelInfo?.precision ?? 63.73;
  const recall = modelInfo?.recall ?? 50.27;
  const f1 = precision && recall
    ? ((2 * precision * recall) / (precision + recall) / 100).toFixed(2)
    : '0.56';

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-surface border-r border-border hidden lg:flex flex-col z-20">
      {/* Logo — click to go home */}
      <div
        onClick={onNavigateHome}
        className="px-4 py-5 border-b border-border cursor-pointer hover:bg-slate-50 transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-sky-50 border border-sky-200 rounded-sm flex items-center justify-center group-hover:border-sky-600 transition-colors">
            <Zap size={14} className="text-sky-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 leading-none group-hover:text-sky-700 transition-colors">ChurnLens</div>
            <div className="text-[9px] text-dim mt-0.5">Predictive analytics</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        <div className="section-label px-3 mb-3">Main</div>
        <NavItem
          icon={Home}
          label="Hero Landing"
          active={false}
          onClick={onNavigateHome}
        />
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-4 border-t border-border space-y-0.5">
        <NavItem
          icon={LogOut}
          label="Sign Out"
          active={false}
          onClick={onNavigateLogin}
        />
        <NavItem icon={Settings} label="Settings" />
        <div className="mt-3 mx-1 p-2.5 bg-rose-50 border border-rose-200 rounded-sm">
          <div className="text-[9px] text-rose-700 mb-1">Model status</div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-slow" />
            <span className="text-xs text-slate-800">RandomForest Live</span>
          </div>
          <div className="text-[9px] text-dim mt-0.5 font-mono">
            Acc: {accuracy}% · F1: {f1}
          </div>
        </div>
      </div>
    </aside>
  );
}
