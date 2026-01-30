
import React, { useState } from 'react';
import {
  Ambulance, ArrowRight, AlertCircle, MapPin,
  ShieldCheck, Loader2, X, User, Mail,
  Phone, Activity, HelpCircle, Radar,
  Siren, CheckCircle2, Navigation
} from 'lucide-react';
import { AmbulanceDetails, EmergencyRequest } from '../types';

interface SplashViewProps {
  onEnter: () => void;
  onDispatcherReview: (request: EmergencyRequest, suggestions: AmbulanceDetails[]) => void;
}

const EMERGENCY_TYPES = [
  "Cardiac / Heart Issue",
  "Trauma / Accident",
  "Respiratory / Breathing",
  "Allergic Reaction",
  "Neurological / Seizure",
  "Other Emergency"
];

const SCENARIOS = [
  "Chest Pain / Pressure",
  "Severe Bleeding",
  "Difficulty Breathing",
  "Loss of Consciousness",
  "Fall or Physical Injury",
  "Sudden Confusion"
];

const AVAILABLE_AMBULANCES: AmbulanceDetails[] = [
  {
    id: 'UNIT-R402',
    driverName: 'Dr. Sarah Chen',
    eta: '4:20',
    specialty: 'Trauma Specialist',
    avatar: 'https://picsum.photos/seed/doctor1/300/300',
    rating: 4.9
  },
  {
    id: 'UNIT-L109',
    driverName: 'Marc Walters',
    eta: '3:15',
    specialty: 'Advanced Paramedic',
    avatar: 'https://picsum.photos/seed/doc2/300/300',
    rating: 4.8
  },
  {
    id: 'UNIT-S550',
    driverName: 'Elena Rodriguez',
    eta: '6:45',
    specialty: 'Cardiac Response',
    avatar: 'https://picsum.photos/seed/doc3/300/300',
    rating: 5.0
  }
];

