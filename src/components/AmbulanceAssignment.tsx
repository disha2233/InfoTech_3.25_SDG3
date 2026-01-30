import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

import { Ambulance, CheckCircle, MapPin, Navigation, Clock } from 'lucide-react';
import { Progress } from './ui/progress';

interface AmbulanceOption {
  id: string;
  vehicle: string;
  driver: string;
  distance: number;
  eta: number;
  location: { lat: number; lng: number };
  available: boolean;
}

interface AssignmentProps {
  patientLocation: { lat: number; lng: number };
  problemType: string;
  onAssignmentComplete: (ambulance: AmbulanceOption) => void;
}

export function AmbulanceAssignment({ patientLocation, problemType, onAssignmentComplete }: AssignmentProps) {
  const [stage, setStage] = useState<'searching' | 'found' | 'assigning' | 'assigned'>('searching');
  const [progress, setProgress] = useState(0);
  const [ambulances, setAmbulances] = useState<AmbulanceOption[]>([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState<AmbulanceOption | null>(null);

  useEffect(() => {
    // Stage 1: Simulate searching for ambulances
    const searchTimer = setTimeout(() => {
      // Generate mock ambulances
      const mockAmbulances: AmbulanceOption[] = [
        {
          id: 'AMB-001',
          vehicle: 'A-2847',
          driver: 'Dr. John Smith',
          distance: 2.8,
          eta: 8,
          location: { lat: patientLocation.lat + 0.02, lng: patientLocation.lng + 0.01 },
          available: true
        },
        {
          id: 'AMB-002',
          vehicle: 'A-3921',
          driver: 'Dr. Sarah Johnson',
          distance: 4.5,
          eta: 12,
          location: { lat: patientLocation.lat + 0.04, lng: patientLocation.lng - 0.02 },
          available: true
        },
        {
          id: 'AMB-003',
          vehicle: 'A-1654',
          driver: 'Dr. Mike Davis',
          distance: 6.2,
          eta: 16,
          location: { lat: patientLocation.lat - 0.03, lng: patientLocation.lng + 0.03 },
          available: true
        }
      ];

      setAmbulances(mockAmbulances);
      setStage('found');
      setProgress(33);
    }, 2000);

    return () => clearTimeout(searchTimer);
  }, [patientLocation]);

  useEffect(() => {
    if (stage === 'found' && ambulances.length > 0) {
      // Stage 2: Auto-select nearest ambulance
      const assignTimer = setTimeout(() => {
        const nearest = ambulances.reduce((prev, current) =>
          current.distance < prev.distance ? current : prev
        );
        setSelectedAmbulance(nearest);
        setStage('assigning');
        setProgress(66);
      }, 1500);

      return () => clearTimeout(assignTimer);
    }
  }, [stage, ambulances]);

  useEffect(() => {
    if (stage === 'assigning' && selectedAmbulance) {
      // Stage 3: Confirm assignment
      const confirmTimer = setTimeout(() => {
        setStage('assigned');
        setProgress(100);

        // Show notification
        showNotification();

        // Trigger completion
        setTimeout(() => {
          onAssignmentComplete(selectedAmbulance);
        }, 2000);
      }, 2000);

      return () => clearTimeout(confirmTimer);
    }
  }, [stage, selectedAmbulance, onAssignmentComplete]);

  const showNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚑 Ambulance Assigned!', {
        body: `Ambulance ${selectedAmbulance?.vehicle} is on the way. ETA: ${selectedAmbulance?.eta} minutes`,
        icon: '/ambulance-icon.png'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {stage === 'searching' && '🔍 Searching for Available Ambulances...'}
            {stage === 'found' && '✅ Ambulances Found - Selecting Nearest'}
            {stage === 'assigning' && '📡 Assigning Ambulance...'}
            {stage === 'assigned' && '🎉 Ambulance Successfully Assigned!'}
          </CardTitle>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Patient Info */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-800">Emergency Request</p>
                <p className="text-sm text-red-700">{problemType}</p>
                <p className="text-xs text-red-600 mt-1">
                  Location: {patientLocation.lat.toFixed(4)}, {patientLocation.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>

          {/* Searching Animation */}
          {stage === 'searching' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <Ambulance className="w-20 h-20 text-blue-500 animate-bounce" />
                <div className="absolute -inset-4 border-4 border-blue-300 rounded-full animate-ping" />
              </div>
              <p className="mt-6 text-slate-600 animate-pulse">Scanning nearby ambulances...</p>
            </div>
          )}

          {/* Ambulance List */}
          {(stage === 'found' || stage === 'assigning' || stage === 'assigned') && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Available Ambulances ({ambulances.length})</p>
              {ambulances.map((amb, index) => {
                const isSelected = selectedAmbulance?.id === amb.id;
                const isNearest = index === 0;

                return (
                  <div
                    key={amb.id}
                    className={`p-4 rounded-lg border-2 transition-all ${isSelected
                        ? 'bg-green-50 border-green-400 shadow-lg scale-105'
                        : 'bg-white border-slate-200'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${isSelected ? 'bg-green-500' : 'bg-blue-500'}`}>
                          <Ambulance className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-slate-800">{amb.vehicle}</p>
                            {isNearest && (
                              <Badge className="bg-blue-500 text-xs">NEAREST</Badge>
                            )}
                            {isSelected && (
                              <Badge className="bg-green-500 text-xs">ASSIGNED</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{amb.driver}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Navigation className="w-3 h-3" />
                              {amb.distance} km
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {amb.eta} min
                            </span>
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-8 h-8 text-green-500 animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Assignment Details */}
          {stage === 'assigned' && selectedAmbulance && (
            <div className="p-6 bg-green-50 border-2 border-green-300 rounded-lg">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-green-800 text-lg mb-2">Assignment Successful!</p>
                  <div className="space-y-2 text-sm text-green-700">
                    <p>✓ Ambulance <span className="font-semibold">{selectedAmbulance.vehicle}</span> has been dispatched</p>
                    <p>✓ Driver <span className="font-semibold">{selectedAmbulance.driver}</span> is en route</p>
                    <p>✓ Estimated arrival: <span className="font-semibold">{selectedAmbulance.eta} minutes</span></p>
                    <p>✓ Hospital has been notified</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {stage === 'assigning' && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                <span className="font-semibold">Calculating fastest route...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
