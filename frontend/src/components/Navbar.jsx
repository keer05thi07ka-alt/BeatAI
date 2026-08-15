import React, { useState } from 'react';
import Logo from './Logo';
import UserProfileModal from './UserProfileModal';
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  GitCompare,
  Heart,
  Plus,
  Menu,
  X
} from 'lucide-react';

const Navbar = ({ currentUser, activeTab, setActiveTab, onQuickUploadClick, onLogout, onSwitchToDemo }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reports', label: 'My Reports', icon: FileText },
    { id: 'trends', label: 'Health', icon: TrendingUp },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'assistant', label: 'Beat AI', icon: Heart },
  ];

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const user = currentUser || {
    name: 'Alex Morgan',
    email: 'alex.morgan@beat.health',
    patientId: 'PAT-8921',
    initials: 'AM',
    isDemo: true
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="beat-container flex items-center justify-between h-20">
        
        {/* Logo & Tagline */}
        <button
          onClick={() => handleTabSelect('dashboard')}
          className="focus:outline-hidden cursor-pointer"
        >
          <Logo size="medium" />
        </button>

        {/* Desktop Navigation Items */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#1687E8] shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-[#0B1F33] hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1687E8]' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3 relative">
          
          <button
            onClick={onQuickUploadClick}
            className="beat-btn-primary cursor-pointer text-xs sm:text-sm px-4 py-2.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Upload Report</span>
            <span className="sm:hidden">Upload</span>
          </button>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1687E8] to-[#0B1F33] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user.initials}
              </div>
              <div className="hidden lg:flex flex-col text-left text-xs leading-tight pr-1">
                <span className="font-bold text-[#0B1F33]">{user.name}</span>
                <span className="text-slate-400">{user.patientId}</span>
              </div>
            </button>

            <UserProfileModal
              isOpen={showProfile}
              currentUser={user}
              onClose={() => setShowProfile(false)}
              onLogout={onLogout}
              onSwitchToDemo={onSwitchToDemo}
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden py-3 border-t border-slate-100 space-y-1 animate-fade-in px-4 pb-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? 'bg-sky-50 text-[#1687E8]' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-[#1687E8]" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}

    </header>
  );
};

export default Navbar;