export const SplashView: React.FC<SplashViewProps> = ({ onEnter, onDispatcherReview }) => {
  const [stage, setStage] = useState<'idle' | 'registration' | 'locating' | 'dispatcher_queue'>('idle');
  const [isLocating, setIsLocating] = useState(false);
  // Reverted: api fetching removed



  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    emergencyType: '',
    whatHappened: ''
  });

  const startEmergencyFlow = () => {
    setIsLocating(true);

    const finishLocating = (coords: { latitude: number; longitude: number }) => {
      setTimeout(() => {
        const request: EmergencyRequest = {
          patientName: 'Anonymous SOS', // Default for SOS
          mobile: 'Unknown',
          email: 'sos@emergency.com',
          emergencyType: 'Critical SOS',
          whatHappened: 'Immediate Assistance Requested',
          latitude: coords.latitude,
          longitude: coords.longitude,
          timestamp: Date.now()
        };

        // Final transition to dispatcher review
        setStage('dispatcher_queue');
        setTimeout(() => {
          setTimeout(() => {
            onDispatcherReview(request, AVAILABLE_AMBULANCES);
          }, 2000);
        }, 2000);
      }, 4000); // Locating animation duration
    };

    if (!navigator.geolocation) {
      finishLocating({ latitude: 27.9478, longitude: -82.4584 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        finishLocating({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => {
        finishLocating({ latitude: 27.9478, longitude: -82.4584 });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSOSClick = () => {
    // Skip registration, go straight to locating
    setStage('locating');
    startEmergencyFlow();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStage('locating');
    // For manual form submit, we might want to keep using formData state
    // But since we are removing the form flow for SOS, this might only be used if we kept the form accessible elsewhere.
    // Logic below handles the "manual" registration if ever needed (but user asked to remove steps).
    // effectively startEmergencyFlow with state values (though now startEmergencyFlow hardcodes SOS defaults above).
    // See note below.
    startEmergencyFlow();
  };

  if (stage === 'locating' || stage === 'dispatcher_queue') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-950 overflow-hidden relative">
        <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-red-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" />

        <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center space-y-12">
          {/* Radar Animation */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 border border-slate-800 rounded-full" />
            <div className="absolute inset-8 border border-slate-800 rounded-full" />
            <div className="absolute inset-16 border border-slate-800 rounded-full" />
            <div className="absolute inset-24 border border-slate-800 rounded-full" />

            <div className="absolute inset-0 bg-conic-gradient from-red-600/20 to-transparent rounded-full animate-[spin_4s_linear_infinite]" />

            <div className="relative z-20 w-24 h-24 bg-red-600 rounded-full shadow-[0_0_60px_rgba(239,68,68,0.4)] flex flex-col items-center justify-center border-4 border-slate-950 animate-pulse">
              <Radar size={40} className="text-white" />
            </div>

            {/* Finding markers */}
            {stage === 'locating' && (
              <>
                <div className="absolute top-10 right-20 w-4 h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-bounce delay-75" />
                <div className="absolute bottom-20 left-10 w-4 h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-bounce delay-300" />
                <div className="absolute top-40 left-32 w-4 h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-bounce delay-700" />
              </>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black text-white font-['Space_Grotesk'] tracking-tight">
              {stage === 'locating' ? 'Locating Nearest Units' : 'Connecting to Dispatcher'}
            </h2>
            <div className="flex flex-col gap-2 items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Live GPS Link Established</span>
              </div>
              <p className="text-sm text-slate-400 font-medium max-w-xs">
                {stage === 'locating'
                  ? 'Scanning for available Trauma and Advanced Life Support units in your vicinity...'
                  : 'Emergency packet received. Waiting for operator assignment...'}
              </p>
            </div>
          </div>

          {stage === 'locating' && (
            <div className="w-full grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
              {AVAILABLE_AMBULANCES.map((unit, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-2xl">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                    <Siren size={20} />
                  </div>
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">{unit.id}</span>
                </div>
              ))}
            </div>
          )}

          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 transition-all duration-3000 ease-in-out" style={{ width: stage === 'locating' ? '60%' : '100%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#fce4ec]/20 backdrop-blur-3xl animate-in fade-in duration-1000 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-rose-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-blue-100/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
        <div className="mb-8 flex items-center gap-2 px-4 py-1.5 bg-white/70 backdrop-blur-md rounded-full border border-white/50 shadow-sm">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Live Dispatch Network</span>
        </div>

        <div className="relative mb-10 float">
          <div className="absolute inset-0 bg-slate-900/5 rounded-[2.5rem] rotate-6 scale-105" />
          <div className="relative z-10 bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-white/60">
            <Ambulance size={64} className="text-red-500" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
        </div>

        <div className="space-y-4 mb-12">
          <h1 className="text-sm font-black text-slate-400 uppercase tracking-[0.4em]">
            Emergency Life Alert
          </h1>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Rapid help, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-orange-400">just one tap away.</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-lg mx-auto bg-white/40 p-6 rounded-[3rem] border border-white/50 backdrop-blur-sm shadow-xl">

          <button
            onClick={handleSOSClick}
            disabled={isLocating}
            className={`group relative w-24 h-24 bg-red-600 text-white flex flex-col items-center justify-center rounded-full shadow-lg shadow-red-500/30 transition-all transform hover:scale-105 active:scale-95 ${isLocating ? 'animate-pulse' : ''}`}
          >
            <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-[ping_2.5s_infinite] opacity-30" />
            <AlertCircle size={32} strokeWidth={2.5} />
            <span className="text-[9px] font-black mt-1 uppercase tracking-widest">SOS</span>
          </button>

          <div className="h-px w-12 md:h-12 md:w-px bg-slate-200/50" />

          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">System Ready</p>
              <p className="text-[10px] font-bold text-slate-400 leading-tight">GPS tracking will be shared with responders upon activation.</p>
            </div>
            <button
              onClick={onEnter}
              className="group flex items-center justify-center gap-4 px-8 py-3 bg-slate-900 text-white rounded-2xl shadow-lg hover:bg-slate-800 transition-all transform active:scale-95"
            >
              <span className="font-bold text-sm tracking-wide">Enter App</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Patient Registration Modal */}
      {stage === 'registration' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setStage('idle')}
          />

          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setStage('idle')}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10 max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="mb-6 text-center">
                <div className="mx-auto w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
                  <AlertCircle size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1 font-['Space_Grotesk'] tracking-tight">
                  Emergency Intake
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Gathering critical data for first responders.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Patient Name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 focus:border-red-400 focus:bg-white rounded-xl transition-all outline-none font-medium text-sm"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 focus:border-red-400 focus:bg-white rounded-xl transition-all outline-none font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 focus:border-red-400 focus:bg-white rounded-xl transition-all outline-none font-medium text-sm"
                  />
                </div>

                <div className="h-px bg-slate-100 my-2" />

                <div className="space-y-4">
                  <div className="relative">
                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      required
                      value={formData.emergencyType}
                      onChange={(e) => setFormData({ ...formData, emergencyType: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 focus:border-red-400 focus:bg-white rounded-xl transition-all outline-none font-medium text-sm appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Emergency Type</option>
                      {EMERGENCY_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      required
                      value={formData.whatHappened}
                      onChange={(e) => setFormData({ ...formData, whatHappened: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 focus:border-red-400 focus:bg-white rounded-xl transition-all outline-none font-medium text-sm appearance-none cursor-pointer"
                    >
                      <option value="" disabled>What happened?</option>
                      {SCENARIOS.map(scenario => (
                        <option key={scenario} value={scenario}>{scenario}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all transform active:scale-[0.98] shadow-lg shadow-red-100 flex items-center justify-center gap-2 mt-4"
                >
                  Locate Nearest Units
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-8 left-0 right-0 text-center opacity-40">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Authorized Emergency Service Platform</p>
      </div>
    </div>
  );
};
