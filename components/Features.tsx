
import React from 'react';
import { Smartphone, Zap, Users, Globe, Lock, HeartPulse } from 'lucide-react';

const features = [
  {
    icon: <Smartphone className="text-blue-500" />,
    title: "One-Tap SOS",
    desc: "Single press notification to pre-defined emergency contacts and dispatch."
  },
  {
    icon: <Zap className="text-yellow-500" />,
    title: "Instant Location",
    desc: "Real-time high-precision GPS tracking shared with responders instantly."
  },
  {
    icon: <Users className="text-purple-500" />,
    title: "Family Network",
    desc: "Coordinate with family members during emergencies with shared status."
  },
  {
    icon: <Globe className="text-emerald-500" />,
    title: "Global Coverage",
    desc: "Seamlessly working across 120+ countries with local dispatch integration."
  },
  {
    icon: <Lock className="text-red-500" />,
    title: "Secure Vault",
    desc: "End-to-end encrypted medical history available only to authorized responders."
  },
  {
    icon: <HeartPulse className="text-rose-500" />,
    title: "Health Sync",
    desc: "Integrates with Apple Health & Google Fit for automatic vitals monitoring."
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Built for Critical Moments</h2>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            Our platform is engineered for reliability, speed, and privacy. When every second counts, you can trust Emergency Life Alert.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="group p-8 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-[2rem] transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
