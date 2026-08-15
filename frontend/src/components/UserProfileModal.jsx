import React from 'react';
import { User, Settings, Shield, LogOut, X, Sparkles } from 'lucide-react';

const UserProfileModal = ({ isOpen, currentUser, onClose, onLogout, onSwitchToDemo }) => {
  if (!isOpen) return null;

  const user = currentUser || {
    name: 'Alex Morgan',
    email: 'alex.morgan@beat.health',
    patientId: 'PAT-8921',
    initials: 'AM',
    isDemo: true
  };

  return (
    <div className="absolute right-0 top-14 z-50 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 space-y-3 animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1687E8] to-[#0B1F33] text-white flex items-center justify-center font-bold text-sm">
            {user.initials}
          </div>
          <div>
            <div className="font-bold text-sm text-[#0B1F33]">{user.name}</div>
            <div className="text-xs text-slate-400">{user.email || user.patientId}</div>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1 text-xs font-medium text-slate-700">
        <button
          onClick={onClose}
          className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <User className="w-4 h-4 text-slate-500" />
          <span>Patient Profile ({user.patientId})</span>
        </button>
        
        {!user.isDemo && onSwitchToDemo && (
          <button
            onClick={() => {
              onClose();
              onSwitchToDemo();
            }}
            className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl bg-sky-50 text-[#1687E8] font-bold hover:bg-sky-100 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#1687E8]" />
            <span>Load Demo Account Data</span>
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Account Settings</span>
        </button>
        <button
          onClick={onClose}
          className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Shield className="w-4 h-4 text-slate-500" />
          <span>Privacy & Data Controls</span>
        </button>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={() => {
            onClose();
            if (onLogout) onLogout();
          }}
          className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors font-semibold text-xs cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfileModal;
