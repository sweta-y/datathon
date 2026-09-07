import { ArrowRight, Lightbulb, Sparkles } from 'lucide-react';

export default function AIRecommendationSection({ filters = {}, globalSearch = '' }) {
  const hasFilters = Object.keys(filters).length > 0;
  const scope = globalSearch
    ? `Search results for "${globalSearch}"`
    : hasFilters
      ? 'The current filtered customer segment'
      : 'High-risk customers';

  return (
    <section className="panel border border-sky-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center flex-shrink-0">
            <Sparkles size={17} />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900">AI retention recommendation</h2>
            <p className="text-sm text-slate-500 mt-1">Prioritized for {scope.toLowerCase()}.</p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-semibold text-sky-700 bg-sky-50 border border-sky-100 px-2 py-1 rounded flex-shrink-0">
          Model-guided
        </span>
      </div>

      <div className="mt-4 flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-md">
        <Lightbulb size={17} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">Offer annual-plan incentives to month-to-month fiber customers.</p>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            This segment combines short contract commitment with elevated churn exposure and is a strong candidate for targeted retention outreach.
          </p>
        </div>
        <button className="text-xs font-mono font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 flex-shrink-0 cursor-pointer">
          Review <ArrowRight size={13} />
        </button>
      </div>
    </section>
  );
}
