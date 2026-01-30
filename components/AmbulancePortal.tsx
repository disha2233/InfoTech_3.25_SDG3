
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, Siren, Activity, User, HeartPulse,
  ShieldAlert, Edit3, X, Save, ClipboardList, CheckCircle2,
  Plus, Navigation, Building2, Clock, MapPin,
  ChevronRight, Compass, Locate, AlertTriangle
} from 'lucide-react';
import { PatientRequest, MedicalRecord } from '../types';

interface AmbulancePortalProps {
  onExit: () => void;
  onComplete: (record: MedicalRecord) => void;
  onNotifyImminentArrival?: () => void;
  patientName: string;
  emergencyType: string;
}

const NEAREST_HOSPITAL = {
  name: "St. Jude Medical Center",
  distance: "2.4 miles",
  eta: "6 min",
  address: "100 Medical Plaza, Tampa"
};

const AMBULANCE_UNIT_ID = 'UNIT-S12';

export const AmbulancePortal: React.FC<AmbulancePortalProps> = ({ onExit, onComplete, onNotifyImminentArrival, patientName, emergencyType }) => {
  const [activeTab, setActiveTab] = useState<'vitals' | 'nav'>('vitals');
  const [currentPulse, setCurrentPulse] = useState<number | null>(null);
  const [currentBp, setCurrentBp] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('No data recorded');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showVitalsModal, setShowVitalsModal] = useState(false);

  const [editBp, setEditBp] = useState('');
  const [editPulse, setEditPulse] = useState('');

  // Local state for the active mission based on the prop
  const missionDetails: PatientRequest = {
    id: 'ACTIVE-DISPATCH',
    name: patientName,
    location: 'Current Location Override',
    emergencyType: emergencyType,
    distance: 'Calculating...',
    vitals: {
      bp: '',
      pulse: null
    }
  };

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpdateVitals = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentBp(editBp);
    setCurrentPulse(parseInt(editPulse) || 0);
    const now = new Date();
    setLastUpdated(`Logged at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    setShowVitalsModal(false);
  };

  const handleFinalize = () => {
    if (!currentBp || currentPulse === null) return;

    const now = new Date();
    const record: MedicalRecord = {
      id: Math.random().toString(36).substr(2, 9),
      patientName: patientName,
      timestamp: new Date().toLocaleString(),
      arrivalTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emergencyType: emergencyType,
      bp: currentBp,
      pulse: currentPulse,
      ambulanceId: AMBULANCE_UNIT_ID,
      status: 'Arrived'
    };

    onComplete(record);
  };

  const hasData = currentBp !== '' && currentPulse !== null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-['Inter'] flex flex-col">
      <header className="bg-white border-b border-slate-200 p-5 flex items-center justify-between shadow-sm sticky top-0 z-[60]">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="p-2.5 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200">
            <ChevronLeft size={20} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Siren size={18} className="text-red-500" />
              {AMBULANCE_UNIT_ID} Dashboard
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Active Mission</p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('vitals')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'vitals' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Activity size={14} /> Patient Care
          </button>
          <button
            onClick={() => setActiveTab('nav')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'nav' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Navigation size={14} /> Navigation
          </button>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-1">Trip Time</span>
          <span className="text-xl font-bold tabular-nums text-slate-900">{formatTime(elapsedSeconds)}</span>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">

          {activeTab === 'vitals' ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 border-l-8 border-l-red-500">
                <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 shrink-0">
                  <User size={48} strokeWidth={1.5} />
                </div>
                <div className="space-y-2 text-center md:text-left flex-grow">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase">Incoming Patient</span>
                    <span className="text-slate-400 font-medium text-[10px] uppercase tracking-widest">Unit: {AMBULANCE_UNIT_ID}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 leading-tight">{patientName}</h2>
                  <p className="text-base text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                    <ShieldAlert size={18} className="text-orange-500" />
                    {emergencyType}
                  </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl text-center md:text-right border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Mission Source</span>
                  <p className="text-sm font-bold text-slate-700">Rapid Response Dispatch</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div
                  className={`bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col justify-between h-72 transition-all cursor-pointer shadow-sm hover:shadow-xl ${!currentBp ? 'border-dashed border-slate-300 bg-slate-50/50' : 'hover:border-blue-200'}`}
                  onClick={() => setShowVitalsModal(true)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Blood Pressure</span>
                      <span className={`text-[10px] font-medium mt-1 inline-block ${currentBp ? 'text-blue-500' : 'text-slate-400'}`}>
                        {currentBp ? lastUpdated : 'Measurement Required'}
                      </span>
                    </div>
                    <div className={`p-4 rounded-2xl ${currentBp ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-400'}`}>
                      <Activity size={28} />
                    </div>
                  </div>
                  <div>
                    {currentBp ? (
                      <h3 className="text-6xl font-black text-slate-900 leading-none tracking-tighter">{currentBp}</h3>
                    ) : (
                      <div className="flex items-center gap-3 text-slate-300">
                        <Plus size={40} />
                        <span className="text-2xl font-bold uppercase tracking-tight">Log BP</span>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={`bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col justify-between h-72 transition-all cursor-pointer shadow-sm hover:shadow-xl ${currentPulse === null ? 'border-dashed border-slate-300 bg-slate-50/50' : 'hover:border-red-200'}`}
                  onClick={() => setShowVitalsModal(true)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Heart Rate</span>
                      <span className={`text-[10px] font-medium mt-1 inline-block ${currentPulse !== null ? 'text-red-500' : 'text-slate-400'}`}>
                        {currentPulse !== null ? lastUpdated : 'Measurement Required'}
                      </span>
                    </div>
                    <div className={`p-4 rounded-2xl ${currentPulse !== null ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400'}`}>
                      <HeartPulse size={28} />
                    </div>
                  </div>
                  <div>
                    {currentPulse !== null ? (
                      <h3 className="text-6xl font-black text-red-600 leading-none tracking-tighter">
                        {currentPulse}
                        <span className="text-2xl text-slate-400 ml-3 font-medium uppercase tracking-widest">BPM</span>
                      </h3>
                    ) : (
                      <div className="flex items-center gap-3 text-slate-300">
                        <Plus size={40} />
                        <span className="text-2xl font-bold uppercase tracking-tight">Log Pulse</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Building2 size={24} />
                      </div>
                      <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Hospital Destination</h3>
                    </div>
                    <div className="space-y-6 flex-grow">
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 mb-1">{NEAREST_HOSPITAL.name}</h4>
                        <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5"><MapPin size={14} />{NEAREST_HOSPITAL.address}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Distance</span>
                          <span className="text-lg font-bold text-slate-900">{NEAREST_HOSPITAL.distance}</span>
                        </div>
                        <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                          <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block mb-1">ETA</span>
                          <span className="text-lg font-bold text-red-600">{NEAREST_HOSPITAL.eta}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={handleFinalize} disabled={!hasData} className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 mt-4 shadow-lg ${hasData ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                      {hasData ? 'Deliver to Hospital' : 'Log Vitals to Finish'}
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-2 relative bg-slate-200 rounded-3xl overflow-hidden shadow-inner border border-slate-300">
                  <div className="absolute inset-0 bg-cover bg-center grayscale-[20%] opacity-90" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000')` }} />
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <button className="p-3 bg-white border border-slate-200 rounded-xl shadow-lg text-slate-600"><Compass size={20} /></button>
                    <button className="p-3 bg-white border border-slate-200 rounded-xl shadow-lg text-slate-600"><Locate size={20} /></button>
                  </div>
                  <div className="absolute left-[35%] bottom-[35%] animate-bounce">
                    <div className="relative">
                      <div className="absolute inset-[-15px] bg-red-500/20 rounded-full animate-ping" />
                      <div className="bg-red-600 p-2.5 rounded-xl shadow-xl text-white border-2 border-white rotate-12">
                        <Siren size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {showVitalsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-md" onClick={() => setShowVitalsModal(false)} />
            <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
              <button onClick={() => setShowVitalsModal(false)} className="absolute top-8 right-8 p-3 text-slate-400 hover:bg-slate-50 rounded-xl">
                <X size={20} />
              </button>
              <div className="mb-10 text-center">
                <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                  <Activity size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Triage Record</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Manual vitals entry for {patientName}.</p>
              </div>
              <form onSubmit={handleUpdateVitals} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Pressure</label>
                  <input type="text" value={editBp} onChange={(e) => setEditBp(e.target.value)} placeholder="120/80" required className="w-full px-6 py-5 bg-slate-50 border border-slate-100 focus:border-blue-400 rounded-2xl outline-none text-slate-900 font-black text-3xl transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pulse (BPM)</label>
                  <input type="number" value={editPulse} onChange={(e) => setEditPulse(e.target.value)} placeholder="72" required className="w-full px-6 py-5 bg-slate-50 border border-slate-200 focus:border-red-400 rounded-2xl outline-none text-slate-900 font-black text-3xl transition-all" />
                </div>
                <div className="pt-6 grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setShowVitalsModal(false)} className="py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl text-sm">Cancel</button>
                  <button type="submit" className="py-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg text-sm">Update Vitals</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Floating Alert Hospital Button */}
        <div className="fixed bottom-32 right-6 z-50">
          <button
            onClick={onNotifyImminentArrival}
            className="bg-red-600 text-white p-4 rounded-full shadow-lg shadow-red-500/40 hover:scale-110 transition-transform active:scale-95 flex items-center justify-center border-4 border-white"
            title="Notify Hospital of Arrival"
          >
            <Siren size={24} className="animate-pulse" />
          </button>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 p-6 flex items-center justify-center sticky bottom-0 z-[60]">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-3 text-slate-400">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Medical Protocol Verified</span>
          </div>
          <button
            onClick={handleFinalize}
            disabled={!hasData}
            className={`flex-1 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] ${hasData ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            {hasData ? 'Confirm Handover to ER' : 'Capture Patient Vitals to Finalize'}
          </button>
        </div>
      </footer>
    </div>
  );
};
