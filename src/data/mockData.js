// ─── Churn Trend (12 months) ────────────────────────────────────────────────
export const churnTrend = [
  { month: 'Oct', churnRate: 9.4, predicted: 9.2, retained: 90.6 },
  { month: 'Nov', churnRate: 10.1, predicted: 10.4, retained: 89.9 },
  { month: 'Dec', churnRate: 11.8, predicted: 11.5, retained: 88.2 },
  { month: 'Jan', churnRate: 13.2, predicted: 12.9, retained: 86.8 },
  { month: 'Feb', churnRate: 12.6, predicted: 13.1, retained: 87.4 },
  { month: 'Mar', churnRate: 14.9, predicted: 14.2, retained: 85.1 },
  { month: 'Apr', churnRate: 16.3, predicted: 15.8, retained: 83.7 },
  { month: 'May', churnRate: 15.1, predicted: 15.5, retained: 84.9 },
  { month: 'Jun', churnRate: 17.8, predicted: 17.2, retained: 82.2 },
  { month: 'Jul', churnRate: 18.4, predicted: 18.9, retained: 81.6 },
  { month: 'Aug', churnRate: 19.2, predicted: 19.6, retained: 80.8 },
  { month: 'Sep', churnRate: null, predicted: 22.1, retained: null },
];

// ─── Risk Distribution ───────────────────────────────────────────────────────
export const riskDistribution = [
  { label: 'High Risk', count: 847, pct: 18.4, color: '#E11D48' },
  { label: 'Medium Risk', count: 1432, pct: 31.1, color: '#D97706' },
  { label: 'Low Risk', count: 2323, pct: 50.5, color: '#059669' },
];

// ─── Churn by Segment ────────────────────────────────────────────────────────
export const churnBySegment = [
  { segment: 'Enterprise', actual: 8.2, predicted: 9.1 },
  { segment: 'Mid-Market', actual: 14.7, predicted: 16.2 },
  { segment: 'SMB', actual: 22.4, predicted: 24.8 },
  { segment: 'Starter', actual: 31.9, predicted: 34.5 },
  { segment: 'Trial', actual: 58.3, predicted: 61.2 },
];

// ─── Predictive Radar (churn drivers, 0-100 severity) ───────────────────────
export const radarData = [
  { driver: 'Support Calls', severity: 78 },
  { driver: 'Usage Drop', severity: 65 },
  { driver: 'Payment Issues', severity: 54 },
  { driver: 'Low Engagement', severity: 82 },
  { driver: 'Short Tenure', severity: 43 },
  { driver: 'Plan Downgrade', severity: 71 },
];

import realCustomers from './real_customers.json';

// ─── At-Risk Customers with Authentic Telco Dataset Records ─────────────────
// Sourced directly from telco_churn.csv with model predictions from Random Forest
export const atRiskCustomers = realCustomers;

// ─── KPI Summary ─────────────────────────────────────────────────────────────
export const kpis = {
  totalCustomers: 4602,
  churnRate: 19.2,
  atRiskCount: 847,
  revenueAtRisk: 2840000,
  churnRateDelta: +2.8,
  atRiskDelta: +124,
  revenueAtRiskDelta: +340000,
};

// ─── Retention Playbooks ───────────────────────────────────────────────────────
export const retentionPlaybooks = [
  {
    id: 'PB-01',
    name: 'Concierge Outreach',
    trigger: 'Score ≥ 85',
    impact: 'High',
    successRate: 68,
    avgRetention: 4.2,
    color: '#0284C7',
  },
  {
    id: 'PB-02',
    name: 'Discount Offer — 20%',
    trigger: 'Score 70–84, Price-sensitive',
    impact: 'Medium',
    successRate: 54,
    avgRetention: 6.8,
    color: '#0EA5E9',
  },
  {
    id: 'PB-03',
    name: 'Feature Unlock Trial',
    trigger: 'Low Engagement Flag',
    impact: 'Medium',
    successRate: 47,
    avgRetention: 8.1,
    color: '#D97706',
  },
  {
    id: 'PB-04',
    name: 'Executive Escalation',
    trigger: 'Enterprise + Score ≥ 80',
    impact: 'Critical',
    successRate: 71,
    avgRetention: 9.4,
    color: '#E11D48',
  },
];

// ─── Live ticker events ──────────────────────────────────────────────────────
export const tickerEvents = [
  { time: '11:55', msg: 'C-00412 Meridian Healthcare prediction confirmed: 86.0% Churn Risk', type: 'alert' },
  { time: '11:47', msg: 'Playbook PB-04 triggered for NovaTech Systems', type: 'action' },
  { time: '11:33', msg: 'RandomForest Model live on port 5000 (Accuracy: 79.21%)', type: 'model' },
  { time: '11:21', msg: 'C-00387 Apex Logistics: Electronic check payment flagged', type: 'alert' },
  { time: '11:09', msg: '3 new customers analyzed by ML inference engine', type: 'alert' },
  { time: '10:58', msg: 'C-00733 Vantage Media: Retention campaign dispatched', type: 'action' },
  { time: '10:45', msg: 'Model info retrieved: 10 feature importances loaded', type: 'model' },
];
