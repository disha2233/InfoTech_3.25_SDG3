
import React from 'react';
import { Search, Ambulance, Building2, Zap, ArrowRight, BellRing, MapPin, LogIn, Hospital } from 'lucide-react';
import { AuthMode } from '../types';

interface HomeViewProps {
  onSelectAmbulance: () => void;
  onSelectFirstAid: () => void;
  onAuthClick: (mode: AuthMode) => void;
  onAmbulanceLogin: () => void;
  onHospitalLogin: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  onSelectAmbulance, 
  onAuthClick, 
  onAmbulanceLogin,
  onHospitalLogin
}) => {
  return (
    <div className="flex-grow flex flex-col bg-slate-50/50 animate-in fade-in duration-500 pb-20">
      {/* Hero-like Search Section - Refined Scaling */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-16 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Ready to save <span className="text-red-600">lives,</span> <br className="hidden md:block" /> anywhere, anytime.
          </h2>
          
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 p-1.5 bg-red-50 text-red-500 rounded-lg">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search medical services or hubs..."
              className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-200 focus:border-red-400 focus:bg-white rounded-2xl shadow-sm focus:shadow-md transition-all outline-none font-medium text-base text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full"><MapPin size={12} className="text-red-500" /> Downtown Tampa</span>
            <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full"><Zap size={12} className="text-yellow-500" /> Active Dispatch</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 py-12">
        {/* Categories Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
              <Zap size={16} className="text-yellow-500 fill-yellow-500" />
              Emergency Portals
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* SOS ACTION */}
            <button 
              onClick={onSelectAmbulance}
              className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-rose-600 p-8 rounded-[2rem] shadow-xl shadow-red-100 transition-all hover:-translate-y-1 active:scale-95 text-left h-full"
            >
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl w-fit mb-6">
                <Ambulance size={24} className="text-white" />
              </div>
              <h4 className="text-white font-black text-xl tracking-tight mb-2">Request Ambulance</h4>
              <p className="text-red-100 text-sm font-medium leading-relaxed opacity-90">Instant SOS dispatch to your coordinates. Life-saving response in minutes.</p>
              <div className="mt-8 flex items-center gap-2 text-white/80 font-bold text-[10px] uppercase tracking-widest">
                <span>Dispatch Now</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            
            {/* AMBULANCE LOGIN */}
            <button 
              onClick={onAmbulanceLogin}
              className="group p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-blue-100 transition-all hover:-translate-y-1 active:scale-95 text-left h-full"
            >
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <LogIn size={24} />
              </div>
              <h4 className="text-slate-900 font-black text-xl tracking-tight mb-2">Ambulance Portal</h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Secure gateway for medical first responders and fleet operators.</p>
              <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                <span>Staff Access</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* HOSPITAL LOGIN/SIGNUP */}
            <button 
              onClick={onHospitalLogin}
              className="group p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all hover:-translate-y-1 active:scale-95 text-left h-full"
            >
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl w-fit mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Hospital size={24} />
              </div>
              <h4 className="text-slate-900 font-black text-xl tracking-tight mb-2">Hospital Dashboard</h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Manage ER intake, bed availability, and patient coordination records.</p>
              <div className="mt-8 flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                <span>Facility Access</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
