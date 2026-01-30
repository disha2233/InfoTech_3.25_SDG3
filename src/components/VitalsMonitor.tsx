import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Activity, Heart, Droplet, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface Vitals {
  heartRate: number;
  oxygen: number;
  bloodPressure: string;
  timestamp: number;
}

interface VitalsMonitorProps {
  initialVitals?: Vitals;
}

export function VitalsMonitor({ initialVitals }: VitalsMonitorProps) {
  const [vitals, setVitals] = useState<Vitals>(
    initialVitals || {
      heartRate: 85,
      oxygen: 95,
      bloodPressure: '120/80',
      timestamp: Date.now()
    }
  );

  const [heartRateHistory, setHeartRateHistory] = useState<{ time: string; value: number }[]>([]);
  const [oxygenHistory, setOxygenHistory] = useState<{ time: string; value: number }[]>([]);

  useEffect(() => {
    // Simulate real-time vitals updates
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
      });

      // Generate realistic fluctuations
      const newHeartRate = Math.max(60, Math.min(120, vitals.heartRate + (Math.random() - 0.5) * 8));
      const newOxygen = Math.max(88, Math.min(100, vitals.oxygen + (Math.random() - 0.5) * 3));
      
      // Random BP variation
      const systolic = Math.round(120 + (Math.random() - 0.5) * 20);
      const diastolic = Math.round(80 + (Math.random() - 0.5) * 15);

      setVitals({
        heartRate: Math.round(newHeartRate),
        oxygen: Math.round(newOxygen),
        bloodPressure: `${systolic}/${diastolic}`,
        timestamp: Date.now()
      });

      // Update history (keep last 20 points)
      setHeartRateHistory(prev => {
        const newHistory = [...prev, { time: timeStr, value: Math.round(newHeartRate) }];
        return newHistory.slice(-20);
      });

      setOxygenHistory(prev => {
        const newHistory = [...prev, { time: timeStr, value: Math.round(newOxygen) }];
        return newHistory.slice(-20);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [vitals]);

  const getHeartRateStatus = (hr: number) => {
    if (hr < 60) return { status: 'Low', color: 'bg-yellow-500', alert: true };
    if (hr > 100) return { status: 'High', color: 'bg-red-500', alert: true };
    return { status: 'Normal', color: 'bg-green-500', alert: false };
  };

  const getOxygenStatus = (o2: number) => {
    if (o2 < 90) return { status: 'Critical', color: 'bg-red-500', alert: true };
    if (o2 < 95) return { status: 'Low', color: 'bg-yellow-500', alert: true };
    return { status: 'Normal', color: 'bg-green-500', alert: false };
  };

  const heartRateStatus = getHeartRateStatus(vitals.heartRate);
  const oxygenStatus = getOxygenStatus(vitals.oxygen);

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {(heartRateStatus.alert || oxygenStatus.alert) && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 animate-pulse" />
            <div>
              <p className="font-bold text-red-800">⚠️ Vital Signs Alert</p>
              <p className="text-sm text-red-700">
                {heartRateStatus.alert && `Heart Rate ${heartRateStatus.status}`}
                {heartRateStatus.alert && oxygenStatus.alert && ' | '}
                {oxygenStatus.alert && `Oxygen Level ${oxygenStatus.status}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vitals Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Heart Rate */}
        <Card className={`shadow-lg border-2 ${heartRateStatus.alert ? 'border-red-300 animate-pulse' : 'border-pink-200'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2 text-pink-600">
                <Heart className="w-4 h-4" />
                Heart Rate
              </span>
              <Badge className={heartRateStatus.color}>{heartRateStatus.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-pink-600">{vitals.heartRate}</span>
              <span className="text-lg text-slate-500 mb-2">bpm</span>
            </div>
            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={heartRateHistory}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ec4899" 
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Blood Oxygen */}
        <Card className={`shadow-lg border-2 ${oxygenStatus.alert ? 'border-red-300 animate-pulse' : 'border-blue-200'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2 text-blue-600">
                <Activity className="w-4 h-4" />
                Blood Oxygen
              </span>
              <Badge className={oxygenStatus.color}>{oxygenStatus.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-blue-600">{vitals.oxygen}</span>
              <span className="text-lg text-slate-500 mb-2">%</span>
            </div>
            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={oxygenHistory}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Blood Pressure */}
        <Card className="shadow-lg border-2 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2 text-purple-600">
                <Droplet className="w-4 h-4" />
                Blood Pressure
              </span>
              <Badge className="bg-purple-500">Monitoring</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-purple-600">{vitals.bloodPressure}</span>
              <span className="text-lg text-slate-500 mb-2">mmHg</span>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Systolic</span>
                <span className="font-semibold">{vitals.bloodPressure.split('/')[0]}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Diastolic</span>
                <span className="font-semibold">{vitals.bloodPressure.split('/')[1]}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-600" />
            Live Vitals Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartRateHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="time" 
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  domain={[40, 140]}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ec4899" 
                  strokeWidth={3}
                  dot={{ fill: '#ec4899', r: 3 }}
                  name="Heart Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full" />
              <span className="text-slate-600">Heart Rate (bpm)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-slate-600">Live Update</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vitals Summary */}
      <Card className="shadow-lg bg-slate-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-600 mb-1">Status</p>
              <Badge className="bg-green-500">STABLE</Badge>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Last Update</p>
              <p className="font-semibold text-sm">2 sec ago</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Connection</p>
              <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Data Points</p>
              <p className="font-semibold text-sm">{heartRateHistory.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
