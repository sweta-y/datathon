import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BarChart2, Sparkles } from 'lucide-react';
import ChurnTrendChart from './ChurnTrendChart';
import RiskDistributionChart from './RiskDistributionChart';
import ChurnBySegmentChart from './ChurnBySegmentChart';
import PredictiveRadar from './PredictiveRadar';
import FeatureImportanceChart from './FeatureImportanceChart';
import CohortHeatmap from './CohortHeatmap';

export default function AnalyticsCarousel({ modelInfo }) {
  const [slideIndex, setSlideIndex] = useState(0);

  // Group charts into slides of 2 charts each
  const slides = [
    {
      id: 1,
      title: 'Monthly Overview & Risk Buckets',
      charts: [
        { id: 'trend', component: <ChurnTrendChart key="trend" /> },
        { id: 'risk', component: <RiskDistributionChart key="risk" /> },
      ],
    },
    {
      id: 2,
      title: 'Segment Analysis & Driver Radar',
      charts: [
        { id: 'segment', component: <ChurnBySegmentChart key="segment" /> },
        { id: 'radar', component: <PredictiveRadar key="radar" /> },
      ],
    },
    {
      id: 3,
      title: 'SHAP Explainability & Cohort Matrix',
      charts: [
        {
          id: 'shap',
          component: (
            <FeatureImportanceChart
              key="shap"
              featureImportance={modelInfo?.feature_importance}
            />
          ),
        },
        { id: 'cohort', component: <CohortHeatmap key="cohort" /> },
      ],
    },
  ];

  const currentSlide = slides[slideIndex];

  const handleNext = () => {
    setSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="space-y-3">
      {/* Carousel Header Controls */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <BarChart2 size={14} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-none">
              Analytics carousel
            </h2>
            <p className="text-[13px] font-mono text-slate-500 mt-1">
              Slide {slideIndex + 1} of {slides.length} — {currentSlide.title}
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5 mr-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setSlideIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  slideIndex === idx
                    ? 'w-6 bg-indigo-600'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-indigo-300 transition-colors flex items-center justify-center shadow-sm cursor-pointer"
            title="Previous 2 Charts"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-indigo-300 transition-colors flex items-center justify-center shadow-sm cursor-pointer"
            title="Next 2 Charts"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Animated 2-Chart Slide Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slideIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {currentSlide.charts.map((c) => c.component)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
