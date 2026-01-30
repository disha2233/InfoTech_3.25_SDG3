
import React from 'react';
import { Ambulance, FileText } from 'lucide-react';

interface HeaderProps {
  onRecordsClick: () => void;
  isDarkMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRecordsClick, isDarkMode }) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-xl text-white shadow-lg shadow-red-200 animate-pulse">
            <Ambulance size={28} />
          </div>
          <div className="flex flex-col">
            <span className={`text-xl font-extrabold tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Emergency <span className="text-red-600">Life Alert</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Response Coordination Network
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 mr-auto ml-12">
          <a href="#" className={`text-sm font-semibold transition-colors ${isDarkMode ? 'text-slate-300 hover:text-red-500' : 'text-slate-600 hover:text-red-600'}`}>Services</a>
          <a href="#" className={`text-sm font-semibold transition-colors ${isDarkMode ? 'text-slate-300 hover:text-red-500' : 'text-slate-600 hover:text-red-600'}`}>Safety Hub</a>
          <button 
            onClick={onRecordsClick}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${isDarkMode ? 'text-slate-300 hover:text-red-500' : 'text-slate-600 hover:text-red-600'}`}
          >
            <FileText size={16} />
            My Records
          </button>
        </nav>

        {/* Action items removed as requested */}
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
            Network Active
          </div>
        </div>
      </div>
    </header>
  );
};
