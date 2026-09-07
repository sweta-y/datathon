import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import KPICard from './components/KPICard';
import ChurnTrendChart from './components/ChurnTrendChart';
import RiskDistributionChart from './components/RiskDistributionChart';
import ChurnBySegmentChart from './components/ChurnBySegmentChart';
import PredictiveRadar from './components/PredictiveRadar';
import CustomerTable from './components/CustomerTable';
import CustomerModal from './components/CustomerModal';
import ModelPerformancePanel from './components/ModelPerformancePanel';
import RetentionPlaybooks from './components/RetentionPlaybooks';
import FilterBar from './components/FilterBar';
import CohortHeatmap from './components/CohortHeatmap';
import FeatureImportanceChart from './components/FeatureImportanceChart';
import ChurnGauge from './components/ChurnGauge';
import AlertBanner from './components/AlertBanner';
import { kpis } from './data/mockData';
import { fmt } from './utils/formatters';
import { Users, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

const KPI_CONFIG = [
  { label: 'Total Customers',  value: fmt.number(kpis.totalCustomers),  delta: null,                              color: 'cyan',    icon: Users,         index: 0 },
  { label: 'Churn Rate (MoM)', value: fmt.pct(kpis.churnRate),          delta: `${kpis.churnRateDelta.toFixed(1)}%`, deltaLabel: 'vs last month', color: 'magenta', icon: TrendingUp,    index: 1 },
  { label: 'At-Risk Customers',value: fmt.number(kpis.atRiskCount),     delta: `+${kpis.atRiskDelta}`,            deltaLabel: 'added this week', color: 'amber',   icon: AlertTriangle, index: 2 },
  { label: 'Revenue at Risk',  value: fmt.currency(kpis.revenueAtRisk), delta: fmt.currency(kpis.revenueAtRiskDelta), deltaLabel: 'MoM increase', color: 'violet',  icon: DollarSign,    index: 3 },
];

function getInitialView() {
  if (typeof window === 'undefined') return 'landing';
  const path = window.location.pathname.toLowerCase();
  if (path.startsWith('/login')) return 'login';
  if (path.startsWith('/signup')) return 'signup';
  if (path.startsWith('/dashboard')) return 'dashboard';
  return 'landing';
}

const PAGE_TRANSITION = {
  initial: { opacity: 0, scale: 0.992, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.992, y: -10 },
  transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
};

export default function App() {
  const [currentView, setCurrentView]           = useState(getInitialView);
  const [playbooksOpen, setPlaybooksOpen]       = useState(false);
  const [filters, setFilters]                   = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modelInfo, setModelInfo]               = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/model-info')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setModelInfo(data);
      })
      .catch((err) => {
        console.warn('Could not fetch from http://127.0.0.1:5000/model-info, using fallback data:', err);
      });
  }, []);

  // Sync with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view, path) => {
    setCurrentView(view);
    if (window.history?.pushState) {
      window.history.pushState({}, '', path);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {/* 1. HERO LANDING PAGE */}
      {currentView === 'landing' && (
        <motion.div
          key="landing"
          {...PAGE_TRANSITION}
          className="w-full min-h-screen bg-void"
        >
          <LandingPage
            onNavigateSignup={() => navigateTo('signup', '/signup')}
            onNavigateLogin={() => navigateTo('login', '/login')}
            modelInfo={modelInfo}
          />
        </motion.div>
      )}

      {/* 2. LOGIN PAGE */}
      {currentView === 'login' && (
        <motion.div
          key="login"
          {...PAGE_TRANSITION}
          className="w-full min-h-screen bg-void"
        >
          <LoginPage
            onLoginSuccess={() => navigateTo('dashboard', '/dashboard')}
            onSwitchToSignup={() => navigateTo('signup', '/signup')}
            onNavigateHome={() => navigateTo('landing', '/landing')}
          />
        </motion.div>
      )}

      {/* 3. SIGNUP PAGE */}
      {currentView === 'signup' && (
        <motion.div
          key="signup"
          {...PAGE_TRANSITION}
          className="w-full min-h-screen bg-void"
        >
          <SignupPage
            onSignupSuccess={() => navigateTo('dashboard', '/dashboard')}
            onSwitchToLogin={() => navigateTo('login', '/login')}
            onNavigateHome={() => navigateTo('landing', '/landing')}
          />
        </motion.div>
      )}

      {/* 4. MAIN PREDICTIVE ANALYTICS DASHBOARD */}
      {currentView === 'dashboard' && (
        <motion.div
          key="dashboard"
          {...PAGE_TRANSITION}
          className="min-h-screen bg-void bg-grid-void"
        >
          <Sidebar
            modelInfo={modelInfo}
            onNavigateHome={() => navigateTo('landing', '/landing')}
            onNavigateLogin={() => navigateTo('login', '/login')}
          />
          <TopBar
            onOpenPlaybooks={() => setPlaybooksOpen(true)}
            onSelectCustomer={setSelectedCustomer}
          />
          <RetentionPlaybooks
            open={playbooksOpen}
            onClose={() => setPlaybooksOpen(false)}
          />
          <CustomerModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />

          <main className="ml-56 pt-14 min-h-screen">
            <div className="p-6 space-y-4">

              {/* Alert banner */}
              <AlertBanner />

              {/* Filter bar */}
              <FilterBar onFilterChange={setFilters} />

              {/* KPI row */}
              <div className="grid grid-cols-4 gap-4">
                {KPI_CONFIG.map((kpi) => <KPICard key={kpi.label} {...kpi} />)}
              </div>

              {/* Churn trend */}
              <ChurnTrendChart />

              {/* Row 3: Gauge + charts + model */}
              <div className="grid grid-cols-5 gap-4">
                <ChurnGauge />
                <RiskDistributionChart />
                <ChurnBySegmentChart />
                <PredictiveRadar />
                <ModelPerformancePanel modelInfo={modelInfo} />
              </div>

              {/* Row 4: SHAP + cohort */}
              <div className="grid grid-cols-2 gap-4">
                <FeatureImportanceChart featureImportance={modelInfo?.feature_importance} />
                <CohortHeatmap />
              </div>

              {/* Customer table */}
              <CustomerTable filters={filters} onSelect={setSelectedCustomer} />

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 pb-4">
                <span className="text-[9px] font-mono text-dim uppercase tracking-widest">
                  ChurnLens v2.4.1 · RandomForestClassifier (Accuracy: {modelInfo?.accuracy ?? 79.21}%) · ML Server: http://127.0.0.1:5000
                </span>
                <span className="text-[9px] font-mono text-dim">
                  Refreshes every 15 min · Next: 12:45 IST
                </span>
              </div>
            </div>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
