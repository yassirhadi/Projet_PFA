// Correspond aux cas d'utilisation : Saisir offre cible, Comparer avec exigences, Adapter CV
import { useEffect, useState, useCallback } from 'react';
import { offreApi }    from '../api/offreApi';
import OffreCard       from '../components/offre/OffreCard';
import LoadingSpinner  from '../components/common/LoadingSpinner';
import OffreForm       from '../components/offre/OffreForm';
import { useAnalyse }  from '../hooks/useAnalyse';
import { useCVStore }  from '../store/useStore';
import { useCV }       from '../hooks/useCV';
import { useAuth }     from '../context/AuthContext';
import { GitCompare, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { offrePriveeApi } from '../api/offrePriveeApi';
import { toast }       from 'react-toastify';

const OffrePage = () => {
  const [offres, setOffres]     = useState([]);
  const [loadingOffres, setLO]  = useState(true);
  const [comparingOffre, setCO] = useState(null); // offre en cours de comparaison
  const [showOfferForm, setShowOfferForm] = useState(true);
  const [privateOffres, setPrivateOffres] = useState([]);
  const [loadingPrivate, setLoadingPrivate] = useState(false);
  const [expandedPrivateId, setExpandedPrivateId] = useState(null);

  const { isAdmin } = useAuth();
  const { adapterPourOffre, loading: loadingAdapt } = useAnalyse();
  const { fetchCVs }  = useCV();
  const cvList        = useCVStore((s) => s.cvList);
  const [selectedCv, setSelectedCv] = useState('');

  const loadOffres = useCallback(async () => {
    setLO(true);
    try {
      const raw = await offreApi.getOffres();
      const list = Array.isArray(raw) ? raw : [];
      setOffres(list.filter((o) => o.active !== false && (o.etudiantId == null || o.etudiantId === undefined)));
    } catch {
      toast.error('Erreur chargement offres');
    } finally {
      setLO(false);
    }
  }, []);

  const loadPrivateOffres = useCallback(async () => {
    if (isAdmin) return;
    setLoadingPrivate(true);
    try {
      const list = await offrePriveeApi.getMine();
      setPrivateOffres(Array.isArray(list) ? list : []);
    } catch {
      toast.error('Erreur chargement offres personnelles');
      setPrivateOffres([]);
    } finally {
      setLoadingPrivate(false);
    }
  }, [isAdmin]);

  useEffect(() => { loadOffres(); fetchCVs(); }, [loadOffres, fetchCVs]);
  useEffect(() => { loadPrivateOffres(); }, [loadPrivateOffres]);

  const handleTogglePrivate = async (o) => {
    const opening = expandedPrivateId !== o.id;
    setExpandedPrivateId(opening ? o.id : null);
    if (opening && !o.vue) {
      try {
        await offrePriveeApi.markAsRead(o.id);
        setPrivateOffres((prev) =>
          prev.map((x) => (x.id === o.id ? { ...x, vue: true } : x))
        );
      } catch {
        /* ignore */
      }
    }
  };
  useEffect(() => {
    if (cvList.length && !selectedCv)
      setSelectedCv(String(cvList[0].id));
  }, [cvList, selectedCv]);

  const handleComparer = (offre) => setCO(offre);

  const handleAdapterConfirm = async () => {
    if (!selectedCv || !comparingOffre) return;
    await adapterPourOffre(Number(selectedCv), comparingOffre.id);
    setCO(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

      {/* En-tête */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Offres d&apos;emploi</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isAdmin
              ? 'Offres publiées (visibles par les étudiants)'
              : "Offres publiées par l'administration"}
          </p>
        </div>
      </div>

      {/* Offres privées (table offre_privee) — visible uniquement par l’étudiant destinataire */}
      {!isAdmin && (
        <div className="bg-amber-950/20 border border-amber-500/25 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-lg font-semibold text-amber-200 flex items-center gap-2">
              <Mail size={20} className="shrink-0" />
              Offres personnelles
            </h2>
            <button
              type="button"
              onClick={() => loadPrivateOffres()}
              className="text-xs text-amber-300/90 hover:text-amber-200 underline"
            >
              Actualiser
            </button>
          </div>
          <p className="text-slate-400 text-sm">
            Propositions envoyées par un administrateur pour vous uniquement (non visibles par les autres étudiants).
          </p>
          {loadingPrivate ? (
            <LoadingSpinner message="Chargement…" />
          ) : privateOffres.length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">Aucune offre personnelle pour le moment.</p>
          ) : (
            <ul className="space-y-2">
              {privateOffres.map((o) => {
                const open = expandedPrivateId === o.id;
                return (
                  <li
                    key={o.id}
                    className="bg-slate-900/60 border border-slate-700 rounded-lg overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => handleTogglePrivate(o)}
                      className="w-full flex items-center justify-between gap-3 p-3 text-left hover:bg-slate-800/50"
                    >
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{o.titre}</p>
                        <p className="text-slate-400 text-sm truncate">
                          {o.entreprise}
                          {o.localisation ? ` · ${o.localisation}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!o.vue && (
                          <span className="px-2 py-0.5 rounded text-xs bg-amber-500/25 text-amber-200">Nouveau</span>
                        )}
                        {open ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                      </div>
                    </button>
                    {open && (
                      <div className="px-3 pb-3 pt-0 border-t border-slate-700/80 space-y-2 text-sm">
                        <p className="text-slate-300 whitespace-pre-wrap mt-2">{o.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 text-xs">
                          {o.typeContrat && <span>Contrat : {o.typeContrat}</span>}
                          {o.niveauExperience && <span>Exp. : {o.niveauExperience}</span>}
                          {o.salaireMin != null && o.salaireMax != null && (
                            <span>
                              Salaire : {o.salaireMin} – {o.salaireMax} MAD
                            </span>
                          )}
                          {o.dateExpiration && (
                            <span>Expire : {new Date(o.dateExpiration).toLocaleString('fr-FR')}</span>
                          )}
                        </div>
                        {o.competences && (
                          <p className="text-slate-400 text-xs">
                            <span className="text-slate-500">Compétences : </span>
                            {o.competences}
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Formulaire: étudiant saisit une offre cible */}
      {!isAdmin && (
        <div className="bg-slate-900/30 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3 gap-3">
            <p className="text-white font-semibold">Saisir une offre cible</p>
            {!showOfferForm ? (
              <button
                type="button"
                onClick={() => setShowOfferForm(true)}
                className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-medium"
              >
                Ajouter
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowOfferForm(false)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium"
              >
                Masquer
              </button>
            )}
          </div>

          {showOfferForm && (
            <OffreForm
              onSuccess={() => {
                setShowOfferForm(false);
                loadOffres();
              }}
              onCancel={() => setShowOfferForm(false)}
            />
          )}
        </div>
      )}

      {/* Modal comparaison */}
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
            <select
              value={selectedCv}
              onChange={(e) => setSelectedCv(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:border-teal-500 text-sm"
            >
              {cvList.map((cv) => (
                <option key={cv.id} value={String(cv.id)}>{cv.nomFichier}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button onClick={() => setCO(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
                Annuler
              </button>
              <button
                onClick={handleAdapterConfirm}
                disabled={loadingAdapt || !selectedCv}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg text-sm transition-colors font-medium"
              >
                {loadingAdapt ? 'Adaptation...' : 'Adapter avec l\'IA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des offres */}
      {loadingOffres ? (
        <LoadingSpinner message="Chargement des offres..." />
      ) : offres.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <p>
            {isAdmin
              ? 'Aucune offre publique pour le moment.'
              : "Aucune offre publiée par l'administration pour le moment."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offres.map((offre) => (
            <OffreCard
              key={offre.id}
              offre={offre}
              canDelete={
                isAdmin
                  ? offre.etudiantId == null
                  : false
              }
              onDelete={(id) => setOffres((p) => p.filter((o) => o.id !== id))}
              onComparer={handleComparer}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OffrePage;