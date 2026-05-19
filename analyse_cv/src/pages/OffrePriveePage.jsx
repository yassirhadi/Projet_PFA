import { useEffect, useState, useCallback } from 'react';
import { offrePriveeApi } from '../api/offrePriveeApi';
import { useOffreStore, useCVStore } from '../store/useStore';
import { useCV } from '../hooks/useCV';
import { useAnalyse } from '../hooks/useAnalyse';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Mail, ChevronDown, ChevronUp, GitCompare } from 'lucide-react';
import { toast } from 'react-toastify';

const OffrePriveePage = () => {
  const [privateOffres, setPrivateOffres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [comparingOffre, setComparingOffre] = useState(null);
  const [selectedCv, setSelectedCv] = useState('');
  const { adapterPourOffrePrivee, loading: loadingAdapt } = useAnalyse();

  const { setPrivateOffresCount } = useOffreStore();
  const cvList = useCVStore((s) => s.cvList);
  const { fetchCVs } = useCV();
  

  const loadPrivateOffres = useCallback(async () => {
    setLoading(true);
    try {
      const list = await offrePriveeApi.getMine();
      const data = Array.isArray(list) ? list : [];
      setPrivateOffres(data);
      setPrivateOffresCount(data.filter((o) => !o.vue).length);
    } catch {
      toast.error('Erreur chargement offres personnelles');
      setPrivateOffres([]);
    } finally {
      setLoading(false);
    }
  }, [setPrivateOffresCount]);

  useEffect(() => { loadPrivateOffres(); fetchCVs(); }, [loadPrivateOffres, fetchCVs]);

  useEffect(() => {
    if (cvList.length && !selectedCv)
      setSelectedCv(String(cvList[0].id));
  }, [cvList, selectedCv]);

  const handleToggle = async (o) => {
    const opening = expandedId !== o.id;
    setExpandedId(opening ? o.id : null);
    if (opening && !o.vue) {
      try {
        await offrePriveeApi.markAsRead(o.id);
        setPrivateOffres((prev) =>
          prev.map((x) => (x.id === o.id ? { ...x, vue: true } : x))
        );
        setPrivateOffresCount((prev) => Math.max(0, prev - 1));
      } catch { /* ignore */ }
    }
  };

  const handleAdapterConfirm = async () => {
    if (!selectedCv || !comparingOffre) return;
       await adapterPourOffrePrivee(Number(selectedCv), comparingOffre.id);
    setComparingOffre(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* En-tête */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Mail size={22} className="text-amber-400" />
            Offres personnelles
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Propositions envoyées par un administrateur pour vous uniquement.
          </p>
        </div>
        <button type="button" onClick={loadPrivateOffres}
          className="text-xs text-amber-300/90 hover:text-amber-200 underline">
          Actualiser
        </button>
      </div>

      {/* Contenu */}
      {loading ? (
        <LoadingSpinner message="Chargement…" />
      ) : privateOffres.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <Mail size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-sm">Aucune offre personnelle pour le moment.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {privateOffres.map((o) => {
            const open = expandedId === o.id;
            return (
              <li key={o.id}
                className="bg-slate-900/60 border border-slate-700 rounded-xl overflow-hidden">
                <button type="button" onClick={() => handleToggle(o)}
                  className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-slate-800/50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{o.titre}</p>
                    <p className="text-slate-400 text-sm truncate">
                      {o.entreprise}{o.localisation ? ` · ${o.localisation}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!o.vue && (
                      <span className="px-2 py-0.5 rounded text-xs bg-amber-500/25 text-amber-200 font-medium">
                        Nouveau
                      </span>
                    )}
                    {open
                      ? <ChevronUp size={18} className="text-slate-400" />
                      : <ChevronDown size={18} className="text-slate-400" />}
                  </div>
                </button>

                {open && (
                  <div className="px-4 pb-4 pt-0 border-t border-slate-700/80 space-y-3 text-sm">
                    <p className="text-slate-300 whitespace-pre-wrap mt-3">{o.description}</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-slate-500 text-xs">
                      {o.typeContrat && <span>Contrat : {o.typeContrat}</span>}
                      {o.niveauExperience && <span>Exp. : {o.niveauExperience}</span>}
                      {o.salaireMin != null && o.salaireMax != null && (
                        <span>Salaire : {o.salaireMin} – {o.salaireMax} MAD</span>
                      )}
                      {o.dateExpiration && (
                        <span>Expire : {new Date(o.dateExpiration).toLocaleString('fr-FR')}</span>
                      )}
                    </div>
                    {o.competences && (
                      <p className="text-slate-400 text-xs">
                        <span className="text-slate-500">Compétences : </span>{o.competences}
                      </p>
                    )}

                    {/* ✅ Bouton Comparer avec mon CV */}
                    <button
                      type="button"
                      onClick={() => setComparingOffre(o)}
                      className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors"
                      style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.3)', color: '#2dd4bf' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(20,184,166,0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(20,184,166,0.1)'}
                    >
                      <GitCompare size={15} />
                      Comparer avec mon CV
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Modal adapter avec l'IA */}
      {comparingOffre && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
              <GitCompare size={18} className="text-teal-400" />
              Adapter mon CV
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Offre : <span className="text-teal-300">{comparingOffre.titre}</span>
            </p>
            <label className="block text-slate-400 text-xs mb-2">Sélectionnez votre CV</label>
            <select value={selectedCv} onChange={(e) => setSelectedCv(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:border-teal-500 text-sm">
              {cvList.map((cv) => (
                <option key={cv.id} value={String(cv.id)}>{cv.nomFichier}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button onClick={() => setComparingOffre(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
                Annuler
              </button>
              <button onClick={handleAdapterConfirm} disabled={loadingAdapt || !selectedCv}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg text-sm transition-colors font-medium">
                {loadingAdapt ? 'Adaptation...' : "Adapter avec l'IA"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffrePriveePage;
