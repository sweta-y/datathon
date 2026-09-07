import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Zap, ArrowLeft, CheckCircle2 } from 'lucide-react';
import ThreeBackground from './ThreeBackground';

export default function SignupPage({ onSignupSuccess, onSwitchToLogin, onNavigateHome }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password && confirmPassword && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSignupSuccess();
    }, 450);
  };

  const handleFillDemo = () => {
    setName('Alex Vance');
    setEmail('alex.vance@enterprise.ai');
    setPassword('SecurePassword2026!');
    setConfirmPassword('SecurePassword2026!');
  };

  return (
    <div className="relative min-h-screen w-full bg-void bg-grid-void text-slate-800 flex flex-col justify-between overflow-y-auto font-sans selection:bg-sky-100 selection:text-slate-900">
      {/* Interactive 3D Canvas in background */}
      <ThreeBackground />

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-white/40 pointer-events-none z-[1]" />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs font-mono text-dim hover:text-slate-900 transition-colors cursor-pointer group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Landing</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-sky-50 border border-sky-200 rounded-sm flex items-center justify-center glow-violet">
            <Zap size={14} className="text-sky-600" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900">ChurnLens</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-6 py-6 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="panel border-border glow-cyan bg-white rounded-sm p-8 shadow-sm relative overflow-hidden"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-sky-600" />

          {/* Card Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-mono text-sky-700 bg-sky-50 border border-sky-200 uppercase tracking-widest mb-3">
              <CheckCircle2 size={11} className="text-sky-600" /> Enterprise Registration
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
              Create ML Workspace
            </h1>
            <p className="text-xs text-subtle font-normal">
              Deploy predictive churn intelligence for your organization.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name Field */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-dim mb-1">
                Full Name
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Alex Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-border rounded-sm pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-dim focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 transition-all font-mono"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-dim mb-1">
                Organization Email
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="alex@enterprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-border rounded-sm pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-dim focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-dim mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-border rounded-sm pl-9 pr-9 py-2 text-xs text-slate-800 placeholder-dim focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dim hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-dim mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-border rounded-sm pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-dim focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 transition-all font-mono"
                />
              </div>
            </div>

            {/* Quick Demo Fill & Terms */}
            <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
              <label className="flex items-center gap-2 text-[10px] text-dim cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-sky-600 rounded-sm" />
                <span>Agree to enterprise terms</span>
              </label>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[10px] font-mono text-sky-700 hover:text-sky-800 underline decoration-sky-300 cursor-pointer"
              >
                Auto-fill
              </button>
            </div>

            {/* Magnetic/Glow Submit Button */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 text-xs font-mono font-bold tracking-wider uppercase text-white bg-sky-600 rounded-sm hover:bg-sky-700 transition-all shadow-sm flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Setting up Workspace...' : 'Create Account & Enter'}</span>
              <ArrowRight size={14} className="text-white group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          {/* Switch to Login */}
          <div className="mt-5 pt-4 border-t border-border text-center">
            <p className="text-xs text-dim">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-sky-700 font-semibold hover:text-sky-800 underline cursor-pointer ml-1"
              >
                Sign In
              </button>
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-[10px] font-mono text-dim">
        ChurnLens AI Platform · Automated Provisioning Engine
      </footer>
    </div>
  );
}
