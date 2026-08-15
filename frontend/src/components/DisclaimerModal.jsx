import React from 'react';
import { X, Info, ShieldCheck } from 'lucide-react';

const DisclaimerModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100 relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-sky-700">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Health Information Notice</h3>
            <p className="text-xs text-slate-500">Important guidance regarding Beat</p>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
          <p>
            <strong>Beat ❤️</strong> is designed as a personal healthcare information and monitoring platform to help you track medical report parameters over time and understand laboratory terminology.
          </p>
          <p>
            <strong>Important Boundaries:</strong> Beat does not perform medical diagnosis, provide clinical treatment plans, or issue automated prescribing decisions.
          </p>
          <p>
            Always consult a qualified doctor, physician, or healthcare provider for medical evaluations, symptomatic concerns, or treatment changes.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="beat-btn-primary text-xs px-5 py-2.5"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};

export default DisclaimerModal;
