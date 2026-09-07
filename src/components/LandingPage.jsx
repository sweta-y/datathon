import { motion } from 'framer-motion';
import { ArrowRight, Zap, ShieldAlert, Cpu, Activity, Sparkles, BarChart3, LogIn, UserPlus } from 'lucide-react';
import ThreeBackground from './ThreeBackground';

export default function LandingPage({ onNavigateLogin, onNavigateSignup, modelInfo }) {
  const accuracy = modelInfo?.accuracy ?? 79.21;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const METRICS = [
    { label: 'Model Accuracy', val: `${accuracy}%`, icon: Cpu, color: 'text-cyan', border: 'border-cyan/30', bg: 'bg-cyan/10' },
    { label: 'ML Inference', val: '< 20ms', icon: Zap, color: 'text-violet', border: 'border-violet/30', bg: 'bg-violet/10' },
    { label: 'Revenue Monitored', val: '$2.84M', icon: Activity, color: 'text-magenta', border: 'border-magenta/30', bg: 'bg-magenta/10' },
    { label: 'Retention Playbooks', val: '4 Active', icon: ShieldAlert, color: 'text-amber', border: 'border-amber/30', bg: 'bg-amber/10' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-void bg-grid-void text-white flex flex-col justify-between overflow-x-hidden font-sans selection:bg-violet selection:text-white">
      {/* High-Performance 3D Three.js Interactive Background */}
      <ThreeBackground />

      {/* Subtle radial lighting overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-void/40 to-void pointer-events-none z-[1]" />

      {/* Top Navigation - Responsive for Desktop & Mobile */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-violet/20 border border-violet/40 rounded-sm flex items-center justify-center glow-violet">
            <Zap size={15} className="text-violet" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5 sm:gap-2">
              ChurnLens
              <span className="text-[8px] sm:text-[9px] font-mono text-cyan bg-cyan/10 border border-cyan/30 px-1.5 py-0.5 rounded-sm uppercase tracking-widest">
                v2.4.1
              </span>
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono text-dim tracking-wider uppercase">
              Predictive Retention Intelligence
            </div>
          </div>
        </div>

        {/* Right Nav Links */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 border border-border bg-surface/80 backdrop-blur-sm rounded-sm text-[11px] font-mono mr-1">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <span className="text-dim">RandomForest Engine:</span>
            <span className="text-cyan font-bold">{accuracy}% Acc</span>
          </div>

          <button
            onClick={onNavigateLogin}
            className="px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-mono text-subtle hover:text-white hover:bg-white/5 transition-colors rounded-sm flex items-center gap-1 cursor-pointer"
          >
            <LogIn size={13} className="text-cyan" />
            <span>Sign In</span>
          </button>

          <button
            onClick={onNavigateSignup}
            className="px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-mono text-cyan bg-cyan/10 border border-cyan/30 hover:bg-cyan/20 transition-all rounded-sm flex items-center gap-1 glow-cyan cursor-pointer"
          >
            <UserPlus size={13} className="text-cyan" />
            <span>Sign Up</span>
          </button>

          <button
            onClick={onNavigateSignup}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono font-medium text-white bg-violet/20 border border-violet/50 hover:bg-violet hover:border-violet transition-all duration-200 rounded-sm flex items-center gap-1.5 glow-violet group cursor-pointer"
          >
            <span>Launch</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col justify-center items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center max-w-4xl"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-sm text-[10px] sm:text-xs font-mono uppercase tracking-widest text-cyan bg-cyan/10 border border-cyan/30 glow-cyan">
              <Sparkles size={12} className="text-cyan animate-pulse" />
              Machine Learning Churn Analytics
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-4 sm:mb-6"
          >
            Predict Churn{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet via-cyan to-magenta">
              Before It Happens
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-lg md:text-xl text-subtle max-w-2xl font-normal leading-relaxed mb-8 sm:mb-10 px-2"
          >
            Empower your enterprise with real-time gradient boosted inference, granular SHAP explainability, and automated retention playbooks that safeguard customer revenue.
          </motion.p>

          {/* CTA Buttons — Responsive layout */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto px-4 sm:px-0"
          >
            <button
              onClick={onNavigateSignup}
              className="w-full sm:w-auto px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-mono font-bold tracking-wider text-black bg-gradient-to-r from-cyan via-white to-cyan rounded-sm hover:opacity-90 transition-all duration-200 shadow-[0_0_30px_rgba(34,240,216,0.35)] flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>ENTER DASHBOARD</span>
              <ArrowRight size={15} className="text-black group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={onNavigateLogin}
              className="w-full sm:w-auto px-5 py-3.5 sm:py-4 text-xs font-mono font-medium text-dim hover:text-white border border-border hover:border-violet/50 bg-surface/60 backdrop-blur-sm rounded-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <BarChart3 size={14} className="text-violet" />
              <span>Sign In to Account</span>
            </button>
          </motion.div>

          {/* Key Metrics Pills */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 w-full mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-border/80"
          >
            {METRICS.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className={`p-3 sm:p-3.5 border ${m.border} ${m.bg} bg-opacity-40 backdrop-blur-sm rounded-sm text-left`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <Icon size={13} className={m.color} />
                    <span className="text-[9px] sm:text-[10px] font-mono text-dim uppercase tracking-wider">{m.label}</span>
                  </div>
                  <div className={`text-base sm:text-lg font-bold font-mono ${m.color}`}>{m.val}</div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[9px] sm:text-[10px] font-mono text-dim">
        <div>
          ChurnLens AI Platform · Dark Neon Terminal Edition · Model Server: http://127.0.0.1:5000
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan" /> 3D Engine Active (60 FPS)
          </span>
          <span>© 2026 Datathon Intelligence</span>
        </div>
      </footer>
    </div>
  );
}
