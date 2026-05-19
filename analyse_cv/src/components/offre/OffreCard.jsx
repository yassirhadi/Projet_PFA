import { Briefcase, Building2, Calendar, Tag, Trash2, GitCompare } from 'lucide-react';
import { offreApi } from '../../api/offreApi';
import { toast }   from 'react-toastify';

const keywordList = (offre) => {
  if (Array.isArray(offre.motsCles) && offre.motsCles.length) return offre.motsCles;
  if (typeof offre.competences === 'string' && offre.competences.trim()) {
    return offre.competences.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

const OffreCard = ({ offre, onDelete, onComparer, canDelete = false }) => {
  const tags = keywordList(offre);

  const handleDelete = async () => {
    if (!canDelete) return;
    if (!window.confirm('Supprimer cette offre ?')) return;
    try {
      await offreApi.deleteOffre(offre.id);
      toast.success('Offre supprimée');
      onDelete?.(offre.id);
    } catch {
      toast.error('Erreur suppression');
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 hover:border-teal-500/40 rounded-xl p-5 transition-all">

      {/* En-tête */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Briefcase size={18} className="text-teal-400 shrink-0" />
          <h3 className="text-white font-semibold leading-tight">{offre.titre}</h3>
        </div>
        {canDelete && (
          <button onClick={handleDelete}
            className="text-red-400 hover:text-red-300 ml-2 shrink-0"
            aria-label="Supprimer l'offre">
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Infos */}
      <div className="space-y-1 mb-3">
        {offre.entreprise && (
          <p className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Building2 size={13} /> {offre.entreprise}
          </p>
        )}
        {(offre.typeContrat || offre.niveauExperience) && (
          <p className="text-slate-500 text-xs">
            {[offre.typeContrat, offre.niveauExperience].filter(Boolean).join(' · ')}
          </p>
        )}
        {(offre.salaireMin != null || offre.salaireMax != null) && (
          <p className="text-slate-500 text-xs">
            {offre.salaireMin != null && offre.salaireMax != null
              ? `${offre.salaireMin} – ${offre.salaireMax}`
              : offre.salaireMin != null
                ? `À partir de ${offre.salaireMin}`
                : `Max. ${offre.salaireMax}`}
          </p>
        )}
        {offre.datePublication && (
          <p className="flex items-center gap-1.5 text-slate-500 text-xs">
            <Calendar size={12} />
            {new Date(offre.datePublication).toLocaleDateString('fr-FR')}
          </p>
        )}
      </div>

      {/* Description */}
      {offre.description && (
        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{offre.description}</p>
      )}

      {/* Mots-clés */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 6).map((kw, i) => (
            <span key={i}
              className="flex items-center gap-1 text-xs bg-teal-950/40 text-teal-300 border border-teal-700/40 rounded-full px-2 py-0.5">
              <Tag size={10} />{kw}
            </span>
          ))}
        </div>
      )}

      {/* Action comparer */}
      <button
        onClick={() => onComparer?.(offre)}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
                     bg-teal-700/20 hover:bg-teal-700/40 text-teal-400 text-sm transition-colors border border-teal-700/30"
      >
        <GitCompare size={14} /> Comparer avec mon CV
      </button>
    </div>
  );
};

export default OffreCard;