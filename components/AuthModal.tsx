
import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Github, Chrome, Siren } from 'lucide-react';
import { AuthMode } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: AuthMode;
  isAmbulanceMode?: boolean;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  isAmbulanceMode = false,
  onSuccess
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-10">
          <div className="mb-8 text-center">
            {isAmbulanceMode && (
              <div className="mx-auto w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-4">
                <Siren size={24} />
              </div>
            )}
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              {isAmbulanceMode
                ? 'Responder Access'
                : (mode === 'login' ? 'Welcome Back' : 'Join Life Alert')}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              {isAmbulanceMode
                ? 'Authorized ambulance personnel only'
                : (mode === 'login' ? 'Log in to manage your medical safety' : 'Start your life-saving journey today')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isAmbulanceMode && (
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
                  <span className="text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">ID</span>
                </div>
                <input
                  type="text"
                  placeholder="Ambulance Unit ID (e.g. S-12)"
                  required
                  className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-100 focus:border-red-400 focus:bg-white rounded-xl transition-all outline-none font-medium text-sm"
                />
              </div>
            )}

            {(mode === 'signup' && !isAmbulanceMode) && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 focus:border-red-400 focus:bg-white rounded-xl transition-all outline-none font-medium text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <select
                      required
                      className="w-full pl-4 pr-8 py-4 bg-slate-50 border border-slate-100 focus:border-red-400 focus:bg-white rounded-xl transition-all outline-none font-medium text-sm text-slate-500 appearance-none"
                    >
                      <option value="" disabled selected>Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="Mobile No."
                      required
                      className="w-full pl-4 pr-4 py-4 bg-slate-50 border border-slate-100 focus:border-red-400 focus:bg-white rounded-xl transition-all outline-none font-medium text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 focus:border-red-400 focus:bg-white rounded-xl transition-all outline-none font-medium text-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 focus:border-red-400 focus:bg-white rounded-xl transition-all outline-none font-medium text-sm"
              />
            </div>

            {mode === 'login' && !isAmbulanceMode && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-semibold text-slate-400 hover:text-red-600">Forgot Password?</button>
              </div>
            )}

            <button
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isAmbulanceMode ? 'Authorize & Enter' : (mode === 'login' ? 'Sign In' : 'Create Account')
              )}
            </button>
          </form>

          {!isAmbulanceMode && (
            <>
              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Social Connect</span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-100 rounded-xl hover:bg-slate-50 font-semibold text-slate-600 text-sm transition-all">
                  <Chrome size={16} className="text-blue-500" />
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-100 rounded-xl hover:bg-slate-50 font-semibold text-slate-600 text-sm transition-all">
                  <Github size={16} />
                  Github
                </button>
              </div>
            </>
          )}

          <p className="mt-8 text-center text-xs font-medium text-slate-400">
            {isAmbulanceMode
              ? 'Contact administration for unit re-assignment.'
              : (mode === 'login' ? "Don't have an account?" : "Already member?")}{' '}
            {!isAmbulanceMode && (
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-red-500 font-bold hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
