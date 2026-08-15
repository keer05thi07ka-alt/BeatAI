import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api';
import {
  Heart,
  Send,
  Sparkles,
  FileText,
  User,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const HealthcareAssistant = ({ reports, activeReport }) => {
  const [selectedReportId, setSelectedReportId] = useState(activeReport ? activeReport.id : (reports && reports.length > 0 ? reports[reports.length - 1].id : null));
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello Alex! I am your Beat Healthcare Assistant. I can answer any questions about your selected medical report, parameter values, reference ranges, and health trends. Ask me anything!",
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: q
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const data = await api.chatAssistant(q, selectedReportId);

      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: data.answer,
        sources: data.sources || []
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] tracking-tight flex items-center gap-2">
            <Heart className="w-7 h-7 text-[#F45B75] fill-[#F45B75]" />
            Ask Beat AI
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Your friendly AI healthcare companion. Ask anything about your selected medical report.
          </p>
        </div>

        {/* Report Selector */}
        <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
          <FileText className="w-4 h-4 text-[#1687E8] shrink-0 ml-2" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Report:</span>
          <select
            value={selectedReportId || ''}
            onChange={(e) => setSelectedReportId(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-hidden cursor-pointer"
          >
            <option value="">All Uploaded Reports</option>
            {reports && reports.map((r) => (
              <option key={r.id} value={r.id}>
                {r.report_date} — {r.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Container */}
      <div className="beat-card flex flex-col h-[560px] bg-slate-50/50 overflow-hidden border border-slate-200/80 shadow-md rounded-3xl">
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#0B1F33] text-white'
                    : 'bg-gradient-to-tr from-[#F45B75] to-[#1687E8] text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Heart className="w-5 h-5 fill-white" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0B1F33] text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-tl-none space-y-3'
                }`}
              >
                <div className="whitespace-pre-line font-normal">{msg.text}</div>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="text-xs font-bold text-[#1687E8] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1687E8]" /> Information Sources:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold bg-sky-50 text-[#1687E8] px-2.5 py-0.5 rounded-md border border-sky-100"
                        >
                          {src.title} ({src.source})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F45B75] text-white flex items-center justify-center animate-bounce">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1687E8] animate-spin" />
                <span>Analyzing your query against report data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about your medical report, values, or trends..."
              className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3.5 focus:outline-hidden focus:border-[#1687E8] transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="beat-btn-heart cursor-pointer disabled:opacity-50 px-6 py-3.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

          <div className="mt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> Beat AI provides healthcare information grounded in your report and does not replace medical advice.
          </div>
        </div>

      </div>

    </div>
  );
};

export default HealthcareAssistant;
