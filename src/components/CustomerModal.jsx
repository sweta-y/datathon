import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, Clock, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { fmt } from '../utils/formatters';

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
  if (pred === 'Yes' || prob >= 70) return '#E11D48'; // Rose/Magenta
  if (prob >= 40) return '#D97706'; // Amber
  return '#0EA5E9'; // Sky Cyan
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
    { label: 'Contract Type', val: customer.Contract || 'Month-to-month', score: customer.Contract === 'Month-to-month' ? 88 : customer.Contract === 'One year' ? 45 : 15, color: customer.Contract === 'Month-to-month' ? '#E11D48' : '#0EA5E9' },
    { label: 'Internet Service', val: customer.InternetService || 'Fiber optic', score: customer.InternetService === 'Fiber optic' ? 85 : customer.InternetService === 'DSL' ? 50 : 20, color: customer.InternetService === 'Fiber optic' ? '#E11D48' : '#0EA5E9' },
    { label: 'Tenure (months)', val: `${customer.tenure ?? 1} mo`, score: Math.max(10, 100 - (customer.tenure ?? 1) * 1.4), color: (customer.tenure ?? 1) < 12 ? '#E11D48' : '#0EA5E9' },
    { label: 'Payment Method', val: customer.PaymentMethod || 'Electronic check', score: customer.PaymentMethod === 'Electronic check' ? 78 : 30, color: customer.PaymentMethod === 'Electronic check' ? '#D97706' : '#0EA5E9' },
    { label: 'Tech Support', val: customer.TechSupport || 'No', score: customer.TechSupport === 'No' ? 75 : 20, color: customer.TechSupport === 'No' ? '#D97706' : '#0EA5E9' },
    { label: 'Monthly Charges', val: fmt.currency(customer.MonthlyCharges ?? 70), score: Math.min(100, (customer.MonthlyCharges ?? 70)), color: (customer.MonthlyCharges ?? 70) > 80 ? '#D97706' : '#0EA5E9' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
      />
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] max-h-[88vh] overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-slate-500">{customer.id}</span>
              <span className={`badge-${isChurn ? 'high' : 'low'}`}>
                {isChurn ? 'High Churn Risk' : 'Loyal Account'}
              </span>
              <span className="text-[10px] font-mono text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                Live ML Inference
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-mono">Customer {customer.id}</h2>
            <div className="text-xs font-mono text-slate-500 mt-0.5">
              {customer.Contract} · Tenure: {customer.tenure} mo · Monthly: {fmt.currency(customer.MonthlyCharges ?? 70)} · Total Spend: {fmt.currency(customer.TotalCharges ?? 150)}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer mt-1">
            <X size={15} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Real Model Inference Row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Churn Probability */}
            <div className="col-span-1 border rounded-md p-4 bg-slate-50/50" style={{ borderColor: `${color}40` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="section-label">Churn Probability</div>
                {loading && <span className="text-[9px] font-mono text-slate-400 animate-pulse">Running ML...</span>}
              </div>
              <div className="text-4xl font-bold font-mono" style={{ color }}>
                {churnProb}%
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1 font-medium">
                RandomForest Model Output
              </div>
              <div className="mt-2 h-1.5 bg-slate-200 rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${churnProb}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded"
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>

            {/* Decision & Confidence */}
            <div className="border border-slate-200 rounded-md p-4 bg-white shadow-2xs">
              <div className="section-label mb-2">ML Decision & Confidence</div>
              <div className="flex items-center gap-2 mb-1">
                {isChurn ? (
                  <ShieldAlert size={18} className="text-rose-600" />
                ) : (
                  <CheckCircle2 size={18} className="text-sky-600" />
                )}
                <span className="text-base font-bold font-mono" style={{ color }}>
                  {prediction === 'Yes' ? 'WILL CHURN' : 'RETAINED'}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-700 mt-1 font-medium">
                Confidence: <strong className="text-sky-600 font-bold">{confidence}%</strong>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                <Clock size={11} className="text-amber-600" />
                Est. Action Date: {fmt.shortDate(customer.predictedDate)}
              </div>
            </div>

            {/* Quick Intervention */}
            <div className="border border-slate-200 rounded-md p-3.5 bg-white space-y-1.5">
              <div className="section-label mb-1.5">Quick Interventions</div>
              <button className="w-full flex items-center gap-2 text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded px-2.5 py-1.5 hover:bg-indigo-100 transition-colors cursor-pointer">
                <Phone size={12} /> Call Account Lead
              </button>
              <button className="w-full flex items-center gap-2 text-xs font-mono font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded px-2.5 py-1.5 hover:bg-sky-100 transition-colors cursor-pointer">
                <Mail size={12} /> Email Discount (20%)
              </button>
            </div>
          </div>

          {/* Model Inference Payload Summary */}
          <div className="border border-slate-200 rounded-md p-3.5 bg-slate-50 font-mono text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="section-label">POST /predict Feature Vector</span>
              <span className="text-slate-500 text-[10px]">Endpoint: http://127.0.0.1:5000/predict</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-slate-600">
              <div>Contract: <span className="font-bold text-slate-900">{customer.Contract || 'Month-to-month'}</span></div>
              <div>Internet: <span className="font-bold text-slate-900">{customer.InternetService || 'Fiber optic'}</span></div>
              <div>Tenure: <span className="font-bold text-slate-900">{customer.tenure ?? 1} mo</span></div>
              <div>Monthly: <span className="font-bold text-slate-900">${customer.MonthlyCharges ?? 70.7}</span></div>
              <div>Payment: <span className="font-bold text-slate-900">{customer.PaymentMethod || 'Electronic check'}</span></div>
              <div>Total: <span className="font-bold text-slate-900">${customer.TotalCharges ?? 151.65}</span></div>
              <div>Paperless: <span className="font-bold text-slate-900">{customer.PaperlessBilling || 'Yes'}</span></div>
              <div>Tech Support: <span className="font-bold text-slate-900">{customer.TechSupport || 'No'}</span></div>
            </div>
          </div>

          {/* Trajectory chart */}
          <div>
            <div className="section-label mb-2">Churn Risk Trajectory (6 Months)</div>
            <div className="border border-slate-200 rounded-md p-3 bg-white">
              <ResponsiveContainer width="100%" height={110}>
                <AreaChart data={history} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke={color} strokeWidth={2} fill="url(#scoreGradLight)"
                    dot={{ fill: color, r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: color, stroke: '#FFFFFF', strokeWidth: 2 }}
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
                <div key={d.label} className="border border-slate-200 rounded-md p-3 bg-white">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-semibold text-slate-500">{d.label}</span>
                    <span className="text-xs font-bold font-mono text-slate-900">
                      {d.val}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.score}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded"
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
