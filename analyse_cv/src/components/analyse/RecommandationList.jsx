import { Lightbulb } from 'lucide-react';

const PRIORITY_STYLES = {
  HIGH: 'border-red-500/40 bg-red-950/20',
  MEDIUM: 'border-yellow-500/40 bg-yellow-950/20',
  LOW: 'border-slate-600 bg-slate-800/50',
};

const RecommandationList = ({ recommandations = [] }) => (
  <div className="space-y-4">
    <h3 className="text-teal-400 font-semibold flex items-center gap-2">
      <Lightbulb size={18} /> Recommandations IA
    </h3>
    
    {recommandations.length === 0 && (
      <p className="text-slate-500 italic">Aucune recommandation disponible.</p>
    )}

    <div className="grid gap-3">
      {recommandations.map((rec) => (
        <div
          key={rec.id}
          className={`border rounded-lg p-4 transition-all hover:scale-[1.01] ${
            // Adaptation pour gérer les priorités numériques (1=HIGH, 2=MEDIUM)
            rec.priorite === 1 ? PRIORITY_STYLES.HIGH : 
            rec.priorite === 2 ? PRIORITY_STYLES.MEDIUM : PRIORITY_STYLES.LOW
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-100 font-bold text-xs tracking-wider uppercase">
              {rec.categorie}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
              rec.priorite === 1 ? 'border-red-500 text-red-400' : 'border-slate-500 text-slate-400'
            }`}>
              {/* Affiche "HAUTE" si 1, "MOYENNE" si 2, etc. */}
              {rec.priorite === 1 ? 'HAUTE' : rec.priorite === 2 ? 'MOYENNE' : 'BASSE'}
            </span>
          </div>

          {/* SOLUTION : Utilise .texte car c'est le nom dans ton DTO Java */}
          <p className="text-slate-300 text-sm leading-relaxed">
            {rec.texte || "Aucun détail disponible"}
          </p>

          {/* Affichage de l'action concrète envoyée par Python */}
          {rec.action && (
            <div className="mt-3 pt-2 border-t border-white/5">
              <p className="text-teal-400 text-xs italic font-medium">
                <span className="mr-1">⚡</span> 
                {rec.action}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default RecommandationList;