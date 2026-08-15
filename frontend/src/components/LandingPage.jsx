import React from 'react';
import Logo from './Logo';
import {
  Upload,
  FileText,
  TrendingUp,
  Heart,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Sparkles,
  Zap,
  Lock,
  ChevronRight,
  Eye,
  Bot
} from 'lucide-react';

const LandingPage = ({ onGetStarted, onExplore, onNavigateLogin }) => {
  return (
    <div className="min-h-screen bg-[#F6F9FC] text-[#0B1F33] selection:bg-[#1687E8] selection:text-white">
      
      {/* Landing Top Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="beat-container flex items-center justify-between h-20">
          <Logo size="medium" />

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-[#1687E8] transition-colors">How It Works</a>
            <a href="#report-analysis" className="hover:text-[#1687E8] transition-colors">Report Analysis</a>
            <a href="#health-timeline" className="hover:text-[#1687E8] transition-colors">Health Timeline</a>
            <a href="#beat-ai" className="hover:text-[#1687E8] transition-colors">Beat AI</a>
            <a href="#privacy" className="hover:text-[#1687E8] transition-colors">Privacy</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateLogin}
              className="text-sm font-bold text-slate-700 hover:text-[#1687E8] px-4 py-2 cursor-pointer transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={onGetStarted}
              className="beat-btn-primary cursor-pointer text-sm px-5 py-2.5"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Report</span>
            </button>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="beat-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-[#1687E8] text-xs font-bold border border-sky-100 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F45B75]" />
              <span>Next-Generation AI Healthcare Companion</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0B1F33] leading-[1.12]">
              Understand your reports. <br />
              <span className="bg-gradient-to-r from-[#1687E8] via-[#42C7E8] to-[#F45B75] bg-clip-text text-transparent">
                Track your health.
              </span> <br />
              Ask Beat AI.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Beat transforms your complex medical reports into clear, organized, and trackable health information. No medical jargon. Just clarity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="beat-btn-primary cursor-pointer text-base px-7 py-3.5 w-full sm:w-auto justify-center shadow-lg"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Your Report</span>
              </button>

              <button
                onClick={onExplore}
                className="beat-btn-outline cursor-pointer text-base px-7 py-3.5 w-full sm:w-auto justify-center"
              >
                <Activity className="w-5 h-5 text-[#1687E8]" />
                <span>Explore Beat Demo</span>
              </button>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Private & Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> PDF & Image OCR Support
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Grounded Clinical Knowledge
              </span>
            </div>

          </div>

          {/* Right Visual Flow Diagram */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-4">
              
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>BEAT HEALTH ENGINE PIPELINE</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>

              {/* Step 1: Report */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#1687E8] flex items-center justify-center font-bold shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0B1F33]">Medical Report (PDF / Image)</div>
                  <div className="text-[11px] text-slate-500">Blood sugar, lipid panel, CBC, BP</div>
                </div>
              </div>

              <div className="flex justify-center my-1 text-[#1687E8]">
                <ArrowRight className="w-5 h-5 rotate-90" />
              </div>

              {/* Step 2: AI Analysis */}
              <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1687E8] text-white flex items-center justify-center font-bold shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0B1F33]">AI Entity & Reference Extraction</div>
                  <div className="text-[11px] text-slate-600">Values matched with clinical reference bounds</div>
                </div>
              </div>

              <div className="flex justify-center my-1 text-[#1687E8]">
                <ArrowRight className="w-5 h-5 rotate-90" />
              </div>

              {/* Step 3: Health Timeline */}
              <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0B1F33]">Personalized Health History</div>
                  <div className="text-[11px] text-slate-600">Jan 2026 → Mar 2026 → Jun 2026 Trajectory</div>
                </div>
              </div>

              <div className="flex justify-center my-1 text-[#F45B75]">
                <ArrowRight className="w-5 h-5 rotate-90" />
              </div>

              {/* Step 4: Beat AI */}
              <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F45B75] text-white flex items-center justify-center font-bold shrink-0">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0B1F33]">Beat AI Healthcare Assistant</div>
                  <div className="text-[11px] text-slate-600">Ask natural questions with cited answers</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. HOW BEAT WORKS */}
      <section id="how-it-works" className="py-16 bg-white border-y border-slate-200/80">
        <div className="beat-container space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-[#0B1F33]">How Beat Works</h2>
            <p className="text-slate-500 text-sm">Three simple steps to transform your health reports into actionable clarity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 01 */}
            <div className="beat-card p-8 space-y-4 hover:border-[#1687E8]">
              <div className="text-4xl font-black text-[#1687E8]/20">01</div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#1687E8] flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1F33]">Upload</h3>
              <p className="text-sm text-slate-600">
                Upload your medical report in PDF or image format. Beat's OCR engine extracts test parameters automatically.
              </p>
            </div>

            {/* Step 02 */}
            <div className="beat-card p-8 space-y-4 hover:border-[#1687E8]">
              <div className="text-4xl font-black text-[#1687E8]/20">02</div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#1687E8] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1F33]">Understand</h3>
              <p className="text-sm text-slate-600">
                Beat identifies parameters, values, and reference ranges, providing plain-language summaries and observations.
              </p>
            </div>

            {/* Step 03 */}
            <div className="beat-card p-8 space-y-4 hover:border-[#1687E8]">
              <div className="text-4xl font-black text-[#F45B75]/20">03</div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#F45B75] flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1F33]">Track</h3>
              <p className="text-sm text-slate-600">
                Build your long-term health history across multiple reports and observe trends as they develop over time.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. MEDICAL REPORT ANALYSIS SECTION */}
      <section id="report-analysis" className="py-20">
        <div className="beat-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Mock Report Box */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-xs font-bold text-[#1687E8]">BEAT REPORT PARSER</div>
                <div className="text-base font-bold text-[#0B1F33]">Comprehensive Metabolic Report</div>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold">Processed</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl font-medium">
                <span className="font-bold text-[#0B1F33]">Fasting Blood Glucose</span>
                <span className="font-extrabold text-[#0B1F33]">120 mg/dL</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl font-medium">
                <span className="font-bold text-[#0B1F33]">Total Cholesterol</span>
                <span className="font-extrabold text-[#0B1F33]">210 mg/dL</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl font-medium">
                <span className="font-bold text-[#0B1F33]">Systolic Blood Pressure</span>
                <span className="font-extrabold text-[#0B1F33]">124 mmHg</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl font-medium">
                <span className="font-bold text-[#0B1F33]">Hemoglobin (Hb)</span>
                <span className="font-extrabold text-[#0B1F33]">13.2 g/dL</span>
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33] leading-tight">
              Your reports shouldn't feel like a puzzle.
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Medical reports are filled with acronyms, reference bounds, and clinical codes. Beat extracts key parameters and presents them cleanly.
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm font-bold text-[#0B1F33]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#1687E8]" /> Blood Sugar
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#1687E8]" /> Total Cholesterol
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#1687E8]" /> Blood Pressure
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#1687E8]" /> Hemoglobin
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#1687E8]" /> Heart Rate
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#1687E8]" /> Thyroid (TSH)
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. PERSONALIZED HEALTH TIMELINE */}
      <section id="health-timeline" className="py-20 bg-white border-y border-slate-200/80">
        <div className="beat-container space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#1687E8] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              <TrendingUp className="w-3.5 h-3.5" /> Longitudinal Health History
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33]">
              Personalized Health Timeline
            </h2>
            <p className="text-slate-600 text-sm">
              Beat turns individual medical reports into a continuous view of your health history over time.
            </p>
          </div>

          <div className="bg-[#F6F9FC] p-8 sm:p-12 rounded-3xl border border-slate-200/80 space-y-8">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-200 pb-6">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase">PARAMETER PROGRESSION TRAJECTORY</div>
                <div className="text-2xl font-extrabold text-[#0B1F33]">Blood Glucose & Cholesterol Over Time</div>
              </div>

              <div className="flex items-center gap-6 text-xs font-bold">
                <span className="flex items-center gap-2 text-[#1687E8]">
                  <span className="w-3 h-3 rounded-full bg-[#1687E8]"></span> Blood Sugar (mg/dL)
                </span>
                <span className="flex items-center gap-2 text-[#F45B75]">
                  <span className="w-3 h-3 rounded-full bg-[#F45B75]"></span> Cholesterol (mg/dL)
                </span>
              </div>
            </div>

            {/* Timeline Stepper Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="text-xs font-extrabold text-[#1687E8] bg-sky-50 px-2.5 py-1 rounded-md inline-block">JAN 2026</div>
                <div className="text-sm font-bold text-[#0B1F33]">Annual Health Checkup</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Blood Sugar:</span>
                    <strong className="text-[#0B1F33]">105 mg/dL</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cholesterol:</span>
                    <strong className="text-[#0B1F33]">180 mg/dL</strong>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="text-xs font-extrabold text-[#1687E8] bg-sky-50 px-2.5 py-1 rounded-md inline-block">MAR 2026</div>
                <div className="text-sm font-bold text-[#0B1F33]">Metabolic Panel</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Blood Sugar:</span>
                    <strong className="text-[#0B1F33]">112 mg/dL (+7)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cholesterol:</span>
                    <strong className="text-[#0B1F33]">195 mg/dL (+15)</strong>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="text-xs font-extrabold text-[#F45B75] bg-rose-50 px-2.5 py-1 rounded-md inline-block">JUN 2026</div>
                <div className="text-sm font-bold text-[#0B1F33]">Mid-Year Health Review</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Blood Sugar:</span>
                    <strong className="text-[#0B1F33]">120 mg/dL (+8)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cholesterol:</span>
                    <strong className="text-[#0B1F33]">210 mg/dL (+15)</strong>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. BEAT AI SECTION */}
      <section id="beat-ai" className="py-20">
        <div className="beat-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F45B75] bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
              <Heart className="w-3.5 h-3.5 fill-[#F45B75]" /> Beat AI Assistant
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33]">
              Meet Beat AI
            </h2>

            <p className="text-lg text-slate-600 font-medium">
              Your reports are complex. Your questions don't have to be.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Ask natural questions about your uploaded medical reports. Beat AI provides context-aware, cited explanations grounded in your data.
            </p>

            <div className="pt-2">
              <button
                onClick={onExplore}
                className="beat-btn-heart cursor-pointer text-sm px-6 py-3"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Ask Beat AI</span>
              </button>
            </div>
          </div>

          {/* Interactive Chat UI Demo Box */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-full bg-[#F45B75] text-white flex items-center justify-center font-bold">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#0B1F33]">Beat AI Assistant</div>
                <div className="text-xs text-slate-400">Using: June 2026 Health Report</div>
              </div>
            </div>

            {/* Chat Messages Demo */}
            <div className="space-y-3 text-xs">
              <div className="bg-slate-100 p-3 rounded-2xl rounded-tr-none ml-auto max-w-xs text-[#0B1F33] font-medium">
                What changed in my latest report?
              </div>

              <div className="bg-sky-50/70 p-3.5 rounded-2xl rounded-tl-none border border-sky-100 text-slate-700 leading-relaxed space-y-2">
                <div>In your June 2026 report, your Fasting Blood Sugar measured 120 mg/dL (an increase from 112 mg/dL in March), and Total Cholesterol measured 210 mg/dL.</div>
                <div className="text-[10px] text-sky-700 font-bold">Source: User Report dated 2026-06-10</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. PRIVACY & TRUST */}
      <section id="privacy" className="py-16 bg-white border-t border-slate-200/80">
        <div className="beat-container space-y-8 text-center max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#1687E8] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-[#0B1F33]">
            Privacy & Security First
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed">
            Your medical records belong exclusively to you. Beat encrypts all data locally and never shares or sells patient health information.
          </p>
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-r from-[#0B1F33] via-[#1687E8] to-[#0B1F33] text-white">
        <div className="beat-container text-center space-y-6 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to understand your health history?
          </h2>
          <p className="text-sky-100 text-sm">
            Upload your medical report today and experience Beat AI.
          </p>

          <button
            onClick={onGetStarted}
            className="beat-btn-heart cursor-pointer text-base px-8 py-4 shadow-xl mx-auto"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Your Report Now</span>
          </button>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-[#0B1F33] text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="beat-container space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <Logo size="medium" />

            <div className="flex items-center gap-6 font-semibold">
              <a href="#how-it-works" className="hover:text-white">How It Works</a>
              <a href="#report-analysis" className="hover:text-white">Report Analysis</a>
              <a href="#health-timeline" className="hover:text-white">Health Timeline</a>
              <a href="#privacy" className="hover:text-white">Privacy</a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500">
            <div>Beat ❤️ © {new Date().getFullYear()} • Your Health, Our Pulse</div>
            <div>Beat provides health-information support and does not replace medical advice.</div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
