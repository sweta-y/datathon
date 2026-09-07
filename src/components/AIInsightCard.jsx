import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, Zap, Lightbulb } from 'lucide-react';

export default function AIInsightCard({ onOpenPlaybooks }) {
  const INSIGHTS = [
    {
      id: 1,
      tag: 'Critical Impact',
      tagBg: 'bg-rose-50 text-rose-700 border-rose-200',
      title: 'Month-to-Month + Fiber Optic Overlap',
      body: '68% of high-risk customers are on Month-to-Month contracts with Fiber Optic. Competitor pricing causes a 3.4x higher churn rate in month 2.',
      impact: '+$420K Revenue Save Potential',
    },
    {
      id: 2,
      tag: 'High Impact',
      tagBg: 'bg-amber-50 text-amber-700 border-amber-200',
      title: 'Electronic Check Payment Failures',
      body: 'Accounts paying via Electronic Check experience 2.1x more involuntary churn due to billing renewal bounces in days 15–30.',
      impact: '124 Accounts Targetable',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="panel p-5 bg-gradient-to-r from-white via-indigo-50/30 to-sky-50/40 border border-indigo-100 shadow-sm relative overflow-hidden"
    >
      {/* Subtle background glow pill */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                AI Churn Insights & Recommendations
              </h2>
              <span className="text-[13px] font-mono font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded">
                Real-time ML synthesis
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Automated pattern detection from 19 customer features and machine learning importance drivers.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenPlaybooks}
          className="hidden sm:flex items-center gap-1.5 text-[13px] font-mono font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3.5 py-1.5 rounded transition-colors cursor-pointer"
        >
          <Zap size={14} />
          <span>Deploy playbooks</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Insight Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {INSIGHTS.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/80 rounded-md p-4 shadow-sm hover:border-indigo-200 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[13px] font-mono font-semibold px-2.5 py-0.5 border rounded ${item.tagBg}`}>
                {item.tag}
              </span>
              <span className="text-[13px] font-mono font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={13} />
                {item.impact}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              {item.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Recommendation Action Strip */}
      <div className="flex items-center justify-between p-3.5 bg-white border border-indigo-100 rounded-md text-sm">
        <div className="flex items-center gap-2.5 text-slate-700 font-medium">
          <Lightbulb size={18} className="text-amber-500 flex-shrink-0" />
          <span>
            <strong>Recommended action:</strong> Auto-trigger <em>PB-02 (20% Annual Contract Discount)</em> for all fiber optic accounts with tenure under 12 months.
          </span>
        </div>
        <button
          onClick={onOpenPlaybooks}
          className="text-sm font-mono font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer whitespace-nowrap ml-3"
        >
          Execute strategy <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
