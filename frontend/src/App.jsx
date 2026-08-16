import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ReportAnalyzer from './components/ReportAnalyzer';
import HealthHistory from './components/HealthHistory';
import ReportComparator from './components/ReportComparator';
import HealthcareAssistant from './components/HealthcareAssistant';
import Logo from './components/Logo';
import DisclaimerModal from './components/DisclaimerModal';
import { api, setUserEmail } from './api';
import { Info } from 'lucide-react';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'login', 'app'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [currentUser, setCurrentUser] = useState({
    name: 'Alex Morgan',
    email: 'demo@beat.health',
    patientId: 'PAT-8921',
    initials: 'AM',
    isDemo: true
  });

  const [reports, setReports] = useState([]);
  const [trends, setTrends] = useState(null);
  const [selectedReportForAnalysis, setSelectedReportForAnalysis] = useState(null);
  const [comparePrevId, setComparePrevId] = useState(null);
  const [compareLatestId, setCompareLatestId] = useState(null);
  const [showFooterNoticeModal, setShowFooterNoticeModal] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.email) {
      setUserEmail(currentUser.email);
    }
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      if (currentUser && currentUser.email) {
        setUserEmail(currentUser.email);
      }
      const reportsData = await api.getReports();
      if (reportsData) setReports(reportsData);

      const trendsData = await api.getTrends();
      if (trendsData) setTrends(trendsData);
    } catch (err) {
      console.warn("Backend connection fetch issue:", err);
    }
  };

  const handleLoginSuccess = async (userPayload) => {
    setSelectedReportForAnalysis(null);
    setComparePrevId(null);
    setCompareLatestId(null);
    if (userPayload) {
      setCurrentUser(userPayload);
      setUserEmail(userPayload.email);
      try {
        const reportsData = await api.getReports();
        setReports(reportsData || []);
        const trendsData = await api.getTrends();
        setTrends(trendsData || null);
      } catch (err) {
        console.warn("Fetch error after login:", err);
        setReports([]);
        setTrends(null);
      }
    }
    setActiveTab('dashboard');
    setView('app');
  };

  const handleLogout = () => {
    setSelectedReportForAnalysis(null);
    setComparePrevId(null);
    setCompareLatestId(null);
    setUserEmail('demo@beat.health');
    setView('login');
  };

  const handleSwitchToDemo = async () => {
    const demoUser = {
      name: 'Alex Morgan',
      email: 'demo@beat.health',
      patientId: 'PAT-8921',
      initials: 'AM',
      isDemo: true
    };
    setCurrentUser(demoUser);
    setUserEmail(demoUser.email);
    try {
      await api.seedSample();
      const reportsData = await api.getReports();
      setReports(reportsData || []);
      const trendsData = await api.getTrends();
      setTrends(trendsData || null);
    } catch (err) {
      console.warn("Error switching to demo mode:", err);
    }
  };

  const handleReportUploaded = (newReport) => {
    setSelectedReportForAnalysis(newReport);
    fetchInitialData();
  };

  const handleSelectCompare = (reportId) => {
    setCompareLatestId(reportId);
    setActiveTab('compare');
  };

  if (view === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => {
          setActiveTab('reports');
          setView('app');
        }}
        onExplore={() => {
          setActiveTab('dashboard');
          setView('app');
        }}
        onNavigateLogin={() => setView('login')}
      />
    );
  }

  if (view === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateHome={() => setView('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F9FC] text-[#0B1F33] font-sans selection:bg-[#1687E8] selection:text-white">
      
      {/* Top Patient Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNavigateHome={() => setView('landing')}
        onLogout={handleLogout}
        onSwitchToDemo={handleSwitchToDemo}
      />

      {/* Main Patient Companion Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && (
          <Dashboard
            currentUser={currentUser}
            reports={reports}
            trends={trends}
            setActiveTab={setActiveTab}
            setSelectedReportForAnalysis={setSelectedReportForAnalysis}
            onSelectCompareReports={handleSelectCompare}
            onSwitchToDemo={handleSwitchToDemo}
          />
        )}

        {(activeTab === 'reports' || activeTab === 'analyzer') && (
          <ReportAnalyzer
            reports={reports}
            onUploadSuccess={handleReportUploaded}
            selectedReport={selectedReportForAnalysis}
            setActiveTab={setActiveTab}
            onSelectCompareReports={handleSelectCompare}
          />
        )}

        {activeTab === 'trends' && (
          <HealthHistory trends={trends} />
        )}

        {activeTab === 'compare' && (
          <ReportComparator
            reports={reports}
            preselectedPrevId={comparePrevId}
            preselectedLatestId={compareLatestId}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'assistant' && (
          <HealthcareAssistant
            currentUser={currentUser}
            reports={reports}
            selectedReport={selectedReportForAnalysis}
          />
        )}

      </main>

      {/* Modern Patient Portal Footer */}
      <footer className="bg-[#0B1F33] text-slate-400 border-t border-slate-800 py-10 mt-16 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="text-xs text-slate-500 font-medium border-l border-slate-700 pl-3">
                Patient Medical Record & AI Companion
              </span>
            </div>

            <div className="flex items-center gap-6 text-xs font-semibold text-slate-300">
              <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors cursor-pointer">Dashboard</button>
              <button onClick={() => setActiveTab('reports')} className="hover:text-white transition-colors cursor-pointer">My Reports</button>
              <button onClick={() => setActiveTab('trends')} className="hover:text-white transition-colors cursor-pointer">Health Trends</button>
              <button onClick={() => setActiveTab('compare')} className="hover:text-white transition-colors cursor-pointer">Report Comparison</button>
              <button onClick={() => setActiveTab('assistant')} className="hover:text-white transition-colors cursor-pointer">Beat AI Assistant</button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/60 text-center text-xs text-slate-400 space-y-2 max-w-4xl mx-auto">
            <p>
              Beat is an informational and health monitoring platform designed for personal tracking and educational purposes. Beat does not provide medical diagnoses or replace consultations with licensed healthcare professionals.
            </p>
            <div className="flex items-center justify-center gap-4 text-slate-400 pt-2 font-medium">
              <span>© {new Date().getFullYear()} Beat. All rights reserved.</span>
              <button
                onClick={() => setShowFooterNoticeModal(true)}
                className="text-[#1687E8] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
              >
                <Info className="w-3.5 h-3.5" /> Medical Disclaimer & Terms
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer Disclaimer Modal */}
      <DisclaimerModal
        isOpen={showFooterNoticeModal}
        onClose={() => setShowFooterNoticeModal(false)}
      />

    </div>
  );
}

export default App;
