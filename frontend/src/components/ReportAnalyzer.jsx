import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  Share2,
  Trash2,
  Eye,
  Plus,
  PlusCircle,
  Clock,
  Layers
} from 'lucide-react';

const ReportAnalyzer = ({ selectedReport, reports, onUploadSuccess, setActiveTab, onSelectCompareReports }) => {
  const hasReports = reports && reports.length > 0;
  
  const [activeSubTab, setActiveSubTab] = useState(selectedReport ? 'details' : (hasReports ? 'list' : 'upload'));
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepLabel, setStepLabel] = useState('');
  const [uploadedReport, setUploadedReport] = useState(selectedReport || (hasReports ? reports[reports.length - 1] : null));
  const [uploadError, setUploadError] = useState(null);

  const selectedReportIdRef = useRef(selectedReport?.id);

  useEffect(() => {
    // Only update when selectedReport explicitly changes to a different report ID
    if (selectedReport && selectedReport.id !== selectedReportIdRef.current) {
      selectedReportIdRef.current = selectedReport.id;
      setUploadedReport(selectedReport);
      setActiveSubTab('details');
    } else if (!selectedReport && hasReports && !uploadedReport) {
      setUploadedReport(reports[reports.length - 1]);
    }
  }, [selectedReport, reports]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);
    setActiveSubTab('upload');

    // 5-Stage Progress Simulation
    setCurrentStep(1);
    setStepLabel('1. Uploading file...');
    await new Promise((r) => setTimeout(r, 400));

    setCurrentStep(2);
    setStepLabel('2. Reading report text...');
    await new Promise((r) => setTimeout(r, 400));

    setCurrentStep(3);
    setStepLabel('3. Extracting health parameters...');
    await new Promise((r) => setTimeout(r, 400));

    setCurrentStep(4);
    setStepLabel('4. Preparing plain-language summary...');
    await new Promise((r) => setTimeout(r, 400));

    try {
      const data = await api.uploadReport(file);
      setCurrentStep(5);
      setStepLabel('5. Processing complete!');
      
      // Lock reference ID so useEffect doesn't overwrite new upload
      selectedReportIdRef.current = data.id;
      setUploadedReport(data);

      if (onUploadSuccess) onUploadSuccess(data);

      setTimeout(() => {
        setIsUploading(false);
        setActiveSubTab('details');
      }, 400);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError(err.message || "Failed to process report file. Please try again.");
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Normal':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Normal
          </span>
        );
      case 'Elevated':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Elevated
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <Info className="w-3.5 h-3.5" /> Low
          </span>
        );
      case 'Prescribed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5" /> Prescribed Treatment
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Sub-Tab Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          {hasReports && (
            <button
              onClick={() => setActiveSubTab('list')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === 'list'
                  ? 'bg-[#1687E8] text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>All Reports Gallery ({reports.length})</span>
            </button>
          )}

          {uploadedReport && (
            <button
              onClick={() => setActiveSubTab('details')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === 'details'
                  ? 'bg-[#1687E8] text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Selected Report Details</span>
            </button>
          )}

          <button
            onClick={() => {
              setActiveSubTab('upload');
              setUploadError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'upload'
                ? 'bg-[#1687E8] text-white shadow-md'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload New Report</span>
          </button>
        </div>

        {uploadedReport && activeSubTab === 'details' && (
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onSelectCompareReports && onSelectCompareReports(uploadedReport.id)}
              className="beat-btn-outline cursor-pointer py-2 px-3 text-slate-700 font-bold"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#1687E8]" /> Compare
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className="beat-btn-heart cursor-pointer py-2 px-3 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" /> Ask AI
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: Upload Dropzone & Stepper */}
      {activeSubTab === 'upload' && (
        <div className="space-y-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="beat-card p-10 sm:p-14 text-center space-y-6 bg-white border-2 border-dashed border-sky-200 hover:border-[#1687E8] transition-colors rounded-3xl"
          >
            <div className="w-20 h-20 rounded-full bg-sky-50 text-[#1687E8] flex items-center justify-center mx-auto shadow-xs">
              <UploadCloud className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1F33]">
                Upload Medical Lab Report or Prescription
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Drag and drop your PDF lab report, scanned prescription, or medical photo here.
              </p>
            </div>

            {uploadError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs max-w-md mx-auto font-bold">
                {uploadError}
              </div>
            )}

            {!isUploading ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <label className="beat-btn-primary cursor-pointer text-sm px-6 py-3">
                  <FileText className="w-4 h-4" />
                  <span>Choose PDF / Image File</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.bmp"
                    onChange={handleSelectFile}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-4 max-w-md mx-auto pt-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#0B1F33]">
                  <span>{stepLabel}</span>
                  <span>{currentStep * 20}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-[#1687E8] h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${currentStep * 20}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: All Reports Gallery */}
      {activeSubTab === 'list' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0B1F33]">Your Saved Medical Reports ({reports?.length || 0})</h3>
            <button
              onClick={() => setActiveSubTab('upload')}
              className="beat-btn-primary cursor-pointer text-xs px-4 py-2.5"
            >
              <Plus className="w-3.5 h-3.5" /> Upload Another Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className={`beat-card p-6 flex flex-col justify-between space-y-4 hover:border-[#1687E8] transition-all ${
                  uploadedReport?.id === report.id ? 'border-[#1687E8] ring-2 ring-[#1687E8]/10' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1687E8] bg-sky-50 px-3 py-1 rounded-full border border-sky-100 line-clamp-1">
                      {report.lab_name || "Diagnostic Lab"}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1 shrink-0">
                      <Calendar className="w-3.5 h-3.5" /> {report.report_date}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#0B1F33] text-base line-clamp-2">
                      {report.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-3 mt-1.5 leading-relaxed">
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
                      selectedReportIdRef.current = report.id;
                      setUploadedReport(report);
                      setActiveSubTab('details');
                    }}
                    className="text-[#1687E8] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Report Details & Extracted Parameters */}
      {activeSubTab === 'details' && uploadedReport && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Header Summary Card */}
          <div className="beat-card p-6 sm:p-8 bg-gradient-to-r from-[#0B1F33] to-[#1687E8] text-white rounded-3xl space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="text-xs font-semibold text-sky-200 uppercase tracking-wider">
                  Selected Report
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {uploadedReport.title}
                </h2>
                <div className="text-xs text-sky-100 mt-1 flex items-center gap-4">
                  <span>Report Date: <strong>{uploadedReport.report_date}</strong></span>
                  <span>•</span>
                  <span>Lab: <strong>{uploadedReport.lab_name}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectCompareReports && onSelectCompareReports(uploadedReport.id)}
                  className="bg-white/15 hover:bg-white/25 text-white font-bold px-4 py-2.5 rounded-xl backdrop-blur-md text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Compare with Previous</span>
                </button>
                <button
                  onClick={() => setActiveTab('assistant')}
                  className="bg-white text-[#0B1F33] hover:bg-slate-50 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#1687E8]" />
                  <span>Ask Beat AI About This Report</span>
                </button>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/15 text-xs sm:text-sm text-sky-50 leading-relaxed">
              <div className="font-bold text-white mb-1 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-300" /> Executive Report Summary
              </div>
              <p>{uploadedReport.summary}</p>
            </div>
          </div>

          {/* Extracted Parameters Table */}
          <div className="beat-card p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B1F33]">
                  Health Information ({uploadedReport.parameters?.length || 0} Parameters Extracted)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Parameter values extracted and matched against reference ranges.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="pb-3 pr-4">Parameter Name</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Value</th>
                    <th className="pb-3 pr-4 whitespace-nowrap">Reference Range</th>
                    <th className="pb-3 pr-4">Observation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {uploadedReport.parameters?.map((param, index) => (
                    <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 pr-4 font-bold text-[#0B1F33]">
                        {param.name}
                      </td>
                      <td className="py-4 pr-4 text-slate-500 text-xs">
                        {param.category}
                      </td>
                      <td className="py-4 pr-4 font-extrabold text-[#0B1F33]">
                        {param.value_str} {param.unit && param.unit !== 'N/A' && <span className="text-xs font-normal text-slate-400">{param.unit}</span>}
                      </td>
                      <td className="py-4 pr-4 text-slate-500 text-xs">
                        {param.reference_range}
                      </td>
                      <td className="py-4 pr-4 text-slate-600 text-xs max-w-xs leading-relaxed">
                        <div>{param.observation}</div>
                        {(param.frequency && param.frequency !== 'Not applicable' && param.frequency !== 'N/A') && (
                          <div className="mt-1 font-semibold text-[#1687E8]">
                            Dosage: {param.frequency} {param.duration && param.duration !== 'Not applicable' && param.duration !== 'Not provided' ? `(${param.duration})` : ''}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* New Document Summary Section */}
          <div className="beat-card p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-[#0B1F33]">Document Summary</h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {uploadedReport.summary}
            </p>
          </div>


        </div>
      )}

    </div>
  );
};

export default ReportAnalyzer;
