import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Ambulance, MapPin, Phone, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';

interface PatientRequestProps {
  onRequestAmbulance: (data: { location: { lat: number; lng: number }; problemType: string }) => void;
}

export function PatientRequest({ onRequestAmbulance }: PatientRequestProps) {
  const [problemType, setProblemType] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const problemTypes = [
    'Chest Pain / Heart Attack',
    'Breathing Difficulty',
    'Severe Bleeding',
    'Stroke Symptoms',
    'Unconscious',
    'Accident / Trauma',
    'Burns',
    'Poisoning',
    'Other Emergency'
  ];

  const handleGetLocation = () => {
    // Simulate GPS location
    const mockLocation = {
      lat: 40.7128 + (Math.random() - 0.5) * 0.1,
      lng: -74.0060 + (Math.random() - 0.5) * 0.1
    };
    setLocation(mockLocation);
  };

  const handleCallAmbulance = () => {
    if (!problemType) {
      alert('Please select emergency type');
      return;
    }
    
    if (!location) {
      handleGetLocation();
    }

    setRequesting(true);
    
    setTimeout(() => {
      const finalLocation = location || {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1
      };
      onRequestAmbulance({ location: finalLocation, problemType });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-2xl border-red-100">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Ambulance className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl text-red-600">Emergency Request</CardTitle>
          <CardDescription className="text-base">
            Request immediate ambulance assistance
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Location Status */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm text-slate-700">Current Location</p>
                {location ? (
                  <div className="mt-1">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Location Detected
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGetLocation}
                    className="mt-2"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Get My Location
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Problem Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Emergency Type
            </label>
            <Select value={problemType} onValueChange={setProblemType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select emergency type" />
              </SelectTrigger>
              <SelectContent>
                {problemTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Call Ambulance Button */}
          <Button
            onClick={handleCallAmbulance}
            disabled={requesting}
            className="w-full h-14 text-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
          >
            {requesting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Requesting Ambulance...
              </>
            ) : (
              <>
                <Phone className="w-5 h-5 mr-2" />
                Call Ambulance Now
              </>
            )}
          </Button>

          {/* Emergency Number */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-slate-600">Emergency Hotline</p>
            <p className="text-2xl font-bold text-red-600">911</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
