
import React from 'react';
import { Ambulance, Twitter, Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-2 rounded-lg text-white">
                <Ambulance size={20} />
              </div>
              <span className="text-lg font-black text-slate-900">Life Alert</span>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Leading the world in emergency coordination technology. Our mission is to reduce emergency response times globally.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Facebook size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">Platform</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><a href="#" className="hover:text-red-600 transition-colors">How it works</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Mobile App</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">First Responders</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">Resources</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><a href="#" className="hover:text-red-600 transition-colors">Safety Guides</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Health Blog</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Partner Network</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Status</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">Legal</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><a href="#" className="hover:text-red-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">HIPAA Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            © 2024 Emergency Life Alert. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>911 Emergency - US Only</span>
            <span>112 Emergency - EU Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
