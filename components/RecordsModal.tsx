
import React from 'react';
import { X, ClipboardList, Activity, HeartPulse, Clock, FileText } from 'lucide-react';
import { MedicalRecord } from '../types';

interface RecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: MedicalRecord[];
}

export const RecordsModal: React.FC<RecordsModalProps> = ({ isOpen, onClose, records }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
        >
          <X size={24} />
        </button>

        <div className="p-10">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-2 font-['Space_Grotesk']">My Medical History</h2>
            <p className="text-slate-500 font-medium">Archived vitals and emergency response summaries.</p>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
            {records.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
                <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No records found</p>
              </div>
            ) : (
              records.map((record) => (
                <div key={record.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-slate-200 transition-all group">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{record.timestamp}</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">{record.emergencyType}</h4>
                      <p className="text-xs text-slate-500 font-medium tracking-tight">Assigned to: {record.patientName}</p>
                    </div>
                    
                    <div className="flex items-center gap-6 bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                      <div className="flex flex-col items-center">
                        <Activity size={16} className="text-blue-500 mb-1" />
                        <span className="text-sm font-black text-slate-900 leading-none">{record.bp}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">BP</span>
                      </div>
                      <div className="w-px h-8 bg-slate-100" />
                      <div className="flex flex-col items-center">
                        <HeartPulse size={16} className="text-red-500 mb-1" />
                        <span className="text-sm font-black text-slate-900 leading-none">{record.pulse}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">BPM</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
