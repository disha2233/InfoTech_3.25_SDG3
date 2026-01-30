
import React from 'react';
import {
  Building2, ChevronLeft, Users, Activity, HeartPulse,
  Clock, Siren, CheckCircle2, Search,
  Filter, ArrowUpRight, Bed, AlertCircle
} from 'lucide-react';
import { MedicalRecord, EmergencyRequest } from '../types';

interface HospitalPortalProps {
  onExit: () => void;
  records: MedicalRecord[];
  activeEmergency?: EmergencyRequest | null;
  arrivalAlert?: boolean;
  onAcknowledgeAlert?: () => void;
}

export const HospitalPortal: React.FC<HospitalPortalProps> = ({ onExit, records, activeEmergency, arrivalAlert, onAcknowledgeAlert }) => {

  const incomingRecord: MedicalRecord | null = activeEmergency ? {
    id: `temp-${activeEmergency.timestamp}`,
    patientName: activeEmergency.patientName,
    timestamp: new Date(activeEmergency.timestamp).toLocaleTimeString(),
    arrivalTime: 'ETA < 2m',
    emergencyType: activeEmergency.emergencyType,
    bp: '--/--',
    pulse: 0,
    ambulanceId: 'UNIT-S12',
    status: 'En Route'
  } : null;

  const displayRecords = incomingRecord ? [incomingRecord, ...records] : records;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter']">
      <header className="bg-white border-b border-slate-200 p-5 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="p-2.5 hover:bg-slate-50 rounded-xl transition-all border border-slate-200">
            <ChevronLeft size={20} className="text-slate-500" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-100">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">St. Jude Medical Center</h1>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Emergency Department Intake</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-6 pr-6 border-r border-slate-100">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Available Beds</span>
              <span className="text-sm font-black text-slate-900">14 / 20</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
              <Users size={20} />
            </div>
          </div>
        </div>
      </header>

      {/* Arrival Alert Overlay */}
      {arrivalAlert && activeEmergency && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-red-600 text-white p-8 rounded-[2.5rem] max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <Siren size={40} />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Incoming Critical</h2>
              <p className="text-lg font-bold opacity-90 mb-8">{activeEmergency.patientName} is arriving in &lt; 2 mins!</p>

              <div className="bg-white/10 rounded-2xl p-4 mb-8 text-left">
                <div className="flex justify-between border-b border-white/20 pb-2 mb-2">
                  <span className="text-xs uppercase font-bold opacity-70">Condition</span>
                  <span className="font-bold">{activeEmergency.emergencyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs uppercase font-bold opacity-70">Source</span>
                  <span className="font-bold">Unit S12</span>
                </div>
              </div>

              <button
                onClick={onAcknowledgeAlert}
                className="w-full py-4 bg-white text-red-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-lg active:scale-95"
              >
                Prepare Trauma Team
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Incoming', value: displayRecords.filter(r => r.status === 'En Route').length, icon: <Siren />, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Recently Arrived', value: displayRecords.filter(r => r.status === 'Arrived').length, icon: <CheckCircle2 />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Critical Alert', value: 2, icon: <Activity />, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'ICU Vacancy', value: '4', icon: <Bed />, color: 'text-blue-600', bg: 'bg-blue-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-slate-200 transition-all">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">{stat.label}</span>
                  <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(stat.icon as React.ReactElement, { size: 20 })}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Handover Registry</h3>
                <p className="text-sm text-slate-500 font-medium">Synced telemetry data from incoming ambulance units.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search by name or unit..." className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-medium focus:bg-white focus:border-emerald-200 transition-all" />
                </div>
                <button className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50"><Filter size={18} /></button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Details</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ambulance No.</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Handover Vitals</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Intake Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Arrival Time</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {displayRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <div className="max-w-xs mx-auto space-y-3 opacity-30">
                          <AlertCircle size={48} className="mx-auto text-slate-400" />
                          <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">No active handovers recorded</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayRecords.map((record) => (
                      <tr key={record.id} className={`hover:bg-slate-50/50 transition-colors group ${record.status === 'En Route' ? 'bg-red-50/30' : ''}`}>
                        <td className="px-8 py-6">
                          <div>
                            <p className="text-base font-black text-slate-900">{record.patientName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{record.emergencyType}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-900 rounded-xl text-xs font-black border border-slate-200 shadow-sm">
                            <Siren size={14} className="text-red-500" />
                            {record.ambulanceId}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-6">
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">BP</span>
                              <span className="text-base font-black text-slate-900 tracking-tighter">{record.bp}</span>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">BPM</span>
                              <span className="text-base font-black text-slate-900 tracking-tighter">{record.pulse || '--'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${record.status === 'Arrived' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100 animate-pulse'
                            }`}>
                            <CheckCircle2 size={12} />
                            {record.status}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                            <Clock size={16} className="text-slate-400" />
                            {record.arrivalTime || record.timestamp.split(',')[1]}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">
                            <ArrowUpRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
