import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Ambulance, MapPin, Clock, User, Navigation } from 'lucide-react';
import { Progress } from './ui/progress';

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
  vitals?: {
    heartRate: number;
    oxygen: number;
    bloodPressure: string;
  };
}

interface HospitalDashboardProps {
  ambulanceData: AmbulanceData | null;
}

export function HospitalDashboard({ ambulanceData }: HospitalDashboardProps) {
  const [liveEta, setLiveEta] = useState(ambulanceData?.eta || 0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (ambulanceData) {
      setLiveEta(ambulanceData.eta);

      // Simulate ETA countdown
      const interval = setInterval(() => {
        setLiveEta((prev) => {
          if (prev <= 0) return 0;
          return prev - 1;
        });

        setProgress((_) => {
          const maxEta = ambulanceData.eta;
          const remaining = liveEta;
          return ((maxEta - remaining) / maxEta) * 100;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [ambulanceData, liveEta]);

  if (!ambulanceData) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Hospital Dashboard</h1>
            <p className="text-slate-600">Emergency Ambulance Monitoring System</p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <Ambulance className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-500">No active ambulance requests</p>
              <p className="text-sm text-slate-400 mt-2">Waiting for emergency calls...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusColors = {
    'assigned': 'bg-blue-500',
    'en-route': 'bg-orange-500',
    'arriving': 'bg-green-500'
  };

  const statusLabels = {
    'assigned': 'Ambulance Assigned',
    'en-route': 'En Route to Patient',
    'arriving': 'Arriving Soon'
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Hospital Dashboard</h1>
              <p className="text-slate-600">Emergency Response Center</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="font-semibold">LIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="mb-6 p-4 bg-red-500 text-white rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center gap-3">
            <Ambulance className="w-6 h-6" />
            <div>
              <p className="font-bold text-lg">🚨 INCOMING AMBULANCE</p>
              <p className="text-sm">Emergency patient arriving - Prepare emergency room</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Tracking Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Tracking Map */}
            <Card className="shadow-lg border-2 border-red-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-red-600" />
                    Live Route Tracking
                  </CardTitle>
                  <Badge className={statusColors[ambulanceData.status]}>
                    {statusLabels[ambulanceData.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Simulated Map */}
                <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-80 overflow-hidden">
                  {/* Map Grid */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="border border-slate-200/30" />
                    ))}
                  </div>

                  {/* Route Path */}
                  <svg className="absolute inset-0 w-full h-full">
                    <path
                      d="M 50 300 Q 150 250, 250 200 T 450 100"
                      stroke="#ef4444"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="8 4"
                    />
                  </svg>

                  {/* Ambulance Icon */}
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
                    <div className="bg-red-600 text-white p-3 rounded-full shadow-lg">
                      <Ambulance className="w-6 h-6" />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <Badge className="bg-red-600">Vehicle #{ambulanceData.vehicle}</Badge>
                    </div>
                  </div>

                  {/* Hospital Marker */}
                  <div className="absolute top-12 right-12">
                    <div className="bg-green-600 text-white p-3 rounded-full shadow-lg">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <Badge className="bg-green-600 text-xs">Hospital</Badge>
                    </div>
                  </div>

                  {/* Patient Marker */}
                  <div className="absolute bottom-12 left-12">
                    <div className="bg-blue-600 text-white p-3 rounded-full shadow-lg">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <Badge className="bg-blue-600 text-xs">Patient</Badge>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Journey Progress</span>
                    <span className="font-semibold text-slate-800">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* ETA & Distance Card */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-lg border-2 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Estimated Arrival</p>
                      <p className="text-3xl font-bold text-orange-600">
                        {Math.floor(liveEta / 60)}:{(liveEta % 60).toString().padStart(2, '0')}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">minutes remaining</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-2 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Navigation className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Distance</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {ambulanceData.distance.toFixed(1)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">kilometers away</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Side Panel - Patient & Ambulance Info */}
          <div className="space-y-6">
            {/* Patient Info */}
            <Card className="shadow-lg border-2 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <User className="w-5 h-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Emergency Type</p>
                  <p className="font-semibold text-red-700">{ambulanceData.patient.problemType}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-slate-600">Patient Location</p>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700 font-mono text-xs">
                      {ambulanceData.patient.location.lat.toFixed(4)}, {ambulanceData.patient.location.lng.toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    HIGH PRIORITY
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Ambulance Info */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ambulance className="w-5 h-5 text-blue-600" />
                  Ambulance Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-slate-600">Vehicle ID</span>
                  <span className="font-semibold">#{ambulanceData.vehicle}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-slate-600">Driver</span>
                  <span className="font-semibold">{ambulanceData.driver}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-600">Status</span>
                  <Badge className={statusColors[ambulanceData.status]}>
                    {ambulanceData.status.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg bg-gradient-to-br from-slate-800 to-slate-900 text-white">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-lg text-left transition-colors">
                  <p className="font-semibold">📞 Contact Driver</p>
                  <p className="text-xs text-slate-300">Call ambulance crew</p>
                </button>
                <button className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-lg text-left transition-colors">
                  <p className="font-semibold">🏥 Prepare ER</p>
                  <p className="text-xs text-slate-300">Alert emergency room</p>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
