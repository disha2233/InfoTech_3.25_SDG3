
import React, { useState } from 'react';
import { 
  ShieldAlert, MapPin, User, Phone, Mail, 
  Activity, CheckCircle2, Siren, Star,
  ArrowRight, ShieldCheck, Loader2, Clock
} from 'lucide-react';
import { EmergencyRequest, AmbulanceDetails } from '../types';

interface DispatcherPortalProps {
  request: EmergencyRequest;
  suggestions: AmbulanceDetails[];
  onAssign: (ambulance: AmbulanceDetails) => void;
}

export const DispatcherPortal: React.FC<DispatcherPortalProps> = ({ request, suggestions, onAssign }) => {
  const [selectedUnit, setSelectedUnit] = useState<AmbulanceDetails | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleApprove = () => {
    if (!selectedUnit) return;
    setIsAssigning(true);
    setTimeout(() => {
      onAssign(selectedUnit);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Inter'] flex flex-col p-4 md:p-8">
      {/* Tactical Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 p-2.5 rounded-xl shadow-lg shadow-red-500/20 animate-pulse">
            <Siren size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-widest text-white font-['Space_Grotesk']">
              Command <span className="text-red-500">Center</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operator ID: DISP-ALPHA-09</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Load</span>
             <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Normal - 1.2s Latency</span>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Network Active</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Incoming Request Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldAlert size={120} />
             </div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-red-500 text-[10px] font-black uppercase tracking-widest">
                    Priority Alpha
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Received {new Date(request.timestamp).toLocaleTimeString()}</span>
                </div>

                <h2 className="text-3xl font-black text-white mb-8 tracking-tight font-['Space_Grotesk']">Incoming SOS</h2>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Patient Identity</p>
                      <p className="text-lg font-black text-white">{request.patientName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Mobile</p>
                      <p className="text-sm font-bold text-white flex items-center gap-2"><Phone size={14} className="text-slate-400" /> {request.mobile}</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Email</p>
                      <p className="text-sm font-bold text-white flex items-center gap-2 truncate"><Mail size={14} className="text-slate-400" /> {request.email}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl space-y-3">
                    <div className="flex items-center gap-3">
                      <Activity size={18} className="text-red-500" />
                      <p className="text-xs font-black uppercase tracking-widest text-red-500">Emergency Type</p>
                    </div>
                    <p className="text-xl font-black text-white">{request.emergencyType}</p>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed italic">"{request.whatHappened}"</p>
                  </div>

                  <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-emerald-500" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Coordinates</p>
                        <p className="text-xs font-mono text-slate-300">{request.latitude.toFixed(4)}, {request.longitude.toFixed(4)}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      View Map
                    </button>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Suggestion Board */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex-grow shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white font-['Space_Grotesk'] tracking-tight">Nearest Responders</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Suggested Based on specialty</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                 <Loader2 size={12} className="animate-spin" />
                 Updating Live
              </div>
            </div>

            <div className="grid gap-4">
              {suggestions.map((unit) => (
                <button 
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit)}
                  className={`flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl border transition-all text-left group ${
                    selectedUnit?.id === unit.id 
                    ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-900/20' 
                    : 'bg-slate-800/30 border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="relative">
                    <img src={unit.avatar} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-slate-500 transition-all" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center text-white border-2 border-slate-800">
                      <ShieldCheck size={12} />
                    </div>
                  </div>
                  
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className={`text-lg font-black font-['Space_Grotesk'] ${selectedUnit?.id === unit.id ? 'text-white' : 'text-slate-100'}`}>{unit.driverName}</h4>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${selectedUnit?.id === unit.id ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'}`}>
                        {unit.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className={`text-xs font-bold ${selectedUnit?.id === unit.id ? 'text-blue-100' : 'text-slate-400'}`}>{unit.specialty}</span>
                       <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-500 fill-yellow-500" />
                          <span className={`text-xs font-black ${selectedUnit?.id === unit.id ? 'text-white' : 'text-slate-300'}`}>{unit.rating}</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 md:border-l md:border-slate-700/50 md:pl-6 text-center md:text-right">
                    <div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest block mb-0.5 ${selectedUnit?.id === unit.id ? 'text-blue-200' : 'text-slate-500'}`}>Arrival ETA</span>
                      <span className={`text-2xl font-black tabular-nums ${selectedUnit?.id === unit.id ? 'text-white' : 'text-slate-100'}`}>{unit.eta}</span>
                    </div>
                    {selectedUnit?.id === unit.id && (
                       <div className="bg-white/20 p-2 rounded-xl text-white">
                          <CheckCircle2 size={24} />
                       </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
             <button className="flex-1 py-6 bg-slate-900 border border-slate-800 text-slate-400 font-black uppercase tracking-widest text-xs rounded-[2rem] hover:bg-slate-800 transition-all">
                Reject Request
             </button>
             <button 
                onClick={handleApprove}
                disabled={!selectedUnit || isAssigning}
                className={`flex-[2] py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-2xl transform active:scale-[0.98] ${
                  !selectedUnit 
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/30'
                }`}
             >
                {isAssigning ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Assigning Unit...
                  </>
                ) : (
                  <>
                    Approve & Assign Unit
                    <ArrowRight size={18} />
                  </>
                )}
             </button>
          </div>
        </div>
      </main>

      <footer className="mt-12 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-900 pt-8 opacity-40">
         <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>Protocol V4.2</span>
            <span>Encryption Active</span>
            <span className="flex items-center gap-1.5"><Clock size={12} /> T-Zero Sync</span>
         </div>
         <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Government Emergency Response Network Access Only</p>
      </footer>
    </div>
  );
};
