import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  BookOpen,
  Search,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Tag
} from 'lucide-react';

const MedicalKnowledge = () => {
  const [docs, setDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    try {
      const data = await api.getKnowledge();
      setDocs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = docs.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-sky-600" />
            Beat Medical Knowledge Base (RAG Corpus)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Trusted clinical reference literature indexed in the RAG vector store for Beat Healthcare Assistant answers.
          </p>
        </div>

        <div className="relative min-w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medical guidelines & terms..."
            className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-hidden focus:border-sky-500 shadow-2xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="beat-card p-6 flex flex-col justify-between space-y-4 hover:border-sky-300">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                  <Tag className="w-3 h-3" /> {doc.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {doc.id}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{doc.title}</h3>
              <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Source: {doc.source}
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {doc.content}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default MedicalKnowledge;
