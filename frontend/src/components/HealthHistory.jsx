import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Filter,
  Info,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

const HealthHistory = ({ trends }) => {
  const trackedParams = trends?.tracked_parameters || [
    "Fasting Blood Glucose",
    "Total Cholesterol",
    "Hemoglobin (Hb)",
    "Systolic Blood Pressure"
  ];

  const [selectedParam, setSelectedParam] = useState(trackedParams[0] || "Fasting Blood Glucose");

  const currentTrend = trends?.trends?.[selectedParam] || null;
  const chartData = currentTrend?.data || [];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-sky-600" />
            Your Health Trends & History
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track how your parameters change over time across your medical reports.
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2">Metric:</span>
          <select
            value={selectedParam}
            onChange={(e) => setSelectedParam(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl px-4 py-2 focus:outline-hidden cursor-pointer"
          >
            {trackedParams.map((param) => (
              <option key={param} value={param}>
                {param}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Card */}
      <div className="beat-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {currentTrend?.category || "Health Parameter"}
            </div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-0.5">
              {selectedParam}
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                Unit: {currentTrend?.unit || "N/A"}
              </span>
            </h2>
          </div>

          <div className="text-xs font-medium text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
            Report Reference Range: <strong className="text-slate-900">{currentTrend?.reference_range || "N/A"}</strong>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="w-full h-80 pt-2">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="historyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={['dataMin - 10', 'dataMax + 15']} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl text-xs space-y-1 min-w-40">
                          <div className="font-bold border-b border-slate-700 pb-1">{label}</div>
                          <div className="text-sm font-extrabold text-sky-400">
                            {dataPoint.value} {currentTrend?.unit}
                          </div>
                          <div className="text-slate-300">
                            Report: <span className="font-semibold text-white">{dataPoint.report_title}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                
                {currentTrend?.max_ref && (
                  <ReferenceLine
                    y={currentTrend.max_ref}
                    stroke="#f43f5e"
                    strokeDasharray="4 4"
                    label={{ value: `Reference Range Threshold (${currentTrend.max_ref})`, fill: '#f43f5e', fontSize: 11, position: 'top' }}
                  />
                )}

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#historyGrad)"
                  dot={{ r: 6, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
              <span>Select a health parameter to view timeline graph.</span>
            </div>
          )}
        </div>

        {/* Simple Neutral Insight */}
        <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100 text-xs sm:text-sm text-sky-950 font-medium flex items-center gap-3">
          <Info className="w-5 h-5 text-sky-600 shrink-0" />
          <span>Your <strong>{selectedParam}</strong> value has changed compared with your previous report.</span>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="beat-card p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-600" />
          Timeline of Reports
        </h3>

        <div className="relative pl-6 border-l-2 border-sky-200 space-y-6">
          {chartData.map((dp, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-sky-500 group-hover:scale-110 transition-transform"></div>
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-slate-400">{dp.date}</div>
                  <div className="text-sm font-bold text-slate-900">{dp.report_title}</div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-extrabold text-slate-900">
                    {dp.value_str || dp.value} <span className="text-xs font-normal text-slate-500">{currentTrend?.unit}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Reference Range: {currentTrend?.reference_range}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HealthHistory;
