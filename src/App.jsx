import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './components/LandingPage';
import FilterDrawer from './components/FilterDrawer';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import KPICard from './components/KPICard';
import CustomerTable from './components/CustomerTable';
import CustomerModal from './components/CustomerModal';
import ModelPerformancePanel from './components/ModelPerformancePanel';
import RetentionPlaybooks from './components/RetentionPlaybooks';
// FilterBar import removed (unused)
import AlertBanner from './components/AlertBanner';
import AnalyticsCarousel from './components/AnalyticsCarousel';
import AIInsightCard from './components/AIInsightCard';
import AIRecommendationSection from './components/AIRecommendationSection';
import ClaudeImportModal from './components/ClaudeImportModal';
import FeatureImportanceChart from './components/FeatureImportanceChart';
import { fmt } from './utils/formatters';
import { Users, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

const KPI_CONFIG = [
  {
    label: 'Total customers',
    value: fmt.number(7043),
    delta: null,
    context: 'All records in Telco dataset',
    color: 'cyan',
    icon: Users,
    index: 0,
  },
  {
    label: 'Churn rate',
    value: '26.5%',
    delta: null, // Omitted: single historical dataset snapshot; no fabricated trend comparison
    context: '1,869 churned of 7,043 accounts',
    color: 'magenta',
    icon: TrendingUp,
    index: 1,
  },
  {
    label: 'High-risk customers',
    value: fmt.number(1423),
    delta: null, // Omitted: no fabricated weekly delta
    context: 'Model prediction probability ≥ 70%',
    color: 'amber',
    icon: AlertTriangle,
    index: 2,
  },
  {
    label: 'Revenue at risk',
    value: fmt.currency(109213),
    delta: null, // Omitted: no fabricated MoM delta
    context: 'Monthly billing rate across high-risk accounts',
    color: 'violet',
    icon: DollarSign,
    index: 3,
  },
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
  const [currentView, setCurrentView] = useState(getInitialView);
  const [playbooksOpen, setPlaybooksOpen] = useState(false);
  const [claudeImportOpen, setClaudeImportOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  // active filter count passed to TopBar
  const activeFilterCount = Object.values(filters).filter((v, i) => {
    // FilterBar defaults (including Segment) but we now only care about real filters
    const keys = ['risk', 'contract', 'internet', 'payment', 'tenureRange', 'chargesRange'];
    const key = Object.keys(filters)[i];
    if (!keys.includes(key)) return false;
    const defaults = {
      risk: 'All Risk Levels',
      contract: 'All Contracts',
      internet: 'All Internet Services',
      payment: 'All Payment Methods',
      tenureRange: 'All Tenures',
      chargesRange: 'All Charges',
    };
    return v !== defaults[key];
  }).length;

  // later in JSX replace FilterBar with FilterDrawer and pass props
  // Inside main content replace line 199 (FilterBar) with:
  // <FilterDrawer isOpen={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)} appliedFilters={filters} onApplyFilters={setFilters} />
  // Also pass activeFilterCount and onOpenFilters to TopBar (add props).

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
            onOpenClaudeImport={() => setClaudeImportOpen(true)}
            globalSearchQuery={globalSearchQuery}
            onGlobalSearchChange={setGlobalSearchQuery}
            modelInfo={modelInfo}
            activeFilterCount={activeFilterCount}
            onOpenFilters={() => setFilterDrawerOpen(true)}
          />
          <RetentionPlaybooks
            open={playbooksOpen}
            onClose={() => setPlaybooksOpen(false)}
          />
          <CustomerModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
          <ClaudeImportModal
            isOpen={claudeImportOpen}
            onClose={() => setClaudeImportOpen(false)}
          />

          <main className="ml-0 lg:ml-56 pt-14 min-h-screen" id="main-content">
            <div className="p-6 space-y-6">

              {/* 1. Top Bar Controls: Filters */}
               {/* Filter drawer - triggered via Filters button */}
               <FilterDrawer
                 isOpen={filterDrawerOpen}
                 onClose={() => setFilterDrawerOpen(false)}
                 appliedFilters={filters}
                 onApplyFilters={setFilters}
               />

              {/* 2. 4 KPI cards: Total Customers, Churn Rate, High-Risk Customers, Revenue at Risk */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {KPI_CONFIG.map((kpi) => <KPICard key={kpi.label} {...kpi} />)}
              </div>

              {/* 3. AI Insight / Alert banner */}
              <div className="space-y-4">
                <AlertBanner />
                <AIInsightCard modelInfo={modelInfo} onOpenPlaybooks={() => setPlaybooksOpen(true)} />
              </div>

              {/* 4. Analytics carousel */}
              <AnalyticsCarousel modelInfo={modelInfo} />

              {/* 5. Top At-Risk Customers table */}
              <CustomerTable
                filters={filters}
                onSelect={setSelectedCustomer}
                globalSearch={globalSearchQuery}
              />

              {/* AI Recommendation Section */}
              <AIRecommendationSection 
                filters={filters}
                globalSearch={globalSearchQuery}
              />

              {/* 6. Model Transparency & Architecture Section */}
              <ModelPerformancePanel modelInfo={modelInfo} />

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 pb-4">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                  ChurnLens v2.4.1 · RandomForestClassifier (Accuracy: {modelInfo?.accuracy ?? 79.21}%) · ML Server: http://127.0.0.1:5000
                </span>
                <span className="text-[9px] font-mono text-slate-400">
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
