import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  Upload,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileUp,
  Heart,
  GitCompare,
  Info,
  Calendar,
  Eye,
  Plus,
  FolderOpen
} from 'lucide-react';

const ReportAnalyzer = ({ reports, onUploadSuccess, selectedReport, setActiveTab, onSelectCompareReports }) => {
  const hasReports = reports && reports.length > 0;
  
  const [activeSubTab, setActiveSubTab] = useState(selectedReport ? 'details' : (hasReports ? 'list' : 'upload'));
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepLabel, setStepLabel] = useState('');
  const [uploadedReport, setUploadedReport] = useState(selectedReport || (hasReports ? reports[reports.length - 1] : null));
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (!reports || reports.length === 0) {
      setUploadedReport(null);
      if (!selectedReport) setActiveSubTab('list');
      return;
    }

    if (selectedReport) {
      setUploadedReport(selectedReport);
      setActiveSubTab('details');
    } else if (hasReports) {
      const exists = reports.some(r => r.id === uploadedReport?.id);
      if (!exists) {
        setUploadedReport(reports[reports.length - 1]);
      }
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
      setUploadedReport(data);
      if (onUploadSuccess) onUploadSuccess(data);
      setActiveSubTab('details');
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError("Failed to process report file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">

      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-[#1687E8]" />
            My Medical Reports
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            View all uploaded medical reports, extract parameters, or upload a new report file.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setActiveSubTab('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'list' ? 'bg-white text-[#1687E8] shadow-xs' : 'text-slate-600 hover:text-[#0B1F33]'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>All Reports ({reports?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('upload')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'upload' ? 'bg-[#1687E8] text-white shadow-xs' : 'text-slate-600 hover:text-[#0B1F33]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Report</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: ALL REPORTS LIST */}
      {activeSubTab === 'list' && (
        <div className="space-y-6 animate-fade-in">
          {hasReports ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="beat-card p-6 flex flex-col justify-between space-y-4 hover:border-[#1687E8] transition-all bg-white rounded-3xl border border-slate-200/80 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1687E8] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                        {report.lab_name || "Diagnostic Lab"}
                      </span>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {report.report_date}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-[#0B1F33] text-lg">
                        {report.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {report.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500 font-medium">
                      {report.parameter_count || report.parameters?.length || 0} Parameters Extracted
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setUploadedReport(report);
                          setActiveSubTab('details');
                        }}
                        className="beat-btn-secondary text-xs px-3 py-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>

                      <button
                        onClick={() => {
                          if (onSelectCompareReports) onSelectCompareReports(report.id);
                          setActiveTab('compare');
                        }}
                        className="beat-btn-outline text-xs px-3 py-1.5 text-slate-700 font-bold cursor-pointer"
                      >
                        <GitCompare className="w-3.5 h-3.5 text-[#1687E8]" />
                        <span>Compare</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="beat-card p-10 text-center space-y-4 bg-white rounded-3xl border border-sky-100 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-sky-50 text-[#1687E8] flex items-center justify-center mx-auto">
                <FileUp className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#0B1F33]">No medical reports uploaded yet</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Upload a PDF or image of your medical report to extract parameters and track your health history.
                </p>
              </div>
              <button
                onClick={() => setActiveSubTab('upload')}
                className="beat-btn-primary cursor-pointer text-xs px-6 py-3"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Report Now</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: UPLOAD DROPZONE */}
      {activeSubTab === 'upload' && (
        <div className="beat-card p-8 sm:p-10 border-2 border-dashed border-sky-200 hover:border-sky-400 bg-sky-50/20 transition-all text-center rounded-3xl space-y-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-white text-[#1687E8] flex items-center justify-center shadow-sm border border-sky-100">
              <FileUp className="w-8 h-8 text-[#1687E8]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">
                Drag & Drop Your Medical Report
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                PDF, JPG, PNG formats supported
              </p>
            </div>

            <div className="pt-2">
              <label className="beat-btn-primary cursor-pointer text-sm px-6 py-3">
                <Upload className="w-4 h-4" />
                <span>Choose File to Upload</span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          {/* 5-Step Friendly Progress Indicator */}
          {isUploading && (
            <div className="mt-8 pt-6 border-t border-sky-100 space-y-4 animate-fade-in">
              <div className="text-sm font-bold text-[#1687E8] flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1687E8] animate-spin" />
                <span>{stepLabel}</span>
              </div>

              {/* Stepper Dots */}
              <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      step <= currentStep ? 'bg-[#1687E8]' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 3: SINGLE REPORT DETAILS VIEW (Only shown when user has reports) */}
      {hasReports && activeSubTab === 'details' && uploadedReport && (
        <div className="space-y-6 animate-fade-in pt-4 border-t border-slate-200">
          
          {/* Top Report Summary Banner */}
          <div className="beat-card p-6 bg-gradient-to-r from-[#0B1F33] to-[#1687E8] text-white rounded-3xl space-y-3 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Selected Report
                </div>
                <h2 className="text-2xl font-bold text-white">{uploadedReport.title}</h2>
                <div className="text-xs text-sky-100 mt-1">
                  Report Date: <strong>{uploadedReport.report_date}</strong> • Lab: <strong>{uploadedReport.lab_name}</strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    if (onSelectCompareReports) onSelectCompareReports(uploadedReport.id);
                    setActiveTab('compare');
                  }}
                  className="beat-btn-secondary text-xs px-4 py-2.5"
                >
                  <GitCompare className="w-4 h-4" />
                  <span>Compare with Previous</span>
                </button>

                <button
                  onClick={() => setActiveTab('assistant')}
                  className="beat-btn-heart text-xs px-4 py-2.5"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Ask Beat AI About This Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Plain Language Summary */}
          <div className="beat-card p-6 space-y-3 bg-white rounded-3xl border border-slate-200/80">
            <h3 className="text-base font-bold text-[#0B1F33] flex items-center gap-2">
              <Info className="w-5 h-5 text-[#1687E8]" />
              Executive Report Summary
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-sky-50/50 p-4 rounded-2xl border border-sky-100 font-medium">
              {uploadedReport.summary}
            </p>
          </div>

          {/* Health Information Table */}
          <div className="beat-card overflow-hidden bg-white rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0B1F33]">
                  Health Information ({uploadedReport.parameters?.length || 0} Parameters Extracted)
                </h3>
                <p className="text-xs text-slate-500">
                  Parameter values extracted and matched against reference ranges.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Parameter Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Value</th>
                    <th className="py-3.5 px-4">Reference Range</th>
                    <th className="py-3.5 px-4">Observation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {uploadedReport.parameters?.map((p) => (
                    <tr key={p.id || p.name} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-[#0B1F33]">
                        {p.name}
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-slate-500">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-md">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-extrabold text-[#0B1F33] whitespace-nowrap">
                        {p.value_str} <span className="text-xs font-normal text-slate-500">{p.unit}</span>
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                        {p.reference_range}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600 max-w-xs">
                        {p.observation}
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

export default ReportAnalyzer;
