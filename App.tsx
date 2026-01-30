
import React, { useState, useEffect } from 'react';
import { SplashView } from './components/SplashView';
import { HomeView } from './components/HomeView';
import { MapView } from './components/MapView';
import { AuthModal } from './components/AuthModal';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AmbulancePortal } from './components/AmbulancePortal';
import { RecordsModal } from './components/RecordsModal';
import { HospitalPortal } from './components/HospitalPortal';
import { DispatcherPortal } from './components/DispatcherPortal';
import { AuthMode, AmbulanceDetails, MedicalRecord, EmergencyRequest } from './types';

type View = 'splash' | 'home' | 'map' | 'ambulance' | 'hospital' | 'dispatcher';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('splash');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authContext, setAuthContext] = useState<'user' | 'ambulance' | 'hospital'>('user');
  const [isRecordsModalOpen, setIsRecordsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Emergency State
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [assignedAmbulance, setAssignedAmbulance] = useState<AmbulanceDetails | null>(null);
  const [activePatientName, setActivePatientName] = useState<string>('Unknown Patient');
  const [activeEmergencyType, setActiveEmergencyType] = useState<string>('Emergency Response');
  const [currentEmergencyRequest, setCurrentEmergencyRequest] = useState<EmergencyRequest | null>(null);
  const [suggestedAmbulances, setSuggestedAmbulances] = useState<AmbulanceDetails[]>([]);

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [arrivalAlert, setArrivalAlert] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Live Location Tracking
  useEffect(() => {
    let watchId: number;
    if (currentView === 'map' && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => console.error("Tracking error:", error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [currentView]);

  const handleAuthClick = (mode: AuthMode) => {
    setAuthContext('user');
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAmbulancePortalClick = () => {
    setAuthContext('ambulance');
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleHospitalPortalClick = () => {
    setAuthContext('hospital');
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    if (authContext === 'ambulance') {
      setCurrentView('ambulance');
    } else if (authContext === 'hospital') {
      setCurrentView('hospital');
    }
  };

  const handleDispatcherReview = (request: EmergencyRequest, suggestions: AmbulanceDetails[]) => {
    setCurrentEmergencyRequest(request);
    setSuggestedAmbulances(suggestions);
    setCurrentView('dispatcher');
  };

  const handleApproveAndAssign = (ambulance: AmbulanceDetails) => {
    if (!currentEmergencyRequest) return;

    setAssignedAmbulance(ambulance);
    setActivePatientName(currentEmergencyRequest.patientName);
    setActiveEmergencyType(currentEmergencyRequest.emergencyType);
    setUserCoords({
      latitude: currentEmergencyRequest.latitude,
      longitude: currentEmergencyRequest.longitude
    });

    setCurrentView('map');
  };

  const handleCompleteCase = (record: MedicalRecord) => {
    setMedicalRecords(prev => [record, ...prev]);
    setCurrentView('home');
    setIsRecordsModalOpen(true);
  };

  const handleNotifyImminentArrival = () => {
    setArrivalAlert(true);
  };

  const renderView = () => {
    switch (currentView) {
      case 'splash':
        return (
          <SplashView
            onEnter={() => setCurrentView('home')}
            onDispatcherReview={handleDispatcherReview}
          />
        );
      case 'dispatcher':
        return currentEmergencyRequest ? (
          <DispatcherPortal
            request={currentEmergencyRequest}
            suggestions={suggestedAmbulances}
            onAssign={handleApproveAndAssign}
          />
        ) : <SplashView onEnter={() => setCurrentView('home')} onDispatcherReview={handleDispatcherReview} />;
      case 'home':
        return (
          <div className={`flex flex-col min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <Header
              onRecordsClick={() => setIsRecordsModalOpen(true)}
              isDarkMode={isDarkMode}
            />
            <main className="flex-grow pt-20">
              <HomeView
                onSelectAmbulance={() => { }}
                onSelectFirstAid={() => { }}
                onAuthClick={handleAuthClick}
                onAmbulanceLogin={handleAmbulancePortalClick}
                onHospitalLogin={handleHospitalPortalClick}
              />
            </main>
            <Footer />
          </div>
        );
      case 'map':
        return (
          <MapView
            onBack={() => setCurrentView('home')}
            emergencyMode={!!userCoords}
            ambulance={assignedAmbulance}
            userLocation={userCoords}
            onUpdateLocation={setUserCoords}
          />
        );
      case 'ambulance':
        return (
          <AmbulancePortal
            onExit={() => setCurrentView('home')}
            onComplete={handleCompleteCase}
            onNotifyImminentArrival={handleNotifyImminentArrival}
            patientName={activePatientName}
            emergencyType={activeEmergencyType}
          />
        );
      case 'hospital':
        return (
          <HospitalPortal
            onExit={() => setCurrentView('home')}
            records={medicalRecords}
            activeEmergency={currentEmergencyRequest}
            arrivalAlert={arrivalAlert}
            onAcknowledgeAlert={() => setArrivalAlert(false)}
          />
        );
      default:
        return <SplashView onEnter={() => setCurrentView('home')} onDispatcherReview={handleDispatcherReview} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
      {renderView()}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        isAmbulanceMode={authContext === 'ambulance'}
        onSuccess={handleAuthSuccess}
      />

      <RecordsModal
        isOpen={isRecordsModalOpen}
        onClose={() => setIsRecordsModalOpen(false)}
        records={medicalRecords}
      />
    </div>
  );
};

export default App;
