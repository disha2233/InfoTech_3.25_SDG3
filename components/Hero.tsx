
import React from 'react';
import { Shield, MapPin, Activity, ChevronRight, Siren } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 right-0 -z-10 w-full h-full bg-[radial-gradient(circle_at_70%_30%,#fee2e2_0%,transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full border border-red-100">
              <Siren size={16} className="animate-bounce" />
              <span className="text-xs font-bold uppercase tracking-wider">24/7 Professional Dispatch</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1]">
              Every Second <br />
              <span className="text-red-600">Saves a Life.</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
              Connect to emergency services instantly. Share vital medical data, real-time location, and receive AI-guided first aid instructions while help is on the way.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-xl shadow-red-200 transition-all transform hover:-translate-y-1">
                Activate Alert Now
                <ChevronRight size={20} />
              </button>
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 font-bold rounded-2xl hover:border-slate-300 transition-all shadow-sm">
                View Coverage Area
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img 
                    key={i} 
                    className="w-10 h-10 rounded-full border-2 border-white" 
                    src={`https://picsum.photos/seed/${i + 10}/100/100`} 
                    alt="User" 
                  />
                ))}
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Joined by <span className="text-slate-900 font-bold">10,000+</span> first responders
              </p>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative z-10 w-full aspect-square max-w-[500px] bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border-[12px] border-slate-800">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/emergency/1000/1000')] bg-cover bg-center opacity-60 mix-blend-overlay" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-slate-900 via-transparent">
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-500 rounded-lg text-white">
                        <MapPin size={18} />
                      </div>
                      <span className="text-white font-bold">Current Location Found</span>
                    </div>
                    <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-green-500 animate-[pulse_2s_infinite]" />
                    </div>
                  </div>
                  
                  <div className="bg-red-600/20 backdrop-blur-md p-4 rounded-2xl border border-red-500/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-red-600 rounded-lg text-white">
                        <Activity size={18} />
                      </div>
                      <span className="text-white font-bold">Vitals Monitored</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-white text-2xl font-black">72</span>
                      <span className="text-red-200 text-xs font-bold uppercase">BPM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000" />
          </div>
        </div>
      </div>
    </section>
  );
};
