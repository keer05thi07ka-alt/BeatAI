import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  GitCompare,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  Sparkles,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const ReportComparator = ({ reports, selectedPrevId, selectedLatestId }) => {
  const [prevId, setPrevId] = useState(selectedPrevId || null);
  const [latestId, setLatestId] = useState(selectedLatestId || null);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync state when reports load or props change
  useEffect(() => {
    if (reports && reports.length > 0) {
      const defaultPrev = selectedPrevId || (reports.length >= 2 ? reports[0].id : reports[0].id);
      const defaultLatest = selectedLatestId || (reports.length >= 1 ? reports[reports.length - 1].id : reports[0].id);
      
      setPrevId(defaultPrev);
      setLatestId(defaultLatest);
      
      fetchComparison(defaultPrev, defaultLatest);
    }
  }, [reports, selectedPrevId, selectedLatestId]);

  const fetchComparison = async (pId, lId) => {
    if (!pId || !lId) return;
    setLoading(true);
    try {
      const data = await api.compareReports(pId, lId);
      if (data) {
        setComparisonData(data);
      }
    } catch (err) {
      console.warn("API comparison fetch failed, building fallback comparison:", err);
      // Fallback comparison engine if API error occurs
      const rPrev = reports.find((r) => r.id === Number(pId));
      const rLatest = reports.find((r) => r.id === Number(lId));
      if (rPrev && rLatest) {
        const prevParams = {};
        rPrev.parameters?.forEach((p) => { prevParams[p.name] = p; });
        const latestParams = {};
        rLatest.parameters?.forEach((p) => { latestParams[p.name] = p; });

        const allNames = Array.from(new Set([...Object.keys(prevParams), ...Object.keys(latestParams)]));
        const comps = allNames.map((name) => {
          const lp = latestParams[name];
          const pp = prevParams[name];
          const unit = lp?.unit || pp?.unit || '';
          const lNum = lp?.numerical_value;
          const pNum = pp?.numerical_value;

          let diffStr = 'N/A';
          let trend = 'Stable';
          if (lNum !== undefined && pNum !== undefined && lNum !== null && pNum !== null) {
            const diff = Math.round((lNum - pNum) * 100) / 100;
            if (diff > 0) { diffStr = `+${diff} ${unit}`; trend = 'Increased'; }
            else if (diff < 0) { diffStr = `${diff} ${unit}`; trend = 'Decreased'; }
            else { diffStr = `0 ${unit}`; trend = 'Stable'; }
          }

          return {
            parameter_name: name,
            category: lp?.category || pp?.category,
            previous_value: pp ? `${pp.value_str} ${pp.unit}` : 'Not Tested',
            latest_value: lp ? `${lp.value_str} ${lp.unit}` : 'Not Tested',
            reference_range: lp?.reference_range || pp?.reference_range || 'N/A',
            difference: diffStr,
            trend: trend,
            latest_status: lp?.status || 'N/A'
          };
        });

        setComparisonData({
          report_previous: { id: rPrev.id, title: rPrev.title, date: rPrev.report_date },
          report_latest: { id: rLatest.id, title: rLatest.title, date: rLatest.report_date },
          comparisons: comps,
          summary: `Comparing ${rPrev.title} (${rPrev.report_date}) with ${rLatest.title} (${rLatest.report_date}).`
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRunComparison = () => {
    if (prevId && latestId) {
      fetchComparison(prevId, latestId);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] tracking-tight flex items-center gap-2">
          <GitCompare className="w-7 h-7 text-[#1687E8]" />
          Compare Your Reports
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Select two medical reports to compare parameters side-by-side and calculate trend differences over time.
        </p>
      </div>

      {/* Report Selector Control Bar */}
      <div className="beat-card p-6 bg-[#0B1F33] text-white rounded-3xl space-y-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Baseline / Previous Dropdown */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-bold text-[#42C7E8] uppercase tracking-wider block">
              1. Baseline / Previous Report
            </label>
            <select
              value={prevId || ''}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPrevId(val);
                fetchComparison(val, latestId);
              }}
              className="w-full bg-slate-800 border border-slate-700 text-white font-semibold text-sm rounded-xl p-3 focus:outline-hidden cursor-pointer"
            >
              {reports && reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.report_date} — {r.title}
                </option>
              ))}
            </select>
          </div>

          {/* Arrow Divider */}
          <div className="md:col-span-2 flex items-center justify-center pt-2 md:pt-6">
            <div className="w-10 h-10 rounded-full bg-white/10 text-[#42C7E8] flex items-center justify-center shrink-0">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Latest / Comparison Dropdown */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-bold text-[#F45B75] uppercase tracking-wider block">
              2. Latest / Comparison Report
            </label>
            <select
              value={latestId || ''}
              onChange={(e) => {
                const val = Number(e.target.value);
                setLatestId(val);
                fetchComparison(prevId, val);
              }}
              className="w-full bg-slate-800 border border-slate-700 text-white font-semibold text-sm rounded-xl p-3 focus:outline-hidden cursor-pointer"
            >
              {reports && reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.report_date} — {r.title}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-300 font-medium">
            {prevId === latestId ? (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Info className="w-4 h-4" /> Tip: Select two different report dates (e.g. Jan 2026 vs Jun 2026) for meaningful delta tracking.
              </span>
            ) : (
              <span>Comparing parameters between baseline and comparison date.</span>
            )}
          </div>

          <button
            onClick={handleRunComparison}
            disabled={loading}
            className="beat-btn-primary cursor-pointer text-xs px-5 py-2.5 whitespace-nowrap"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <GitCompare className="w-4 h-4" />}
            <span>Compare Reports Now</span>
          </button>
        </div>
      </div>

      {/* Comparison Loading Indicator */}
      {loading && (
        <div className="beat-card p-8 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-[#1687E8] animate-spin mx-auto" />
          <div className="text-sm font-bold text-[#0B1F33]">Computing parameter differences between reports...</div>
        </div>
      )}

      {/* Comparison Matrix Output Table */}
      {!loading && comparisonData && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Summary Box */}
          <div className="beat-card p-5 bg-sky-50/70 border-sky-100 text-[#0B1F33] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-medium rounded-2xl">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#1687E8] shrink-0" />
              <span>{comparisonData.summary}</span>
            </div>
            <span className="font-extrabold text-[#1687E8] bg-white px-3 py-1.5 rounded-full border border-sky-100 shadow-2xs text-xs whitespace-nowrap">
              {comparisonData.comparisons?.length || 0} Parameters Matched
            </span>
          </div>

          {/* Matrix Table */}
          <div className="beat-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Parameter Name</th>
                    <th className="py-3.5 px-4 bg-slate-100/50">
                      Baseline ({comparisonData.report_previous?.date})
                    </th>
                    <th className="py-3.5 px-4 bg-sky-50/50">
                      Latest ({comparisonData.report_latest?.date})
                    </th>
                    <th className="py-3.5 px-4">Difference (Delta)</th>
                    <th className="py-3.5 px-4">Trend Direction</th>
                    <th className="py-3.5 px-4">Report Reference Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonData.comparisons?.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      
                      <td className="py-4 px-4 font-bold text-[#0B1F33]">
                        <div>{c.parameter_name}</div>
                        <div className="text-xs font-normal text-slate-400">{c.category}</div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-700 bg-slate-50/20 whitespace-nowrap">
                        {c.previous_value}
                      </td>

                      <td className="py-4 px-4 font-extrabold text-[#0B1F33] bg-sky-50/10 whitespace-nowrap">
                        {c.latest_value}
                      </td>

                      <td className="py-4 px-4 font-extrabold whitespace-nowrap">
                        <span className={
                          c.trend === 'Increased' ? 'text-amber-700' :
                          c.trend === 'Decreased' ? 'text-[#1687E8]' : 'text-slate-600'
                        }>
                          {c.difference}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          c.trend === 'Increased' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          c.trend === 'Decreased' ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {c.trend === 'Increased' && <TrendingUp className="w-3.5 h-3.5 text-amber-600" />}
                          {c.trend === 'Decreased' && <TrendingDown className="w-3.5 h-3.5 text-[#1687E8]" />}
                          {c.trend === 'Stable' && <Minus className="w-3.5 h-3.5 text-slate-500" />}
                          {c.trend === 'Increased' ? '↑ Increased' : c.trend === 'Decreased' ? '↓ Decreased' : '→ Relatively stable'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                        {c.reference_range}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportComparator;
