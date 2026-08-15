import React, { useState } from 'react';
import DisclaimerModal from './DisclaimerModal';
import {
  Plus,
  Heart,
  FileText,
  TrendingUp,
  ArrowRight,
  Info,
  CheckCircle2,
  Calendar,
  Sparkles,
  GitCompare,
  Eye,
  Activity,
  ArrowUpRight,
  HelpCircle,
  UploadCloud
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const Dashboard = ({ currentUser, reports, trends, setActiveTab, setSelectedReportForAnalysis, onSelectCompareReports, onSwitchToDemo }) => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Alex';
  const hasReports = reports && reports.length > 0;

  // Selected Parameter for Chart
  const trackedParams = trends?.tracked_parameters || [
    "Fasting Blood Glucose",
    "Total Cholesterol",
    "Hemoglobin (Hb)",
    "Systolic Blood Pressure"
  ];
  const [selectedParam, setSelectedParam] = useState(trackedParams[0] || "Fasting Blood Glucose");

  const latestReport = hasReports ? reports[reports.length - 1] : null;

  // Helper to locate parameter data by fuzzy keyword match
  const findParamData = (trendsObj, keywords) => {
    if (!trendsObj || !trendsObj.trends) return [];
    for (const key of Object.keys(trendsObj.trends)) {
      const kLower = key.toLowerCase();
      if (keywords.some(kw => kLower.includes(kw))) {
        return trendsObj.trends[key]?.data || [];
      }
    }
    return [];
  };

  // Build dynamic overview cards based on parameters present in user's reports
  const getDynamicOverviewCards = () => {
    if (!hasReports || !latestReport || !latestReport.parameters) {
      return [
        { label: "Blood Sugar", data: [], defaultUnit: "mg/dL" },
        { label: "Total Cholesterol", data: [], defaultUnit: "mg/dL" },
        { label: "Blood Pressure", data: [], defaultUnit: "mmHg" },
        { label: "Hemoglobin", data: [], defaultUnit: "g/dL" },
      ];
    }

    const availableParams = latestReport.parameters;
    const cards = [];

    // Prioritize key parameters present in latest report
    for (const p of availableParams) {
      if (cards.length >= 4) break;
      const name = p.name;
      const trendData = trends?.trends?.[name]?.data || [
        {
          date: latestReport.report_date,
          value: p.numerical_value,
          value_str: p.value_str,
          unit: p.unit,
          status: p.status
        }
      ];

      cards.push({
        label: name.replace(/^Rx:\s*/i, 'Rx: ').replace(/^Vitals:\s*/i, ''),
        data: trendData,
        defaultUnit: p.unit || '',
        category: p.category
      });
    }

    // Fill remaining slots if fewer than 4 parameters
    const standardDefaults = [
      { label: "Blood Sugar", kw: ["glucose", "sugar"], defaultUnit: "mg/dL" },
      { label: "Total Cholesterol", kw: ["cholesterol", "lipid"], defaultUnit: "mg/dL" },
      { label: "Blood Pressure", kw: ["blood pressure", "pressure", "bp"], defaultUnit: "mmHg" },
      { label: "Hemoglobin", kw: ["hemoglobin", "hb"], defaultUnit: "g/dL" }
    ];

    for (const def of standardDefaults) {
      if (cards.length >= 4) break;
      const exists = cards.some(c => c.label.toLowerCase().includes(def.label.toLowerCase()));
      if (!exists) {
        cards.push({
          label: def.label,
          data: findParamData(trends, def.kw),
          defaultUnit: def.defaultUnit,
          category: "General"
        });
      }
    }

    return cards.slice(0, 4);
  };

  const overviewCards = getDynamicOverviewCards();
  const currentTrend = trends?.trends?.[selectedParam] || null;
  const chartData = currentTrend?.data || [];

  const getOverviewInfo = (dataList, defaultUnit) => {
    if (!dataList || dataList.length === 0) {
      return { val: '--', unit: defaultUnit, text: "Not included in this report", tag: "none" };
    }
    const last = dataList[dataList.length - 1];
    const prev = dataList.length >= 2 ? dataList[dataList.length - 2] : null;

    let text = "→ Within reference range";
    let tag = "stable";

    const displayVal = last.value_str || last.value;

    if (prev && last.value !== prev.value) {
      text = last.value > prev.value ? "↑ Changed since last report" : "↓ Changed since last report";
      tag = "changed";
    } else if (last.status === "Elevated") {
      text = "Above reference range";
      tag = "changed";
    } else if (last.status === "Low") {
      text = "Below reference range";
      tag = "changed";
    } else if (last.status === "Prescribed") {
      text = "Prescribed Treatment";
      tag = "stable";
    } else {
      text = "→ Within reference range";
      tag = "stable";
    }

    return {
      val: displayVal,
      unit: last.unit || defaultUnit,
      text: text,
      tag: tag
    };
  };

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* 1. Welcoming Hero Banner */}
      <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5" /> {hasReports ? "You're all caught up with your latest report." : "Welcome to your clear health companion."}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Good morning, {firstName} 👋
            </h1>
            <p className="text-sky-100 text-sm sm:text-base max-w-xl font-medium">
              {hasReports ? "Here's a simple view of your health history." : "Upload your medical report to begin tracking your health timeline."}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('reports')}
              className="bg-white text-sky-800 hover:bg-slate-50 font-bold px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer text-sm"
            >
              <Plus className="w-4 h-4 text-sky-600" />
              <span>Upload New Report</span>
            </button>

            <button
              onClick={() => setActiveTab('assistant')}
              className="beat-btn-heart cursor-pointer text-sm px-5 py-3"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Ask Beat AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clean Account Onboarding Notice if no reports exist */}
      {!hasReports && (
        <div className="beat-card p-10 text-center space-y-6 bg-white rounded-3xl border border-sky-100 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-sky-50 text-[#1687E8] flex items-center justify-center mx-auto">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-2xl font-bold text-[#0B1F33]">Welcome {firstName}! No reports uploaded yet.</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your account (<strong>{currentUser?.email || 'New Patient'}</strong>) is clean and ready. Upload your medical lab report in PDF or Image format to extract health parameters and track your timeline.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('reports')}
              className="beat-btn-primary cursor-pointer text-sm px-6 py-3"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Your First Report</span>
            </button>
            {onSwitchToDemo && (
              <button
                onClick={onSwitchToDemo}
                className="beat-btn-outline cursor-pointer text-sm px-6 py-3 text-slate-700 font-bold"
              >
                <Sparkles className="w-4 h-4 text-[#1687E8]" />
                <span>Load Sample Demo Data</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. YOUR HEALTH OVERVIEW (Dynamic Parameters Extracted From Report) */}
      {hasReports && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              YOUR HEALTH OVERVIEW
            </h2>
            <button
              onClick={() => setActiveTab('trends')}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
            >
              View all health parameters <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {overviewCards.map((card, idx) => {
              const info = getOverviewInfo(card.data, card.defaultUnit);
              return (
                <div key={idx} className="beat-card p-6 flex flex-col justify-between space-y-4 hover:border-sky-300">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider line-clamp-1">
                      {card.label}
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1 line-clamp-1">
                      {info.val} <span className="text-xs font-normal text-slate-500">{info.unit}</span>
                    </div>
                    <div className={`mt-2 text-xs font-medium px-2.5 py-1 rounded-lg inline-block ${
                      info.tag === 'none' ? 'bg-slate-100 text-slate-500' :
                      info.tag === 'changed' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'
                    }`}>
                      {info.text}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('trends')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100"
                  >
                    View details <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. YOUR HEALTH TRENDS - Only shown when user has reports */}
      {hasReports && (
        <div className="beat-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                YOUR HEALTH TRENDS
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Visualize how your health metrics change over time.
              </p>
            </div>

            {/* Clean Parameter Dropdown */}
            <div className="flex items-center gap-2">
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

          {/* Clean Recharts Line Chart */}
          <div className="w-full h-72 pt-2">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashboardGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
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
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                            <div className="font-bold border-b border-slate-700 pb-1">{label}</div>
                            <div className="text-sm font-extrabold text-sky-400">{dataPoint.value} {currentTrend?.unit}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#dashboardGrad)"
                    dot={{ r: 6, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                <span>Select a parameter to view health trend timeline.</span>
              </div>
            )}
          </div>

          {/* Neutral Insight Statement */}
          <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 text-xs sm:text-sm text-sky-900 font-medium flex items-center gap-3">
            <Info className="w-5 h-5 text-sky-600 shrink-0" />
            <span>Your <strong>{selectedParam}</strong> value has changed compared with your previous report.</span>
          </div>
        </div>
      )}

      {/* 4. RECENT MEDICAL REPORTS - Only shown when user has reports */}
      {hasReports && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              RECENT REPORTS
            </h2>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
            >
              View all reports <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reports.slice(-3).map((report) => (
              <div
                key={report.id}
                className="beat-card p-6 flex flex-col justify-between space-y-4 hover:border-sky-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                      {report.lab_name || "Diagnostic Lab"}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {report.report_date}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {report.summary}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">
                    {report.parameter_count || report.parameters?.length || 0} Parameters
                  </span>
                  <button
                    onClick={() => {
                      setSelectedReportForAnalysis(report);
                      setActiveTab('analyzer');
                    }}
                    className="text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medical Disclaimer Card */}
      <div className="beat-card p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <HelpCircle className="w-6 h-6 text-sky-400 shrink-0" />
          <span>Beat is an AI health-information companion and does not diagnose conditions or replace clinical advice.</span>
        </div>
        <button
          onClick={() => setShowDisclaimer(true)}
          className="text-xs font-bold text-sky-400 hover:text-white underline cursor-pointer whitespace-nowrap"
        >
          Read Disclaimer
        </button>
      </div>

      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
      />

    </div>
  );
};

export default Dashboard;
