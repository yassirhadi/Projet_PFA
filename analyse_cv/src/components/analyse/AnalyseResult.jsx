import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { CheckCircle, XCircle } from 'lucide-react';

const AnalyseResult = ({ analyse }) => {
  if (!analyse) return null;

  const radarData = [
    { subject: 'Compétences', A: analyse.scoreCompatibilite || 0 },
    { subject: 'Format', A: analyse.scoreCompatibilite * 0.8 || 0 },
    { subject: 'Mots-clés', A: analyse.scoreCompatibilite * 0.9 || 0 },
    { subject: 'Structure', A: analyse.scoreCompatibilite * 0.85 || 0 },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-teal-400 text-lg font-semibold">Résultat de l'Analyse IA</h3>
        <span className="text-3xl font-bold text-white">
          {analyse.scoreCompatibilite}<span className="text-sm text-slate-400">/100</span>
        </span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Radar dataKey="A" fill="#14b8a6" fillOpacity={0.3} stroke="#14b8a6" />
        </RadarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-green-400 font-medium mb-2 flex items-center gap-2">
            <CheckCircle size={16} /> Points forts
          </p>
          {analyse.pointsForts?.map((p, i) => (
            <p key={i} className="text-slate-300 text-sm py-1 border-b border-slate-700">{p}</p>
          ))}
        </div>
        <div>
          <p className="text-red-400 font-medium mb-2 flex items-center gap-2">
            <XCircle size={16} /> Points à améliorer
          </p>
          {analyse.pointFaibles?.map((p, i) => (
            <p key={i} className="text-slate-300 text-sm py-1 border-b border-slate-700">{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyseResult;