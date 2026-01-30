import { useState, useEffect } from 'react';
import { PatientRequest } from './components/PatientRequest';
import { AmbulanceAssignment } from './components/AmbulanceAssignment';
import { HospitalDashboard } from './components/HospitalDashboard';
import { VitalsMonitor } from './components/VitalsMonitor';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Ambulance, Activity, Home, Hospital } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';

interface RequestData {
  location: { lat: number; lng: number };
  problemType: string;
}

interface AmbulanceData {
  id: string;
  status: 'assigned' | 'en-route' | 'arriving';
  driver: string;
  vehicle: string;
  eta: number;
  distance: number;
  patient: {
    problemType: string;
    location: { lat: number; lng: number };
  };
  currentLocation: { lat: number; lng: number };
  vitals: {
    heartRate: number;
    oxygen: number;
    bloodPressure: string;
    timestamp: number;
  };
}

export default function App() {
  const [view, setView] = useState<'home' | 'patient-request' | 'assignment' | 'tracking'>('home');
  const [requestData, setRequestData] = useState<RequestData | null>(null);
  const [ambulanceData, setAmbulanceData] = useState<AmbulanceData | null>(null);
  const [_, setShowVitals] = useState(false);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleRequestAmbulance = (data: RequestData) => {
    setRequestData(data);
    setView('assignment');

    toast.success('🚨 Emergency Request Sent', {
      description: `Searching for nearest ambulance for ${data.problemType}`,
    });
  };

  const handleAssignmentComplete = (ambulance: any) => {
    const newAmbulanceData: AmbulanceData = {
      id: ambulance.id,
      status: 'en-route',
      driver: ambulance.driver,
      vehicle: ambulance.vehicle,
      eta: ambulance.eta * 60, // Convert to seconds
      distance: ambulance.distance,
      patient: {
        problemType: requestData?.problemType || '',
        location: requestData?.location || { lat: 0, lng: 0 }
      },
      currentLocation: ambulance.location,
      vitals: {
        heartRate: 85,
        oxygen: 95,
        bloodPressure: '120/80',
        timestamp: Date.now()
      }
    };

    setAmbulanceData(newAmbulanceData);
    setView('tracking');
    setShowVitals(true);

    toast.success('✅ Ambulance Assigned!', {
      description: `Vehicle ${ambulance.vehicle} is on the way. ETA: ${ambulance.eta} minutes`,
      duration: 5000,
    });

    // Send browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚑 Ambulance On The Way!', {
        body: `Ambulance ${ambulance.vehicle} arriving in ${ambulance.eta} minutes`,
      });
    }
  };

  const handleReset = () => {
    setView('home');
    setRequestData(null);
    setAmbulanceData(null);
    setShowVitals(false);
    toast.info('System Reset', {
      description: 'Ready for new emergency requests',
    });
  };

  if (view === 'home') {
    return (
      <>
        <Toaster position="top-right" richColors />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
          <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500 rounded-full mb-6 animate-pulse">
                <Ambulance className="w-12 h-12" />
              </div>
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Smart Ambulance System
              </h1>
              <p className="text-xl text-blue-200 mb-8">
                AI-Powered Emergency Response & Real-Time Patient Monitoring
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                  ⚡ Fastest Route Selection
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                  📍 Live GPS Tracking
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                  ❤️ Real-Time Vitals
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                  🏥 Hospital Integration
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
              <div className="p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Ambulance className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Patient Emergency</h3>
                <p className="text-blue-200 text-sm mb-4">
                  Quick emergency request with GPS location and problem type selection
                </p>
                <ul className="space-y-2 text-sm text-blue-300">
                  <li>✓ One-click ambulance call</li>
                  <li>✓ Automatic location detection</li>
                  <li>✓ Emergency type selection</li>
                </ul>
              </div>

              <div className="p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Routing</h3>
                <p className="text-blue-200 text-sm mb-4">
                  AI-powered ambulance assignment and traffic-aware routing
                </p>
                <ul className="space-y-2 text-sm text-blue-300">
                  <li>✓ Nearest ambulance selection</li>
                  <li>✓ Real-time ETA calculation</li>
                  <li>✓ Live GPS tracking</li>
                </ul>
              </div>

              <div className="p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <Hospital className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Hospital Dashboard</h3>
                <p className="text-blue-200 text-sm mb-4">
                  Real-time patient vitals monitoring and emergency room preparation
                </p>
                <ul className="space-y-2 text-sm text-blue-300">
                  <li>✓ Live vitals streaming</li>
                  <li>✓ Ambulance tracking map</li>
                  <li>✓ Arrival notifications</li>
                </ul>
              </div>
            </div>

            {/* Demo Selector */}
            <div className="max-w-2xl mx-auto">
              <div className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                <h2 className="text-2xl font-bold text-center mb-6">Choose Demo View</h2>
                <div className="grid gap-4">
                  <Button
                    onClick={() => setView('patient-request')}
                    size="lg"
                    className="h-16 text-lg bg-red-600 hover:bg-red-700 shadow-lg"
                  >
                    <Ambulance className="w-6 h-6 mr-3" />
                    Patient Emergency Request
                  </Button>
                  <Button
                    onClick={() => {
                      // Set mock data for direct hospital view
                      const mockData: AmbulanceData = {
                        id: 'AMB-001',
                        status: 'en-route',
                        driver: 'Dr. John Smith',
                        vehicle: 'A-2847',
                        eta: 360,
                        distance: 4.5,
                        patient: {
                          problemType: 'Chest Pain / Heart Attack',
                          location: { lat: 40.7128, lng: -74.0060 }
                        },
                        currentLocation: { lat: 40.7328, lng: -74.0260 },
                        vitals: {
                          heartRate: 95,
                          oxygen: 92,
                          bloodPressure: '130/85',
                          timestamp: Date.now()
                        }
                      };
                      setAmbulanceData(mockData);
                      setView('tracking');
                      setShowVitals(true);
                    }}
                    size="lg"
                    className="h-16 text-lg bg-green-600 hover:bg-green-700 shadow-lg"
                  >
                    <Hospital className="w-6 h-6 mr-3" />
                    Hospital Dashboard (Direct)
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-16 text-blue-300 text-sm">
              <p>🚑 Smart Ambulance System Prototype</p>
              <p className="mt-2">Emergency Response • Live Tracking • Patient Monitoring</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (view === 'patient-request') {
    return (
      <>
        <Toaster position="top-right" richColors />
        <div className="relative">
          <Button
            onClick={() => setView('home')}
            variant="outline"
            className="absolute top-4 left-4 z-10"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <PatientRequest onRequestAmbulance={handleRequestAmbulance} />
        </div>
      </>
    );
  }

  if (view === 'assignment') {
    return (
      <>
        <Toaster position="top-right" richColors />
        <AmbulanceAssignment
          patientLocation={requestData?.location || { lat: 40.7128, lng: -74.0060 }}
          problemType={requestData?.problemType || ''}
          onAssignmentComplete={handleAssignmentComplete}
        />
      </>
    );
  }

  if (view === 'tracking') {
    return (
      <>
        <Toaster position="top-right" richColors />
        <div className="min-h-screen bg-slate-50">
          <div className="bg-white border-b shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setView('home')}
                    variant="outline"
                    size="sm"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                  <div className="h-8 w-px bg-slate-200" />
                  <h2 className="text-xl font-bold text-slate-800">Emergency Tracking System</h2>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Reset Demo
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="container mx-auto p-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
              <TabsTrigger value="dashboard">
                <Hospital className="w-4 h-4 mr-2" />
                Hospital Dashboard
              </TabsTrigger>
              <TabsTrigger value="vitals">
                <Activity className="w-4 h-4 mr-2" />
                Patient Vitals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <HospitalDashboard ambulanceData={ambulanceData} />
            </TabsContent>

            <TabsContent value="vitals">
              <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">Patient Vitals Monitoring</h2>
                  <p className="text-slate-600">Real-time health metrics from ambulance</p>
                </div>
                <VitalsMonitor initialVitals={ambulanceData?.vitals} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </>
    );
  }

  return null;
}
