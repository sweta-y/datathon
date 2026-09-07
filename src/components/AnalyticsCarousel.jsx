import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
import ChurnTrendChart from './ChurnTrendChart';
import RiskDistributionChart from './RiskDistributionChart';
import PredictiveRadar from './PredictiveRadar';
import ChurnBySegmentChart from './ChurnBySegmentChart';
import FeatureImportanceChart from './FeatureImportanceChart';
import CohortHeatmap from './CohortHeatmap';

export default function AnalyticsCarousel({ modelInfo }) {
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef(null);

  // Grouped exactly as requested:
  // Page 1: Churn Rate Overview + Customer Risk Distribution
  // Page 2: Actual vs Predicted Churn + Segment-wise Churn
  // Page 3: Feature Importance + Cohort Analysis
  const pages = [
    {
      page: 1,
      title: 'Churn Rate Overview & Customer Risk Distribution',
      charts: [
        { id: 'churn-trend', component: <ChurnTrendChart key="churn-trend" /> },
        { id: 'risk-distribution', component: <RiskDistributionChart key="risk-distribution" /> },
      ],
    },
    {
      page: 2,
      title: 'Actual vs Predicted Churn & Segment-wise Churn',
      charts: [
        { id: 'predictive-radar', component: <PredictiveRadar key="predictive-radar" /> },
        { id: 'churn-by-segment', component: <ChurnBySegmentChart key="churn-by-segment" /> },
      ],
    },
    {
      page: 3,
      title: 'Feature Importance & Cohort Analysis',
      charts: [
        {
          id: 'feature-importance',
          component: (
            <FeatureImportanceChart
              key="feature-importance"
              featureImportance={modelInfo?.feature_importance}
            />
          ),
        },
        { id: 'cohort-heatmap', component: <CohortHeatmap key="cohort-heatmap" /> },
      ],
    },
  ];

  const totalPages = pages.length;
  const currentGroup = pages[currentPage - 1];

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Keyboard navigation: ArrowLeft / ArrowRight
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Analytics charts carousel"
      className="space-y-3 focus:outline-none focus:ring-1 focus:ring-sky-300 rounded-md"
    >
      {/* Carousel Header Controls */}
      <div className="flex items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded bg-sky-50 border border-sky-200 flex items-center justify-center">
            <BarChart2 size={14} className="text-sky-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-none truncate">
              Analytics carousel
            </h2>
            <p className="text-[13px] font-mono text-slate-500 mt-1">
              Page <strong className="text-sky-700">{currentPage} of {totalPages}</strong> — {currentGroup.title}
            </p>
          </div>
        </div>

        {/* Navigation Buttons & Page Indicators */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Indicator Pills */}
          <div className="flex items-center gap-1.5 mr-2">
            {pages.map((p) => (
              <button
                key={p.page}
                onClick={() => setCurrentPage(p.page)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentPage === p.page
                    ? 'w-6 bg-sky-600'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to page ${p.page} of ${totalPages}`}
                title={`Page ${p.page}: ${p.title}`}
              />
            ))}
          </div>

          <span className="text-[13px] font-mono text-slate-600 font-semibold px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
            {currentPage} of {totalPages}
          </span>

          <button
            onClick={handlePrev}
            disabled={currentPage <= 1}
            aria-label="Previous page of charts"
            className="w-8 h-8 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-sky-300 transition-colors flex items-center justify-center shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            aria-label="Next page of charts"
            className="w-8 h-8 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-sky-300 transition-colors flex items-center justify-center shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 2 Charts Grid with simple, smooth transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0"
        >
          {currentGroup.charts.map((c) => c.component)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
