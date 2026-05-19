import { FileText, Trash2, Download, Zap } from 'lucide-react';
import { useCV } from '../../hooks/useCV';
import { useAnalyse } from '../../hooks/useAnalyse';

const CVCard = ({ cv, onSelect }) => {
  const { deleteCV, exportCV } = useCV();
  const { lancerAnalyse, loading } = useAnalyse();

  const score = cv.scoreGeneral || 0;
  const scoreColor =
    score >= 75 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-teal-500/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="text-teal-400" size={24} />
          <div>
            <p className="text-slate-200 font-medium">{cv.nomFichier}</p>
            <p className="text-slate-500 text-xs">v{cv.version} · {new Date(cv.dateDernierModif).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
        <span className={`text-2xl font-bold ${scoreColor}`}>{score}<span className="text-xs">/100</span></span>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => lancerAnalyse(cv.id)}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-sm rounded-lg transition-colors"
        >
          <Zap size={14} /> Analyser
        </button>
        {['PDF', 'DOCX', 'TXT'].map((fmt) => (
          <button
            key={fmt}
            onClick={() => exportCV(cv.id, fmt)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors"
          >
            <Download size={12} /> {fmt}
          </button>
        ))}
        <button
          onClick={() => deleteCV(cv.id)}
          className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-red-900/40 hover:bg-red-800/60 text-red-400 text-sm rounded-lg transition-colors"
        >
          <Trash2 size={14} /> Supprimer
        </button>
      </div>
    </div>
  );
};

export default CVCard;