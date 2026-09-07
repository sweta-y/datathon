import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, ArrowLeft, ShieldCheck } from 'lucide-react';
import ThreeBackground from './ThreeBackground';

export default function LoginPage({ onLoginSuccess, onSwitchToSignup, onNavigateHome }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate swift authenticating experience
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 450);
  };

  const handleFillDemo = () => {
    setEmail('lead.analyst@churnlens.ai');
    setPassword('••••••••••••');
  };

  return (
    <div className="relative min-h-screen w-full bg-void bg-grid-void text-white flex flex-col justify-between overflow-hidden font-sans selection:bg-violet selection:text-white">
      {/* Interactive 3D Canvas in background */}
      <ThreeBackground />

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-void/50 to-void pointer-events-none z-[1]" />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs font-mono text-dim hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Landing</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-violet/20 border border-violet/40 rounded-sm flex items-center justify-center glow-violet">
            <Zap size={14} className="text-violet" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">ChurnLens</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-6 py-8 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="panel border-border glow-violet bg-surface/90 backdrop-blur-md rounded-sm p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet via-cyan to-magenta" />

          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-mono text-cyan bg-cyan/10 border border-cyan/30 uppercase tracking-widest mb-3">
              <ShieldCheck size={11} className="text-cyan" /> Secure ML Portal
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
              Welcome Back
            </h1>
            <p className="text-xs text-subtle font-normal">
              Enter your credentials to access the churn prediction platform.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-dim mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-panel border border-border rounded-sm pl-9 pr-3 py-2.5 text-xs text-white placeholder-dim focus:outline-none focus:border-violet/60 focus:ring-1 focus:ring-violet/30 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-dim">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[10px] font-mono text-violet hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-panel border border-border rounded-sm pl-9 pr-9 py-2.5 text-xs text-white placeholder-dim focus:outline-none focus:border-violet/60 focus:ring-1 focus:ring-violet/30 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dim hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            {/* Quick Demo Fill */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-[11px] text-dim cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-violet rounded-sm" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[10px] font-mono text-cyan hover:text-cyan/80 underline decoration-cyan/40 cursor-pointer"
              >
                Auto-fill Demo
              </button>
            </div>

            {/* Magnetic/Glow Submit Button */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 text-xs font-mono font-bold tracking-wider uppercase text-black bg-gradient-to-r from-cyan via-white to-cyan rounded-sm hover:opacity-95 transition-all shadow-[0_0_24px_rgba(34,240,216,0.3)] flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight size={14} className="text-black group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          {/* Switch to Signup */}
          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-xs text-dim">
              Don't have an enterprise account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-violet font-semibold hover:text-violet/80 underline cursor-pointer ml-1"
              >
                Create Account
              </button>
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-[10px] font-mono text-dim">
        ChurnLens AI Platform · End-to-end Encrypted Session
      </footer>
    </div>
  );
}
