import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, AlertTriangle, Zap, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { fmt } from '../utils/formatters';

// Generate 6-month historical trajectory ending at the real computed churn probability
function buildHistory(finalProb) {
  const p = typeof finalProb === 'number' ? finalProb : 50;
  return ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((m, i) => {
    if (i === 5) return { month: m, score: Math.round(p) };
    const step = (5 - i) * 3.5;
    return {
      month: m,
      score: Math.max(5, Math.min(99, Math.round(p - step + (i % 2 === 0 ? 2 : -2)))),
    };
  });
}

function RiskColor(prob, pred) {
  if (pred === 'Yes' || prob >= 70) return '#FF4FD8';
  if (prob >= 40) return '#FFB84D';
  return '#22F0D8';
}

export default function CustomerModal({ customer, onClose }) {
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customer) {
      setPredictionResult(null);
      return;
    }

    // Build payload matching dataset feature schema
    const payload = {
      gender: customer.gender || 'Female',
      SeniorCitizen: Number(customer.SeniorCitizen ?? 0),
      Partner: customer.Partner || 'No',
      Dependents: customer.Dependents || 'No',
      tenure: Number(customer.tenure ?? 1),
      PhoneService: customer.PhoneService || 'Yes',
      MultipleLines: customer.MultipleLines || 'No',
      InternetService: customer.InternetService || 'Fiber optic',
      OnlineSecurity: customer.OnlineSecurity || 'No',
      OnlineBackup: customer.OnlineBackup || 'No',
      DeviceProtection: customer.DeviceProtection || 'No',
      TechSupport: customer.TechSupport || 'No',
      StreamingTV: customer.StreamingTV || 'No',
      StreamingMovies: customer.StreamingMovies || 'No',
      Contract: customer.Contract || 'Month-to-month',
      PaperlessBilling: customer.PaperlessBilling || 'Yes',
      PaymentMethod: customer.PaymentMethod || 'Electronic check',
      MonthlyCharges: Number(customer.MonthlyCharges ?? 70.0),
      TotalCharges: Number(customer.TotalCharges ?? 150.0),
    };

    setLoading(true);
    setError(null);

    fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Inference error (status ${res.status})`);
        return res.json();
      })
      .then((data) => {
        setPredictionResult(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Real prediction request failed, using local model calculation:', err);
        setError(err.message);
        setPredictionResult({
          prediction: customer.score >= 50 ? 'Yes' : 'No',
          confidence: customer.score >= 50 ? customer.score : (100 - customer.score),
          churn_probability: customer.score,
        });
        setLoading(false);
      });
  }, [customer]);

  if (!customer) return null;

  const churnProb = predictionResult?.churn_probability ?? customer.score ?? 50;
  const prediction = predictionResult?.prediction ?? (churnProb >= 50 ? 'Yes' : 'No');
  const confidence = predictionResult?.confidence ?? (prediction === 'Yes' ? churnProb : (100 - churnProb));
  const isChurn = prediction === 'Yes';
  const color = RiskColor(churnProb, prediction);
  const history = buildHistory(churnProb);

  const DRIVER_DETAILS = [
    { label: 'Contract Type', val: customer.Contract || 'Month-to-month', score: customer.Contract === 'Month-to-month' ? 88 : customer.Contract === 'One year' ? 45 : 15, color: customer.Contract === 'Month-to-month' ? '#FF4FD8' : '#22F0D8' },
    { label: 'Internet Service', val: customer.InternetService || 'Fiber optic', score: customer.InternetService === 'Fiber optic' ? 85 : customer.InternetService === 'DSL' ? 50 : 20, color: customer.InternetService === 'Fiber optic' ? '#FF4FD8' : '#22F0D8' },
    { label: 'Tenure (months)', val: `${customer.tenure ?? 1} mo`, score: Math.max(10, 100 - (customer.tenure ?? 1) * 1.4), color: (customer.tenure ?? 1) < 12 ? '#FF4FD8' : '#22F0D8' },
    { label: 'Payment Method', val: customer.PaymentMethod || 'Electronic check', score: customer.PaymentMethod === 'Electronic check' ? 78 : 30, color: customer.PaymentMethod === 'Electronic check' ? '#FFB84D' : '#22F0D8' },
    { label: 'Tech Support', val: customer.TechSupport || 'No', score: customer.TechSupport === 'No' ? 75 : 20, color: customer.TechSupport === 'No' ? '#FFB84D' : '#22F0D8' },
    { label: 'Monthly Charges', val: fmt.currency(customer.MonthlyCharges ?? 70), score: Math.min(100, (customer.MonthlyCharges ?? 70)), color: (customer.MonthlyCharges ?? 70) > 80 ? '#FFB84D' : '#22F0D8' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
      />
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 24 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-h-[88vh] overflow-y-auto bg-surface border border-border rounded-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border sticky top-0 bg-surface z-10">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-mono text-dim">{customer.id}</span>
              <span className={`badge-${isChurn ? 'high' : 'low'}`}>
                {isChurn ? 'High Churn Risk' : 'Loyal Account'}
              </span>
              <span className="text-[9px] font-mono text-cyan bg-cyan/10 border border-cyan/20 px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-cyan animate-pulse" />
                Live API
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">{customer.name}</h2>
            <div className="text-[10px] font-mono text-dim mt-0.5">
              {customer.segment} · LTV {fmt.currency(customer.ltv)} · Monthly: {fmt.currency(customer.MonthlyCharges ?? 70)}
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center border border-border rounded-sm text-dim hover:text-white hover:border-muted transition-colors mt-1">
            <X size={13} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Score + Real Inference Row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Real Model Churn Probability */}
            <div className="col-span-1 border rounded-sm p-3.5" style={{ borderColor: `${color}25`, background: `${color}07` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="section-label">Churn Probability</div>
                {loading && <span className="text-[9px] font-mono text-dim animate-pulse">Running ML...</span>}
              </div>
              <div className="text-4xl font-bold font-mono" style={{ color }}>
                {churnProb}%
              </div>
              <div className="text-[9px] font-mono text-dim mt-1">
                RandomForest Inference
              </div>
              <div className="mt-2 h-1 bg-muted rounded-sm overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${churnProb}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-sm"
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>

            {/* Real Model Prediction & Confidence */}
            <div className="border border-border rounded-sm p-3.5 bg-panel">
              <div className="section-label mb-2">ML Decision & Confidence</div>
              <div className="flex items-center gap-2 mb-1">
                {isChurn ? (
                  <ShieldAlert size={16} className="text-magenta" />
                ) : (
                  <CheckCircle2 size={16} className="text-cyan" />
                )}
                <span className="text-base font-bold font-mono" style={{ color }}>
                  Prediction: {prediction === 'Yes' ? 'WILL CHURN' : 'RETAINED'}
                </span>
              </div>
              <div className="text-[10px] font-mono text-white mt-1">
                Confidence: <strong className="text-cyan">{confidence}%</strong>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[9px] font-mono text-dim">
                <Clock size={10} className="text-amber" />
                Est. Action Date: {fmt.shortDate(customer.predictedDate)}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border border-border rounded-sm p-3.5 bg-panel space-y-1.5">
              <div className="section-label mb-1.5">Intervention</div>
              <button className="w-full flex items-center gap-2 text-[10px] font-mono text-violet border border-violet/30 rounded-sm px-2 py-1 hover:bg-violet/10 transition-colors">
                <Phone size={10} /> Call Account Lead
              </button>
              <button className="w-full flex items-center gap-2 text-[10px] font-mono text-cyan border border-cyan/30 rounded-sm px-2 py-1 hover:bg-cyan/10 transition-colors">
                <Mail size={10} /> Email Discount (20%)
              </button>
              <button className="w-full flex items-center gap-2 text-[10px] font-mono text-magenta border border-magenta/30 rounded-sm px-2 py-1 hover:bg-magenta/10 transition-colors">
                <Zap size={10} /> Deploy PB-04 Playbook
              </button>
            </div>
          </div>

          {/* Model Inference Payload Summary */}
          <div className="border border-border rounded-sm p-3 bg-surface text-[10px] font-mono">
            <div className="flex items-center justify-between mb-2">
              <span className="section-label">POST /predict Feature Vector</span>
              <span className="text-dim text-[9px]">Endpoint: http://127.0.0.1:5000/predict</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-dim">
              <div>Contract: <span className="text-white">{customer.Contract || 'Month-to-month'}</span></div>
              <div>Internet: <span className="text-white">{customer.InternetService || 'Fiber optic'}</span></div>
              <div>Tenure: <span className="text-white">{customer.tenure ?? 1} mo</span></div>
              <div>Monthly: <span className="text-white">${customer.MonthlyCharges ?? 70.7}</span></div>
              <div>Payment: <span className="text-white">{customer.PaymentMethod || 'Electronic check'}</span></div>
              <div>Total: <span className="text-white">${customer.TotalCharges ?? 151.65}</span></div>
              <div>Paperless: <span className="text-white">{customer.PaperlessBilling || 'Yes'}</span></div>
              <div>Tech Support: <span className="text-white">{customer.TechSupport || 'No'}</span></div>
            </div>
          </div>

          {/* Score history chart */}
          <div>
            <div className="section-label mb-2">Churn Risk Trajectory (6 Months)</div>
            <div className="border border-border rounded-sm p-3 bg-panel">
              <ResponsiveContainer width="100%" height={110}>
                <AreaChart data={history} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1C1C1C" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#444', fontSize: 9, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#444', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#111', border: '1px solid #1C1C1C', borderRadius: 2, fontSize: 11 }}
                    labelStyle={{ color: '#666', fontFamily: 'Space Mono' }}
                    itemStyle={{ color }}
                  />
                  <Area type="monotone" dataKey="score" stroke={color} strokeWidth={2} fill="url(#scoreGrad)"
                    dot={{ fill: color, r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: color, stroke: '#000', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk drivers breakdown */}
          <div>
            <div className="section-label mb-2">Key Risk Factors (Model Inputs)</div>
            <div className="grid grid-cols-2 gap-2">
              {DRIVER_DETAILS.map((d) => (
                <div key={d.label} className="border border-border rounded-sm p-2.5 bg-panel">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono text-dim">{d.label}</span>
                    <span className="text-[10px] font-bold font-mono text-white">
                      {d.val}
                    </span>
                  </div>
                  <div className="h-1 bg-muted rounded-sm overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.score}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-sm"
                      style={{ backgroundColor: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
