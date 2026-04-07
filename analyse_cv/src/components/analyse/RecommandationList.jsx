import { Lightbulb } from 'lucide-react';

const PRIORITY_STYLES = {
  HIGH: 'border-red-500/40 bg-red-950/20',
  MEDIUM: 'border-yellow-500/40 bg-yellow-950/20',
  LOW: 'border-slate-600 bg-slate-800/50',
};

const RecommandationList = ({ recommandations = [] }) => (
  <div className="space-y-3">
    <h3 className="text-teal-400 font-semibold flex items-center gap-2">
      <Lightbulb size={18} /> Recommandations IA
    </h3>
    {recommandations.length === 0 && (
      <p className="text-slate-500 italic">Aucune recommandation. Lancez d'abord une analyse.</p>
    )}
    {recommandations.map((rec) => (
      <div
        key={rec.id}
        className={`border rounded-lg p-4 ${PRIORITY_STYLES[rec.priorite] || PRIORITY_STYLES.LOW}`}
      >
        <div className="flex justify-between items-start mb-1">
          <span className="text-slate-200 font-medium text-sm">{rec.categorie}</span>
          <span className="text-xs text-slate-500 uppercase">{rec.priorite}</span>
        </div>
        <p className="text-slate-400 text-sm">{rec.contenu}</p>
        {rec.ActionConcrete && (
          <p className="text-teal-300 text-xs mt-2 italic">→ {rec.ActionConcrete}</p>
        )}
      </div>
    ))}
  </div>
);

export default RecommandationList;