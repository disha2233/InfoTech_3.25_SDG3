import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft, Navigation, Star, Siren, Activity,
  Phone, ShieldCheck, Clock, Share2,
  AlertCircle, HeartPulse, Compass, Send, Info
} from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { AmbulanceDetails } from '../types';

interface MapViewProps {
  onBack: () => void;
  emergencyMode?: boolean;
  ambulance: AmbulanceDetails | null;
  userLocation?: { latitude: number; longitude: number } | null;
  onUpdateLocation?: (coords: { latitude: number; longitude: number }) => void;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem'
};

const defaultCenter = {
  lat: 27.9478,
  lng: -82.4584 // Tampa default
};

export const MapView: React.FC<MapViewProps> = ({ onBack, emergencyMode, ambulance, userLocation, onUpdateLocation }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [progress, setProgress] = useState(0);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [showDirections, setShowDirections] = useState(false);

  // Use provided location or default
  const center = useMemo(() => userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : defaultCenter, [userLocation]);

  // Simulated ambulance start position (slightly offset from user)
  const ambulanceStart = useMemo(() => ({
    lat: center.lat + 0.02,
    lng: center.lng + 0.02
  }), [center]);

  const [ambulancePosition, setAmbulancePosition] = useState(ambulanceStart);

  // Simulated movement logic
  // Simulated movement logic (Ola/Uber style)
  useEffect(() => {
    if (emergencyMode && directionsResponse) {
      const path = directionsResponse.routes[0].overview_path;
      let step = 0;
      const totalSteps = path.length;

      const interval = setInterval(() => {
        if (step < totalSteps) {
          const point = path[step];
          setAmbulancePosition({ lat: point.lat(), lng: point.lng() });

          // Calculate progress percentage based on step
          setProgress(Math.round((step / totalSteps) * 100));

          step++;
        } else {
          clearInterval(interval);
        }
      }, 500); // Update every 500ms for smooth-ish movement

      return () => clearInterval(interval);
    }
  }, [emergencyMode, directionsResponse]);

  // Fetch Directions
  useEffect(() => {
    if (isLoaded && emergencyMode && google) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: ambulanceStart,
          destination: center,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [isLoaded, emergencyMode, center, ambulanceStart]);

  const responder = ambulance || {
    id: 'UNIT-SEARCHING',
    driverName: 'Locating...',
    eta: '--:--',
    specialty: 'Trauma Unit',
    avatar: 'https://picsum.photos/seed/doctor1/300/300',
    rating: 5.0
  };

  const handleLocateMe = () => {
    if (navigator.geolocation && onUpdateLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onUpdateLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => console.error("Locate Me Error:", err),
        { enableHighAccuracy: true }
      );
    }
  };

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] p-4 md:p-8 flex flex-col gap-6 font-['Inter']">

      {/* Header Controls */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
        >
          <ChevronLeft size={18} />
          Back to Dashboard
        </button>
        <div className="flex gap-2">
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 shadow-sm"><Share2 size={18} /></button>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 shadow-sm"><Activity size={18} /></button>
        </div>
      </div>

      {/* Main Tracking Card */}
      <div className="max-w-5xl mx-auto w-full bg-white rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

        {/* Card Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-red-500">
              <Navigation size={22} fill="currentColor" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 font-['Space_Grotesk']">Live Route Tracking</h2>
          </div>
          <div className="px-4 py-1.5 bg-[#ff6b00] rounded-full">
            <span className="text-white text-[11px] font-black uppercase tracking-wider">En Route to Patient</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative mx-6 h-[400px] bg-[#e5e7eb] rounded-2xl overflow-hidden border border-slate-100 group">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={14}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
              }}
            >
              {/* Directions Renderer */}
              {directionsResponse && (
                <DirectionsRenderer
                  options={{
                    directions: directionsResponse,
                    suppressMarkers: true, // We have custom markers
                    polylineOptions: {
                      strokeColor: "#2563eb",
                      strokeWeight: 5,
                    },
                  }}
                />
              )}

              {/* Patient Location */}
              <Marker
                position={center}
                title="Patient Location"
              />

              {/* Responder Location */}
              {emergencyMode && (
                <Marker
                  position={ambulancePosition}
                  title={responder.id}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  }}
                />
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
              Loading Google Maps...
            </div>
          )}

          {/* Journey Progress Overlay (Keep purely visual progress bar relative to map?) 
              Moved out of map div to avoid z-index issues with Google Maps iframe
           */}
          {/* Floating Map Controls */}
          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
            <button
              onClick={handleLocateMe}
              className="p-3 bg-white rounded-full shadow-lg text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all active:scale-95 flex items-center justify-center"
              title="Locate Me"
            >
              <Compass size={20} fill={userLocation ? "#3b82f6" : "none"} className={userLocation ? "text-blue-600" : ""} />
            </button>
          </div>
        </div>


        {/* Directions Overlay */}
        {showDirections && directionsResponse && (
          <div className="absolute top-4 left-4 z-10 w-64 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 max-h-[300px] overflow-y-auto p-4 custom-scrollbar">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-3">Turn-by-Turn</h3>
            <div className="space-y-3">
              {directionsResponse.routes[0].legs[0].steps.map((step, i) => (
                <div key={i} className="flex gap-3 text-xs border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                  <span className="font-bold text-slate-300">{i + 1}</span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-700 leading-tight" dangerouslySetInnerHTML={{ __html: step.instructions }} />
                    <div className="flex gap-2 mt-1 text-[10px] font-medium text-slate-500">
                      <span>{step.distance?.text}</span>
                      <span>•</span>
                      <span>{step.duration?.text}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Responder Detail Card */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-6 relative">
          <div className="relative">
            <img src={responder.avatar} className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-50" />
            <div className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 rounded-lg text-white border-2 border-white">
              <ShieldCheck size={14} />
            </div>
          </div>
          <div className="flex-grow">
            <h4 className="text-xl font-black text-slate-900 font-['Space_Grotesk']">{responder.driverName}</h4>
            <p className="text-slate-500 font-bold text-sm">{responder.specialty}</p>
            <div className="flex items-center gap-2 mt-2">
              <Star size={14} fill="#f59e0b" className="text-yellow-500" />
              <span className="text-xs font-black text-yellow-700">{responder.rating} Certified Responder</span>
            </div>

          </div>

          <div className="bg-red-600 p-6 rounded-[2rem] shadow-xl shadow-red-100 flex flex-col justify-between text-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Arrival ETA</span>
              <Clock size={18} />
            </div>
            <div>
              <span className="text-4xl font-black font-['Space_Grotesk']">{progress >= 100 ? '0:00' : responder.eta}</span>
              <p className="text-[10px] font-bold uppercase mt-1 opacity-80 tracking-tighter">Minutes Remaining</p>
            </div>
            <button
              onClick={() => setShowDirections(!showDirections)}
              className="mt-4 w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
              {showDirections ? 'Hide Route' : 'Route Info'}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-5xl mx-auto w-full flex flex-wrap gap-3">
          {[
            { icon: <AlertCircle size={18} />, label: 'Medical Info', color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: <HeartPulse size={18} />, label: 'Vitals Sync', color: 'text-rose-500', bg: 'bg-rose-50' },
            { icon: <Send size={18} />, label: 'Message', color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { icon: <Info size={18} />, label: 'First Aid', color: 'text-amber-500', bg: 'bg-amber-50' },
          ].map((item, i) => (
            <button key={i} className="flex-1 min-w-[140px] p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 group">
              <div className={`p-1.5 rounded-lg ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>

  );
};