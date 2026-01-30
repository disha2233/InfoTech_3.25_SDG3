
import React, { useState } from 'react';
import { Sparkles, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getFirstAidGuidance } from '../services/gemini';
import { EmergencyAction } from '../types';

export const AiAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmergencyAction | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setResult(null);
    try {
      const data = await getFirstAidGuidance(query);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_20%_20%,#ef4444_0%,transparent_50%)]" />
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 text-red-400 rounded-full border border-red-500/20">
            <Sparkles size={14} />
            <span className="text-[10px] uppercase font-bold tracking-widest">Beta AI Support</span>
          </div>
          <h2 className="text-4xl font-black">AI First Aid Assistant</h2>
          <p className="text-slate-400 font-medium">Get instant, reliable first aid instructions for any situation.</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl p-6 md:p-10 rounded-[2.5rem] border border-slate-700 shadow-2xl">
          <form onSubmit={handleAsk} className="relative group">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.g., Severe bleeding, Choking, Burn treatment..."
              className="w-full pl-6 pr-24 py-6 bg-slate-900 text-white border-2 border-slate-700 focus:border-red-500 rounded-2xl outline-none transition-all placeholder:text-slate-600 text-lg font-medium"
            />
            <button 
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-lg shadow-red-900/40 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={24} />
              )}
            </button>
          </form>

          {result && (
            <div className="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">{result.title}</h3>
                <span className={`px-4 py-1 rounded-full text-[10px] uppercase font-black border ${
                  result.severity === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                  result.severity === 'medium' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 
                  'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}>
                  {result.severity} Priority
                </span>
              </div>
              
              <div className="grid gap-4">
                {result.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-5 bg-slate-900/50 border border-slate-700 rounded-2xl group hover:border-red-500/50 transition-all">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center font-black text-sm border border-red-500/20">
                      {idx + 1}
                    </div>
                    <p className="text-slate-300 font-medium leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-3">
                <AlertTriangle className="text-orange-400 shrink-0" size={20} />
                <p className="text-xs text-orange-200 font-medium">
                  Disclaimer: AI guidance is for informational purposes. Always contact local emergency services immediately in a life-threatening situation.
                </p>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Heat Stroke', 'Allergic Reaction', 'Seizure Response', 'CPR Technique'].map((suggestion) => (
                <button 
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="flex items-center gap-3 p-4 bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl border border-slate-700 transition-all text-left group"
                >
                  <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-red-600 transition-colors">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="font-bold">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
